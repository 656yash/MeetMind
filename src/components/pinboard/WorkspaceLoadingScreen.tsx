"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Sparkles, CheckCircle2, ShieldCheck, Database, Cpu } from "lucide-react";
import confetti from "canvas-confetti";

interface WorkspaceLoadingScreenProps {
  onComplete: () => void;
  guestMode?: boolean;
}

export const WorkspaceLoadingScreen: React.FC<WorkspaceLoadingScreenProps> = ({
  onComplete,
  guestMode = false,
}) => {
  const [progress, setProgress] = useState(15);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { label: guestMode ? "Initializing Guest Evaluation Session..." : "Registering Workspace Credentials...", icon: ShieldCheck },
    { label: "Connecting Persistent Cross-Meeting Memory...", icon: Database },
    { label: "Indexing Diarized Transcripts & Decisions...", icon: Cpu },
    { label: "Calibrating Contradiction Radar Engine...", icon: Sparkles },
    { label: "Workspace Ready! Launching Pinboard...", icon: CheckCircle2 },
  ];

  useEffect(() => {
    // Stage 1
    const t1 = setTimeout(() => {
      setProgress(38);
      setStepIndex(1);
    }, 350);

    // Stage 2
    const t2 = setTimeout(() => {
      setProgress(68);
      setStepIndex(2);
    }, 750);

    // Stage 3
    const t3 = setTimeout(() => {
      setProgress(90);
      setStepIndex(3);
    }, 1200);

    // Stage 4
    const t4 = setTimeout(() => {
      setProgress(100);
      setStepIndex(4);
    }, 1600);

    // Complete & Move to Home
    const t5 = setTimeout(() => {
      try {
        confetti.reset();
      } catch {}
      onComplete();
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  const CurrentIcon = steps[stepIndex].icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#152e20] text-[#f7fae8] select-none p-6 overflow-hidden">
      {/* Background Cutting-Mat Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(226, 238, 178, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(226, 238, 178, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Center Card */}
      <div className="relative z-10 w-full max-w-md bg-[#193826]/90 backdrop-blur-xl border border-[#2d5f44] rounded-2xl shadow-2xl p-7 sm:p-8 flex flex-col items-center text-center space-y-6 animate-fadeIn">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-display font-black text-xl tracking-tight text-white">
            MEETMIND
          </span>
          <span className="font-mono-code text-[10px] text-emerald-300 font-bold bg-[#12281c] px-2 py-0.5 rounded-full border border-emerald-500/30">
            {guestMode ? "EVALUATION MODE" : "WORKSPACE"}
          </span>
        </div>

        {/* Standard Spinner & Status Icon */}
        <div className="relative flex items-center justify-center my-2">
          {/* Dual Ring Spinner */}
          <div className="w-20 h-20 rounded-full border-4 border-emerald-950 border-t-emerald-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <CurrentIcon className="w-7 h-7 text-emerald-300 transition-all duration-300" />
          </div>
        </div>

        {/* Status Stage Text & Progress Bar */}
        <div className="space-y-1.5 w-full">
          <div className="flex items-center justify-between text-xs font-mono-code text-emerald-200/90 font-medium px-1">
            <span className="truncate max-w-[280px] text-left">{steps[stepIndex].label}</span>
            <span className="font-bold text-emerald-400">{progress}%</span>
          </div>

          {/* Standard Progress Bar */}
          <div className="w-full h-2.5 bg-[#0f2418] rounded-full overflow-hidden border border-emerald-900/60 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(52,211,153,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checklist Steps */}
        <div className="w-full pt-1 space-y-1.5 text-left font-mono-code text-[11px] border-t border-[#2d5f44]/60">
          {steps.slice(0, 4).map((step, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-2 transition-colors ${
                idx < stepIndex 
                  ? "text-emerald-400" 
                  : idx === stepIndex 
                  ? "text-white font-bold" 
                  : "text-stone-500 opacity-60"
              }`}
            >
              {idx < stepIndex ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : idx === stepIndex ? (
                <Loader2 className="w-3.5 h-3.5 text-emerald-300 animate-spin shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-stone-600 shrink-0" />
              )}
              <span className="truncate">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Footer Tagline */}
        <p className="text-[11px] font-sans text-stone-300/80 tracking-wide pt-1">
          Stop discussing. Start doing.
        </p>
      </div>
    </div>
  );
};
