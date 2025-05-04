import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-gray-400 flex justify-center items-center h-screen">
      <div className="max-w-2xl text-justify">
        <h1 className="text-3xl font-bold mb-6 text-center">About Me</h1>
        <p className="text-lg leading-relaxed mb-4">
          After earning an MSc in Theoretical Physics, I became a Master Mariner. This platform—a research tool for automating alpha extraction and strategy development—reflects my long-standing passion for research, often set aside during my seafaring career.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          Quantitative finance offers a unique way to apply abstract thinking in real-world markets, much like experimental physics. I use AI to develop trading algorithms with a focus on stock selection, forecasting, and financial analysis.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          Building this platform allowed me to unify my tools and workflows, emphasizing AI as a decision-support system—not a substitute for oversight—in structured data environments.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          I occasionally publish equity insights as “Executive Summaries” on Substack and use this tool to rapidly explore new algorithmic ideas. I'm not a financial advisor, and nothing here or in the summaries should be considered investment advice. Always do your own research.
        </p>
        <div className="text-center mt-6">
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
