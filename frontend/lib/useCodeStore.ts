import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GeneratedCode } from '../types/code'

interface CodeState {
  generatedCode: GeneratedCode | null
  setGeneratedCode: (code: GeneratedCode) => void
  clearCode: () => void
}

export const useCodeStore = create(
  persist<CodeState>(
    (set) => ({
      generatedCode: null,
      setGeneratedCode: (code) => set({ generatedCode: code }),
      clearCode: () => set({ generatedCode: null }),
    }),
    {
      name: 'generated-code',
    }
  )
)
