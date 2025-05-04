'use client'

import React, { useState } from 'react'
import FileExplorer from '../components/FileExplorer'
import PDFViewer from '../components/PDFViewer'
import CodeViewer from '../components/CodeViewer'
import api from '../lib/api'
import { useCodeStore } from '../lib/useCodeStore'

export default function CodingPage() {
  const { generatedCode, setGeneratedCode, clearCode } = useCodeStore()
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (fn: string | null) => {
    setSelectedFilename(fn)
    clearCode()
    setError(null)
  }

  const handleGenerateCode = async (fn: string) => {
    setIsLoading(true)
    setError(null)
    clearCode()
    try {
      const code = await api.generateCode(fn)
      setGeneratedCode(code)
    } catch (e: any) {
      setError(e.message || 'Failed to generate code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setSelectedFilename(null)
    clearCode()
    setError(null)
  }

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      {/* File Explorer ≈14% */}
      <aside className="flex-[1] border-r border-gray-800 p-4 overflow-auto">
        <FileExplorer onSummaryClick={({ filename }) => handleFileSelect(filename)} />
      </aside>

      {/* PDF Preview ≈43% */}
      <aside className="flex-[3] border-r border-gray-800 flex flex-col p-4">
        <div className="flex-1">
          <PDFViewer
            selectedFilename={selectedFilename}
            onSelect={handleFileSelect}
            isLoading={isLoading}
            onGenerateCode={handleGenerateCode}
          />
        </div>
      </aside>

      {/* Code Viewer ≈43% */}
      <aside className="flex-[3] flex flex-col p-4">
        <div className="flex-1 overflow-hidden">
          <CodeViewer generatedCode={generatedCode} onClear={handleClear} />
        </div>
        {isLoading && selectedFilename && (
          <p className="text-blue-400 mt-2 text-sm">
            Generating code from “{selectedFilename}”…
          </p>
        )}
        {error && <p className="text-red-400 mt-2 text-sm">❌ {error}</p>}
      </aside>
    </div>
  )
}
