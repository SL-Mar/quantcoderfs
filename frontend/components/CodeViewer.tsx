'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSave,
  faCopy,
  faEraser,
  faPlay,
  faFileCode,
} from '@fortawesome/free-solid-svg-icons'
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
  const [backtestStatus, setBacktestStatus] = useState<null | 'running' | 'success' | 'error'>(null)

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
      window.dispatchEvent(new CustomEvent('code-saved', { detail: generatedCode.filename }))
    } catch (err) {
      console.error('Failed to save to disk:', err)
    }
  }

  const handleRunBacktest = async () => {
    if (!generatedCode) return
    setBacktestStatus('running')
    try {
      await api.triggerBacktest(generatedCode.filename, generatedCode.code)
      setBacktestStatus('success')
      setTimeout(() => setBacktestStatus(null), 2000)
    } catch (err) {
      console.error('Backtest failed:', err)
      setBacktestStatus('error')
      setTimeout(() => setBacktestStatus(null), 2000)
    }
  }

  const buttonBase = 'flex items-center gap-2 px-2 py-1 rounded transition text-blue-400 hover:text-blue-300 active:scale-95'

  return (
    <div className="w-full h-full bg-gray-800 rounded-xl p-4 shadow-md flex flex-col gap-4 relative">
      {/* Header */}
      <div className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
        <FontAwesomeIcon icon={faPython} className="text-blue-400" />
        Generated Code
      </div>

      {/* Code container */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-900 rounded-md shadow-inner">
        {!generatedCode ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No code generated yet.
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <span className="flex items-center gap-2 text-white font-mono text-sm truncate">
                <FontAwesomeIcon icon={faFileCode} className="text-blue-400" />
                {generatedCode.filename}
              </span>
              <div className="flex gap-4 items-center text-sm font-medium">
                <button
                  onClick={handleSaveToDisk}
                  aria-pressed={saved}
                  className={`${buttonBase} ${saved ? 'ring-2 ring-blue-500 bg-blue-950' : ''}`}
                  title="Save file"
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>{saved ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCopy}
                  aria-pressed={copied}
                  className={`${buttonBase} ${copied ? 'ring-2 ring-blue-500 bg-blue-950' : ''}`}
                  title="Copy code"
                >
                  <FontAwesomeIcon icon={faCopy} />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleRunBacktest}
                  aria-pressed={backtestStatus === 'running'}
                  className={`${buttonBase} ${
                    backtestStatus === 'running' ? 'ring-2 ring-blue-500 bg-blue-950' : ''
                  }`}
                  title="Run backtest"
                >
                  <FontAwesomeIcon icon={faPlay} />
                  <span>Run</span>
                </button>
                {onClear && (
                  <button
                    onClick={onClear}
                    className={`${buttonBase} hover:text-red-300`}
                    title="Clear code"
                  >
                    <FontAwesomeIcon icon={faEraser} />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Monaco Editor */}
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
        <div className="absolute bottom-4 right-4 bg-gray-700 text-white px-3 py-1 text-sm rounded shadow-lg">
          File saved to disk!
        </div>
      )}
      {copied && (
        <div className="absolute bottom-12 right-4 bg-gray-700 text-white px-3 py-1 text-sm rounded shadow-lg">
          Copied to clipboard!
        </div>
      )}
      {backtestStatus === 'running' && (
        <div className="absolute bottom-20 right-4 bg-blue-600 text-white px-3 py-1 text-sm rounded shadow-lg">
          Backtest started…
        </div>
      )}
      {backtestStatus === 'success' && (
        <div className="absolute bottom-20 right-4 bg-green-600 text-white px-3 py-1 text-sm rounded shadow-lg">
          Backtest triggered!
        </div>
      )}
      {backtestStatus === 'error' && (
        <div className="absolute bottom-20 right-4 bg-red-600 text-white px-3 py-1 text-sm rounded shadow-lg">
          Failed to trigger backtest.
        </div>
      )}
    </div>
  )
}
