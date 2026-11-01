"use client";

import React, { useState, useEffect } from "react";
import { BoardNavigation, ActiveTab } from "./BoardNavigation";
import { InteractiveHomePinboard } from "./InteractiveHomePinboard";
import { MeetingsPinboard } from "@/components/pages/MeetingsPinboard";
import { DecisionsPinboard } from "@/components/pages/DecisionsPinboard";
import { ConflictsPinboard } from "@/components/pages/ConflictsPinboard";
import { TasksPinboard } from "@/components/pages/TasksPinboard";
import { WeeklyNotesPinboard } from "@/components/pages/WeeklyNotesPinboard";
import { AskQuestionsPinboard } from "@/components/pages/AskQuestionsPinboard";
import { LandingPage } from "@/components/pages/LandingPage";
import { DecisionDnaModal } from "./DecisionDnaModal";
import { WorkspaceLoadingScreen } from "./WorkspaceLoadingScreen";
import {
  INITIAL_MEETINGS,
  INITIAL_DECISIONS,
  INITIAL_CONFLICTS,
  INITIAL_TASKS,
  INITIAL_DIGEST,
  INITIAL_SPEAKERS,
  DEMO_MEETING_PRESETS,
} from "@/data/mockData";
import { Meeting, Decision, Conflict, TaskItem, WeeklyDigest } from "@/types";
import { Plus, X, Sparkles, Upload } from "lucide-react";
import { PushPin, Tape } from "./PinboardDecorations";
import {
  seedFirestoreIfEmpty,
  subscribeToMeetings,
  subscribeToDecisions,
  subscribeToConflicts,
  subscribeToTasks,
  subscribeToDigest,
  saveMeetingToDb,
  saveDecisionToDb,
  saveTaskToDb,
  updateTaskInDb,
  resolveConflictInDb,
  batchSaveIngestedMeeting,
} from "@/services/firebaseService";

