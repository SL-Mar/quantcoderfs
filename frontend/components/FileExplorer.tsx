'use client'

import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronRight,
  faFileAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { useSummaryStore } from '../lib/useSummaryStore'
import api from '../lib/api'
import { Summary } from '../types/summary'

const folders = ['articles', 'codes'] as const
export type Folder = (typeof folders)[number]

export interface FileExplorerProps {
  onSummaryClick?: (summary: Summary) => void
  onPdfSelect?: (filename: string) => void
}

export default function FileExplorer({ onSummaryClick, onPdfSelect }: FileExplorerProps) {
  const setSummary = useSummaryStore((s) => s.setSummary)

  const [folderFiles, setFolderFiles] = useState<Record<Folder, string[]>>({
    articles: [],
    codes: [],
  })

  const [openFolders, setOpenFolders] = useState<Record<Folder, boolean>>({
    articles: true,
    codes: true,
  })

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    try {
      const [articles, codes] = await Promise.all([
        api.listFiles('articles'),
        api.listFiles('codes'),
      ])
      setFolderFiles({ articles, codes })
    } catch (err) {
      console.error('Failed to list files:', err)
    }
  }

  function toggle(folder: Folder) {
    setOpenFolders((prev) => ({ ...prev, [folder]: !prev[folder] }))
  }

  async function handleLoad(filename: string, folder: Folder) {
    if (!filename.toLowerCase().endsWith('.pdf')) {
      alert('Only PDF files can be opened in the reader.')
      return
    }

    try {
      const res = await api.loadFile(filename, folder)
      const summaryObj: Summary = { filename, summary: res.content }
      setSummary(summaryObj)
      onSummaryClick?.(summaryObj)
      onPdfSelect?.(filename) // pass filename to PDFViewer
    } catch (err) {
      console.error('Load failed:', err)
    }
  }

  async function handleDelete(filename: string, folder: Folder) {
    try {
      await api.deleteFile(filename, folder)
      await fetchAll()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div className="h-full bg-gray-900 text-white p-4 rounded-xl shadow-md overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Working Directory</h2>

      {folders.map((folder) => (
        <div key={folder} className="mb-3">
          <button
            onClick={() => toggle(folder)}
            className="flex items-center gap-2 font-semibold w-full text-left capitalize"
          >
            <FontAwesomeIcon
              icon={openFolders[folder] ? faChevronDown : faChevronRight}
            />
            {folder}
          </button>

          {openFolders[folder] && (
            <ul className="ml-4 mt-1 space-y-1">
              {folderFiles[folder].length === 0 ? (
                <li className="text-sm text-gray-500 italic">No files</li>
              ) : (
                folderFiles[folder].map((fn) => (
                  <li
                    key={fn}
                    className="group flex items-center justify-between bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded"
                  >
                    <button
                      onClick={() => handleLoad(fn, folder)}
                      className={`flex items-center gap-2 text-left text-sm w-full ${
                        folder !== 'articles' ? 'cursor-not-allowed opacity-60' : ''
                      }`}
                    >
                      <FontAwesomeIcon icon={faFileAlt} className="text-blue-400" />
                      <span className="truncate">{fn}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(fn, folder)}
                      className="text-red-400 hover:text-red-600 ml-2 hidden group-hover:block"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
