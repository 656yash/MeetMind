import React, { useState } from 'react'
import { Send, User, Bot, HelpCircle, CheckCircle2, Clock, Brain } from 'lucide-react'
import { PushPin, Tape } from '@/components/pinboard/PinboardDecorations'
import { Meeting, Decision, Conflict } from '@/types'
import { askMeetingsAssistant } from '@/services/groqService'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  citations?: { meetingTitle: string; timestamp: string; quote: string }[]
  timestamp: string
}

interface Props {
  meetings: Meeting[]
  decisions: Decision[]
  conflicts: Conflict[]
}

export const AskQuestionsPinboard: React.FC<Props> = ({
  meetings,
  decisions,
  conflicts,
}) => {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'assistant',
      text: "Hi! Ask me any question about your past meetings, decisions, or assigned tasks. I'll search your meeting records and give you the answer with the exact quote.",
      timestamp: 'Just now'
    }
  ])

  const quickQuestions = [
    "Why was the Winter Collection drop moved to Nov 15?",
    "Who is responsible for the fabric quality & seam audit?",
    "What did we decide about the Milan EcoWeave wool supplier?",
    "Are there any open drop date conflicts right now?"
  ]


  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || query).trim()
    if (!prompt || isLoading) return

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setQuery('')
    setIsLoading(true)

    try {
      const response = await askMeetingsAssistant(prompt, meetings, decisions, conflicts)
      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, assistantMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative w-full pt-6 pb-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2d5f44]">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#f7fae8] flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#0b3320] border border-emerald-500/40 text-emerald-400 shadow-md">
                <Brain className="w-7 h-7" />
              </span>
              <span>AI Mind</span>
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#e2eeb2]/80 mt-1.5">
              Neural cross-meeting memory intelligence. Query past agreements, dates, and commitments in natural language.
            </p>
          </div>
        </div>

        {/* Quick Question Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono-code text-xs text-[#e2eeb2]">Try asking:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="bg-[#faf8f5] hover:bg-white text-stone-900 font-sans text-xs px-3 py-1.5 rounded-xs border border-stone-300 shadow-xs cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              "{q}"
            </button>
          ))}
        </div>

        {/* Chat Pinboard Box */}
        <div className="relative paper-sheet paper-white p-6 sm:p-8 rounded-xs border-2 border-stone-300 shadow-2xl space-y-6 min-h-[480px] max-h-[600px] overflow-y-auto">
          <PushPin color="cyan" className="-top-3 left-8" />
          <Tape position="top-right" angle="3deg" width="w-24" />

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-stone-900 text-white'
                  : 'bg-[#ffea55] text-stone-950 border border-amber-400'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-xl space-y-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <div className="text-[10px] font-mono-code text-stone-500">
                  {msg.sender === 'user' ? 'You' : 'MeetMind Assistant'} · {msg.timestamp}
                </div>

                <div className={`p-4 rounded-xs text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line text-left ${
                  msg.sender === 'user'
                    ? 'bg-[#244a33] text-white font-medium'
                    : 'bg-stone-50 border border-stone-300 text-stone-900'
                }`}>
                  {msg.text}
                </div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="space-y-1.5 pt-1 text-left">
                    <span className="font-mono-code text-[11px] font-bold text-emerald-800 uppercase">
                      Exact quotes found in meetings:
                    </span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="p-2.5 bg-amber-50 border-l-3 border-amber-600 rounded-xs text-xs font-sans text-stone-800">
                        <p className="font-mono-code text-[11px] font-bold text-amber-950">
                          {c.meetingTitle} [{c.timestamp}]
                        </p>
                        <p className="font-hand text-xs sm:text-sm text-stone-900 italic mt-0.5">
                          "{c.quote}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="p-3 bg-stone-100 rounded-xs text-xs font-mono-code text-stone-600 w-fit flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              Searching past meetings and decisions...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Type your question about meetings or decisions..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend()
            }}
            disabled={isLoading}
            className="w-full pl-4 pr-24 py-3.5 bg-[#faf8f5] border-2 border-stone-300 rounded-xs text-xs sm:text-sm font-sans text-stone-900 placeholder-stone-500 focus:outline-none focus:border-stone-900 shadow-md"
          />

          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 px-5 bg-[#244a33] hover:bg-[#1a3826] text-white font-mono-code font-bold text-xs uppercase rounded-xs transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  )
}
