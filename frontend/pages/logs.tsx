'use client'

import React from 'react'
import FileExplorer from '../components/FileExplorer'
import { LogConsole } from '../components/LogConsole'

export default function LogsPage() {
  return (
    <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* === Sidebar: File Explorer === */}
      <aside className="w-[260px] bg-gray-900 border-r border-gray-800 p-4 overflow-auto">
        <FileExplorer />
      </aside>

      {/* === Main log panel === */}
      <main className="flex-1 p-6 overflow-hidden">
        <section className="bg-gray-800 rounded-xl p-4 shadow-lg overflow-auto h-full flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4">📡 Live Backend Logs</h2>
          <LogConsole />
        </section>
      </main>
    </div>
  )
}
