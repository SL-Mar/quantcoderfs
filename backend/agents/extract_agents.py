from crewai import Agent
from tools.PDFAnalyserTool import PDFAnalyserTool
from core.llm_provider import get_llm

llm = get_llm(role="store")  

pdf_analysis_agent = Agent(
    role="Quant Research Extractor",
    goal="Extract structured sections from a PDF article relevant to trading and risk.",
    backstory=(
        "You are a quant analyst skilled at quickly breaking down complex academic papers. "
        "You extract structured, labeled sections for downstream trading insight extraction."
    ),
    tools=[PDFAnalyserTool()],
    allow_delegation=False,
    llm = llm
)
