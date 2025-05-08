'use client'

import React, { useState, useEffect } from 'react'
import api from '../lib/api'

const MODEL_OPTIONS = [
  { name: 'gpt-4.1', price: 'Input $2.00 / Cached $0.50 / Output $8.00', disabled: false },
  { name: 'gpt-4o', price: 'Input $2.50 / Cached $1.25 / Output $10.00', disabled: false },
  { name: 'gpt-3.5-turbo', price: 'Input $0.50 / Output $1.50', disabled: false },
  { name: 'gpt-4o-mini', price: 'Input $0.15 / Cached $0.075 / Output $0.60', disabled: true },
  { name: 'o1', price: 'Input $15.00 / Cached $7.50 / Output $60.00', disabled: true },
]

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
    const modelInfo = MODEL_OPTIONS.find((m) => m.name === model_name)
    if (modelInfo?.disabled) {
      setMessage(`⚠️ ${model_name} is currently unsupported.`)
      return
    }

    try {
      const updated = await api.updateLLM(field, model_name)
      setSettings(updated)
      setMessage(`✅ Updated ${field} to ${model_name}`)
      window.dispatchEvent(new Event('llm-updated'))
    } catch (err) {
      console.error('❌ Error updating model:', err)
    }
  }

  const renderSelect = (field: 'manager' | 'store', value: string) => (
    <select
      value={value}
      onChange={(e) => updateModel(field, e.target.value)}
      className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
      title={MODEL_OPTIONS.find((m) => m.name === value)?.price || ''}
    >
      {MODEL_OPTIONS.map((model) => (
        <option
          key={model.name}
          value={model.name}
          disabled={model.disabled}
          title={model.price}
        >
          {model.disabled ? `${model.name} (unavailable)` : model.name}
        </option>
      ))}
    </select>
  )

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
              {renderSelect('manager', settings.manager)}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-500">
                Store Model
              </label>
              {renderSelect('store', settings.store)}
            </div>
          </>
        )}

        {message && (
          <div className="mt-4 p-2 text-sm bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
