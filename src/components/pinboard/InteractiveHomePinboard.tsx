"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowDownRight,
  AlertTriangle,
  Sparkles,
  Zap,
  Users,
  RotateCcw,
  Plus,
  LayoutGrid,
  Check,
  Pin,
  Calendar,
  Layers,
  ArrowUpRight,
  List,
} from "lucide-react";
import {
  PushPin,
  Tape,
  LeftEdgeBinderClip,
  PaperClip,
  SparkDoodle,
  HandDrawnArrow,
} from "./PinboardDecorations";
import { ActiveTab } from "./BoardNavigation";
import { Meeting, Decision, Conflict, TaskItem } from "@/types";

export interface PinItem {
  id: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  type:
    | "identity"
    | "conflict"
    | "overview"
    | "handwritten-note"
    | "task-102"
    | "custom-note";
  customData?: {
    title: string;
    text: string;
    color: "yellow" | "coral" | "mint" | "white" | "kraft";
  };
}

interface Props {
  onNavigate: (tab: ActiveTab) => void;
  onTriggerKillerDemo: () => void;
  meetings: Meeting[];
  decisions: Decision[];
  conflicts: Conflict[];
  tasks: TaskItem[];
  showAddNoteModal?: boolean;
  setShowAddNoteModal?: (open: boolean) => void;
  tidyTrigger?: number;
  onInspectDecision?: (decision: Decision) => void;
  onOpenMeeting?: (meetingId: string) => void;
}

const DEFAULT_PIN_ITEMS: PinItem[] = [
  {
    id: "identity",
    x: 40,
    y: 35,
    rotation: -1,
    zIndex: 10,
    type: "identity",
  },
  {
    id: "conflict",
    x: 665,
    y: 35,
    rotation: 1.2,
    zIndex: 15,
    type: "conflict",
  },
  {
    id: "overview",
    x: 670,
    y: 300,
    rotation: 0,
    zIndex: 12,
    type: "overview",
  },
  {
    id: "handwritten-note",
    x: 500,
    y: 505,
    rotation: -3.5,
    zIndex: 18,
    type: "handwritten-note",
  },
  {
    id: "task-102",
    x: 740,
    y: 490,
    rotation: 3.5,
    zIndex: 14,
    type: "task-102",
  },
];

