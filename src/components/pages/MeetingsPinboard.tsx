"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Check,
  Upload,
  X,
  Zap,
  Search,
  ExternalLink,
  ChevronDown,
  Maximize2,
  Volume2,
  Layers,
  Edit3,
  Link as LinkIcon,
  Send,
  Info,
  Trash2,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  PushPin,
  Tape,
  LeftEdgeBinderClip,
} from "@/components/pinboard/PinboardDecorations";
import { Meeting, Decision, Conflict, TaskItem, Speaker } from "@/types";
import {
  runMeetingIntelligenceExtraction,
  ExtractedIntelligence,
} from "@/services/groqService";
import { INITIAL_SPEAKERS, DEMO_MEETING_PRESETS } from "@/data/mockData";

// Integration Tracker SVGs matching the target mockup
const TrelloLogo = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#0079bf" />
    <rect x="4" y="4" width="6.5" height="13" rx="1.5" fill="white" />
    <rect x="13.5" y="4" width="6.5" height="8.5" rx="1.5" fill="white" />
  </svg>
);

const NotionLogo = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M4.459 4.208c.746.606 1.026.56 2.428.466l12.128-.84c1.12-.093 1.307-.467 1.4-.933l.467-2.427a.56.56 0 0 0-.654-.467L3.433 1.688a.653.653 0 0 0-.56.653l.093 18.005c0 .747.373 1.213 1.213 1.213l13.993-.84c.84 0 1.213-.466 1.213-1.213V7.006c0-.84-.373-1.213-1.213-1.213l-12.408.84c-.467 0-.747.093-.747.467l-.56 16.14z"
      fill="#000000"
    />
    <path d="M15.485 7.94l-7.743.56v11.754l7.743-.56V7.94z" fill="#ffffff" />
    <path d="M7.742 8.5v11.754l2.8-.2v-8.754l4.943 8.4-7.743.56" fill="#000000" />
  </svg>
);

const GoogleTasksLogo = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#1a73e8" />
    <path
      d="M7.5 12l3 3 6-6"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SlackLogo = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
    <path
      d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.528 2.528 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
      fill="#E01E5A"
    />
    <path
      d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
      fill="#36C5F0"
    />
    <path
      d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
      fill="#2EB67D"
    />
    <path
      d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.528 2.528 0 0 1 2.52-2.52h6.313A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
      fill="#ECB22E"
    />
  </svg>
);

interface Props {
  meetings: Meeting[];
  activeMeetingId: string;
  onSelectMeeting: (id: string) => void;
  onDeleteMeeting?: (id: string) => void;
  onAddMeeting: (title: string, summary: string, transcriptText: string) => void;
  onAddIngestedMeeting?: (
    newMeeting: Meeting,
    extractedDecisions: Decision[],
    extractedTasks: TaskItem[],
    extractedConflicts: Conflict[]
  ) => void;
  decisions?: Decision[];
  tasks?: TaskItem[];
  conflicts?: Conflict[];
  onNavigateToConflicts?: () => void;
  onNavigateToDecisions?: () => void;
  onNavigateToTasks?: () => void;
  onInspectDecision?: (decision: Decision) => void;
  onApproveAndCreateTasks?: (
    tasksToCreate: TaskItem[],
    decisionsToConfirm?: Decision[]
  ) => void;
  onToggleTaskStatus?: (taskId: string) => void;
}

