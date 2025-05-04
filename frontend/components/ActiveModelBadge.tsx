'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import api from '../lib/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faDatabase } from '@fortawesome/free-solid-svg-icons'

const ActiveModelBadge: React.FC = () => {
  const [manager, setManager] = useState<string | null>(null)
  const [store, setStore] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const fetchActiveModels = async () => {
    try {
      const setting = await api.getActiveLLM()
      setManager(setting.manager)
      setStore(setting.store)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch active LLM models:', err)
      setError('⚠️')
    }
  }

  useEffect(() => {
    fetchActiveModels()
    const handler = () => fetchActiveModels()
    window.addEventListener('llm-updated', handler)
    return () => window.removeEventListener('llm-updated', handler)
  }, [pathname])

  return (
    <button
      onClick={() => router.push('/settings')}
      title={`Manager: ${manager} | Store: ${store}`}
      className="ml-auto flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded-md border border-gray-500 transition"
    >
      <FontAwesomeIcon icon={faRobot} />
      <span>{manager || '...'}</span>
      <FontAwesomeIcon icon={faDatabase} />
      <span>{store || '...'}</span>
    </button>
  )
}

export default ActiveModelBadge
