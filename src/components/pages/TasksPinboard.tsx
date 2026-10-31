import React, { useState } from 'react'
import { 
  CheckSquare, 
  Clock, 
  User, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  Filter, 
  Bell, 
  Share2, 
  ExternalLink, 
  Send, 
  AlertTriangle, 
  Copy, 
  Sparkles,
  Layers,
  Calendar
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { PushPin, Tape, BinderClip } from '@/components/pinboard/PinboardDecorations'
import { TaskItem } from '@/types'

interface Props {
  tasks: TaskItem[]
  onUpdateStatus: (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => void
  onToggleApproval: (taskId: string) => void
  onSyncTask?: (taskId: string, target: 'Trello' | 'Google Tasks' | 'Notion' | 'Slack' | 'Jira' | 'GitHub', issueKey?: string) => void
  onSendReminder?: (taskId: string) => void
}

const playSound = (freq = 600, duration = 0.1) => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

export const TasksPinboard: React.FC<Props> = ({
  tasks,
  onUpdateStatus,
  onToggleApproval,
  onSyncTask,
  onSendReminder,
}) => {
  const [selectedOwner, setSelectedOwner] = useState<string>('ALL')
  const [filterMode, setFilterMode] = useState<'ALL' | 'DUE_SOON' | 'NEEDS_APPROVAL' | 'SYNCED'>('ALL')
  const [activeSyncModalTask, setActiveSyncModalTask] = useState<TaskItem | null>(null)
  const [selectedTracker, setSelectedTracker] = useState<'Jira' | 'Trello' | 'GitHub' | 'Notion' | 'Slack'>('Jira')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const owners = ['ALL', 'Rahul Mehta', 'Priya Sharma', 'Yash Deshmukh', 'Sara Lin']

  // Calculation of deadline urgency (Simulation relative to Nov 03, 2026)
  const getDeadlineUrgency = (deadlineStr: string) => {
    const lower = deadlineStr.toLowerCase()
    if (lower.includes('nov 03') || lower.includes('nov 3')) {
      return { status: 'TODAY', label: 'DUE TODAY (<24h)', badgeClass: 'bg-rose-600 text-white animate-pulse' }
    } else if (lower.includes('nov 04') || lower.includes('nov 4') || lower.includes('nov 05') || lower.includes('nov 5')) {
      return { status: 'SOON', label: 'DUE SOON (<48h)', badgeClass: 'bg-amber-400 text-stone-950 font-bold border border-amber-500' }
    } else if (lower.includes('oct')) {
      return { status: 'OVERDUE', label: 'OVERDUE', badgeClass: 'bg-rose-700 text-white font-bold' }
    }
    return { status: 'NORMAL', label: 'ON TRACK', badgeClass: 'bg-emerald-100 text-emerald-900 border border-emerald-300' }
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    playSound(880, 0.15)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Handle Trigger Reminder Ping
  const handleTriggerReminder = (task: TaskItem) => {
    const reminderText = `🔔 REMINDER [@${task.owner}]: Task "${task.title}" is due on ${task.deadline} for ratified Decision #${task.decisionRef}. Please confirm execution status.`
    
    // Copy to clipboard
    try {
      navigator.clipboard.writeText(reminderText)
    } catch {}

    if (onSendReminder) {
      onSendReminder(task.id)
    }

    showToast(`Reminder dispatched to ${task.owner} via Slack & copied to clipboard!`)
  }

  // Handle Tracker Sync
  const handleExecuteSync = () => {
    if (!activeSyncModalTask) return

    if (!activeSyncModalTask.approved) {
      alert("⚠️ HUMAN GATE REQUIREMENT: Task must be confirmed and approved before dispatching to external trackers.")
      return
    }

    const issueKey = selectedTracker === 'Jira' 
      ? `ALPHA-${Math.floor(Math.random() * 800 + 100)}`
      : selectedTracker === 'GitHub'
      ? `#${Math.floor(Math.random() * 90 + 10)}`
      : `CARD-${Math.floor(Math.random() * 900 + 100)}`

    if (onSyncTask) {
      onSyncTask(activeSyncModalTask.id, selectedTracker, issueKey)
    }

    showToast(`Successfully created task in ${selectedTracker} (${issueKey})!`)
    setActiveSyncModalTask(null)
    confetti({ particleCount: 50, spread: 60 })
  }

  // Filtering
  const filtered = tasks.filter(t => {
    const matchesOwner = selectedOwner === 'ALL' || t.owner === selectedOwner
    if (!matchesOwner) return false

    if (filterMode === 'DUE_SOON') {
      const urgency = getDeadlineUrgency(t.deadline)
      return urgency.status === 'TODAY' || urgency.status === 'SOON' || urgency.status === 'OVERDUE'
    } else if (filterMode === 'NEEDS_APPROVAL') {
      return !t.approved
    } else if (filterMode === 'SYNCED') {
      return t.synced
    }
    return true
  })

  const todo = filtered.filter(t => t.status === 'todo')
  const inProgress = filtered.filter(t => t.status === 'in_progress')
  const done = filtered.filter(t => t.status === 'done')

  const renderCard = (task: TaskItem, index: number) => {
    const isCritical = task.priority === 'CRITICAL'
    const isHigh = task.priority === 'HIGH'
    const urgency = getDeadlineUrgency(task.deadline)
    const rot = index % 2 === 0 ? '-rotate-0.5' : 'rotate-0.5'

    return (
      <div
        key={task.id}
        className={`relative paper-sheet p-5 rounded-xs border transition-all ${rot} ${
          task.status === 'done'
            ? 'paper-mint border-emerald-300 opacity-90'
            : isCritical
            ? 'paper-white border-2 border-rose-400'
            : 'paper-white border-stone-300'
        }`}
      >
        <PushPin color={isCritical ? 'red' : 'gold'} className="-top-3 left-4" />

        {/* Top Badges (Priority, Ref, Urgency) */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded-xs ${
              isCritical
                ? 'bg-rose-600 text-white'
                : isHigh
                ? 'bg-[#ffea55] text-stone-900 border border-amber-400'
                : 'bg-stone-200 text-stone-800'
            }`}>
              {task.priority}
            </span>
            <span className="font-mono-code text-[11px] text-stone-500 font-bold">
              #{task.decisionRef}
            </span>
          </div>

          <span className={`text-[9px] font-mono-code px-1.5 py-0.5 rounded-xs ${urgency.badgeClass}`}>
            {urgency.label}
          </span>
        </div>

        {/* Title */}
        <h4 className="font-display font-bold text-sm text-stone-950 leading-snug">
          {task.title}
        </h4>

        {/* Description */}
        <p className="font-sans text-xs text-stone-600 mt-1 leading-relaxed">
          {task.description}
        </p>

        {/* Owner & Due Date */}
        <div className="mt-3 pt-2.5 border-t border-dashed border-stone-300 flex items-center justify-between text-xs font-mono-code text-stone-700">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-bold">{task.owner}</span>
          </div>
          <span className="text-amber-900 font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>Due {task.deadline}</span>
          </span>
        </div>

        {/* Tracker Integration & Reminder Row */}
        <div className="mt-2.5 pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
          {/* Tracker Sync Badge */}
          {task.synced ? (
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 border border-emerald-400 text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-xs">
              <Check className="w-3 h-3 text-emerald-700" />
              <span>SYNCED: {task.syncTarget} [{task.integrationIssueKey || 'ACTIVE'}]</span>
            </span>
          ) : (
            <button
              onClick={() => setActiveSyncModalTask(task)}
              className="inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-xs cursor-pointer transition-colors"
              title="Dispatch task to Jira, Trello, GitHub or Notion"
            >
              <Share2 className="w-3 h-3 text-stone-600" />
              <span>SYNC TO TRACKER →</span>
            </button>
          )}

          {/* Reminder Trigger Button */}
          <button
            onClick={() => handleTriggerReminder(task)}
            className="inline-flex items-center gap-1 text-[10px] font-mono-code text-stone-600 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 px-2 py-0.5 rounded-xs border border-stone-200 cursor-pointer"
            title="Send reminder ping via Slack / Email"
          >
            <Bell className="w-3 h-3 text-amber-700" />
            <span>{task.lastReminderSent ? `Pinged (${task.lastReminderSent})` : 'Ping Reminder'}</span>
          </button>
        </div>

        {/* Human Gate Toggle (MANDATORY CONFIRMATION STEP) */}
        <div className="mt-2.5 pt-2 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => onToggleApproval(task.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer ${
              task.approved
                ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 shadow-xs'
                : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{task.approved ? 'HUMAN GATE: APPROVED ✓' : 'NEEDS HUMAN CONFIRMATION'}</span>
          </button>
        </div>

        {/* Column Status Transition Buttons */}
        <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-end gap-1.5">
          {task.status !== 'todo' && (
            <button
              onClick={() => onUpdateStatus(task.id, 'todo')}
              className="text-[10px] font-mono-code px-2 py-1 rounded-xs bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
            >
              ← To Do
            </button>
          )}
          {task.status !== 'in_progress' && (
            <button
              onClick={() => onUpdateStatus(task.id, 'in_progress')}
              className="text-[10px] font-mono-code px-2 py-1 rounded-xs bg-[#ffea55] text-stone-950 font-bold hover:bg-[#ffe533] cursor-pointer"
            >
              {task.status === 'todo' ? 'Start Doing →' : '← Doing'}
            </button>
          )}
          {task.status !== 'done' && (
            <button
              onClick={() => {
                confetti({ particleCount: 40, spread: 50 })
                onUpdateStatus(task.id, 'done')
              }}
              className="text-[10px] font-mono-code px-2 py-1 rounded-xs bg-emerald-700 text-white font-bold hover:bg-emerald-800 cursor-pointer"
            >
              Done ✓
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="relative w-full pt-6 pb-16 px-4 sm:px-8">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="paper-sheet paper-yellow px-4 py-2.5 rounded-xs border-2 border-amber-400 shadow-2xl flex items-center gap-2.5 text-xs font-mono-code font-bold text-stone-950">
            <Bell className="w-4 h-4 text-amber-900 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2d5f44]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#f7fae8]">
                Action Tasks &amp; Tracker Command
              </h1>
              <span className="bg-emerald-800 text-emerald-200 font-mono-code text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-600">
                INTEGRATION SYNC ACTIVE
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#e2eeb2]/80 mt-1">
              Confirmed decisions automatically generate actionable tasks with deadlines, external tracker integration, and automated reminder pings.
            </p>
          </div>

          {/* Quick Filter Mode Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-xs text-xs font-mono-code font-bold transition-all cursor-pointer ${
                filterMode === 'ALL'
                  ? 'bg-[#ffea55] text-stone-950 border border-amber-400 shadow-xs'
                  : 'bg-[#faf8f5]/80 text-stone-800 hover:bg-white'
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setFilterMode('DUE_SOON')}
              className={`px-3 py-1.5 rounded-xs text-xs font-mono-code font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === 'DUE_SOON'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-[#faf8f5]/80 text-rose-900 hover:bg-rose-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Due Soon / Overdue</span>
            </button>
            <button
              onClick={() => setFilterMode('NEEDS_APPROVAL')}
              className={`px-3 py-1.5 rounded-xs text-xs font-mono-code font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === 'NEEDS_APPROVAL'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'bg-[#faf8f5]/80 text-amber-950 hover:bg-amber-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Needs Approval ({tasks.filter(t => !t.approved).length})</span>
            </button>
          </div>
        </div>

        {/* Owner filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="font-mono-code text-xs text-[#e2eeb2] mr-1">Filter by Assignee:</span>
          {owners.map(o => (
            <button
              key={o}
              onClick={() => setSelectedOwner(o)}
              className={`px-3 py-1 rounded-xs text-xs font-mono-code font-bold uppercase transition-all cursor-pointer whitespace-nowrap ${
                selectedOwner === o
                  ? 'bg-[#ffea55] text-stone-950 border border-[#e6c900] shadow-xs'
                  : 'bg-[#faf8f5]/80 text-stone-800 hover:bg-white border border-stone-300'
              }`}
            >
              {o}
            </button>
          ))}
        </div>

        {/* 3-Column Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* TO DO COLUMN */}
          <div className="space-y-4">
            <div className="paper-sheet paper-yellow p-3 rounded-xs border border-amber-300 flex items-center justify-between shadow-xs -rotate-1">
              <span className="font-display font-black text-sm uppercase tracking-wide text-stone-950">
                TO DO ({todo.length})
              </span>
              <span className="font-mono-code text-[11px] font-bold text-amber-900">
                Ready to start
              </span>
            </div>

            <div className="space-y-4">
              {todo.length === 0 ? (
                <div className="paper-sheet paper-white/80 p-6 text-center text-xs text-stone-500 font-mono-code rounded-xs border border-dashed border-stone-300">
                  No tasks waiting to start
                </div>
              ) : (
                todo.map((t, idx) => renderCard(t, idx))
              )}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="space-y-4">
            <div className="paper-sheet paper-cream p-3 rounded-xs border border-stone-300 flex items-center justify-between shadow-xs rotate-0.5">
              <span className="font-display font-black text-sm uppercase tracking-wide text-stone-950">
                DOING RIGHT NOW ({inProgress.length})
              </span>
              <span className="font-mono-code text-[11px] font-bold text-stone-700">
                In motion
              </span>
            </div>

            <div className="space-y-4">
              {inProgress.length === 0 ? (
                <div className="paper-sheet paper-white/80 p-6 text-center text-xs text-stone-500 font-mono-code rounded-xs border border-dashed border-stone-300">
                  No active tasks right now
                </div>
              ) : (
                inProgress.map((t, idx) => renderCard(t, idx))
              )}
            </div>
          </div>

          {/* DONE COLUMN */}
          <div className="space-y-4">
            <div className="paper-sheet paper-mint p-3 rounded-xs border border-emerald-300 flex items-center justify-between shadow-xs -rotate-0.5">
              <span className="font-display font-black text-sm uppercase tracking-wide text-emerald-950">
                COMPLETED ({done.length})
              </span>
              <span className="font-mono-code text-[11px] font-bold text-emerald-800">
                Finished
              </span>
            </div>

            <div className="space-y-4">
              {done.length === 0 ? (
                <div className="paper-sheet paper-white/80 p-6 text-center text-xs text-stone-500 font-mono-code rounded-xs border border-dashed border-stone-300">
                  No completed tasks yet
                </div>
              ) : (
                done.map((t, idx) => renderCard(t, idx))
              )}
            </div>
          </div>

        </div>

        {/* ========================================================
            TRACKER INTEGRATION MODAL (Jira / Trello / GitHub / Notion / Slack)
           ======================================================== */}
        {activeSyncModalTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="relative paper-sheet paper-white w-full max-w-lg p-6 sm:p-8 rounded-xs border-2 border-stone-400 shadow-2xl space-y-5">
              <PushPin color="gold" className="-top-3 left-8" />
              <Tape position="top-right" angle="-4deg" width="w-24" />

              <div>
                <h3 className="font-display font-black text-xl text-stone-950">
                  Export Task to Tracker Integration
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Task: "{activeSyncModalTask.title}" · Ref #{activeSyncModalTask.decisionRef}
                </p>
              </div>

              {/* Destination Tracker Selector */}
              <div className="space-y-1.5">
                <label className="font-mono-code text-xs uppercase font-bold text-stone-700">
                  Select Destination Tracker
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['Jira', 'Trello', 'GitHub', 'Notion', 'Slack'] as const).map(target => (
                    <button
                      key={target}
                      type="button"
                      onClick={() => setSelectedTracker(target)}
                      className={`p-2.5 rounded-xs font-mono-code text-xs font-bold transition-all cursor-pointer text-center ${
                        selectedTracker === target
                          ? 'bg-stone-900 text-[#ffea55] shadow-xs'
                          : 'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-300'
                      }`}
                    >
                      {target}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payload Preview */}
              <div className="p-3 bg-stone-900 rounded-xs text-[#e2eeb2] font-mono-code text-[11px] space-y-1">
                <div className="text-stone-400 text-[10px] pb-1 border-b border-stone-800 flex items-center justify-between">
                  <span>DISPATCH PAYLOAD PREVIEW</span>
                  <span className="text-[#ffea55]">{selectedTracker.toUpperCase()}_API_v2</span>
                </div>
                <div><strong>summary:</strong> "{activeSyncModalTask.title}"</div>
                <div><strong>assignee:</strong> "{activeSyncModalTask.owner}"</div>
                <div><strong>dueDate:</strong> "{activeSyncModalTask.deadline}"</div>
                <div><strong>priority:</strong> "{activeSyncModalTask.priority}"</div>
                <div><strong>decisionLink:</strong> "MeetMind://decisions/{activeSyncModalTask.decisionRef}"</div>
              </div>

              {/* Human Gate Warning */}
              {!activeSyncModalTask.approved && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xs text-xs text-amber-950 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Human Gate Required:</strong> You must toggle "Approved by Me" on this task before dispatching to external trackers.
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <button
                  onClick={() => setActiveSyncModalTask(null)}
                  className="px-4 py-2 font-mono-code text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleExecuteSync}
                  disabled={!activeSyncModalTask.approved}
                  className="bg-[#244a33] hover:bg-[#1a3826] disabled:opacity-40 text-white font-mono-code font-bold text-xs px-5 py-2.5 rounded-xs shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>CONFIRM &amp; DISPATCH TO {selectedTracker.toUpperCase()}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  )
}