export const InteractiveHomePinboard: React.FC<Props> = ({
  onNavigate,
  onTriggerKillerDemo,
  meetings,
  decisions,
  conflicts,
  tasks,
  showAddNoteModal: externalShowAddNoteModal,
  setShowAddNoteModal: externalSetShowAddNoteModal,
  tidyTrigger = 0,
  onInspectDecision,
  onOpenMeeting,
}) => {
  const [items, setItems] = useState<PinItem[]>(DEFAULT_PIN_ITEMS);
  const [maxZ, setMaxZ] = useState<number>(25);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [internalShowModal, setInternalShowModal] = useState<boolean>(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteColor, setNewNoteColor] = useState<
    "yellow" | "coral" | "mint" | "white" | "kraft"
  >("yellow");

  const showModal = externalShowAddNoteModal ?? internalShowModal;
  const setShowModal = externalSetShowAddNoteModal ?? setInternalShowModal;

  const boardRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{
    pointerStartX: number;
    pointerStartY: number;
    itemStartX: number;
    itemStartY: number;
    moved: boolean;
  }>({
    pointerStartX: 0,
    pointerStartY: 0,
    itemStartX: 0,
    itemStartY: 0,
    moved: false,
  });

  // Respond to external tidyTrigger
  useEffect(() => {
    if (tidyTrigger > 0) {
      setItems(DEFAULT_PIN_ITEMS);
    }
  }, [tidyTrigger]);

  // Primary Winter Drop Conflict card pinned on board
  const winterConflict =
    conflicts.find((c) => c.id === "conf-101") ||
    conflicts.find((c) => c.status === "active") ||
    conflicts[0];
  const isConflictResolved = winterConflict?.status === "resolved";

  const confirmedDecisionsCount = decisions.filter(
    (d) => d.status === "confirmed"
  ).length;
  const activeConflictsCount = conflicts.filter(
    (c) => c.status === "active"
  ).length;
  const pendingTasksCount = tasks.filter((t) => t.status !== "done").length;

  // Pointer Down on draggable card
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "BUTTON" ||
      target.closest("button")
    ) {
      return;
    }

    e.stopPropagation();

    const item = items.find((it) => it.id === id);
    if (!item) return;

    const newZ = maxZ + 1;
    setMaxZ(newZ);
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, zIndex: newZ } : it))
    );

    dragStartRef.current = {
      pointerStartX: e.clientX,
      pointerStartY: e.clientY,
      itemStartX: item.x,
      itemStartY: item.y,
      moved: false,
    };

    setDraggingId(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId) return;

    const dx = e.clientX - dragStartRef.current.pointerStartX;
    const dy = e.clientY - dragStartRef.current.pointerStartY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragStartRef.current.moved = true;
    }

    const newX = Math.max(0, dragStartRef.current.itemStartX + dx);
    const newY = Math.max(0, dragStartRef.current.itemStartY + dy);

    setItems((prev) =>
      prev.map((it) => (it.id === draggingId ? { ...it, x: newX, y: newY } : it))
    );
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      setDraggingId(null);
    }
  };

  const handleCardClick = (action: () => void) => {
    if (!dragStartRef.current.moved) {
      action();
    }
  };

  // Add custom user note
  const handleCreateCustomNote = () => {
    if (!newNoteTitle.trim() && !newNoteText.trim()) return;

    const newId = `custom-note-${Date.now()}`;
    const newZ = maxZ + 1;
    setMaxZ(newZ);

    const newItem: PinItem = {
      id: newId,
      x: 350 + Math.random() * 80,
      y: 180 + Math.random() * 60,
      rotation: (Math.random() - 0.5) * 6,
      zIndex: newZ,
      type: "custom-note",
      customData: {
        title: newNoteTitle || "Pinned Note",
        text: newNoteText || "Custom workspace note.",
        color: newNoteColor,
      },
    };

    setItems((prev) => [...prev, newItem]);
    setShowModal(false);
    setNewNoteTitle("");
    setNewNoteText("");
  };

  return (
    <section className="relative w-full min-h-[920px] pb-16 px-4 sm:px-6 select-none bg-transparent">
      {/* Framed Cutting-Mat Outer Rounded Container */}
      <div
        ref={boardRef}
        className="relative max-w-[1360px] min-h-[820px] mx-auto pinboard-surface border border-[#1a442e] rounded-2xl shadow-2xl overflow-hidden p-6"
        style={{
          boxShadow:
            "inset 0 0 120px rgba(0,0,0,0.65), 0 25px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Subtle Dark Watermark at Bottom Left */}
        <div className="absolute bottom-6 left-8 pointer-events-none select-none opacity-40">
          <span className="font-display font-black text-8xl md:text-9xl tracking-wider text-[#062013] select-none">
            MEETMIND
          </span>
        </div>

        {/* Hand-Drawn Doodle Arrow pointing to main card */}
        <HandDrawnArrow
          className="absolute left-10 bottom-24 -rotate-12"
          color="#16a34a"
        />

        {/* Sparkle Star above Card 1 */}
        <div className="absolute left-[620px] top-6 text-white text-2xl font-bold select-none pointer-events-none opacity-80 animate-pulse">
          ✦
        </div>

        {/* Yellow Doodle Burst next to Card 2 */}
        <SparkDoodle
          color="#facc15"
          className="absolute left-[1110px] top-28 rotate-12"
        />

        {/* Yellow Doodle Burst next to Card 4 */}
        <SparkDoodle
          color="#facc15"
          className="absolute left-[1030px] top-[530px] -rotate-45"
        />

        {/* Draggable Cards on Pinboard */}
        {items.map((item) => {
          const isDragging = draggingId === item.id;

          return (
            <div
              key={item.id}
              onPointerDown={(e) => handlePointerDown(item.id, e)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`absolute cursor-grab active:cursor-grabbing select-none transition-shadow ${
                isDragging ? "is-dragging" : ""
              }`}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: `rotate(${isDragging ? 0 : item.rotation}deg) scale(${
                  isDragging ? 1.03 : 1
                })`,
                zIndex: item.zIndex,
                touchAction: "none",
              }}
            >
              {/* ======================================================== */}
              {/* --- 1. MAIN LARGE WHITE PARCHMENT SHEET --- */}
              {/* ======================================================== */}
              {item.type === "identity" && (
                <div className="w-[580px] relative bg-[#fdfcf7] p-8 rounded-xl shadow-2xl border border-stone-200/90 text-stone-900 overflow-visible">
                  
                  {/* Pale Yellow Washi Tape on Top Left */}
                  <Tape position="top-left" angle="-6deg" width="w-24" />

                  {/* Left Edge Binder Clip */}
                  <LeftEdgeBinderClip className="-left-5 top-36" />

                  {/* Deckled / torn paper edge along bottom */}
                  <div className="absolute -bottom-1 left-0 w-full h-2.5 overflow-hidden pointer-events-none select-none">
                    <svg viewBox="0 0 580 10" className="w-full h-full" preserveAspectRatio="none">
                      <path
                        d="M0 0 Q 30 5, 60 1 T 120 4 T 180 1 T 240 5 T 300 1 T 360 4 T 420 1 T 480 5 T 540 1 T 580 4 L580 10 L0 10 Z"
                        fill="#072216"
                      />
                    </svg>
                  </div>

                  {/* Deckled / torn paper edge along right */}
                  <div className="absolute top-12 -right-1 w-2.5 h-[calc(100%-54px)] overflow-hidden pointer-events-none select-none">
                    <svg viewBox="0 0 10 400" className="w-full h-full" preserveAspectRatio="none">
                      <path
                        d="M0 0 Q 5 30, 1 60 T 4 120 T 1 180 T 5 240 T 1 300 T 4 360 T 1 400 L10 400 L10 0 Z"
                        fill="#072216"
                      />
                    </svg>
                  </div>

                  {/* Curled Dog-Ear Folded Corner on Top Right */}

                  <div className="absolute -top-[1px] -right-[1px] w-12 h-12 pointer-events-none select-none z-20">
                    <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm">
                      {/* Triangle cutout blending with cutting mat */}
                      <path d="M0 0 L48 0 L48 48 Z" fill="#072216" />
                      {/* Folded paper flap */}
                      <path
                        d="M0 0 C12 8, 24 20, 48 48 L0 48 Z"
                        fill="#ece4d4"
                        stroke="#d4c9b6"
                        strokeWidth="0.8"
                      />
                      {/* Crease shadow */}
                      <path
                        d="M0 0 C12 8, 24 20, 48 48"
                        stroke="rgba(0,0,0,0.22)"
                        strokeWidth="2.5"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {/* Top Header Row inside Card: Badge + Green Script */}
                  <div className="flex items-center justify-between gap-2 mb-2 pr-6">
                    <span className="bg-[#181818] text-white font-mono text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-sm">
                      APPAREL EXECUTION WORKSPACE
                    </span>
                    <span className="relative font-hand text-2xl text-[#16a34a] font-bold">
                      Project Alpha // Winter Drop
                      {/* Hand-drawn green wavy underline */}
                      <svg
                        className="absolute -bottom-1 left-0 w-full h-2 text-[#16a34a] overflow-visible"
                        viewBox="0 0 100 8"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 4 Q 25 1, 50 4 T 100 4"
                          stroke="#16a34a"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </div>

                  {/* Giant Grotesque Bold Title */}
                  <h1 className="font-display font-black text-6xl tracking-tight text-[#0a2318] leading-[0.95] mt-3 mb-4">
                    MEETMIND
                  </h1>

                  {/* Two Highlight Pills Under Title */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="bg-[#fde047] text-stone-950 font-display font-bold text-xs tracking-tight uppercase px-3 py-1.5 rounded-sm shadow-xs border border-amber-300">
                      YOUR MEETINGS HAVE A MEMORY NOW.
                    </span>
                    <span className="bg-[#6b3c1b] text-white font-display font-bold text-xs tracking-tight uppercase px-3 py-1.5 rounded-sm shadow-xs">
                      STOP DISCUSSING. START SELLING.
                    </span>
                  </div>

                  {/* Body Paragraph */}
                  <p className="font-sans text-stone-800 text-[14px] leading-relaxed font-medium mb-3">
                    Don't let apparel commitments get lost in audio recordings. MeetMind remembers every fabric supplier decision, catches when marketing proposes a drop date that contradicts warehouse batch lead times, and turns approved collection decisions into real production tasks.
                  </p>

                  {/* Handwritten Quote Signature */}
                  <div className="flex items-center gap-2 my-2">
                    <p className="font-hand text-2xl text-stone-700 font-bold">
                      — Simple, honest, no lost orders.
                    </p>
                    {/* 3 green doodle accent rays */}
                    <div className="flex items-center gap-0.5 text-[#22c55e] font-bold">
                      <span className="text-sm -rotate-45 font-black">/</span>
                      <span className="text-base font-black">|</span>
                      <span className="text-sm rotate-45 font-black">\</span>
                    </div>
                  </div>


                  {/* Bottom Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-stone-200">
                    <button
                      onClick={() => handleCardClick(() => onNavigate("decisions"))}
                      className="bg-[#0b3820] hover:bg-[#072616] text-[#e8f7ee] font-display font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                    >
                      <span>Open Decisions</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleCardClick(() => onNavigate("tasks"))}
                      className="bg-[#decbb5] hover:bg-[#d1bc9f] text-stone-800 font-display font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                    >
                      <List className="w-4 h-4 text-stone-700" />
                      <span>View Tasks ({tasks.length})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* --- 2. CONFLICT PIN CARD (TOP RIGHT) --- */}
              {/* ======================================================== */}
              {item.type === "conflict" && winterConflict && (
                isConflictResolved ? (
                  /* Resolved Conflict Card */
                  <div
                    onClick={() => handleCardClick(() => onNavigate("conflicts"))}
                    className="w-[420px] relative bg-[#ecfdf5] p-5 rounded-2xl border border-emerald-300 shadow-2xl group cursor-pointer transition-all"
                  >
                    {/* 3D Green Pushpin at Top Right */}
                    <PushPin color="green" className="-top-3 right-5" />

                    {/* Top Bar: Icon + Title + Action Pill */}
                    <div className="flex items-center justify-between gap-2 mb-2 pr-4">
                      <span className="font-display text-[11px] uppercase font-bold text-emerald-900 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>CONFLICT RESOLVED &amp; SYNCED</span>
                      </span>
                      <span className="bg-emerald-200 text-emerald-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {winterConflict.resolutionAction === "adopted_proposal"
                          ? "RATIFIED: NOV 10"
                          : "RATIFIED: NOV 15"}
                      </span>
                    </div>

                    {/* Conflict Title */}
                    <h3 className="font-display font-extrabold text-lg text-emerald-950 leading-snug mt-1 mb-3">
                      {winterConflict.resolutionAction === "adopted_proposal"
                        ? "Winter Drop: Nov 10 Marketing Drop Ratified"
                        : "Winter Drop Conflict: Ratified Nov 15"}
                    </h3>

                    {/* Resolution Summary Box */}
                    <div className="space-y-2 text-xs bg-white/85 p-3.5 rounded-xl border border-emerald-200 text-stone-900">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <p className="leading-snug">
                          <strong className="text-emerald-950">Ratified Decision:</strong>{" "}
                          {winterConflict.resolutionAction === "adopted_proposal"
                            ? "Team accepted Nov 10 release for Black Friday creator blast with spot-checks."
                            : "Nov 15 locked for fabric QA & seam testing. Garment quality protected."}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-mono-code font-bold bg-emerald-100/70 px-2 py-1 rounded">
                        <span>✓ Decision D-024 Ratified &amp; Saved in Database</span>
                      </div>
                    </div>

                    {/* Bottom Row Actions */}
                    <div className="mt-4 flex items-center justify-end text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(() => onNavigate("conflicts"));
                        }}
                        className="bg-[#0b3820] hover:bg-[#072616] text-[#e8f7ee] text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View in Conflict Radar</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Active Conflict Card */
                  <div
                    onClick={() => handleCardClick(() => onNavigate("conflicts"))}
                    className="w-[420px] relative bg-[#fed7dc] p-5 rounded-2xl border border-rose-300/80 shadow-2xl group cursor-pointer"
                  >
                    {/* 3D Red Pushpin at Top Right */}
                    <PushPin color="red" className="-top-3 right-5" />

                    {/* Top Bar: Icon + Title + Action Pill */}
                    <div className="flex items-center justify-between gap-2 mb-2 pr-4">
                      <span className="font-display text-[11px] uppercase font-bold text-rose-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-700" />
                        <span>CONFLICT CAUGHT BY MEMORY</span>
                      </span>
                      <span className="bg-[#fca5a5] text-rose-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        ACTION NEEDED
                      </span>
                    </div>

                    {/* Conflict Title */}
                    <h3 className="font-display font-extrabold text-lg text-rose-950 leading-snug mt-1 mb-3">
                      Winter Drop Conflict: Nov 15 vs Nov 10
                    </h3>

                    {/* Comparison Box */}
                    <div className="space-y-2 text-xs bg-white/70 p-3 rounded-xl border border-rose-200 text-stone-900">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-rose-700 shrink-0" />
                        <p>
                          <strong className="text-rose-950">Oct 28:</strong> Sara confirmed{" "}
                          <strong className="text-rose-950 font-bold">Nov 15</strong> for fabric QA &amp; seam testing.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-rose-700 shrink-0" />
                        <p>
                          <strong className="text-rose-950">Oct 31:</strong> Marketing proposed{" "}
                          <strong className="text-rose-950 font-bold">Nov 10</strong> for Black Friday creator ads.
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row Actions */}
                    <div className="mt-4 flex items-center justify-end text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(() => onNavigate("conflicts"));
                        }}
                        className="bg-[#be185d] hover:bg-[#9d174d] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Click to Solve</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* ======================================================== */}
              {/* --- 3. QUICK BOARD OVERVIEW (MIDDLE RIGHT) --- */}
              {/* ======================================================== */}
              {item.type === "overview" && (
                <div className="w-[420px] relative bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xl text-stone-900">
                  {/* Header: Green Bar Chart Icon + Title */}
                  <div className="flex items-center gap-2 mb-3.5">
                    <div className="w-4 h-4 flex items-end gap-0.5 text-emerald-600">
                      <div className="w-1 h-2 bg-emerald-600 rounded-xs" />
                      <div className="w-1 h-3.5 bg-emerald-600 rounded-xs" />
                      <div className="w-1 h-2.5 bg-emerald-600 rounded-xs" />
                    </div>
                    <h3 className="font-display font-bold text-base text-stone-950">
                      Quick Board Overview
                    </h3>
                  </div>

                  {/* 4-Column Stats Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-1 pb-3 border-b border-stone-100">
                    {/* 1. Meetings */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-stone-900">
                        <Calendar className="w-4 h-4 text-emerald-700" />
                        <span className="font-display font-extrabold text-2xl">
                          {meetings.length}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-600 leading-tight mt-1">
                        Meetings recorded
                      </span>
                    </div>

                    {/* 2. Confirmed */}
                    <div className="flex flex-col border-l border-stone-200 pl-2">
                      <div className="flex items-center gap-1.5 text-stone-900">
                        <div className="w-4 h-4 rounded-full border border-emerald-600 flex items-center justify-center text-emerald-600 text-[10px] font-bold">
                          ✓
                        </div>
                        <span className="font-display font-extrabold text-2xl">
                          {confirmedDecisionsCount}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-600 leading-tight mt-1">
                        Confirmed decisions
                      </span>
                    </div>

                    {/* 3. Conflicts */}
                    <div className="flex flex-col border-l border-stone-200 pl-2">
                      <div className={`flex items-center gap-1.5 ${activeConflictsCount === 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {activeConflictsCount === 0 ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                        )}
                        <span className="font-display font-extrabold text-2xl">
                          {activeConflictsCount}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-600 leading-tight mt-1">
                        Unresolved conflicts
                      </span>
                    </div>

                    {/* 4. Open tasks */}
                    <div className="flex flex-col border-l border-stone-200 pl-2">
                      <div className="flex items-center gap-1.5 text-stone-900">
                        <Layers className="w-4 h-4 text-emerald-700" />
                        <span className="font-display font-extrabold text-2xl">
                          {pendingTasksCount}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-600 leading-tight mt-1">
                        Open action tasks
                      </span>
                    </div>
                  </div>

                  {/* Bottom Footer Row */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-700">
                      Human Gate:
                    </span>
                    <span className="bg-[#bbf7d0] text-[#14532d] font-bold text-xs px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <span>✓</span>
                      <span>Active</span>
                    </span>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* --- 4. YELLOW POST-IT STICKY NOTE (BOTTOM CENTER) --- */}
              {/* ======================================================== */}
              {item.type === "handwritten-note" && (
                <div className="w-[200px] relative bg-[#fef08a] p-4 rounded-xs shadow-lg border border-amber-300 text-stone-900 select-none">
                  <p className="font-hand text-xl font-bold leading-snug">
                    Sara requested 2 weeks{" "}
                    <span className="relative">
                      for fabric QA inspection.
                      <svg
                        className="absolute -bottom-1 left-0 w-full h-2 text-rose-500 overflow-visible"
                        viewBox="0 0 100 8"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 5 Q 50 1, 100 4"
                          stroke="#f43f5e"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </p>
                </div>
              )}

              {/* ======================================================== */}
              {/* --- 5. KRAFT PAPER TASK TICKET (BOTTOM RIGHT) --- */}
              {/* ======================================================== */}
              {item.type === "task-102" && (
                <div
                  onClick={() => handleCardClick(() => onNavigate("tasks"))}
                  className="w-[250px] relative bg-[#6b3d1f] p-4 rounded-xl shadow-xl select-none text-white cursor-pointer group"
                >
                  {/* Paperclip on left edge */}
                  <PaperClip className="-left-3 top-8" />

                  {/* Top labels */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-black/30 text-stone-200 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      TSK-102
                    </span>
                    <span className="bg-[#fecdd3] text-[#9f1239] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      CRITICAL
                    </span>
                  </div>

                  {/* Ticket Title */}
                  <h4 className="font-display font-bold text-sm text-stone-50 leading-snug">
                    Fabric durability & zipper seam stress audit before collection drop
                  </h4>
                </div>
              )}


              {/* ======================================================== */}
              {/* --- 6. USER CUSTOM PINNED NOTES --- */}
              {/* ======================================================== */}
              {item.type === "custom-note" && item.customData && (
                <div
                  className={`w-[240px] relative paper-sheet paper-${item.customData.color} p-4 rounded-xs border border-stone-300 shadow-md`}
                >
                  <PushPin color="red" className="-top-3 left-6" />
                  <h4 className="font-display font-bold text-sm text-stone-950 mb-1">
                    {item.customData.title}
                  </h4>
                  <p className="font-hand text-xl text-stone-800 leading-snug">
                    {item.customData.text}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Note Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative paper-sheet paper-white w-full max-w-md p-6 rounded-xs border-2 border-stone-400 shadow-2xl space-y-4">
            <PushPin color="gold" className="-top-3 left-6" />
            <Tape position="top-right" angle="-2deg" width="w-20" />

            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-display font-black text-xl text-stone-950 flex items-center gap-2">
                <Pin className="w-5 h-5 text-emerald-800" />
                <span>Pin a Note to the Board</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-stone-700 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sara's Feedback"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-sm font-sans focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-stone-700 mb-1">
                  Note Message (Handwritten)
                </label>
                <textarea
                  rows={3}
                  placeholder="Write your note here..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-sm font-hand text-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-stone-700 mb-1">
                  Paper Color
                </label>
                <div className="flex gap-2">
                  {(["yellow", "coral", "mint", "white", "kraft"] as const).map(
                    (c) => (
                      <button
                        key={c}
                        onClick={() => setNewNoteColor(c)}
                        className={`px-3 py-1 text-xs font-mono-code font-bold uppercase rounded border ${
                          newNoteColor === c
                            ? "border-black scale-105 shadow-xs"
                            : "border-stone-300"
                        } paper-${c}`}
                      >
                        {c}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 font-mono-code text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomNote}
                className="px-5 py-2 bg-[#244a33] hover:bg-[#1a3826] text-white font-mono-code font-bold text-xs uppercase rounded-xs shadow cursor-pointer"
              >
                Pin It
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