export function MeetMindApp() {
  const [activeTab, setActiveTabState] = useState<ActiveTab>("landing");

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("meetmind_active_tab", tab);
      }
    } catch {}
  };

  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState<boolean>(false);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [decisions, setDecisions] = useState<Decision[]>(INITIAL_DECISIONS);
  const [conflicts, setConflicts] = useState<Conflict[]>(INITIAL_CONFLICTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [digest, setDigest] = useState<WeeklyDigest>(INITIAL_DIGEST);
  const [activeMeetingId, setActiveMeetingId] = useState<string>("meet-01");
  const [inspectedDecision, setInspectedDecision] = useState<Decision | null>(null);
  const [showNewMeetingModal, setShowNewMeetingModal] = useState<boolean>(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState<boolean>(false);
  const [tidyTrigger, setTidyTrigger] = useState<number>(0);

  // Real-time Firebase Sync & Initial Seeding
  useEffect(() => {
    // 0. Load cached resolved conflicts, tasks, decisions, meetings, and active tab from local storage on startup
    try {
      if (typeof window !== "undefined") {
        const savedTab = localStorage.getItem("meetmind_active_tab") as ActiveTab | null;
        if (
          savedTab &&
          ["home", "meetings", "decisions", "conflicts", "tasks", "weekly", "ask", "landing"].includes(savedTab)
        ) {
          setActiveTabState(savedTab);
        }

        const storedMeetings = localStorage.getItem("meetmind_meetings");
        if (storedMeetings) {
          const parsed = JSON.parse(storedMeetings);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMeetings(parsed);
          }
        }

        const storedConflicts = localStorage.getItem("meetmind_resolved_conflicts");
        if (storedConflicts) {
          const map = JSON.parse(storedConflicts);
          setConflicts((prev) =>
            prev.map((c) =>
              map[c.id]
                ? { ...c, status: "resolved", resolutionAction: map[c.id] }
                : c
            )
          );
        }

        const storedTasks = localStorage.getItem("meetmind_tasks");
        if (storedTasks) {
          const parsed = JSON.parse(storedTasks);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTasks(parsed);
          }
        }

        const storedDecisions = localStorage.getItem("meetmind_decisions");
        if (storedDecisions) {
          const parsed = JSON.parse(storedDecisions);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDecisions(parsed);
          }
        }
      }
    } catch {}

    // 1. Seed initial data to Firestore if database is empty
    seedFirestoreIfEmpty().catch((err) => {
      console.warn("[Firebase] Initial database check notice:", err);
    });

    // 2. Attach real-time listeners for all MeetMind collections
    const unsubMeetings = subscribeToMeetings((liveMeetings) => {
      if (liveMeetings && liveMeetings.length > 0) {
        setMeetings((prev) => {
          const map = new Map(liveMeetings.map((m) => [m.id, m]));
          prev.forEach((localM) => {
            if (!map.has(localM.id)) {
              map.set(localM.id, localM);
            }
          });
          const merged = Array.from(map.values());
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem("meetmind_meetings", JSON.stringify(merged));
            }
          } catch {}
          return merged;
        });
      }
    });

    const unsubDecisions = subscribeToDecisions((liveDecisions) => {
      if (liveDecisions && liveDecisions.length > 0) {
        setDecisions(liveDecisions);
      }
    });

    const unsubConflicts = subscribeToConflicts((liveConflicts) => {
      if (liveConflicts && liveConflicts.length > 0) {
        try {
          const stored = typeof window !== "undefined" ? localStorage.getItem("meetmind_resolved_conflicts") : null;
          const map = stored ? JSON.parse(stored) : {};
          const merged = liveConflicts.map((c) =>
            map[c.id] ? { ...c, status: "resolved" as const, resolutionAction: map[c.id] } : c
          );
          setConflicts(merged);
        } catch {
          setConflicts(liveConflicts);
        }
      }
    });

    const unsubTasks = subscribeToTasks((liveTasks) => {
      if (liveTasks && liveTasks.length > 0) {
        setTasks((prev) => {
          // Merge live tasks while preserving any local approval status
          const taskMap = new Map(liveTasks.map((t) => [t.id, t]));
          prev.forEach((localTask) => {
            if (localTask.approved && taskMap.has(localTask.id)) {
              taskMap.set(localTask.id, { ...taskMap.get(localTask.id)!, approved: true });
            }
          });
          return Array.from(taskMap.values());
        });
      }
    });

    const unsubDigest = subscribeToDigest((liveDigest) => {
      if (liveDigest) {
        setDigest(liveDigest);
      }
    });

    return () => {
      unsubMeetings();
      unsubDecisions();
      unsubConflicts();
      unsubTasks();
      unsubDigest();
    };
  }, []);

  // New Meeting Form State
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingProject, setNewMeetingProject] = useState("Project Alpha // Winter Apparel Drop");
  const [newMeetingDate, setNewMeetingDate] = useState("Nov 03, 2026");
  const [newMeetingSummary, setNewMeetingSummary] = useState("");
  const [newMeetingTranscript, setNewMeetingTranscript] = useState("");

  const handleLoadMeetingPreset = (index: number) => {
    const preset = DEMO_MEETING_PRESETS[index];
    if (!preset) return;
    setNewMeetingTitle(preset.title);
    setNewMeetingProject(preset.project);
    setNewMeetingDate(preset.date);
    setNewMeetingSummary(preset.summary);
    setNewMeetingTranscript(preset.transcript);
  };

  const [isProcessingAi, setIsProcessingAi] = useState(false);

  // Killer Demo trigger: jumps straight to the conflict view
  const handleTriggerKillerDemo = () => {
    setActiveMeetingId("meet-02");
    setActiveTab("conflicts");
  };

  // Conflict Resolution: Keeps Oct 28 Nov 15 or changes to Nov 10
  const handleResolveConflict = (
    conflictId: string,
    resolution: "kept_historical" | "adopted_proposal" | "scheduled_review"
  ) => {
    setConflicts((prev) =>
      prev.map((c) => {
        if (c.id === conflictId) {
          return {
            ...c,
            status: "resolved",
            resolutionAction: resolution,
          };
        }
        return c;
      })
    );

    if (resolution === "kept_historical") {
      setDecisions((prev) =>
        prev.map((d) => {
          if (d.code === "D-024") return { ...d, status: "confirmed" };
          if (d.code === "D-028") return { ...d, status: "superseded" };
          return d;
        })
      );
    } else if (resolution === "adopted_proposal") {
      setDecisions((prev) =>
        prev.map((d) => {
          if (d.code === "D-024") return { ...d, status: "superseded" };
          if (d.code === "D-028") return { ...d, status: "confirmed" };
          return d;
        })
      );
    }

    // Persist resolution in Firebase Firestore
    resolveConflictInDb(conflictId, resolution).catch(() => {});
  };

  // Task Kanban Status updates
  const handleUpdateTaskStatus = (
    taskId: string,
    newStatus: "todo" | "in_progress" | "done"
  ) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("meetmind_tasks", JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });
    // Persist status change in Firebase Firestore
    updateTaskInDb(taskId, { status: newStatus }).catch(() => {});
  };

  // Human Gate Approval
  const handleToggleApproval = (taskId: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;
    const newApproval = !targetTask.approved;

    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, approved: newApproval } : t));
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("meetmind_tasks", JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });
    // Persist approval change in Firebase Firestore
    updateTaskInDb(taskId, { approved: newApproval }).catch(() => {});
  };

  // Task Tracker Integration Sync (Jira / Trello / GitHub / Notion / Slack)
  const handleSyncTask = (
    taskId: string,
    target: "Trello" | "Google Tasks" | "Notion" | "Slack" | "Jira" | "GitHub",
    issueKey?: string
  ) => {
    const generatedKey = issueKey || `${target.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`;
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            synced: true,
            syncTarget: target,
            integrationIssueKey: generatedKey,
          };
        }
        return t;
      });
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("meetmind_tasks", JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });
    // Persist tracker sync in Firebase Firestore
    updateTaskInDb(taskId, {
      synced: true,
      syncTarget: target,
      integrationIssueKey: generatedKey,
    }).catch(() => {});
  };

  // Approve and create tasks from Meeting Intelligence Studio
  const handleApproveAndCreateTasksFromMeeting = (
    newOrUpdatedTasks: TaskItem[],
    decisionsToConfirm?: Decision[]
  ) => {
    // 1. Update and merge tasks
    setTasks((prev) => {
      const updated = [...prev];
      newOrUpdatedTasks.forEach((t) => {
        const idx = updated.findIndex((item) => item.id === t.id);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], ...t, approved: true };
        } else {
          updated.push({ ...t, approved: true });
        }
      });
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("meetmind_tasks", JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });

    // 2. Confirm linked decisions
    if (decisionsToConfirm && decisionsToConfirm.length > 0) {
      setDecisions((prev) => {
        const updated = [...prev];
        decisionsToConfirm.forEach((d) => {
          const idx = updated.findIndex((item) => item.id === d.id || item.code === d.code);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], status: "confirmed" };
          } else {
            updated.push({ ...d, status: "confirmed" });
          }
        });
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("meetmind_decisions", JSON.stringify(updated));
          }
        } catch {}
        return updated;
      });
    }

    // 3. Persist to Firebase Firestore
    newOrUpdatedTasks.forEach((t) => {
      saveTaskToDb({ ...t, approved: true }).catch(() => {});
    });

    if (decisionsToConfirm) {
      decisionsToConfirm.forEach((d) => {
        saveDecisionToDb({ ...d, status: "confirmed" }).catch(() => {});
      });
    }
  };

  // Toggle task status from action items checkbox
  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const newStatus = t.status === "done" ? ("todo" as const) : ("done" as const);
          updateTaskInDb(taskId, { status: newStatus }).catch(() => {});
          return { ...t, status: newStatus };
        }
        return t;
      });
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("meetmind_tasks", JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });
  };

  // Ingest New Meeting
  const handleSaveNewMeeting = (
    titleParam?: string,
    summaryParam?: string,
    transcriptParam?: string,
    dateParam?: string
  ) => {
    const titleToUse = (typeof titleParam === "string" ? titleParam : newMeetingTitle).trim();
    if (!titleToUse) return;

    const summaryToUse =
      (typeof summaryParam === "string" ? summaryParam : newMeetingSummary).trim() ||
      "Team aligned on collection specs, fabric durability, and operational deliverables.";
    const transcriptToUse =
      (typeof transcriptParam === "string" ? transcriptParam : newMeetingTranscript).trim() ||
      `Confirmed specs and production roadmap for ${titleToUse}. Action items assigned to production team.`;
    const dateToUse = (typeof dateParam === "string" ? dateParam : newMeetingDate).trim() || "Nov 03, 2026";
    const projectToUse = newMeetingProject || "Project Alpha // Winter Apparel Drop";

    setIsProcessingAi(true);

    setTimeout(() => {
      const newMeetId = `meet-${Date.now()}`;
      const newMeet: Meeting = {
        id: newMeetId,
        title: titleToUse,
        project: projectToUse,
        date: dateToUse,
        time: "02:30 PM",
        duration: "30 min",
        summary: summaryToUse,
        status: "confirmed",
        waveformHeights: [
          35, 50, 70, 85, 60, 45, 75, 90, 65, 50, 60, 80, 85, 55, 45, 65,
        ],
        speakers: [INITIAL_SPEAKERS[0], INITIAL_SPEAKERS[1]],
        transcript: [
          {
            id: `tr-${Date.now()}-1`,
            speakerId: "spk-1",
            timestamp: "02:15",
            seconds: 135,
            text: transcriptToUse,
            highlightType: "decision",
            highlightLabel: "Decision Highlight",
          },
          {
            id: `tr-${Date.now()}-2`,
            speakerId: "spk-2",
            timestamp: "04:50",
            seconds: 290,
            text: `Approved action items and milestone verification for ${titleToUse}.`,
            highlightType: "action",
            highlightLabel: "Action Item",
          },
        ],
      };

      const newDecId = `dec-${Date.now()}`;
      const nextDecNum = decisions.length + 1;
      const decCode = `D-${String(24 + nextDecNum).padStart(3, "0")}`;
      const newDecision: Decision = {
        id: newDecId,
        code: decCode,
        title: `Ratified plan for ${titleToUse}`,
        context: summaryToUse,
        owner: INITIAL_SPEAKERS[0].name,
        ownerRole: INITIAL_SPEAKERS[0].role,
        sourceMeetingId: newMeetId,
        sourceMeetingTitle: titleToUse,
        sourceTimestamp: "02:15",
        date: dateToUse,
        status: "confirmed",
        confidence: 96,
        tags: ["Apparel", "Production", "Verified"],
        evidenceQuote: transcriptToUse,
        tasksGenerated: [`task-${Date.now()}`],
        rotationDeg: -1,
      };

      const newTaskId = `task-${Date.now()}`;
      const newTask: TaskItem = {
        id: newTaskId,
        title: `Execute deliverables for ${titleToUse}`,
        description: summaryToUse,
        owner: INITIAL_SPEAKERS[1].name,
        ownerAvatar: INITIAL_SPEAKERS[1].avatar,
        deadline: "Nov 15, 2026",
        priority: "HIGH",
        status: "todo",
        sourceMeeting: titleToUse,
        sourceTimestamp: "04:50",
        decisionRef: decCode,
        approved: true,
        syncTarget: "Trello",
        synced: true,
      };

      setMeetings((prev) => {
        const updated = [newMeet, ...prev];
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("meetmind_meetings", JSON.stringify(updated));
          }
        } catch {}
        return updated;
      });

      setDecisions((prev) => {
        const updated = [newDecision, ...prev];
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("meetmind_decisions", JSON.stringify(updated));
          }
        } catch {}
        return updated;
      });

      setTasks((prev) => {
        const updated = [newTask, ...prev];
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("meetmind_tasks", JSON.stringify(updated));
          }
        } catch {}
        return updated;
      });

      setActiveMeetingId(newMeetId);
      setIsProcessingAi(false);
      setShowNewMeetingModal(false);
      setNewMeetingTitle("");
      setNewMeetingSummary("");
      setNewMeetingTranscript("");
      setActiveTab("meetings");

      // Persist to Firebase Firestore
      saveMeetingToDb(newMeet).catch(() => {});
      saveDecisionToDb(newDecision).catch(() => {});
      saveTaskToDb(newTask).catch(() => {});
    }, 600);
  };

  const activeConflictsCount = conflicts.filter((c) => c.status === "active").length;

  const handleStartLoadingWorkspace = (guest: boolean = false) => {
    setIsGuestMode(guest);
    setIsLoadingWorkspace(true);
  };

  const handleLoadingComplete = () => {
    setIsLoadingWorkspace(false);
    setActiveTab("home");
  };

  // Standard Loading Screen between registration/landing and home tab
  if (isLoadingWorkspace) {
    return (
      <WorkspaceLoadingScreen
        onComplete={handleLoadingComplete}
        guestMode={isGuestMode}
      />
    );
  }

  // When on Landing, render dedicated LandingPage
  if (activeTab === "landing") {
    return (
      <LandingPage
        onNavigate={(tab) => {
          if (tab === "home") {
            handleStartLoadingWorkspace(false);
          } else {
            setActiveTab(tab);
          }
        }}
        onStartLoadingWorkspace={handleStartLoadingWorkspace}
        onTriggerKillerDemo={handleTriggerKillerDemo}
        meetings={meetings}
        decisions={decisions}
        conflicts={conflicts}
        tasks={tasks}
      />
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col pinboard-surface text-[#242220]">
      {/* Top Cutting-Mat Header with Pinned Tabs */}
      <BoardNavigation
        activeTab={activeTab}
        onNavigate={setActiveTab}
        activeConflictsCount={activeConflictsCount}
        onTriggerKillerDemo={handleTriggerKillerDemo}
        onNewMeeting={() => setShowNewMeetingModal(true)}
        onPinNote={() => setShowAddNoteModal(true)}
        onTidyBoard={() => setTidyTrigger((t) => t + 1)}
      />

      {/* Main Tab Viewport */}
      <main className="flex-1 w-full pinboard-surface">
        <div key={activeTab} className="tab-glide-transition w-full">
          {/* TAB 1: Real Interactive Draggable Home Pinboard */}
          {activeTab === "home" && (
          <InteractiveHomePinboard
            onNavigate={setActiveTab}
            onTriggerKillerDemo={handleTriggerKillerDemo}
            meetings={meetings}
            decisions={decisions}
            conflicts={conflicts}
            tasks={tasks}
            showAddNoteModal={showAddNoteModal}
            setShowAddNoteModal={setShowAddNoteModal}
            tidyTrigger={tidyTrigger}
            onInspectDecision={(dec) => setInspectedDecision(dec)}
            onOpenMeeting={(id: string) => {
              setActiveMeetingId(id);
              setActiveTab("meetings");
            }}
          />
        )}

        {/* TAB 2: Fixed Meetings Studio Pinboard */}
        {activeTab === "meetings" && (
          <MeetingsPinboard
            meetings={meetings}
            activeMeetingId={activeMeetingId}
            onSelectMeeting={setActiveMeetingId}
            onAddMeeting={(title, summary, transcript) => {
              handleSaveNewMeeting(title, summary, transcript);
            }}
            onAddIngestedMeeting={(m, d, t, c) => {
              setMeetings((prev) => {
                const updated = [m, ...prev];
                try {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("meetmind_meetings", JSON.stringify(updated));
                  }
                } catch {}
                return updated;
              });
              if (d.length > 0) {
                setDecisions((prev) => {
                  const updated = [...d, ...prev];
                  try {
                    if (typeof window !== "undefined") {
                      localStorage.setItem("meetmind_decisions", JSON.stringify(updated));
                    }
                  } catch {}
                  return updated;
                });
              }
              if (t.length > 0) {
                setTasks((prev) => {
                  const updated = [...t, ...prev];
                  try {
                    if (typeof window !== "undefined") {
                      localStorage.setItem("meetmind_tasks", JSON.stringify(updated));
                    }
                  } catch {}
                  return updated;
                });
              }
              if (c.length > 0) {
                setConflicts((prev) => [...c, ...prev]);
              }
              setActiveMeetingId(m.id);

              // Persist all extracted intelligence to Firebase Firestore
              batchSaveIngestedMeeting(m, d, t, c).catch(() => {});
            }}
            decisions={decisions}
            tasks={tasks}
            conflicts={conflicts}
            onNavigateToConflicts={() => setActiveTab("conflicts")}
            onNavigateToDecisions={() => setActiveTab("decisions")}
            onNavigateToTasks={() => setActiveTab("tasks")}
            onInspectDecision={(dec) => setInspectedDecision(dec)}
            onApproveAndCreateTasks={handleApproveAndCreateTasksFromMeeting}
            onToggleTaskStatus={handleToggleTaskStatus}
          />
        )}

        {/* TAB 3: Fixed Decisions Pinboard */}
        {activeTab === "decisions" && (
          <DecisionsPinboard
            decisions={decisions}
            allTasks={tasks}
            onNavigateToConflicts={() => setActiveTab("conflicts")}
          />
        )}

        {/* TAB 4: Fixed Conflicts Pinboard (The Killer Demo) */}
        {activeTab === "conflicts" && (
          <ConflictsPinboard
            conflicts={conflicts}
            onResolveConflict={handleResolveConflict}
          />
        )}

        {/* TAB 5: Fixed Tasks Pinboard (Kanban Execution) */}
        {activeTab === "tasks" && (
          <TasksPinboard
            tasks={tasks}
            onUpdateStatus={handleUpdateTaskStatus}
            onToggleApproval={handleToggleApproval}
            onSyncTask={handleSyncTask}
          />
        )}

        {/* TAB 6: Fixed Weekly Notes Pinboard */}
        {activeTab === "weekly" && (
          <WeeklyNotesPinboard
            digest={digest}
            tasks={tasks}
            decisions={decisions}
          />
        )}

        {/* TAB 7: AI Mind Pinboard */}
        {activeTab === "ask" && (
          <AskQuestionsPinboard
            meetings={meetings}
            decisions={decisions}
            conflicts={conflicts}
          />
        )}
        </div>
      </main>

      {/* Decision DNA Modal */}
      {inspectedDecision && (
        <DecisionDnaModal
          decision={inspectedDecision}
          allTasks={tasks}
          onClose={() => setInspectedDecision(null)}
          onJumpToMeeting={(mId: string) => {
            setInspectedDecision(null);
            setActiveMeetingId(mId);
            setActiveTab("meetings");
          }}
        />
      )}

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative paper-sheet paper-white w-full max-w-lg p-6 sm:p-7 rounded-xs border-2 border-stone-400 shadow-2xl space-y-4">
            <PushPin color="red" className="-top-3 left-6" />
            <Tape position="top-right" angle="-2deg" width="w-24" />

            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-600" />
                <h3 className="font-display font-black text-xl text-stone-950">
                  Record / Ingest New Meeting
                </h3>
              </div>
              <button
                onClick={() => setShowNewMeetingModal(false)}
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
                  onClick={() => handleLoadMeetingPreset(0)}
                  className="px-2.5 py-1 bg-[#ffea55] hover:bg-amber-300 text-stone-950 font-mono-code font-bold text-[11px] rounded shadow-xs cursor-pointer transition-transform active:scale-95"
                >
                  ⚡ Auto-fill Preset #1
                </button>
              </div>
              <p className="text-[11px] text-stone-300 leading-tight">
                Click any scenario below to pre-populate realistic transcripts & decisions:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {DEMO_MEETING_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadMeetingPreset(idx)}
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
                  placeholder="e.g., Sprint Planning // Database Migration"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-sm font-sans focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code font-bold uppercase text-stone-700 mb-1">
                    Project
                  </label>
                  <input
                    type="text"
                    value={newMeetingProject}
                    onChange={(e) => setNewMeetingProject(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs font-sans focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code font-bold uppercase text-stone-700 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={newMeetingDate}
                    onChange={(e) => setNewMeetingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs font-sans focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-stone-700 mb-1">
                  Meeting Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Key summary points..."
                  value={newMeetingSummary}
                  onChange={(e) => setNewMeetingSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs font-sans focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-stone-700 mb-1">
                  Transcript or Notes (AI will extract decisions & conflicts)
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste meeting transcript snippets or speaker notes here..."
                  value={newMeetingTranscript}
                  onChange={(e) => setNewMeetingTranscript(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs font-mono-code focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-950 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Automatic memory check will compare against past meetings to prevent conflicting commitments!
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                onClick={() => setShowNewMeetingModal(false)}
                className="px-4 py-2 font-mono-code text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveNewMeeting()}
                disabled={isProcessingAi || !newMeetingTitle.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#e63946] hover:bg-[#d62839] disabled:opacity-50 text-white font-mono-code font-bold text-xs uppercase rounded-xs shadow cursor-pointer"
              >
                {isProcessingAi ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing AI Extraction...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Save & Pin to Workspace</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
