import React from 'react'
import { X, Dna, Calendar, Clock, User, CheckCircle2, AlertOctagon, GitCommit, ArrowRight, ShieldCheck, ListTodo } from 'lucide-react'
import { Decision, TaskItem } from '@/types'

interface DecisionDnaModalProps {
  decision: Decision | null
  onClose: () => void
  allTasks: TaskItem[]
  onJumpToMeeting?: (meetingId: string, timestamp: string) => void
}

export const DecisionDnaModal: React.FC<DecisionDnaModalProps> = ({
  decision,
  onClose,
  allTasks,
  onJumpToMeeting
}) => {
  if (!decision) return null

  const linkedTasks = allTasks.filter(t => t.decisionRef === decision.code)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0D2036] border-2 border-[#1A3A5E] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Blueprint ruler top accent */}
        <div className="h-1.5 w-full ruler-top-dense"></div>

        {/* Modal Header */}
        <div className="p-5 border-b border-[#1A3A5E] bg-[#0A1B2D] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8]">
              <Dna className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-mono-tech font-bold bg-[#1A3A5E] text-[#38BDF8] border border-[#38BDF8]/30">
                  {decision.code}
                </span>
                <span className={`text-xs font-mono-tech px-2 py-0.5 rounded uppercase font-semibold ${
                  decision.status === 'confirmed' 
                    ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/40'
                    : decision.status === 'contested'
                    ? 'bg-[#F26C65]/20 text-[#F26C65] border border-[#F26C65]/40 animate-pulse'
                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                }`}>
                  {decision.status.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono-tech text-slate-400">
                  AI Confidence: <strong className="text-white">{decision.confidence}%</strong>
                </span>
              </div>
              <h2 className="font-display font-bold text-xl text-white mt-1">
                {decision.title}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A3A5E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Section 1: Decision Lineage / Origin Trace */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5" />
              <span>Lineage & Genesis Origin</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#07121E] border border-[#1A3A5E] space-y-1">
                <span className="text-[11px] font-mono-tech text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3 text-[#38BDF8]" /> Authority & Owner
                </span>
                <p className="font-semibold text-white text-sm">{decision.owner}</p>
                <p className="text-[11px] text-slate-400">{decision.ownerRole}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#07121E] border border-[#1A3A5E] space-y-1">
                <span className="text-[11px] font-mono-tech text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#2DD4BF]" /> Source Meeting
                </span>
                <p className="font-semibold text-white text-sm truncate" title={decision.sourceMeetingTitle}>
                  {decision.sourceMeetingTitle}
                </p>
                <p className="text-[11px] text-slate-400">{decision.date}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#07121E] border border-[#1A3A5E] space-y-1">
                <span className="text-[11px] font-mono-tech text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#F5C84C]" /> Audio Timestamp
                </span>
                <p className="font-mono-tech font-bold text-[#F5C84C] text-sm">{decision.sourceTimestamp}</p>
                {onJumpToMeeting && (
                  <button
                    onClick={() => onJumpToMeeting(decision.sourceMeetingId, decision.sourceTimestamp)}
                    className="text-[11px] font-mono-tech text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Jump to audio <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Full Context & Verified Audio Quote */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono-tech uppercase tracking-wider text-slate-300">
              Contextual Background
            </h4>
            <div className="p-3.5 rounded-xl bg-[#07121E] border border-[#1A3A5E] text-sm text-slate-200 leading-relaxed">
              {decision.context}
            </div>
          </div>

          {/* Section 3: Paper Quote Proof */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono-tech uppercase tracking-wider text-slate-300">
              Verbatim Transcript Evidence
            </h4>
            <div className="paper-note p-4 rounded-xl text-slate-900 border-l-4 border-l-[#102B46] relative">
              <span className="pushpin -top-2 left-6"></span>
              <p className="font-display font-medium text-sm italic">
                "{decision.evidenceQuote}"
              </p>
              <div className="mt-2 text-right text-xs font-mono-tech text-slate-600">
                — {decision.owner} @ [{decision.sourceTimestamp}]
              </div>
            </div>
          </div>

          {/* Section 4: Resulting Action Items / Execution Output */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[#2DD4BF] flex items-center gap-1.5">
              <ListTodo className="w-3.5 h-3.5" />
              <span>Downstream Execution Tasks ({linkedTasks.length})</span>
            </h4>

            {linkedTasks.length > 0 ? (
              <div className="space-y-2">
                {linkedTasks.map(t => (
                  <div 
                    key={t.id} 
                    className="p-3 rounded-xl bg-[#07121E] border border-[#1A3A5E] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${t.status === 'done' ? 'text-[#2DD4BF]' : 'text-slate-500'}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{t.title}</p>
                        <p className="text-[10px] font-mono-tech text-slate-400">
                          Owner: {t.owner} · Due: {t.deadline}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#1A3A5E] text-[#38BDF8] shrink-0">
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono-tech text-slate-400 italic">
                No active execution tasks currently assigned to this decision record.
              </p>
            )}
          </div>

          {/* Section 5: Historical Modifications / Contradictions */}
          {decision.previousVersion && (
            <div className="p-3.5 rounded-xl bg-[#F26C65]/10 border border-[#F26C65]/30 flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-[#F26C65] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-[#F26C65]">Contradiction Alert Recorded</p>
                <p className="text-slate-300">
                  This proposal challenges earlier decision <strong className="text-white">#{decision.previousVersion}</strong>. It requires human resolution to prevent scheduling misalignment.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1A3A5E] bg-[#0A1B2D] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono-tech text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
            <span>Tamper-evident semantic memory record</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1A3A5E] hover:bg-[#38BDF8] hover:text-[#07121E] text-white text-xs font-mono-tech transition-colors cursor-pointer"
          >
            Close Decision DNA
          </button>
        </div>

      </div>
    </div>
  )
}
