import React, { useState } from 'react'
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Printer, 
  User, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Check, 
  Flame,
  Dna,
  FileText
} from 'lucide-react'
import { PushPin, Tape, BinderClip } from '@/components/pinboard/PinboardDecorations'
import { WeeklyDigest, TaskItem, Decision } from '@/types'
import { generatePersonalWeeklyDigest } from '@/services/groqService'

interface Props {
  digest: WeeklyDigest
  tasks?: TaskItem[]
  decisions?: Decision[]
}

const TEAM_MEMBERS = [
  { name: 'Sara Lin', role: 'Head of Sourcing & Garment QA', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', color: '#2563eb' },
  { name: 'Rahul Mehta', role: 'Founder & Creative Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', color: '#16a34a' },
  { name: 'Yash Deshmukh', role: 'Supply Chain & Logistics Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', color: '#d97706' },
  { name: 'Priya Sharma', role: 'E-commerce & Influencer Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80', color: '#9333ea' }
]


export const WeeklyNotesPinboard: React.FC<Props> = ({ 
  digest, 
  tasks = [], 
  decisions = [] 
}) => {
  const [selectedView, setSelectedView] = useState<'TEAM' | string>('TEAM')
  const [personalAIBriefs, setPersonalAIBriefs] = useState<Record<string, { focusSummary: string; riskAlert: string; achievements: string[] }>>({})
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)

  // Handle Groq AI generation of personal digest
  const handleGeneratePersonalBrief = async (personName: string) => {
    setIsGeneratingAi(true)
    const personTasks = tasks.filter(t => t.owner.toLowerCase().includes(personName.toLowerCase()))
    const personDecisions = decisions.filter(d => d.owner.toLowerCase().includes(personName.toLowerCase()))

    try {
      const brief = await generatePersonalWeeklyDigest(personName, personTasks, personDecisions)
      setPersonalAIBriefs(prev => ({
        ...prev,
        [personName]: brief
      }))
    } catch (e) {
      console.error(e)
    } finally {
      setIsGeneratingAi(false)
    }
  }

  const selectedMember = TEAM_MEMBERS.find(m => m.name === selectedView)

  // Person-specific items
  const memberTasks = selectedMember 
    ? tasks.filter(t => t.owner.toLowerCase().includes(selectedMember.name.toLowerCase()))
    : []
  const memberDecisions = selectedMember 
    ? decisions.filter(d => d.owner.toLowerCase().includes(selectedMember.name.toLowerCase()))
    : []

  const memberCompleted = memberTasks.filter(t => t.status === 'done').length
  const memberTotal = memberTasks.length
  const memberAIBrief = selectedMember ? personalAIBriefs[selectedMember.name] : null

  return (
    <section className="relative w-full pt-6 pb-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2d5f44]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#f7fae8]">
                Weekly Digest &amp; Personal Notes
              </h1>
              <span className="bg-[#ffea55] text-stone-950 font-mono-code text-[10px] font-bold px-2 py-0.5 rounded-full">
                GROQ SUMMARIZATION
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#e2eeb2]/80 mt-1">
              {digest.weekTitle} · {digest.dateRange} · Synthesized from immutable cross-meeting memory.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-[#faf8f5] hover:bg-white text-stone-900 font-mono-code text-xs font-bold px-3.5 py-2 rounded-xs border border-stone-300 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / EXPORT SHEET</span>
          </button>
        </div>

        {/* View Switcher Tabs (Team Overview vs Per-Person) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedView('TEAM')}
            className={`px-3.5 py-1.5 rounded-xs font-mono-code text-xs font-bold transition-all cursor-pointer ${
              selectedView === 'TEAM'
                ? 'bg-[#ffea55] text-stone-950 border border-amber-400 shadow-md scale-102'
                : 'bg-[#faf8f5]/85 text-stone-800 hover:bg-white border border-stone-300'
            }`}
          >
            ✦ ALL TEAM EXECUTIVE REVIEW
          </button>

          <span className="text-[#e2eeb2]/40 hidden sm:inline">|</span>

          {TEAM_MEMBERS.map(m => {
            const isSelected = selectedView === m.name
            const taskCount = tasks.filter(t => t.owner.toLowerCase().includes(m.name.toLowerCase())).length
            return (
              <button
                key={m.name}
                onClick={() => setSelectedView(m.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs font-mono-code text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#faf8f5] text-stone-950 border-2 border-stone-900 shadow-md scale-105'
                    : 'bg-[#faf8f5]/80 text-stone-800 hover:bg-white border border-stone-300/80'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                <span>{m.name}</span>
                <span className="text-[10px] bg-stone-200 px-1.5 rounded-full text-stone-700">
                  {taskCount}
                </span>
              </button>
            )
          })}
        </div>

        {/* ========================================================
            VIEW 1: PERSONAL DIGEST PER PERSON
           ======================================================== */}
        {selectedMember ? (
          <div className="relative paper-sheet paper-white p-6 sm:p-10 rounded-xs border-2 border-stone-300 shadow-2xl space-y-8 animate-fadeIn">
            <PushPin color="red" className="-top-3 left-10" />
            <Tape position="top-right" angle="-3deg" width="w-28" />

            {/* Member Identity Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-stone-900">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedMember.avatar} 
                  alt={selectedMember.name} 
                  className="w-14 h-14 rounded-full border-2 border-stone-800 object-cover shadow-sm"
                />
                <div>
                  <span className="font-mono-code text-[11px] uppercase font-bold text-stone-500">
                    PERSONAL WEEKLY EXECUTION DIGEST
                  </span>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-stone-950">
                    {selectedMember.name}
                  </h2>
                  <p className="font-mono-code text-xs text-stone-600">
                    {selectedMember.role} · Sprint W43
                  </p>
                </div>
              </div>

              {/* Personal Metric Tiles */}
              <div className="flex items-center gap-4 text-center">
                <div className="p-2.5 bg-stone-100 rounded-xs border border-stone-300 min-w-20">
                  <span className="font-display font-black text-2xl text-stone-900">
                    {memberCompleted}/{memberTotal}
                  </span>
                  <p className="font-mono-code text-[9px] uppercase font-bold text-stone-600">
                    Tasks Done
                  </p>
                </div>

                <div className="p-2.5 bg-emerald-100 rounded-xs border border-emerald-300 min-w-20">
                  <span className="font-display font-black text-2xl text-emerald-950">
                    {memberDecisions.length}
                  </span>
                  <p className="font-mono-code text-[9px] uppercase font-bold text-emerald-800">
                    Decisions Owned
                  </p>
                </div>
              </div>
            </div>

            {/* AI Generated Personal Synthesis via Groq */}
            <div className="p-5 bg-gradient-to-r from-amber-50 to-stone-50 rounded-xs border-2 border-amber-300 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-800" />
                  <span className="font-mono-code text-xs font-bold text-amber-950 uppercase">
                    GROQ AI PERSONAL BRIEFING
                  </span>
                </div>

                <button
                  onClick={() => handleGeneratePersonalBrief(selectedMember.name)}
                  disabled={isGeneratingAi}
                  className="bg-[#244a33] hover:bg-[#1a3826] text-white text-xs font-mono-code font-bold px-3 py-1 rounded-xs shadow-xs cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#ffea55]" />
                  <span>{isGeneratingAi ? 'Synthesizing...' : 'Re-Generate AI Brief'}</span>
                </button>
              </div>

              {memberAIBrief ? (
                <div className="space-y-2 text-xs sm:text-sm font-sans text-stone-800 leading-relaxed">
                  <p><strong>Weekly Focus:</strong> {memberAIBrief.focusSummary}</p>
                  <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xs text-xs text-rose-950 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                    <span><strong>Risk / Deadline Alert:</strong> {memberAIBrief.riskAlert}</span>
                  </div>
                  <div className="pt-1">
                    <strong className="font-mono-code text-xs text-stone-700 block mb-1">Key Achievements:</strong>
                    <ul className="list-disc pl-5 space-y-0.5 text-xs">
                      {memberAIBrief.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-stone-700 space-y-1">
                  <p>
                    {selectedMember.name} has <strong>{memberTotal} action items</strong> scheduled for Project Alpha and is primary sponsor for <strong>{memberDecisions.length} ratified platform decisions</strong>.
                  </p>
                  <p className="text-stone-500 font-mono-code text-[11px]">
                    Click "Re-Generate AI Brief" to query Groq for personalized momentum analytics.
                  </p>
                </div>
              )}
            </div>

            {/* Member's Ratified Decisions */}
            <div className="space-y-3">
              <span className="font-mono-code text-xs uppercase font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-xs inline-flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5 text-emerald-800" />
                <span>Ratified Commitments Sponsored by {selectedMember.name} ({memberDecisions.length})</span>
              </span>

              {memberDecisions.length === 0 ? (
                <p className="text-xs text-stone-500 font-mono-code p-3 bg-stone-50 rounded border border-dashed border-stone-300">
                  No direct decision ownership recorded in current meetings.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {memberDecisions.map(d => (
                    <div key={d.id} className="p-4 rounded-xs bg-[#f5eedc] border border-amber-300 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-stone-950 font-bold text-sm">#{d.code} · {d.title}</strong>
                        <span className="font-mono-code text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded font-bold">
                          {d.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-stone-700">{d.context}</p>
                      <p className="text-[11px] font-mono-code text-stone-600 italic pt-1 border-t border-amber-200">
                        Verbatim Quote: "{d.evidenceQuote}" ({d.date})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Member's Action Items */}
            <div className="space-y-3 pt-4 border-t border-dashed border-stone-300">
              <span className="font-mono-code text-xs uppercase font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-xs inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                <span>Active Action Items &amp; Deadlines ({memberTasks.length})</span>
              </span>

              {memberTasks.length === 0 ? (
                <p className="text-xs text-stone-500 font-mono-code p-3 bg-stone-50 rounded border border-dashed border-stone-300">
                  All action items completed or none assigned.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {memberTasks.map(t => (
                    <div key={t.id} className="p-3 rounded-xs bg-stone-50 border border-stone-300 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-stone-900 font-bold">{t.title}</strong>
                        <span className={`text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded ${
                          t.status === 'done' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-200 text-amber-950'
                        }`}>
                          {t.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600">{t.description}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-stone-200 font-mono-code text-[10px] text-stone-700">
                        <span>Ref #{t.decisionRef}</span>
                        <span className="font-bold text-amber-900">Due {t.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : (

          /* ========================================================
              VIEW 2: ALL TEAM EXECUTIVE REVIEW
             ======================================================== */
          <div className="relative paper-sheet paper-white p-6 sm:p-10 rounded-xs border-2 border-stone-300 shadow-2xl space-y-8 animate-fadeIn">
            <PushPin color="red" className="-top-3 left-10" />
            <Tape position="top-right" angle="-2deg" width="w-28" />

            {/* Top Headline Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-stone-900">
              <div>
                <span className="font-mono-code text-xs uppercase font-bold text-stone-500">
                  ALL-TEAM CROSS-MEETING INTELLIGENCE
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-stone-950 mt-1">
                  WEEK IN REVIEW
                </h2>
              </div>

              <div className="text-left sm:text-right">
                <span className="font-display font-black text-3xl text-stone-900">
                  {digest.completedTasks} <span className="text-stone-400 text-xl font-normal">/ {digest.totalTasks}</span>
                </span>
                <p className="font-mono-code text-xs font-bold text-emerald-800 uppercase">
                  Tasks Completed This Week
                </p>
              </div>
            </div>

            {/* SECTION 1: WHAT GOT DONE */}
            <div className="space-y-3">
              <span className="font-mono-code text-xs uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs inline-block">
                1. What Got Done
              </span>
              <div className="space-y-2">
                {digest.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-800 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: WHAT CHANGED */}
            <div className="space-y-3 pt-4 border-t border-dashed border-stone-300">
              <span className="font-mono-code text-xs uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-xs inline-block">
                2. Decisions That Changed
              </span>
              {digest.changedDecisions.map((cd, i) => (
                <div key={i} className="p-4 rounded-xs bg-[#f5eedc] border border-amber-300 space-y-1 text-xs sm:text-sm font-sans">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-stone-950 font-bold">{cd.decision}</strong>
                    <span className="font-mono-code text-xs bg-amber-200 text-amber-950 px-2 py-0.5 rounded-xs font-bold">
                      {cd.from} → {cd.to}
                    </span>
                  </div>
                  <p className="text-stone-700"><strong>Why:</strong> {cd.rationale}</p>
                  <p className="text-stone-600 text-xs"><strong>Result:</strong> {cd.impact}</p>
                </div>
              ))}
            </div>

            {/* SECTION 3: NEXT WEEK PRIORITIES */}
            <div className="space-y-3 pt-4 border-t border-dashed border-stone-300">
              <span className="font-mono-code text-xs uppercase font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-xs inline-block">
                3. Priorities for Next Week
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {digest.nextWeekPriorities.map((p, i) => (
                  <div key={i} className="p-3 bg-stone-50 border border-stone-200 rounded-xs flex items-center gap-2 text-xs font-mono-code font-bold text-stone-900">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Handwritten Bottom Verdict */}
            <div className="pt-6 border-t-2 border-stone-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="font-hand text-2xl font-bold text-stone-800">
                "{digest.handwrittenVerdict}"
              </div>
              <span className="font-mono-code text-xs text-stone-500">
                AFTR_DIGEST_HASH: 0x9482F
              </span>
            </div>

          </div>
        )}

      </div>
    </section>
  )
}
