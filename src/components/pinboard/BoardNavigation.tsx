import React, { useState } from 'react'
import {
  Home as HomeIcon,
  Calendar,
  CheckSquare,
  Crosshair,
  ListTodo,
  FileText,
  Search,
  Brain,
  Bell,
  ChevronDown,
  Pin,
  LayoutGrid,
  Settings,
  Sparkles,
  Zap,
  Plus,
  LogOut,
} from 'lucide-react'
import { getStoredGroqApiKey, getStoredGroqModel } from '@/services/groqService'
import { PushPin } from './PinboardDecorations'

export type ActiveTab =
  | 'landing'
  | 'home'
  | 'meetings'
  | 'decisions'
  | 'conflicts'
  | 'tasks'
  | 'weekly'
  | 'ask'

interface Props {
  activeTab: ActiveTab
  onNavigate: (tab: ActiveTab) => void
  activeConflictsCount: number
  onTriggerKillerDemo: () => void
  onNewMeeting?: () => void
  onPinNote?: () => void
  onTidyBoard?: () => void
  projectName?: string
}

export const BoardNavigation: React.FC<Props> = ({
  activeTab,
  onNavigate,
  activeConflictsCount,
  onTriggerKillerDemo,
  onNewMeeting,
  onPinNote,
  onTidyBoard,
  projectName = 'Alpha / Q4',
}) => {
  const [showGroqInfo, setShowGroqInfo] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showProjectMenu, setShowProjectMenu] = useState(false)

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: HomeIcon },
    { id: 'meetings' as ActiveTab, label: 'Meetings', icon: Calendar },
    { id: 'decisions' as ActiveTab, label: 'Decisions', icon: CheckSquare },
    {
      id: 'conflicts' as ActiveTab,
      label: 'Conflicts',
      icon: Crosshair,
      badge: activeConflictsCount > 0 ? activeConflictsCount : undefined,
    },
    { id: 'tasks' as ActiveTab, label: 'Tasks', icon: ListTodo },
    { id: 'weekly' as ActiveTab, label: 'Weekly Notes', icon: FileText },
    { id: 'ask' as ActiveTab, label: 'AI Mind', icon: Brain },
  ]

  return (
    <div className="w-full pinboard-surface border-b border-[#1b4330]/70 pt-3 pb-2 px-4 sm:px-6 select-none z-40 sticky top-0 shadow-md">
      <div className="max-w-[1360px] mx-auto flex flex-col gap-2.5">
        
        {/* ROW 1: Centered Floating Capsule Navbar with Pinned Brand Badge */}
        <div className="flex items-center justify-between w-full relative">
          {/* Left Brand Badge with Red Pin */}
          <button
            onClick={() => onNavigate('landing')}
            className="hidden lg:flex items-center gap-2 relative bg-[#faf8f5] px-3.5 py-1.5 rounded-xs border border-stone-300 shadow-md transform -rotate-2 hover:rotate-0 transition-all active:scale-95 select-none cursor-pointer shrink-0"
            title="Click to visit Landing Page"
          >
            <PushPin color="red" className="-top-3 -left-2" />
            <div className="flex items-center gap-0.5 text-stone-900">
              <div className="w-1 h-3 bg-stone-900 rounded-full" />
              <div className="w-1 h-5 bg-stone-900 rounded-full" />
              <div className="w-1 h-3.5 bg-stone-900 rounded-full" />
            </div>
            <span className="font-display font-black text-sm tracking-tight text-stone-950">
              MEETMIND
            </span>
          </button>

          <nav className="inline-flex items-center bg-[#072417]/95 backdrop-blur-md border border-[#1b4330] rounded-full px-2.5 py-1.5 shadow-2xl gap-1 sm:gap-1.5 mx-auto">

            {navItems.map((item) => {
              const isActive = activeTab === item.id
              const Icon = item.icon

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#006039] text-white shadow-sm font-semibold'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-emerald-300' : 'text-stone-300'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="bg-[#ef4444] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center leading-tight">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}

            {/* Right icons inside or alongside capsule */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#1b4330]/80">
              {/* AI Mind Quick Button */}
              <button
                onClick={() => onNavigate('ask')}
                className="w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Open AI Mind"
              >
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={onTriggerKillerDemo}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="1 Unresolved Conflict Alert"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="absolute 0 top-0.5 right-0.5 bg-[#ef4444] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-[#072417]">
                    1
                  </span>
                </button>
              </div>

              {/* User Avatar Circle */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1 pl-1 cursor-pointer group"
                  title="User Profile: Yash Deshpande"
                >
                  <div className="w-7 h-7 rounded-full bg-[#bbf7d0] text-[#064e3b] font-bold text-xs flex items-center justify-center shadow-xs group-hover:ring-2 ring-emerald-400 transition-all">
                    YD
                  </div>
                  <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-white transition-colors" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#09281a] border border-[#235338] rounded-lg shadow-2xl py-1 z-50 text-xs text-stone-200">
                    <div className="px-3 py-2 border-b border-[#1b4330]">
                      <div className="font-bold text-white">Yash Deshpande</div>
                      <div className="text-[10px] text-stone-400">Operations & Sourcing Lead</div>
                    </div>
                    {/* Firebase Status Badge */}
                    <div className="px-3 py-1.5 border-b border-[#1b4330] flex items-center justify-between text-[10px]">
                      <span className="text-stone-400">Database</span>
                      <span className="flex items-center gap-1 font-mono-code text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Firebase Connected
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        setShowGroqInfo(true)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#123624] flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Groq AI Engine</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        onNavigate('landing')
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#123624] text-amber-300 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Return to Landing</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* ROW 2: Sub-Bar Controls (Pin Note, Tidy Board, Project Selector, Settings) */}
        <div className="flex items-center justify-between w-full px-1">
          {/* Left Controls - shown on home pinboard */}
          {activeTab === 'home' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onPinNote}
                className="bg-[#fde047] hover:bg-[#facc15] text-stone-950 font-bold text-xs px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                title="Pin a new note to the board"
              >
                <Pin className="w-3.5 h-3.5 fill-stone-950" />
                <span>Pin Note</span>
              </button>

              <button
                onClick={onTidyBoard}
                className="bg-[#0b2416]/90 hover:bg-[#123321] text-stone-200 border border-[#1f4a33] font-medium text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                title="Organize and tidy all board cards"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-stone-300" />
                <span>Tidy Board</span>
              </button>
            </div>
          ) : (
            <div />
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Project Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setShowProjectMenu(!showProjectMenu)}
                className="bg-[#0b2416]/90 hover:bg-[#123321] border border-[#1f4a33] text-stone-200 text-xs px-3 py-1.5 rounded-md flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-stone-400">Project:</span>
                <span className="font-semibold text-white">{projectName}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {showProjectMenu && (
                <div className="absolute right-0 mt-1.5 w-60 bg-[#09281a] border border-[#235338] rounded-md shadow-2xl py-1 z-50 text-xs text-stone-200">
                  <div className="px-3 py-1.5 text-[10px] font-mono-code text-stone-400 border-b border-[#1b4330]">
                    SELECT APPAREL COLLECTION
                  </div>
                  {['Alpha / Q4', 'Winter Drop // Outerwear', 'Spring 2027 Line', 'Core Denim & Basics'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setShowProjectMenu(false)}
                      className={`w-full text-left px-3 py-2 hover:bg-[#123624] flex items-center justify-between ${
                        p === projectName ? 'text-emerald-400 font-bold' : ''
                      }`}
                    >
                      <span>{p}</span>
                      {p === projectName && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>


            {/* Settings Cog Button */}
            <button
              onClick={() => setShowGroqInfo(true)}
              className="bg-[#0b2416]/90 hover:bg-[#123321] border border-[#1f4a33] text-stone-200 p-1.5 rounded-md flex items-center justify-center transition-colors cursor-pointer"
              title="Workspace Settings & AI Telemetry"
            >
              <Settings className="w-4 h-4 text-stone-300" />
            </button>
          </div>
        </div>

      </div>

      {/* Groq Engine Info Modal */}
      {showGroqInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative paper-sheet paper-white w-full max-w-md p-6 rounded-xs border-2 border-stone-400 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <h3 className="font-display font-black text-xl text-stone-950">
                  Groq AI Intelligence Engine
                </h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="space-y-2 text-xs font-mono-code text-stone-800">
              <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-[10px]">
                  <span>ACTIVE API KEY</span>
                  <span className="text-emerald-700 font-bold">AUTHENTICATED ✓</span>
                </div>
                <div className="font-mono-code text-stone-900 bg-stone-200 px-2 py-1 rounded text-[11px] truncate">
                  {getStoredGroqApiKey().slice(0, 16)}...{getStoredGroqApiKey().slice(-6)}
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-[10px]">
                  <span>SELECTED LLM MODEL</span>
                  <span className="text-emerald-700 font-bold">&lt;0.2s LATENCY</span>
                </div>
                <div className="font-bold text-stone-900 text-sm">
                  {getStoredGroqModel()}
                </div>
                <p className="text-[11px] text-stone-500 font-sans">
                  Running high-precision cross-meeting speaker attribution, extraction of decisions, task ownership, and memory conflict detection.
                </p>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-950 text-[11px]">
                ✓ AI extraction runs automatically on all uploaded or pasted meeting transcripts.
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-200">
              <button
                onClick={() => setShowGroqInfo(false)}
                className="bg-[#244a33] hover:bg-[#1a3826] text-white font-mono-code font-bold text-xs px-4 py-2 rounded-xs shadow-xs cursor-pointer"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
