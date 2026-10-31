import React, { useState } from 'react'
import { Calendar, User, Clock, CheckCircle2, AlertOctagon, X, Search, Sparkles } from 'lucide-react'
import { PushPin, Tape, StarCutout } from '@/components/pinboard/PinboardDecorations'
import { Decision, TaskItem } from '@/types'

interface Props {
  decisions: Decision[]
  allTasks: TaskItem[]
  onNavigateToConflicts: () => void
}

export const DecisionsPinboard: React.FC<Props> = ({
  decisions,
  allTasks,
  onNavigateToConflicts,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [inspectedDecision, setInspectedDecision] = useState<Decision | null>(null)

  const tags = ['ALL', 'Release', 'Security', 'Architecture', 'Governance']

  const filtered = decisions.filter(d => {
    const matchesTag = selectedTag === 'ALL' || d.tags.includes(selectedTag)
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.code.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTag && matchesSearch
  })

  return (
    <section className="relative w-full pt-6 pb-16 px-4 sm:px-8">
      
      {/* Decorative stars */}
      <div className="absolute top-12 right-12 hidden md:block select-none pointer-events-none">
        <StarCutout size={30} rotation="rotate-45" />
      </div>

      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2d5f44]">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#f7fae8]">
              Confirmed Decisions Pinboard
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#e2eeb2]/80 mt-1">
              Every commitment agreed by the team, pinned with audio timestamp proof.
            </p>
          </div>

          {/* Search & Tag Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search decisions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#faf8f5] border border-stone-300 rounded-xs text-xs font-sans text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="flex items-center gap-1">
              {tags.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  className={`px-2.5 py-1 text-xs font-mono-code font-bold uppercase rounded-xs transition-all cursor-pointer ${
                    selectedTag === t
                      ? 'bg-[#ffea55] text-stone-950 border border-[#e6c900] shadow-xs'
                      : 'bg-[#faf8f5]/90 text-stone-700 hover:bg-white border border-stone-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Paper Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
          {filtered.map((dec, idx) => {
            const isContested = dec.status === 'contested'
            const pinColors: ('red' | 'cyan' | 'gold' | 'silver')[] = ['red', 'gold', 'cyan', 'silver']
            const pinColor = pinColors[idx % pinColors.length]
            const rots = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', '-rotate-0.5', 'rotate-1.5']
            const rot = rots[idx % rots.length]

            return (
              <div
                key={dec.id}
                onClick={() => isContested ? onNavigateToConflicts() : setInspectedDecision(dec)}
                className={`relative paper-sheet p-6 rounded-xs cursor-pointer group transition-all duration-300 ${rot} ${
                  isContested
                    ? 'paper-coral border-2 border-rose-500 shadow-xl'
                    : 'paper-white border border-stone-300 hover:scale-[1.02]'
                }`}
              >
                <PushPin color={pinColor} className="-top-3 left-6" />

                {/* Top Code Badge & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-code text-xs font-bold bg-stone-900 text-stone-100 px-2.5 py-0.5 rounded-xs">
                    #{dec.code}
                  </span>

                  <span className={`text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded-xs ${
                    isContested
                      ? 'bg-rose-200 text-rose-950 border border-rose-400 animate-pulse'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}>
                    {isContested ? 'CONFLICTED' : 'CONFIRMED'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg text-stone-950 leading-snug group-hover:text-emerald-900 transition-colors">
                  {dec.title}
                </h3>

                {/* Simple Context */}
                <p className="font-sans text-xs text-stone-700 mt-2 line-clamp-3 leading-relaxed">
                  {dec.context}
                </p>

                {/* Handwritten quote callout */}
                <div className="mt-3.5 p-2.5 rounded-xs bg-amber-50/90 border-l-3 border-amber-600 text-xs font-hand font-bold text-amber-950">
                  "{dec.evidenceQuote}"
                </div>

                {/* Metadata Footer */}
                <div className="mt-4 pt-3 border-t border-dashed border-stone-300 text-xs font-mono-code text-stone-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Decided by:</span>
                    <strong className="text-stone-900">{dec.owner}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="truncate max-w-[160px]">{dec.sourceMeetingTitle}</span>
                    <span className="font-bold text-emerald-800">[{dec.sourceTimestamp}]</span>
                  </div>
                </div>

                {/* Bottom Click Hint */}
                <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] font-mono-code font-bold text-stone-800 group-hover:text-emerald-800">
                  <span>{isContested ? 'Solve Contradiction →' : 'Inspect Details & Tasks →'}</span>
                  <span>📌</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* Decision Inspection Modal (Paper Dossier Style) */}
      {inspectedDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative paper-sheet paper-white w-full max-w-xl p-6 sm:p-8 rounded-xs border-2 border-stone-400 shadow-2xl space-y-5">
            <PushPin color="red" className="-top-3 left-8" />
            <Tape position="top-right" angle="-3deg" width="w-24" />

            <div className="flex items-start justify-between pb-3 border-b border-stone-300">
              <div>
                <span className="font-mono-code text-xs font-bold bg-stone-900 text-white px-2 py-0.5 rounded-xs">
                  #{inspectedDecision.code}
                </span>
                <h3 className="font-display font-black text-2xl text-stone-950 mt-1">
                  {inspectedDecision.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectedDecision(null)}
                className="text-stone-500 hover:text-stone-950 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context */}
            <div className="space-y-1">
              <span className="font-mono-code text-xs uppercase font-bold text-stone-700">
                Why this was decided:
              </span>
              <p className="font-sans text-xs sm:text-sm text-stone-800 leading-relaxed bg-stone-50 p-3 rounded-xs border border-stone-200">
                {inspectedDecision.context}
              </p>
            </div>

            {/* Exact Quote */}
            <div className="space-y-1">
              <span className="font-mono-code text-xs uppercase font-bold text-stone-700">
                Exact Quote from Audio:
              </span>
              <div className="p-3 bg-amber-50 border-l-4 border-amber-600 rounded-xs text-xs sm:text-sm font-hand font-bold text-amber-950">
                "{inspectedDecision.evidenceQuote}"
                <div className="mt-1 text-right font-mono-code text-[11px] text-amber-800">
                  — {inspectedDecision.owner} at [{inspectedDecision.sourceTimestamp}]
                </div>
              </div>
            </div>

            {/* Linked Tasks */}
            <div className="space-y-2 pt-2 border-t border-stone-300">
              <span className="font-mono-code text-xs uppercase font-bold text-stone-700">
                Action Tasks Created from this Decision:
              </span>
              {allTasks.filter(t => t.decisionRef === inspectedDecision.code).length > 0 ? (
                <div className="space-y-1.5">
                  {allTasks.filter(t => t.decisionRef === inspectedDecision.code).map(task => (
                    <div key={task.id} className="p-2.5 bg-stone-50 border border-stone-300 rounded-xs flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-stone-900">{task.title}</p>
                        <p className="text-[11px] text-stone-500">Assigned to: {task.owner} · Due {task.deadline}</p>
                      </div>
                      <span className="font-mono-code text-[10px] font-bold bg-stone-200 px-2 py-0.5 rounded-xs">
                        {task.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic">No tasks created yet.</p>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-300">
              <button
                onClick={() => setInspectedDecision(null)}
                className="bg-[#244a33] text-white font-mono-code font-bold text-xs px-5 py-2.5 rounded-xs shadow-md hover:bg-[#1a3826] cursor-pointer"
              >
                CLOSE NOTE
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}
