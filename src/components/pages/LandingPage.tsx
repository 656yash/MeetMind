"use client";

import React, { useState } from "react";
import { ActiveTab } from "@/components/pinboard/BoardNavigation";
import { OfficeDiorama } from "@/components/sites/skydive/OfficeDiorama";
import { X, Sparkles, User, Mail, Building, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface LandingPageProps {
  onNavigate: (tab: ActiveTab) => void;
  onStartLoadingWorkspace?: (guest: boolean) => void;
  onTriggerKillerDemo?: () => void;
  meetings?: unknown;
  decisions?: unknown;
  conflicts?: unknown;
  tasks?: unknown;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate,
  onStartLoadingWorkspace,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"register" | "workspace">("workspace");

  // Form State
  const [fullName, setFullName] = useState("Yash Deshmukh");
  const [email, setEmail] = useState("yash@aura-apparel.com");
  const [teamName, setTeamName] = useState("Project Alpha // Winter Apparel");


  const triggerExitAnimation = (mode: "account" | "guest") => {
    // Celebratory confetti animation
    try {
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.55 },
        colors: ["#2DD4BF", "#ffea55", "#38BDF8", "#22201e", "#ffffff"],
      });
    } catch {
      // Fallback if blocked
    }

    setShowModal(false);

    if (onStartLoadingWorkspace) {
      onStartLoadingWorkspace(mode === "guest");
    } else {
      onNavigate("home");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerExitAnimation("account");
  };

  return (
    <main className="relative w-full h-screen overflow-hidden select-none pinboard-surface text-stone-100">
      {/* 3D Diorama with MeetMind Hero & Action Dock */}
      <OfficeDiorama
        onOpenRegister={() => {
          setModalMode("register");
          setShowModal(true);
        }}
        onEnterPinboard={() => {
          setModalMode("workspace");
          setShowModal(true);
        }}
      />

      {/* Account & Workspace Creation Window Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md transition-all animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#faf8f4] border border-[#d6cfc4] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] p-6 sm:p-7 overflow-hidden">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-5">
              {/* Modal Header */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-mono font-bold tracking-wider uppercase mb-2">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>{modalMode === "register" ? "New Account Setup" : "Workspace Access"}</span>
                  </div>
                  <h2 className="text-2xl font-black font-display text-neutral-900 tracking-tight leading-tight">
                    {modalMode === "register" ? "Create MeetMind Account" : "Enter MeetMind Workspace"}
                  </h2>
                  <p className="text-xs text-neutral-600 font-sans mt-1">
                    Set up your meeting intelligence agent or jump directly in for evaluation.
                  </p>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold font-mono text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Yash Deshmukh"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#d6cfc4] text-xs font-medium text-neutral-900 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 shadow-xs placeholder-stone-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold font-mono text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Work Email</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yash@meetmind.ai"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#d6cfc4] text-xs font-medium text-neutral-900 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 shadow-xs placeholder-stone-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold font-mono text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Team or Project</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Project Alpha // Core Platform"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#d6cfc4] text-xs font-medium text-neutral-900 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 shadow-xs placeholder-stone-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#22201e] hover:bg-black active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-1"
                  >
                    <span>{modalMode === "register" ? "Create Account & Enter Workspace" : "Launch Workspace"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-2">
                  <div className="w-full border-t border-stone-300" />
                  <span className="absolute bg-[#faf8f4] px-3 text-[10px] font-mono uppercase text-stone-500 font-bold tracking-wider">
                    Or Instant Access
                  </span>
                </div>

                {/* Guest Evaluation Option */}
                <button
                  type="button"
                  onClick={() => triggerExitAnimation("guest")}
                  className="w-full p-3.5 rounded-xl bg-amber-50 hover:bg-amber-100/90 border border-amber-300/90 active:scale-[0.98] transition-all shadow-xs cursor-pointer flex items-center justify-between text-left group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <span>Use Guest Mode for Evaluation</span>
                    </div>
                    <p className="text-[11px] text-amber-900/80 font-sans">
                      No sign-up required • Explore live diarization &amp; contradiction radar
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-amber-200/80 group-hover:bg-amber-300 flex items-center justify-center text-amber-950 transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
          </div>
        </div>
      )}
    </main>
  );
};
