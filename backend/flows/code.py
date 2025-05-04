import os
import pprint
from typing import Optional
from pydantic import BaseModel

from crewai import Crew, Task, Process
from crewai.flow.flow import Flow, start
from core.llm_provider import get_llm
from core.logger_config import setup_logger

from models.code_models import SummaryResponse, GeneratedCode
from agents.extract_agents import pdf_analysis_agent
from agents.code_agents import (
    summary_generator_agent,
    code_generator_agent,
    code_validator_agent,
    code_refinement_agent,
    save_code_agent,
    lean_backtest_agent,
)

logger = setup_logger().getChild("coding_flow")
logger.info("[FLOW] Initializing PDF→Code→Back-test flow (v2.3)")

class CodingState(BaseModel):
    result: Optional[GeneratedCode] = None

class CodingFlow(Flow[CodingState]):
    @start()
    def run(self) -> GeneratedCode:
        pdf_path = self.inputs.get("pdf_path")
        if not pdf_path:
            raise ValueError("Missing required input: pdf_path")
        logger.info(f"[CODING_FLOW] Processing PDF: {pdf_path}")

        # Define tasks in order
        t_extract = Task(
            description=f"Extract structured sections from PDF '{pdf_path}'",
            expected_output="List of sections",
            agent=pdf_analysis_agent,
        )

        t_summary = Task(
            description="Generate concise summary of the extracted sections",
            expected_output="SummaryResponse",
            context=[t_extract],
            output_pydantic=SummaryResponse,
            agent=summary_generator_agent,
        )

        t_code = Task(
            description="Generate QuantConnect Python algorithm from summary",
            expected_output="GeneratedCode JSON",
            context=[t_summary],
            output_pydantic=GeneratedCode,
            agent=code_generator_agent,
        )

        t_validate = Task(
            description="Validate generated code with Python AST",
            expected_output="'ok' or error message",
            context=[t_code],
            agent=code_validator_agent,
        )

        t_refine = Task(
            description="If syntax failed, fix the code and return new GeneratedCode JSON",
            expected_output="Validated GeneratedCode JSON",
            context=[t_code, t_validate],
            output_pydantic=GeneratedCode,
            agent=code_refinement_agent,
        )

        t_save = Task(
            description="Save the final GeneratedCode source to a .py file in the LEAN folder",
            expected_output="Absolute file path",
            context=[t_refine],
            agent=save_code_agent,
        )

        t_backtest = Task(
            description="Run Lean CLI backtest on the saved algorithm file",
            expected_output="Backtest stdout/stderr string",
            context=[t_save],
            agent=lean_backtest_agent,
        )

        crew = Crew(
            agents=[
                pdf_analysis_agent,
                summary_generator_agent,
                code_generator_agent,
                code_validator_agent,
                code_refinement_agent,
                save_code_agent,
                lean_backtest_agent,
            ],
            tasks=[
                t_extract,
                t_summary,
                t_code,
                t_validate,
                t_refine,
                t_save,
                t_backtest,
            ],
            manager_llm=get_llm(role="manager"),
            process=Process.sequential,
            verbose=False,
        )

        logger.info("[CODING_FLOW] Launching Crew...")
        raw = crew.kickoff(inputs={"pdf_path": pdf_path})

        try:
            code_obj: GeneratedCode = GeneratedCode.model_validate_json(t_refine.output.raw)
        except Exception as e:
            logger.exception("Failed to parse GeneratedCode JSON")
            raise

        code_obj.backtest = t_backtest.output.raw
        self.state.result = code_obj
        return self.finalize()

    def finalize(self) -> GeneratedCode:
        if not self.state.result:
            raise ValueError("No result generated")
        logger.info("[CODING_FLOW] Complete. Returning result.")
        logger.debug(pprint.pformat(self.state.result.model_dump()))
        return self.state.result
