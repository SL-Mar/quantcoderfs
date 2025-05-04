[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# QuantCoder FS — LLM powered fundamental analysis and pair-coding for Quantitative Finance

**QuantCoder FS** is an open platform for the design, orchestration, and evaluation of agent-based workflows in quantitative finance. It is developed as part of a research initiative aimed at exploring the use of large language models (LLMs) in tasks such as document summarization, trading strategy automation, fundmental analysis and risk modeling.

This repository contains the **FastAPI server**, **CrewAI agents**, and the architecture supporting **modular research workflows**. While the backend is open-source and intended for collaborative research, the frontend remains private to ensure separation of concerns and limit operational overhead.

---

## Research Philosophy

QuantCoder FS is not a SaaS product. It is a **thinking environment** — a research lab where autonomous agents perform tasks on financial data and documents under controlled conditions.

This design follows a few guiding principles:

- **Reproducibility**: Workflows are modular and agent logic is transparent.
- **Minimalism**: Infrastructure is lightweight, with minimal runtime dependencies.
- **Self-directed Use**: Users bring their own API keys or opt into usage-based credits.
- **Public Experimentation**: Results are visible and replicable; usage does not imply support.

---

## Repository Structure

The backend is organized for clarity and modularity, with an emphasis on reproducibility and clean agent-based design.

```
backend/
├── agents/        # CrewAI-based autonomous agents
├── core/          # Configuration files, logging, usage tracking
├── models/        # Pydantic schemas for type safety
├── routers/       # API endpoints for each workflow
├── utils/         # Support functions (token parsing, file handling, etc.)
└── workflows/     # Workflow definitions and orchestration logic
```

Each workflow is developed as a discrete module and follows a shared orchestration pattern. Agents and workflows are designed to be extensible and independently testable.

---

## Getting Started

### 1. Clone and prepare environment

```bash
git clone https://github.com/SL-Mar/quantcoder-backend.git
cd quantcoder-backend
git checkout dev
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt # requirements.windows or requirements.linux
```

### 2. Configure environment variables

```env
OPENAI_API_KEY=sk-...
MODEL_NAME=gpt-4
```

> The system is compatible with all LLMs supported by LangChain depending on availability and keys.

### 3. Launch backend server

```bash
uvicorn backend.main:app --reload --port 8000
```

Interactive API docs will be available at:  
[http://localhost:8000/docs](http://localhost:8000/docs)

---

## Workflow Example: PDF Summarization

The first implemented workflow focuses on the **summarization of academic or financial PDFs**, enabling rapid extraction of structured insights using LLM-based agents.

This workflow provides:

- Stateless API endpoints for PDF processing
- Agent-based reasoning and summarization logic (CrewAI)
- Output formatted for downstream use or display
- Optional persistence of intermediate and final results

The frontend (not included here) provides a document viewer and summary interface, developed in Next.js and Tailwind. Screenshots are included in articles presenting the project mentionned in references. 

---

## Future Research Modules

QuantCoder_FS is being developed incrementally, with a roadmap focused on evaluating AI-agent performance in common quantitative finance workflows:

- **Fundamental Data Analysis** (via EODHD API)
- **Strategy pair-coding** for QuantConnect/LEAN
- **Risk Modeling** (including VaR and stochastic simulations)
- **Forecasting Pipelines** (e.g., XGBoost)
- **Investment Scoring and Lead Filtering**

Each of these will follow a shared interface, supporting reproducible experimentation and plug-and-play agent design.

---

## System Architecture and Access Model

| Component               | Status      | Access Model                |
|------------------------|-------------|-----------------------------|
| AI Workflow Backend    | ✅ Open      | Public GitHub repository    |
| Frontend Interface     | 🔒 Closed    | Stateless, private          |
| Authentication System  | 🔒 Closed    | JWT-based, under development |
| API Key / Credit System| 🔒 Closed    | Self-funded use or API upload |
| Agent Templates         | ✅ Open/Doc | Contribution encouraged     |
| Generated Results       | ✅ Open      | Reproducible and sharable   |

> Contributions are welcome through pull requests, especially for new agent roles and modular workflows.

---

## Licensing

This repository is distributed under the **Apache License 2.0**. You are free to use, modify, and redistribute the code, provided attribution and license terms are respected. See [`LICENSE.md`](LICENSE.md) for details.

---

## References and Development Log

- [QuantCoder FS: Technical Documentation and Contribution guidelines](https://github.com/SL-Mar/quantcoder-documentation)
- [QuantCoder FS: Development Log](https://ai.gopubby.com/quantcoder-fs-development-log-1b3b7e8c23de)
- [Towards automating quantitative finance research](https://medium.com/ai-advances/towards-automating-quantitative-finance-research-c868a2a6477e)

---

## Citation

If this repository or its workflows contribute to your academic or institutional work, you are invited to cite it as:

```
S.M.Laignel. (2025). QuantCoder FS: LLM-powered fundamental analysis and pair-coding for Quantitative Finance. GitHub Repository. https://github.com/SL-Mar/quantcoder-backend
```
---




