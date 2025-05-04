from crewai import Agent
from tools.code_tools import SummaryTool, CodeGenerationTool, CodeValidationTool
from tools.LeanBacktestTool import LeanBacktestTool
from tools.SaveCodeTool import SaveCodeTool

summary_generator_agent = Agent(
    role="Strategy Summarizer",
    goal="Generate a structured summary of trading logic and risk management from extracted PDF sections.",
    backstory="You analyze structured research and extract trading logic, risk rules, and indicator use.",
    tools=[SummaryTool()],
    allow_delegation=False
)

code_generator_agent = Agent(
    role="QuantConnect Developer",
    goal="Translate strategy summary into complete, syntactically correct QuantConnect Python code.",
    backstory="You are a specialist in Lean/QuantConnect and generate clean Python algorithms from structured specs.",
    tools=[CodeGenerationTool()],
    allow_delegation=False
)

code_validator_agent = Agent(
    role="Syntax Validator",
    goal="Check Python code for syntax errors using static AST parsing only.",
    backstory="You validate Python code syntax using the AST module. You do not modify code.",
    tools=[CodeValidationTool()],
    allow_delegation=False
)

code_refinement_agent = Agent(
    role="Code Refiner",
    goal="Fix syntax and logic errors in QuantConnect Python code using LLMs.",
    backstory="You diagnose and fix broken QuantConnect Python code using context from validation errors.",
    tools=[],
    allow_delegation=False
)

save_code_agent = Agent(
    role="Code Saver",
    goal="Save the generated QuantConnect algorithm to disk so that Lean can back-test it.",
    backstory="You take in a GeneratedCode JSON, write the source code to the proper Lean folder, and return the full path.",
    tools=[SaveCodeTool()],
    allow_delegation=False
)

lean_backtest_agent = Agent(
    role="Lean Backtester",
    goal="Run a Lean CLI backtest on the saved algorithm file and return output.",
    backstory="You call Lean CLI in the correct environment and return the backtest stdout or errors.",
    tools=[LeanBacktestTool()],
    allow_delegation=False
)
