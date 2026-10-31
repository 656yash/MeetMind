import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Volume2, Radio, Activity } from 'lucide-react'
import { Speaker } from '@/types'

interface AudioWaveformPlayerProps {
  waveformHeights: number[]
  duration: string
  speakers: Speaker[]
  activeSeconds: number
  onSeek: (seconds: number) => void
  isPlaying: boolean
  onTogglePlay: () => void
}

export const AudioWaveformPlayer: React.FC<AudioWaveformPlayerProps> = ({
  waveformHeights,
  duration,
  speakers,
  activeSeconds,
  onSeek,
  isPlaying,
  onTogglePlay
}) => {
  // Total duration in seconds (assume 38 mins = 2280s for calculation)
  const totalSeconds = 2280

  useEffect(() => {
    let interval: any
    if (isPlaying) {
      interval = setInterval(() => {
        onSeek((activeSeconds + 1) % totalSeconds)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, activeSeconds, onSeek])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progressPercent = Math.min(100, (activeSeconds / totalSeconds) * 100)

  return (
    <div className="p-4 rounded-2xl bg-[#0A1B2D] border border-[#1A3A5E] space-y-3 relative overflow-hidden">
      
      {/* Blueprint grid accent watermark */}
      <div className="absolute top-2 right-2 text-[9px] font-mono-tech text-[#38BDF8]/40 border border-[#38BDF8]/20 px-1 rounded">
        AUDIO_SAMPLER // 48kHz PCM
      </div>

      {/* Controls & Elapsed Time Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-xl bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#07121E] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          
          <button
            onClick={() => onSeek(0)}
            className="p-2 rounded-lg bg-[#07121E] hover:bg-[#1A3A5E] text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Restart playback"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-base font-bold text-white">
                {formatTime(activeSeconds)}
              </span>
              <span className="text-xs font-mono-tech text-slate-500">
                / {duration}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-[#2DD4BF]">
              <Radio className={`w-3 h-3 ${isPlaying ? 'animate-pulse' : ''}`} />
              <span>{isPlaying ? 'ACTIVE AUDIO STREAM' : 'PAUSED'}</span>
            </div>
          </div>
        </div>

        {/* Live Audio Activity Meter */}
        <div className="flex items-center gap-2 bg-[#07121E] px-3 py-1.5 rounded-lg border border-[#1A3A5E]">
          <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="text-[11px] font-mono-tech text-slate-300">
            CH: STEREO 24-BIT
          </span>
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Interactive Waveform Equalizer Display */}
      <div 
        className="h-20 bg-[#07121E] rounded-xl p-3 border border-[#1A3A5E] flex items-center gap-1 relative cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const clickX = e.clientX - rect.left
          const ratio = Math.max(0, Math.min(1, clickX / rect.width))
          onSeek(Math.floor(ratio * totalSeconds))
        }}
      >
        {/* Scrubber Playhead Line */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-[#38BDF8] z-20 shadow-[0_0_8px_#38BDF8] pointer-events-none transition-all duration-75"
          style={{ left: `${progressPercent}%` }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] -ml-1 -top-1 shadow-[0_0_6px_#38BDF8]"></div>
        </div>

        {/* Audio Wave Bars */}
        {waveformHeights.map((h, i) => {
          const barPercent = (i / waveformHeights.length) * 100
          const isPassed = barPercent <= progressPercent

          return (
            <div
              key={i}
              className="flex-1 flex flex-col justify-center items-center h-full"
            >
              <div
                className={`w-full rounded-full transition-all duration-150 ${
                  isPassed
                    ? 'bg-[#38BDF8] shadow-[0_0_4px_rgba(56,189,248,0.5)]'
                    : 'bg-[#1A3A5E] group-hover:bg-[#2A4E77]'
                }`}
                style={{ 
                  height: `${isPlaying ? Math.max(12, Math.min(100, h + (i % 2 === 0 ? Math.sin(activeSeconds + i) * 15 : -Math.cos(activeSeconds + i) * 12))) : h}%` 
                }}
              ></div>
            </div>
          )
        })}
      </div>

      {/* Speaker Distribution Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
          <span>Speaker Attribution Track</span>
          <span>4 Identified Voices</span>
        </div>
        <div className="flex h-2.5 rounded-full overflow-hidden bg-[#07121E] border border-[#1A3A5E]">
          <div className="bg-[#38BDF8] w-[35%]" title="Rahul Mehta (35%)"></div>
          <div className="bg-[#F5C84C] w-[25%]" title="Priya Sharma (25%)"></div>
          <div className="bg-[#2DD4BF] w-[20%]" title="Yash Deshmukh (20%)"></div>
          <div className="bg-[#B69BFF] w-[20%]" title="Sara Lin (20%)"></div>
        </div>

        {/* Speaker Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {speakers.map(s => (
            <div key={s.id} className="flex items-center gap-1.5 text-[10px] font-mono-tech bg-[#07121E] px-2 py-0.5 rounded border border-[#1A3A5E]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
              <span className="text-slate-300">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
