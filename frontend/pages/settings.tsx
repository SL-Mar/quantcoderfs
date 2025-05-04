'use client'

import React, { useState, useEffect } from 'react'
import api from '../lib/api'

const MODEL_PRICING: Record<string, string> = {
  'gpt-4.1': 'Input $2.00 / Cached $0.50 / Output $8.00',
  'o1': 'Input $15.00 / Cached $7.50 / Output $60.00',
  'gpt-4o': 'Input $2.50 / Cached $1.25 / Output $10.00',
  'gpt-4o-mini': 'Input $0.15 / Cached $0.075 / Output $0.60',
  'gpt-3.5-turbo': 'Input $0.50 / Output $1.50',
}

export default function Settings() {
  const [settings, setSettings] = useState<{ manager: string; store: string } | null>(null)
  const [models, setModels] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      try {
        const [current, available] = await Promise.all([
          api.getActiveLLM(),
          api.listSupportedModels(),
        ])
        setSettings(current)
        setModels(available)
      } catch (err) {
        console.error('❌ Failed to load LLM settings:', err)
      }
    }
    load()
  }, [])

  const updateModel = async (field: 'manager' | 'store', model_name: string) => {
    try {
      const updated = await api.updateLLM(field, model_name)
      setSettings(updated)
      setMessage(`✅ Updated ${field} to ${model_name}`)
      window.dispatchEvent(new Event('llm-updated')) // 🔄 notify badge
    } catch (err) {
      console.error('❌ Error updating model:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 grid place-items-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold text-blue-600 mb-6">LLM Settings</h1>

        {settings && (
          <>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Manager Model
              </label>
              <select
                value={settings.manager}
                onChange={(e) => updateModel('manager', e.target.value)}
                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
                title={MODEL_PRICING[settings.manager] || ''}
              >
                {models.map((model) => (
                  <option key={model} value={model} title={MODEL_PRICING[model]}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Store Model
              </label>
              <select
                value={settings.store}
                onChange={(e) => updateModel('store', e.target.value)}
                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
                title={MODEL_PRICING[settings.store] || ''}
              >
                {models.map((model) => (
                  <option key={model} value={model} title={MODEL_PRICING[model]}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {message && (
          <div className="mt-4 p-2 text-sm text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-200 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
