import { GeneratedCode } from '../types/code'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const FILEMANAGER_BASE_URL = `${BASE_URL}/filemanager`
const CODER_BASE_URL = `${BASE_URL}/coder`
const SETTINGS_BASE_URL = `${BASE_URL}/settings`

type FileFolder = 'articles' | 'codes'

const api = {
  /** 1️⃣ List all files in a given folder (`articles` or `codes`) */
  async listFiles(folder: FileFolder): Promise<string[]> {
    const res = await fetch(`${FILEMANAGER_BASE_URL}?folder=${encodeURIComponent(folder)}`)
    if (!res.ok) {
      throw new Error(`Failed to list files in "${folder}"`)
    }
    const { files } = await res.json()
    return files || []
  },

  /** 2️⃣ Stream a PDF blob from the `articles` folder */
  async fetchPdfBlob(filename: string): Promise<Blob> {
    const res = await fetch(
      `${FILEMANAGER_BASE_URL}/pdf/${encodeURIComponent(filename)}?folder=articles`
    )
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Failed to fetch PDF "${filename}": ${text}`)
    }
    return res.blob()
  },

  /** 3️⃣ Kick off unified Extract+Code by uploading the PDF */
  async generateCode(filename: string): Promise<GeneratedCode> {
    const pdfBlob = await this.fetchPdfBlob(filename)

    const form = new FormData()
    form.append('file', pdfBlob, filename)

    const res = await fetch(`${CODER_BASE_URL}/process`, {
      method: 'POST',
      body: form,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Failed to generate code')
    }
    return res.json()
  },

  /** 4️⃣ Load a text or code file from `articles` or `codes` */
  async loadFile(
    filename: string,
    folder: FileFolder
  ): Promise<{ filename: string; content: string }> {
    const res = await fetch(
      `${FILEMANAGER_BASE_URL}/load/${encodeURIComponent(filename)}?folder=${encodeURIComponent(folder)}`
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || `Failed to load file "${filename}"`)
    }
    return res.json()
  },

  /** 5️⃣ Delete a file from `articles` or `codes` */
  async deleteFile(filename: string, folder: FileFolder): Promise<void> {
    const res = await fetch(
      `${FILEMANAGER_BASE_URL}/${encodeURIComponent(filename)}?folder=${encodeURIComponent(folder)}`,
      { method: 'DELETE' }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || `Failed to delete "${filename}"`)
    }
  },

  /** 6️⃣ Save generated code into the `codes` folder */
  async saveFile(
    content: string,
    filename: string,
    folder: 'codes' = 'codes'
  ): Promise<void> {
    const res = await fetch(
      `${FILEMANAGER_BASE_URL}/save?folder=${encodeURIComponent(folder)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content }),
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || `Failed to save code "${filename}"`)
    }
  },

  /** 7️⃣ Get the active LLM models (manager and store) */
  async getActiveLLM(): Promise<{ manager: string; store: string }> {
    const res = await fetch(`${SETTINGS_BASE_URL}/llm/active`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || `Failed to fetch active LLM models`)
    }
    return res.json()
  },

  /** 8️⃣ Update one of the LLM fields (manager or store) */
  async updateLLM(field: 'manager' | 'store', model_name: string): Promise<{ manager: string; store: string }> {
    const res = await fetch(`${SETTINGS_BASE_URL}/llm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, model_name }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || `Failed to update ${field} to ${model_name}`)
    }
    return res.json()
  },

  /** 9️⃣ List all supported models (for dropdowns, etc.) */
  async listSupportedModels(): Promise<string[]> {
    const res = await fetch(`${SETTINGS_BASE_URL}/llm/models`)
    if (!res.ok) {
      throw new Error('Failed to fetch supported LLM models')
    }
    return res.json()
  },
}

export default api
