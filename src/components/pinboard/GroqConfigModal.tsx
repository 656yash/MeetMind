import React, { useState, useEffect } from 'react'
import { X, Sparkles, Key, CheckCircle, Shield, ExternalLink, Cpu } from 'lucide-react'
import { 
  getStoredGroqApiKey, 
  setStoredGroqApiKey, 
  getStoredGroqModel, 
  setStoredGroqModel, 
  GROQ_MODELS 
} from '@/services/groqService'

interface GroqConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

export const GroqConfigModal: React.FC<GroqConfigModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState(GROQ_MODELS[0].id)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredGroqApiKey())
      setSelectedModel(getStoredGroqModel())
      setSavedSuccess(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    setStoredGroqApiKey(apiKey)
    setStoredGroqModel(selectedModel)
    setSavedSuccess(true)
    setTimeout(() => {
      onSaved()
      onClose()
    }, 600)
  }

  const handleClear = () => {
    setStoredGroqApiKey('')
    setApiKey('')
    setSavedSuccess(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0D2036] border-2 border-[#1A3A5E] rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Technical ruler top accent */}
        <div className="h-1.5 w-full ruler-top-dense"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1A3A5E] bg-[#0A1B2D]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Groq AI Intelligence Engine
              </h3>
              <p className="text-xs font-mono-tech text-slate-400">
                LPU™ Inference Acceleration for Meeting Memory
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A3A5E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Status Alert Banner */}
          <div className="p-3.5 rounded-xl bg-[#102B46] border border-[#38BDF8]/30 flex items-start gap-3">
            <Shield className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white">Zero Setup Required</p>
              <p>
                AFTR works immediately with a deterministic high-fidelity AI simulation. To connect live ultra-fast inference with Llama 3 on Groq, paste your API key below.
              </p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-tech uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Groq API Key (gsk_...)</span>
              <a 
                href="https://console.groq.com/keys" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#38BDF8] hover:underline flex items-center gap-1 text-[11px]"
              >
                Get Free API Key <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2.5 bg-[#07121E] border border-[#1A3A5E] rounded-xl text-xs font-mono-tech text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
              />
            </div>
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-tech uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>Inference Model</span>
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#07121E] border border-[#1A3A5E] rounded-xl text-xs font-mono-tech text-white focus:outline-none focus:border-[#38BDF8]"
            >
              {GROQ_MODELS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#2DD4BF] text-xs font-mono-tech">
              <CheckCircle className="w-4 h-4" />
              <span>Groq settings updated & verified!</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#1A3A5E] bg-[#0A1B2D]">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-mono-tech text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            Clear Stored Key
          </button>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-xs font-mono-tech text-slate-300 hover:bg-[#1A3A5E] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#07121E] font-bold text-xs font-mono-tech transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