export const MeetingsPinboard: React.FC<Props> = ({
  meetings,
  activeMeetingId,
  onSelectMeeting,
  onDeleteMeeting,
  onAddMeeting,
  onAddIngestedMeeting,
  decisions = [],
  tasks = [],
  conflicts = [],
  onNavigateToConflicts,
  onNavigateToDecisions,
  onNavigateToTasks,
  onInspectDecision,
  onApproveAndCreateTasks,
  onToggleTaskStatus,
}) => {
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSeconds, setActiveSeconds] = useState<number>(330); // 05:30
  const [playbackSpeed, setPlaybackSpeed] = useState<string>("1.0x");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Action items checkbox toggles
  const [checkedActionItems, setCheckedActionItems] = useState<Record<string, boolean>>({
    "action-1": false,
    "action-2": false,
  });

  // Selected Task Tracker (Trello, Notion, Google Tasks, Slack)
  const [selectedTracker, setSelectedTracker] = useState<string>("Trello");
  const [isApproved, setIsApproved] = useState<boolean>(false);

  // Right column active sub-tab
  const [activeRightTab, setActiveRightTab] = useState<
    "insights" | "memory" | "actions" | "evidence"
  >("insights");

  // Ingestion Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("Nov 03, 2026");
  const [newSummary, setNewSummary] = useState("");
  const [newTranscript, setNewTranscript] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const handleLoadPreset = (index: number) => {
    const preset = DEMO_MEETING_PRESETS[index];
    if (!preset) return;
    setNewTitle(preset.title);
    setNewDate(preset.date);
    setNewSummary(preset.summary);
    setNewTranscript(preset.transcript);
  };

  const activeMeeting =
    meetings.find((m) => m.id === activeMeetingId) || meetings[0];

  // Auto-timer for audio playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveSeconds((prev) => (prev + 1) % 900); // 15 mins total
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSkipSeconds = (delta: number) => {
    setActiveSeconds((prev) => Math.max(0, Math.min(900, prev + delta)));
  };

  const handleSeekTimestamp = (timeString: string) => {
    const parts = timeString.split(":");
    if (parts.length === 2) {
      const s = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      setActiveSeconds(s);
      setIsPlaying(true);
    }
  };

  // Dynamic toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamically find decisions linked to current meeting
  const meetingDecisions = decisions.filter(
    (d) =>
      d.sourceMeetingId === activeMeeting.id ||
      d.sourceMeetingTitle === activeMeeting.title ||
      (d as any).meetingId === activeMeeting.id ||
      (activeMeeting.id === "meet-01" && (d.code === "D-024" || d.code === "D-025")) ||
      (activeMeeting.id === "meet-02" && d.code === "D-028") ||
      (activeMeeting.id === "meet-03" && d.code === "D-027")
  );

  const displayedDecisions =
    meetingDecisions.length > 0
      ? meetingDecisions.slice(0, 2)
      : [
          {
            id: `dec-${activeMeeting.id}`,
            code:
              activeMeeting.id === "meet-03"
                ? "D-027"
                : activeMeeting.id === "meet-02"
                ? "D-028"
                : "D-024",
            title:
              activeMeeting.id === "meet-03"
                ? "Contract Milan EcoWeave Fabric for 2026 Collection."
                : activeMeeting.id === "meet-02"
                ? "Proposal: Revert Drop Date to Nov 10 for TikTok Shop"
                : "Move Winter Collection launch to Nov 15.",
            status: activeMeeting.id === "meet-02" ? "contested" : "confirmed",
            confidence: 94,
            context: activeMeeting.summary,
            owner: "Rahul Mehta",
            ownerRole: "Brand Director",
            sourceMeetingId: activeMeeting.id,
            sourceMeetingTitle: activeMeeting.title,
            sourceTimestamp: "05:30",
            date: activeMeeting.date,
            tags: ["Production", "QA"],
            evidenceQuote: activeMeeting.summary,
            tasksGenerated: [],
            rotationDeg: 0,
          } as Decision,
        ];

  // Dynamically find tasks linked to current meeting
  const meetingTasks = tasks.filter(
    (t) =>
      t.sourceMeeting === activeMeeting.title ||
      (t as any).meetingId === activeMeeting.id ||
      (t as any).meetingTitle === activeMeeting.title ||
      (activeMeeting.id === "meet-01" && (t.id === "task-3" || t.id === "task-2" || t.id === "task-1")) ||
      (activeMeeting.id === "meet-03" && (t.id === "task-5" || t.id === "task-6")) ||
      (t.sourceMeeting?.toLowerCase().includes("winter outerwear") && activeMeeting.id === "meet-01") ||
      (t.sourceMeeting?.toLowerCase().includes("sourcing") && activeMeeting.id === "meet-03")
  );

  const displayedTasks =
    meetingTasks.length > 0
      ? meetingTasks.slice(0, 2)
      : activeMeeting.id === "meet-03"
      ? [
          {
            id: "task-5",
            title: "Issue purchase order for 4,000m OEKO-TEX wool blend",
            owner: "Yash Deshmukh",
            deadline: "Nov 08",
            status: "in_progress",
            priority: "HIGH",
            approved: true,
          } as TaskItem,
          {
            id: "task-6",
            title: "Finalize lab dip color swatches with Milan textile team",
            owner: "Sara Lin",
            deadline: "Nov 12",
            status: "todo",
            priority: "MEDIUM",
            approved: true,
          } as TaskItem,
        ]
      : [
          {
            id: "task-3",
            title: "Warehouse garment inspection & inventory count",
            owner: "Yash Deshmukh",
            deadline: "Nov 07",
            status: "todo",
            priority: "HIGH",
            approved: true,
          } as TaskItem,
          {
            id: "task-2",
            title: "Update marketing & creator launch schedule",
            owner: "Priya Sharma",
            deadline: "Nov 10",
            status: "todo",
            priority: "HIGH",
            approved: true,
          } as TaskItem,
        ];

  // Toggle action items
  const toggleActionItem = (id: string) => {
    setCheckedActionItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    if (onToggleTaskStatus) {
      onToggleTaskStatus(id);
    }
  };

  // Approve & Create Tasks: Syncs to Tasks tab, Decisions tab, and DB
  const handleApproveAndCreate = () => {
    setIsApproved(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#22c55e", "#facc15", "#38bdf8", "#f43f5e"],
      });
    } catch {}

    if (onApproveAndCreateTasks) {
      onApproveAndCreateTasks(displayedTasks, displayedDecisions);
    }

    setToastMessage(`✓ ${displayedTasks.length} Action Tasks created & synced to Tasks tab (Kanban) and Decisions tab!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveDraft = () => {
    setToastMessage("✓ Meeting intelligence draft saved to local record.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check if current meeting has an active conflict
  const currentMeetingConflict = conflicts.find(
    (c) =>
      c.status === "active" &&
      (c.newProposal?.meetingTitle === activeMeeting.title ||
        c.historicalDecision?.meetingTitle === activeMeeting.title ||
        activeMeeting.id === "meet-02")
  );

  // Filter transcript snippets by search query
  const filteredTranscript = activeMeeting.transcript.filter((item) => {
    if (!searchQuery.trim()) return true;
    return (
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.highlightLabel &&
        item.highlightLabel.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <section className="relative w-full min-h-screen pb-20 px-4 sm:px-8 select-none bg-transparent text-[#f7fae8]">
      <div className="max-w-[1360px] mx-auto space-y-4">
        
        {/* ========================================================= */}
        {/* TOP TITLE: Clean Meeting Intelligence                     */}
        {/* ========================================================= */}
        <div className="pt-2 pb-1">
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white">
            Meeting Intelligence
          </h1>
        </div>

        {/* ========================================================= */}
        {/* MEETING SELECTOR TABS ROW                                 */}
        {/* ========================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {meetings.map((m, idx) => {
              const isSelected = activeMeeting.id === m.id;
              let label = "";
              if (m.id === "meet-01") {
                label = "Meeting #1: Oct 28, 2026";
              } else if (m.id === "meet-02") {
                label = "Meeting #2: Oct 31, 2026";
              } else if (m.id === "meet-03") {
                label = "Meeting #3: Nov 02, 2026";
              } else {
                const shortTitle = m.title.length > 22 ? m.title.slice(0, 20) + "..." : m.title;
                label = `${shortTitle} (${m.date || "New"})`;
              }
              const isCustom = m.id !== "meet-01" && m.id !== "meet-02" && m.id !== "meet-03";
              return (
                  <button
                    key={m.id}
                    onClick={() => onSelectMeeting(m.id)}
                    className={`px-3.5 py-2 rounded-md font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? "bg-[#ffea55] text-stone-950 scale-102 ring-1 ring-amber-400"
                        : "bg-white text-stone-800 hover:bg-stone-50 border border-stone-300"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{label}</span>
                    {isCustom && onDeleteMeeting && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMeeting(m.id);
                        }}
                        className="ml-1 p-0.5 rounded-full hover:bg-stone-300/80 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove meeting from database and UI"
                      >
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const preset = DEMO_MEETING_PRESETS[0];
                onAddMeeting(preset.title, preset.summary, preset.transcript);
              }}
              className="bg-[#0b3320] hover:bg-[#134930] text-emerald-300 border border-[#2d5f44] font-mono-code font-bold text-xs px-3 py-2 rounded-md flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Instantly add and pin a sample apparel QA meeting"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Add Demo Meeting</span>
            </button>

            {/* + New Meeting Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#072417] hover:bg-[#0c3120] text-stone-200 border border-[#2d5f44] font-mono-code font-bold text-xs px-3.5 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>New Meeting</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN 3-COLUMN STUDIO LAYOUT                               */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ------------------------------------------------------- */}
          {/* COLUMN 1 (LEFT): Meeting Overview & Speakers            */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Main Left Parchment Sheet */}
            <div className="relative bg-[#fdfcf7] p-5 rounded-xl shadow-2xl border border-stone-200 text-stone-900 overflow-visible">
              {/* Orange/Gold Pushpin on Top Left */}
              <PushPin color="gold" className="-top-3 left-6" />

              {/* Left Edge Binder Clip */}
              <LeftEdgeBinderClip className="-left-5 top-28" />

              {/* Washi Tape on Top Right */}
              <Tape position="top-right" angle="2deg" width="w-20" />

              {/* Metadata row */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 text-[11px] font-mono-code text-stone-500">
                  <span>{activeMeeting.date}</span>
                  <span>·</span>
                  <span>{activeMeeting.duration}</span>
                </div>
                {onDeleteMeeting && activeMeeting.id !== "meet-01" && activeMeeting.id !== "meet-02" && activeMeeting.id !== "meet-03" && (
                  <button
                    onClick={() => onDeleteMeeting(activeMeeting.id)}
                    className="text-stone-400 hover:text-rose-600 text-[11px] font-mono-code flex items-center gap-1 hover:underline cursor-pointer"
                    title="Remove this meeting from database and UI"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                )}
              </div>

              {/* Meeting Title */}
              <h2 className="font-display font-black text-xl text-[#0f281e] leading-tight mb-1">
                {activeMeeting.title}
              </h2>

              {/* Project Line */}
              <p className="text-xs text-stone-600 font-sans mb-3 font-medium">
                {activeMeeting.project || (activeMeeting.id === "meet-03" ? "Project: Alpha / Sustainable Sourcing Initiative" : "Project: Alpha / Winter Apparel Drop")}
              </p>

              {/* Attributed Speakers List */}
              <div className="pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between text-xs font-display font-bold text-stone-900 mb-2.5">
                  <span className="flex items-center gap-1">
                    <span>Attributed Speakers ({activeMeeting.speakers?.length || (activeMeeting.id === "meet-03" ? "3" : "4")})</span>
                    <Info className="w-3 h-3 text-stone-400" />
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {activeMeeting.id === "meet-03" ? (
                    <>
                      {/* Rahul Mehta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                          <div className="w-6 h-6 rounded-full bg-sky-200 text-sky-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                            RM
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 leading-tight">Rahul Mehta</div>
                            <div className="text-[10px] text-stone-500">
                              Founder & Brand Creative Director
                            </div>
                          </div>
                        </div>
                        <span className="font-mono-code font-bold text-stone-800 text-[11px]">
                          30%
                        </span>
                      </div>

                      {/* Yash Deshmukh */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                            YD
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 leading-tight">Yash Deshmukh</div>
                            <div className="text-[10px] text-stone-500">
                              Supply Chain & Operations Lead
                            </div>
                          </div>
                        </div>
                        <span className="font-mono-code font-bold text-stone-800 text-[11px]">
                          40%
                        </span>
                      </div>

                      {/* Sara Lin */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                          <div className="w-6 h-6 rounded-full bg-purple-200 text-purple-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                            SL
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 leading-tight">Sara Lin</div>
                            <div className="text-[10px] text-stone-500">
                              Head of Sourcing & Garment QA
                            </div>
                          </div>
                        </div>
                        <span className="font-mono-code font-bold text-stone-800 text-[11px]">
                          30%
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Speaker 1 - Rahul */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                          <div className="w-6 h-6 rounded-full bg-sky-200 text-sky-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                            RM
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 leading-tight">Rahul Mehta</div>
                            <div className="text-[10px] text-stone-500">
                              Founder & Brand Creative Director
                            </div>
                          </div>
                        </div>
                        <span className="font-mono-code font-bold text-stone-800 text-[11px]">
                          32%
                        </span>
                      </div>

                      {/* Speaker 2 - Priya */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                            PS
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 leading-tight">Priya Sharma</div>
                            <div className="text-[10px] text-stone-500">
                              E-commerce & Marketing Lead
                            </div>
                          </div>
                        </div>
                        <span className="font-mono-code font-bold text-stone-800 text-[11px]">
                          23%
                        </span>
                      </div>

                      {/* Speaker 3 - Yash */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                            YD
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 leading-tight">Yash Deshmukh</div>
                            <div className="text-[10px] text-stone-500">
                              Supply Chain & Operations Lead
                            </div>
                          </div>
                        </div>
                        <span className="font-mono-code font-bold text-stone-800 text-[11px]">
                          27%
                        </span>
                      </div>

                      {/* Speaker 4 - Sara */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                          <div className="w-6 h-6 rounded-full bg-purple-200 text-purple-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                            SL
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 leading-tight">Sara Lin</div>
                            <div className="text-[10px] text-stone-500">
                              Head of Sourcing & Garment QA
                            </div>
                          </div>
                        </div>
                        <span className="font-mono-code font-bold text-stone-800 text-[11px]">
                          18%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Yellow Sticky: AI Executive Summary */}
            <div className="relative bg-[#fef08a] p-4 rounded-xl shadow-md border border-amber-300 text-stone-900">
              <PushPin color="cyan" className="-top-3 right-5" />
              <div className="flex items-center gap-1.5 font-mono-code text-[11px] font-bold uppercase text-stone-900 mb-2">
                <FileText className="w-3.5 h-3.5 text-stone-800" />
                <span>AI EXECUTIVE SUMMARY</span>
              </div>
              <p className="font-sans text-xs text-stone-900 leading-relaxed font-medium">
                {activeMeeting.summary}
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* COLUMN 2 (CENTER): Speaker Diarized Transcript          */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-5 bg-[#072015]/95 border border-[#1b4330] rounded-2xl p-4 shadow-xl flex flex-col justify-between min-h-[580px]">
            {/* Header: Title + Search */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1b4330] mb-3">
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Speaker Diarized Transcript</span>
                  <span className="text-[#fde047] font-mono-code font-bold">
                    ({activeMeeting.transcript.length} lines)
                  </span>
                </h3>

                {/* Search in transcript pill */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search in transcript..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#05160e] text-xs text-stone-200 border border-[#1b4330] rounded-full pl-3 pr-7 py-1 focus:outline-none focus:border-emerald-500 w-44"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1.5" />
                </div>
              </div>

              {/* Transcript Speech Bubbles */}
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                {filteredTranscript.map((item, idx) => {
                  const speaker = INITIAL_SPEAKERS.find(
                    (s) => s.id === item.speakerId
                  ) || {
                    name: "Speaker",
                    role: "Team Member",
                  };

                  const isSara = item.speakerId === "spk-4" || speaker.name.includes("Sara");
                  const isRahul = item.speakerId === "spk-1" || speaker.name.includes("Rahul");
                  const isYash = item.speakerId === "spk-3" || speaker.name.includes("Yash");
                  const isPriya = item.speakerId === "spk-2" || speaker.name.includes("Priya");

                  const initials = isSara ? "SL" : isRahul ? "RM" : isYash ? "YD" : "PS";
                  const avatarColor = isSara
                    ? "bg-purple-200 text-purple-900"
                    : isRahul
                    ? "bg-sky-200 text-sky-900"
                    : isYash
                    ? "bg-emerald-200 text-emerald-900"
                    : "bg-amber-200 text-amber-900";

                  const bubbleBg = isRahul
                    ? "bg-[#f0fdfa] border-teal-200"
                    : isYash
                    ? "bg-[#fffbeb] border-amber-200"
                    : isSara
                    ? "bg-[#f5f3ff] border-purple-200"
                    : "bg-[#faf8f5] border-stone-200";

                  return (
                    <div key={item.id || idx} className="flex items-start gap-2.5">
                      {/* Timestamp on left */}
                      <span className="font-mono-code text-[11px] text-stone-400 pt-1 shrink-0">
                        {item.timestamp}
                      </span>

                      {/* Avatar */}
                      <div
                        className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${avatarColor}`}
                      >
                        {initials}
                      </div>

                      {/* Bubble Content */}
                      <div
                        className={`flex-1 p-3 rounded-xl border text-stone-900 shadow-xs ${bubbleBg}`}
                      >
                        <div className="font-display font-bold text-xs text-stone-900 mb-1">
                          {speaker.name}
                        </div>
                        <p className="font-sans text-xs text-stone-800 leading-relaxed">
                          "{item.text}"
                        </p>

                        {/* Highlight Label Pills (e.g. Decision or Task) */}
                        {item.highlightType === "decision" && (
                          <div className="mt-2 bg-[#dcfce7] border border-emerald-300 text-[#166534] font-mono-code text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>{item.highlightLabel || "Decision Ratified"}</span>
                          </div>
                        )}

                        {item.highlightType === "action" && (
                          <div className="mt-2 bg-[#fef3c7] border border-amber-300 text-[#92400e] font-mono-code text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5">
                            <span>⊙</span>
                            <span>{item.highlightLabel || "Task Assigned"}</span>
                          </div>
                        )}

                        {item.highlightType === "contradiction" && (
                          <div className="mt-2 bg-rose-100 border border-rose-300 text-rose-900 font-mono-code text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                            <span>{item.highlightLabel || "Contradiction Detected"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* COLUMN 3 (RIGHT): AI Insights, Memory & Action Hub      */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-2xl border border-stone-200 space-y-4 text-stone-900">
            {/* Top Sub-Tabs Navigation */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full text-xs font-semibold">
              <button
                onClick={() => setActiveRightTab("insights")}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                  activeRightTab === "insights"
                    ? "bg-[#fef08a] text-stone-950 font-bold shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Sparkles className="w-3 h-3 text-stone-800" />
                <span>AI Insights</span>
              </button>

              <button
                onClick={() => setActiveRightTab("memory")}
                className={`px-2.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeRightTab === "memory"
                    ? "bg-white text-stone-950 font-bold shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <span>Memory</span>
              </button>

              <button
                onClick={() => setActiveRightTab("actions")}
                className={`px-2.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeRightTab === "actions"
                    ? "bg-white text-stone-950 font-bold shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <span>Actions</span>
              </button>

              <button
                onClick={() => setActiveRightTab("evidence")}
                className={`px-2.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeRightTab === "evidence"
                    ? "bg-white text-stone-950 font-bold shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <span>Evidence</span>
              </button>
            </div>

            {/* 1. Decisions Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-sm text-stone-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Decisions ({displayedDecisions.length})</span>
                </h4>
                <span className="bg-[#dcfce7] text-[#15803d] text-[10px] font-bold px-2 py-0.5 rounded">
                  High Confidence 94%
                </span>
              </div>

              <div className="space-y-2">
                {displayedDecisions.map((dec) => {
                  const isContested = dec.status === "contested";
                  const isSuperseded = dec.status === "superseded";
                  const isConfirmed = dec.status === "confirmed";

                  return (
                    <div
                      key={dec.id || dec.code}
                      onClick={() => {
                        if (onInspectDecision) onInspectDecision(dec);
                        else if (onNavigateToDecisions) onNavigateToDecisions();
                      }}
                      className="p-3 bg-stone-50 hover:bg-stone-100/90 border border-stone-200 rounded-xl space-y-1 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono-code font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">
                            {dec.code}
                          </span>
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full ${
                              isConfirmed
                                ? "bg-emerald-600 text-white"
                                : isContested
                                ? "bg-rose-600 text-white"
                                : "bg-stone-400 text-white"
                            }`}
                          >
                            {isConfirmed ? "Confirmed" : isContested ? "Contested" : "Superseded"}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onInspectDecision) onInspectDecision(dec);
                            else if (onNavigateToDecisions) onNavigateToDecisions();
                          }}
                          title="Inspect in Decisions tab"
                          className="p-1 hover:bg-stone-200 rounded text-stone-400 hover:text-stone-700 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-display font-bold text-xs text-stone-900 pt-1 group-hover:text-emerald-900 transition-colors">
                        {dec.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Action Items Section */}
            <div className="space-y-2 pt-1 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-sm text-stone-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Action Items ({displayedTasks.length})</span>
                </h4>
                {onNavigateToTasks && (
                  <button
                    onClick={onNavigateToTasks}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View Kanban</span>
                    <span>→</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {displayedTasks.map((task) => {
                  const isChecked = checkedActionItems[task.id] ?? (task.status === "done");
                  const initials = task.owner
                    ? task.owner
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "YD";

                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleActionItem(task.id)}
                      className="flex items-start gap-2.5 p-2.5 bg-stone-50 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div className="flex-1 text-xs">
                        <div
                          className={`font-medium transition-all ${
                            isChecked ? "line-through text-stone-400" : "text-stone-800"
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500">
                          <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-[9px]">
                            {initials}
                          </span>
                          <span>📅 {task.deadline}</span>
                          {(task.approved || isApproved) && (
                            <span className="text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.2 rounded text-[9px] flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> Approved
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Memory & Conflict Check */}
            <div className="space-y-2 pt-1 border-t border-stone-200">
              <h4 className="font-display font-bold text-sm text-stone-950 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-stone-700" />
                <span>Memory & Conflict Check</span>
              </h4>

              {currentMeetingConflict ? (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-rose-900 text-xs">
                      Contradiction Detected
                    </div>
                    <div className="text-[11px] text-rose-700">
                      {currentMeetingConflict.title}
                    </div>
                    {onNavigateToConflicts && (
                      <button
                        onClick={onNavigateToConflicts}
                        className="mt-1.5 text-[10px] font-bold text-rose-800 underline hover:text-rose-950 cursor-pointer"
                      >
                        Solve in Conflicts Radar →
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#f0fdf4] border border-emerald-300 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-emerald-900 text-xs">
                      No conflicts found
                    </div>
                    <div className="text-[11px] text-stone-600">
                      Consistent with previous decisions in Project Alpha.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Approval & Execution */}
            <div className="space-y-3 pt-1 border-t border-stone-200">
              <h4 className="font-display font-bold text-sm text-stone-950 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-stone-700" />
                <span>Approval & Execution</span>
              </h4>

              {/* Stepper pill */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="border border-amber-500 bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Edit3 className="w-3 h-3" />
                  <span>Review & Edit</span>
                </span>
                <span className="text-stone-400">→</span>
                <span
                  className={`px-2 py-1 rounded-md font-medium transition-colors ${
                    isApproved
                      ? "bg-emerald-100 text-emerald-800 font-bold border border-emerald-300"
                      : "text-stone-500"
                  }`}
                >
                  Approve {isApproved && "✓"}
                </span>
                <span className="text-stone-400">→</span>
                <span
                  className={`px-2 py-1 rounded-md font-medium transition-colors ${
                    isApproved
                      ? "bg-emerald-100 text-emerald-800 font-bold border border-emerald-300"
                      : "text-stone-500"
                  }`}
                >
                  Create Task {isApproved && "✓"}
                </span>
              </div>

              {/* Bottom Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleApproveAndCreate}
                  className="flex-1 py-2.5 px-3 bg-[#fde047] hover:bg-[#facc15] text-stone-950 font-bold text-xs rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>
                    {isApproved ? "Tasks Created & Synced ✓" : "Approve & Create Tasks"}
                  </span>
                </button>

                <button
                  onClick={handleSaveDraft}
                  className="py-2.5 px-3 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs rounded-xl border border-stone-300 transition-colors cursor-pointer shadow-xs"
                >
                  Save Draft
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Ingest / Record New Meeting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative paper-sheet paper-white w-full max-w-lg p-6 sm:p-7 rounded-xl border-2 border-stone-400 shadow-2xl space-y-4 text-stone-900">
            <PushPin color="gold" className="-top-3 left-6" />
            <Tape position="top-right" angle="-2deg" width="w-24" />

            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-black text-xl text-stone-950">
                  Ingest Apparel Meeting Transcript
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Demo Data Options */}
            <div className="p-3 bg-[#072417] border border-[#2d5f44] rounded-lg space-y-2 text-stone-100 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-display font-bold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fill Demo Data</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleLoadPreset(0)}
                  className="px-2.5 py-1 bg-[#ffea55] hover:bg-amber-300 text-stone-950 font-mono-code font-bold text-[11px] rounded shadow-xs cursor-pointer transition-transform active:scale-95"
                >
                  ⚡ Auto-fill Preset #1
                </button>
              </div>
              <p className="text-[11px] text-stone-300 leading-tight">
                Click any apparel meeting scenario to instantly pre-fill realistic transcripts & decisions:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {DEMO_MEETING_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadPreset(idx)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0b3320] hover:bg-[#134930] text-emerald-200 border border-[#2d5f44] rounded-md text-[11px] font-sans font-medium cursor-pointer transition-colors"
                  >
                    <span className="text-[9px] font-mono-code font-bold text-amber-300 uppercase px-1 py-0.2 bg-black/40 rounded">
                      {preset.badge}
                    </span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-stone-700 mb-1">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Fabric Sourcing Review // Seam Durability"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-sm font-sans focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-stone-700 mb-1">
                  Meeting Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of what was discussed..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs font-sans focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-stone-700 mb-1">
                  Transcript or Notes (AI will extract decisions & conflicts)
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste meeting transcript snippets or supplier notes here..."
                  value={newTranscript}
                  onChange={(e) => setNewTranscript(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs font-mono-code focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-950 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Automatic memory check will compare against past meetings to prevent conflicting collection commitments!
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTitle("");
                  setNewSummary("");
                  setNewTranscript("");
                }}
                className="px-4 py-2 font-mono-code text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newTitle.trim()) {
                    onAddMeeting(
                      newTitle.trim(),
                      newSummary.trim() || "Ingested apparel meeting transcript.",
                      newTranscript.trim() || "Aligned on collection deliverables."
                    );
                    setShowAddModal(false);
                    setNewTitle("");
                    setNewSummary("");
                    setNewTranscript("");
                  }
                }}
                disabled={!newTitle.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#006039] hover:bg-[#08482d] disabled:opacity-50 text-white font-mono-code font-bold text-xs uppercase rounded-md shadow cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Ingest & Pin to Studio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time sync feedback toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#072417] text-white border border-emerald-500/70 shadow-2xl px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-display font-bold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};
