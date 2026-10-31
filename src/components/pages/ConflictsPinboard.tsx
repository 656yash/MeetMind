import React, { useState } from 'react'
import { AlertTriangle, CheckCircle2, Zap, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import confetti from 'canvas-confetti'
import { PushPin, Tape, BinderClip } from '@/components/pinboard/PinboardDecorations'
import { Conflict } from '@/types'

interface Props {
  conflicts: Conflict[]
  onResolveConflict: (conflictId: string, resolution: 'kept_historical' | 'adopted_proposal' | 'scheduled_review') => void
}

export const ConflictsPinboard: React.FC<Props> = ({
  conflicts,
  onResolveConflict,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active')

  const activeConflicts = conflicts.filter(c => c.status === 'active')
  const resolvedConflicts = conflicts.filter(c => c.status === 'resolved')
  const currentList = activeTab === 'active' ? activeConflicts : resolvedConflicts

  const handleResolve = (conflictId: string, resolution: 'kept_historical' | 'adopted_proposal' | 'scheduled_review') => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    })
    onResolveConflict(conflictId, resolution)
  }

  return (
    <section className="relative w-full pt-6 pb-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2d5f44]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="font-mono-code text-xs uppercase font-bold text-rose-300">
                CROSS-MEETING CHECKER
              </span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#f7fae8] mt-1">
              Contradictions & Clashing Plans
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#e2eeb2]/80 mt-1">
              MeetMind flags when a new meeting suggests something that contradicts an earlier agreed plan.
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-xs font-mono-code text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-[#faf8f5]/80 text-stone-800 hover:bg-white'
              }`}
            >
              Active Conflicts ({activeConflicts.length})
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1.5 rounded-xs font-mono-code text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'resolved'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#faf8f5]/80 text-stone-800 hover:bg-white'
              }`}
            >
              Resolved ({resolvedConflicts.length})
            </button>
          </div>
        </div>

        {/* Conflicts List */}
        {currentList.length === 0 ? (
          <div className="paper-sheet paper-white p-12 text-center rounded-xs border border-stone-300 space-y-3">
            <ShieldCheck className="w-12 h-12 text-emerald-700 mx-auto" />
            <h3 className="font-display font-bold text-2xl text-stone-900">
              No Active Conflicts on File!
            </h3>
            <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              All team decisions and proposals are currently aligned. If someone proposes a conflicting date or architecture in a future meeting, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {currentList.map(conf => (
              <div
                key={conf.id}
                className="relative paper-sheet paper-white p-6 sm:p-9 rounded-xs border-2 border-rose-400 shadow-xl space-y-6"
              >
                <PushPin color="red" className="-top-3 left-8" />
                <Tape position="top-right" angle="-3deg" width="w-28" />

                {/* Top Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <span className="font-mono-code text-xs font-bold uppercase bg-rose-100 text-rose-900 px-2.5 py-1 rounded-xs flex items-center gap-1.5 border border-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>CONTRADICTION DETECTED IN AUDIO</span>
                  </span>
                  <span className="font-mono-code text-xs font-bold text-stone-500">
                    {conf.historicalDecision.date} vs {conf.newProposal.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-black text-2xl text-stone-950">
                  {conf.title}
                </h3>

                {/* Side-by-Side Paper Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Paper: Earlier Confirmed Decision */}
                  <div className="md:col-span-5 paper-sheet paper-cream p-5 rounded-xs border border-stone-300 space-y-3 -rotate-0.5">
                    <span className="font-mono-code text-[11px] font-bold uppercase bg-emerald-800 text-white px-2 py-0.5 rounded-xs inline-block">
                      1. PREVIOUS AGREED DECISION
                    </span>
                    <h4 className="font-display font-bold text-base text-stone-900">
                      {conf.historicalDecision.title}
                    </h4>
                    <div className="p-3 bg-white/80 rounded-xs border-l-3 border-emerald-600 text-xs font-hand font-bold text-stone-900">
                      "{conf.historicalDecision.quote}"
                    </div>
                    <div className="text-[11px] font-mono-code text-stone-600 pt-2 border-t border-stone-300 space-y-0.5">
                      <p><strong>From:</strong> {conf.historicalDecision.meetingTitle}</p>
                      <p><strong>Agreed by:</strong> {conf.historicalDecision.owner} at [{conf.historicalDecision.timestamp}]</p>
                    </div>
                  </div>

                  {/* Center Lightning Hub */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center p-3 text-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-rose-100 border-2 border-rose-500 text-rose-600 flex items-center justify-center">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <span className="font-mono-code text-[11px] font-bold text-rose-800">
                      VS
                    </span>
                  </div>

                  {/* Right Paper: New Unapproved Proposal */}
                  <div className="md:col-span-5 paper-sheet paper-yellow p-5 rounded-xs border border-amber-300 space-y-3 rotate-0.5">
                    <span className="font-mono-code text-[11px] font-bold uppercase bg-rose-600 text-white px-2 py-0.5 rounded-xs inline-block">
                      2. NEW UNAPPROVED PROPOSAL
                    </span>
                    <h4 className="font-display font-bold text-base text-stone-900">
                      {conf.newProposal.proposalTitle}
                    </h4>
                    <div className="p-3 bg-white/80 rounded-xs border-l-3 border-rose-500 text-xs font-hand font-bold text-stone-900">
                      "{conf.newProposal.quote}"
                    </div>
                    <div className="text-[11px] font-mono-code text-stone-700 pt-2 border-t border-amber-300 space-y-0.5">
                      <p><strong>From:</strong> {conf.newProposal.meetingTitle}</p>
                      <p><strong>Proposed by:</strong> {conf.newProposal.proposedBy} at [{conf.newProposal.timestamp}]</p>
                    </div>
                  </div>

                </div>

                {/* Plain English Explanation */}
                <div className="p-4 bg-stone-100 rounded-xs border border-stone-300 space-y-1.5">
                  <span className="font-mono-code text-xs uppercase font-bold text-stone-800">
                    Why this matters:
                  </span>
                  <p className="font-sans text-xs sm:text-sm text-stone-800 leading-relaxed">
                    {conf.aiExplanation}
                  </p>
                  <p className="font-mono-code text-xs text-emerald-900 font-bold pt-1">
                    Recommended action: {conf.recommendedAction}
                  </p>
                </div>

                {/* Resolution buttons */}
                {conf.status === 'active' && (
                  <div className="pt-4 border-t border-dashed border-stone-300 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono-code text-xs font-bold text-stone-700">
                      Which plan does the team keep?
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleResolve(conf.id, 'kept_historical')}
                        className="bg-[#244a33] hover:bg-[#1a3826] text-white font-mono-code font-bold text-xs px-4 py-2.5 rounded-xs shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      >
                        ✓ {conf.id === 'conf-101' ? 'Keep Nov 15 (Stick with Fabric QA Plan)' : 'Keep 60% D2C Store Reserve'}
                      </button>
                      <button
                        onClick={() => handleResolve(conf.id, 'adopted_proposal')}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-mono-code font-bold text-xs px-4 py-2.5 rounded-xs shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      >
                        {conf.id === 'conf-101' ? 'Change to Nov 10 (Accept Marketing Proposal)' : 'Allocate 100% to Wholesale Consignment'}
                      </button>
                    </div>
                  </div>
                )}

                {conf.status === 'resolved' && (
                  <div className="p-3 bg-emerald-100 text-emerald-950 font-mono-code text-xs rounded-xs flex items-center justify-between border border-emerald-300">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4 text-emerald-700" />
                      Resolved: {conf.resolutionAction === 'adopted_proposal' ? 'The team officially accepted the proposed modification and synced database records.' : 'The team officially confirmed and ratified the historical decision in the database.'}
                    </span>
                    <span className="text-emerald-800 text-[10px] font-bold uppercase bg-emerald-200/60 px-2 py-0.5 rounded">Synced to Pinboard &amp; DB</span>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
