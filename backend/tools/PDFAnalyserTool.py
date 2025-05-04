import logging
import re
from typing import List, Dict, Any, Optional
from collections import defaultdict
import pdfplumber
import spacy
from pydantic import BaseModel, Field
from crewai.tools import BaseTool


# ------------------------------------------------------------------------------
# Text Extraction Component
# ------------------------------------------------------------------------------

class PDFLoader:
    def load_pdf(self, pdf_path: str) -> str:
        text = ""
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            logging.error(f"[PDFLoader] Failed to load PDF: {e}")
        return text


# ------------------------------------------------------------------------------
# Text Preprocessing Component
# ------------------------------------------------------------------------------

class TextPreprocessor:
    def __init__(self):
        self.url_pattern = re.compile(r'https?://\S+')
        self.phrase_pattern = re.compile(r'Electronic copy available at: .*', re.IGNORECASE)
        self.number_pattern = re.compile(r'^\d+\s*$', re.MULTILINE)
        self.multinew_pattern = re.compile(r'\n+')
        self.header_footer_pattern = re.compile(r'^\s*(Author|Title|Abstract)\s*$', re.MULTILINE | re.IGNORECASE)

    def preprocess_text(self, text: str) -> str:
        try:
            text = self.url_pattern.sub('', text)
            text = self.phrase_pattern.sub('', text)
            text = self.number_pattern.sub('', text)
            text = self.multinew_pattern.sub('\n', text)
            text = self.header_footer_pattern.sub('', text)
            return text.strip()
        except Exception as e:
            logging.error(f"[TextPreprocessor] Error: {e}")
            return ""


# ------------------------------------------------------------------------------
# Improved Heading Detection
# ------------------------------------------------------------------------------

class HeadingDetector:
    def __init__(self, model: str = "en_core_web_sm"):
        try:
            self.nlp = spacy.load(model)
        except Exception as e:
            logging.error(f"[HeadingDetector] Could not load spaCy model: {e}")
            raise

        # Fallback regex patterns
        self.section_pattern = re.compile(
            r"^(?:\d{1,2}(\.\d{1,2})*\.?\s*)?[A-Z][A-Za-z\s\-]{3,}$"
        )

    def detect_headings(self, text: str) -> List[str]:
        headings = set()
        lines = text.splitlines()

        # Rule-based detection
        for line in lines:
            line = line.strip()
            if self.section_pattern.match(line):
                headings.add(line)

        # NLP fallback: title-like short sentences
        try:
            doc = self.nlp(text)
            for sent in doc.sents:
                sent_text = sent.text.strip()
                if 2 <= len(sent_text.split()) <= 10 and sent_text.istitle():
                    headings.add(sent_text)
        except Exception as e:
            logging.warning(f"[HeadingDetector] NLP fallback failed: {e}")

        return list(headings)


# ------------------------------------------------------------------------------
# Section Splitting With Metadata
# ------------------------------------------------------------------------------

class SectionSplitter:
    def split_into_sections(self, text: str, headings: List[str]) -> List[Dict[str, Any]]:
        sections = []
        current_section = {"heading": "Preamble", "text": "", "position": 0}
        lines = text.split('\n')
        position = 1

        for line in lines:
            line = line.strip()
            if line in headings:
                sections.append(current_section)
                current_section = {"heading": line, "text": "", "position": position}
                position += 1
            else:
                current_section["text"] += line + " "

        sections.append(current_section)  # Append last section
        return sections


# ------------------------------------------------------------------------------
# Input Schema for Tool
# ------------------------------------------------------------------------------

class PDFAnalysisInput(BaseModel):
    pdf_path: str = Field(..., description="The absolute path to the PDF to be analyzed.")


# ------------------------------------------------------------------------------
# Final CrewAI Tool Definition
# ------------------------------------------------------------------------------

class PDFAnalyserTool(BaseTool):
    name: str = "PDF Analyzer Tool"
    description: str = "Parses a PDF, detects sections, and returns structured content with section metadata."
    args_schema: Any = PDFAnalysisInput

    def _run(self, pdf_path: str) -> List[Dict[str, Any]]:
        logging.info(f"[PDFAnalyserTool] Analyzing PDF: {pdf_path}")
        loader = PDFLoader()
        preprocessor = TextPreprocessor()
        heading_detector = HeadingDetector()
        splitter = SectionSplitter()

        raw_text = loader.load_pdf(pdf_path)
        clean_text = preprocessor.preprocess_text(raw_text)
        headings = heading_detector.detect_headings(clean_text)
        sections = splitter.split_into_sections(clean_text, headings)

        logging.info(f"[PDFAnalyserTool] Extracted {len(sections)} sections.")
        return [
            {
                "heading": sec["heading"],
                "position": sec["position"],
                "text": sec["text"].strip(),
                "type_hint": self._guess_type(sec["heading"])
            }
            for sec in sections if sec["text"].strip()
        ]

    def _guess_type(self, heading: str) -> str:
        lower = heading.lower()
        if "intro" in lower:
            return "background"
        elif "method" in lower or "approach" in lower:
            return "methodology"
        elif "result" in lower:
            return "findings"
        elif "discussion" in lower:
            return "interpretation"
        elif "conclusion" in lower:
            return "summary"
        else:
            return "general"

