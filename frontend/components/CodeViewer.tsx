'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faCopy, faEraser, faFileCode } from '@fortawesome/free-solid-svg-icons'
import { faPython } from '@fortawesome/free-brands-svg-icons'
import type { GeneratedCode } from '../types/code'
import Editor from '@monaco-editor/react'
import api from '../lib/api'

interface CodeViewerProps {
  generatedCode: GeneratedCode | null
  onClear?: () => void
}

export default function CodeViewer({ generatedCode, onClear }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleCopy = async () => {
    if (!generatedCode?.code) return
    try {
      await navigator.clipboard.writeText(generatedCode.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Clipboard copy failed:', err)
    }
  }

  const handleSaveToDisk = async () => {
    if (!generatedCode) return
    try {
      await api.saveFile(generatedCode.code, generatedCode.filename, 'codes')
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)

      // ✅ Notify FileExplorer to refresh
      window.dispatchEvent(new CustomEvent('code-saved', { detail: generatedCode.filename }))
    } catch (err) {
      console.error('Failed to save to disk:', err)
    }
  }

  return (
    <div className="relative flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 px-2">
        <FontAwesomeIcon icon={faPython} className="text-xl text-purple-400" />
        <h2 className="text-purple-400 font-semibold text-xl">Generated Code</h2>
      </div>

      {/* Code container */}
      <div className="flex-1 flex flex-col overflow-hidden bg-black rounded-md shadow-inner">
        {!generatedCode ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No code generated yet.
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="flex items-center gap-2 text-sm font-mono text-gray-300 truncate">
                <FontAwesomeIcon icon={faFileCode} className="text-gray-400" />
                {generatedCode.filename}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveToDisk}
                  className="px-3 py-1 text-sm font-medium bg-yellow-600 hover:bg-yellow-700 text-white rounded transition flex items-center gap-2"
                  title="Save to disk"
                >
                  <FontAwesomeIcon icon={faSave} />
                  {saved ? 'Saved!' : 'Save'}
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition flex items-center gap-2"
                  title="Copy to clipboard"
                >
                  <FontAwesomeIcon icon={faCopy} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                {onClear && (
                  <button
                    onClick={onClear}
                    className="px-3 py-1 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded transition flex items-center gap-2"
                    title="Clear code view"
                  >
                    <FontAwesomeIcon icon={faEraser} />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="python"
                defaultValue={generatedCode.code}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Toasts */}
      {saved && (
        <div className="absolute bottom-4 right-4 bg-yellow-600 text-white px-3 py-1 text-sm rounded shadow-lg">
          File saved to disk!
        </div>
      )}
      {copied && (
        <div className="absolute bottom-12 right-4 bg-blue-600 text-white px-3 py-1 text-sm rounded shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </div>
  )
}
