'use client';

import Link from 'next/link';

interface Workflow {
  name: string;
  version: string;
  date: string;
  description: string;
  steps: string[];
  color: string; // Tailwind text color
}

const workflows: Workflow[] = [
  {
    name: 'Chat with Fundamentals',
    version: 'v1.0',
    date: '15 April 2025',
    description:
      'Transforms a natural language financial query into a professional research note. The flow orchestrates structured API calls and LLMs to analyze metrics, price history, and news.',
    steps: [
      'Interpret the user query to identify tickers, data needs, and date ranges.',
      'Fetch selected financial KPIs from EODHD fundamentals API.',
      'Retrieve recent OHLCV data (default 3-month history).',
      'Fetch and filter recent news headlines per ticker.',
      'Use an LLM to write an executive summary based on all collected inputs.',
      'Return a structured object with tickers, metrics, quotes, news, and summary.',
    ],
    color: 'text-blue-400',
  },
  {
    name: 'Search Articles',
    version: 'v1.0',
    date: '15 April 2025',
    description:
      'Finds academic papers by expanding the user query, inferring arXiv categories, and pulling from CrossRef and arXiv using LLM-enhanced agents.',
    steps: [
      'Extract core terms, expanded terms, and category hints from user query.',
      'Query arXiv and CrossRef using structured parameters.',
      'Return matching articles with title, abstract, link, and source.',
    ],
    color: 'text-orange-400',
  },
  {
    name: 'Summary Generation',
    version: 'v1.0',
    date: '15 April 2025',
    description:
      'Analyzes full academic articles to produce detailed, structured summaries in Markdown format, suitable for research documentation and knowledge sharing.',
    steps: [
      'Extract detailed insights from all sections of the paper.',
      'Organize key points by section with labeled bullet lists.',
      'Refine structure into well-formatted Markdown with clear headings.',
      'Preserve technical depth while improving clarity.',
      'Return a Markdown string with the paper’s conceptual structure.',
      'Export summaries to Notion for further refinement.',
    ],
    color: 'text-green-400',
  },
  {
    name: 'Code Generation',
    version: 'v0.4',
    date: '15 April 2025',
    description:
      'Translates a plain-text trading strategy into validated Python code for QuantConnect. Uses multiple agents for parsing, generation, and syntax validation.',
    steps: [
      'Parse the strategy into structured logic: indicators, signals, alpha models.',
      'Generate Python code for QuantConnect’s LEAN Engine.',
      'Run AST-based syntax validation and patch compatibility issues.',
      'Ensure code defines Initialize(), OnData(), and correct API usage.',
      'Return final Python code with filename and metadata.',
    ],
    color: 'text-purple-400',
  },
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-blue-600">QuantCoder FS Workflows</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {workflows.map((flow) => (
            <div
              key={flow.name}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className={`text-xl font-bold mb-1 ${flow.color}`}>{flow.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Version: {flow.version} — {flow.date}
                </p>
                <p className="mb-4 text-sm">{flow.description}</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {flow.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="https://quantcoderfs.substack.com/"
            target="_blank"
            className="text-blue-600 hover:underline text-sm"
          >
            Visit Substack for full documentation and devlog →
          </Link>
        </div>
      </div>
    </div>
  );
}
