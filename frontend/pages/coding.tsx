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
    <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* File Explorer Panel */}
      <aside className="w-1/6 min-w-[220px] border-r border-gray-800 overflow-y-auto p-4">
        <FileExplorer onSummaryClick={({ filename }) => handleFileSelect(filename)} />
      </aside>

      {/* Main Content Area: PDF + Code side-by-side */}
      <main className="flex flex-1 flex-row gap-4 p-4 overflow-hidden">
        {/* PDF Viewer */}
        <div className="w-1/2 h-full">
          <PDFViewer
            selectedFilename={selectedFilename}
            onSelect={handleFileSelect}
            isLoading={isLoading}
            onGenerateCode={handleGenerateCode}
          />
        </div>

        {/* Code Viewer */}
        <div className="w-1/2 h-full flex flex-col">
          <CodeViewer generatedCode={generatedCode} onClear={handleClear} />
          {isLoading && selectedFilename && (
            <p className="text-blue-400 mt-2 text-sm">Generating code from “{selectedFilename}”...</p>
          )}
          {error && <p className="text-red-400 mt-2 text-sm">❌ {error}</p>}
        </div>
      </main>
    </div>
  )
}
