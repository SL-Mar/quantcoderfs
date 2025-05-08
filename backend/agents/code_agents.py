from crewai import Agent
from tools.code_tools import SummaryTool, CodeGenerationTool, CodeValidationTool
from core.llm_provider import get_llm

llm = get_llm(role="store")  

summary_generator_agent = Agent(
    role="Strategy Summarizer",
    goal="Generate a structured summary of trading logic and risk management from extracted PDF sections.",
    backstory=(
        "You are a systematic trader who reviews structured research sections. "
        "You generate concise summaries focused on indicators, entry/exit logic, and risk management rules."
    ),
    tools=[SummaryTool()],
    allow_delegation=False,
    llm = llm
)

code_generator_agent = Agent(
    role="QuantConnect Developer",
    goal="Translate strategy summary into complete, syntactically correct QuantConnect Python code.",
    backstory=(
        "You specialize in building production-ready QuantConnect algorithms and know the Lean API deeply. "
        "You follow user summaries precisely and generate error-free Python code."
    ),
    tools=[CodeGenerationTool()],
    allow_delegation=False,
    llm = llm
)

code_validator_agent = Agent(
    role="Syntax Validator",
    goal="Check Python code for syntax errors using static AST parsing only.",
    backstory=(
        "You are a validation tool that performs static syntax checks using Python's AST module. "
        "Correct the code if it is not syntactically valid."
    ),
    tools=[CodeValidationTool()],
    allow_delegation=False,
    llm = llm
)

code_refinement_agent = Agent(
    role="Code Refiner",
    goal="Fix syntax and logic errors in QuantConnect Python code.",
    backstory=(
        "You are a senior quant developer specialist of QuantConnect. When given QuantConnect algorithm written in Python, "
        "you check the code step by step for compilation or logic error and return fully functional corrected QuantConnect-compatible code."
    ),
    tools=[],
    allow_delegation=False,
    llm = llm
)

trading_behavior_agent = Agent(
    role="Execution Inspector",
    goal="Verify that the QuantConnect code includes logic that triggers actual trades.",
    backstory=(
        "You are a Lean strategy auditor. Your job is to inspect generated algorithm code and determine "
        "if it includes real trade-execution logic like SetHoldings, MarketOrder, or Portfolio manipulation. "
        "You look for evidence that positions will be opened and closed during backtests."
    ),
    tools=[],
    allow_delegation=False,
    llm = llm
)