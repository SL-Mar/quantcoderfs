'use client'

import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import api from '../lib/api'

interface PDFViewerProps {
  selectedFilename: string | null
  onSelect: (filename: string | null) => void
  onGenerateCode: (filename: string) => void
  isLoading: boolean
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  selectedFilename,
  onSelect,
  onGenerateCode,
  isLoading,
}) => {
  const [availableFiles, setAvailableFiles] = useState<string[]>([])
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    api.listFiles('articles').then(setAvailableFiles).catch(console.error)
  }, [])

  useEffect(() => {
    if (!selectedFilename?.toLowerCase().endsWith('.pdf')) {
      setPdfUrl(null)
      return
    }

    api
      .fetchPdfBlob(selectedFilename)
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
      })
      .catch((err) => {
        console.error('Failed to fetch PDF blob:', err)
        setPdfUrl(null)
      })
  }, [selectedFilename])

  return (
    <div className="w-full h-full bg-gray-800 rounded-xl p-4 shadow-md flex flex-col gap-4">
      {/* Header */}
      <div className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
        <FontAwesomeIcon icon={faMap} className="text-blue-400" />
        PDF Reader
      </div>

      {/* File Selector + Generate Button */}
      <div className="flex items-center gap-3">
        <select
          value={selectedFilename || ''}
          onChange={(e) => onSelect(e.target.value || null)}
          className="px-3 py-2 rounded-md bg-gray-700 text-white text-sm w-64"
        >
          <option value="">Select PDF...</option>
          {availableFiles.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {selectedFilename && (
          <button
            onClick={() => onGenerateCode(selectedFilename)}
            disabled={isLoading}
            className={`flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            <span>Generate Code</span>
          </button>
        )}
      </div>

      {/* PDF Preview */}
      <div className="flex-grow overflow-auto bg-gray-900 rounded-md">
        {pdfUrl ? (
          <object data={pdfUrl} type="application/pdf" className="w-full h-full">
            <p className="text-white p-4">
              Unable to display PDF.{' '}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-400"
              >
                Download instead
              </a>
            </p>
          </object>
        ) : (
          <p className="text-gray-400 text-sm p-4 text-center">
            Select a PDF to preview it here.
          </p>
        )}
      </div>
    </div>
  )
}

export default PDFViewer
