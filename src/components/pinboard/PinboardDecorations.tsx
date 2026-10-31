import React from 'react'

// Realistic Pushpin with 3D specular highlight and drop shadow
export const PushPin: React.FC<{
  color?: 'red' | 'cyan' | 'gold' | 'silver' | 'green'
  className?: string
}> = ({ color = 'red', className = '' }) => {
  const colorMap = {
    red: { head: '#ef4444', ring: '#dc2626', shadow: '#7f1d1d' },
    cyan: { head: '#06b6d4', ring: '#0891b2', shadow: '#164e63' },
    gold: { head: '#f59e0b', ring: '#d97706', shadow: '#78350f' },
    silver: { head: '#94a3b8', ring: '#64748b', shadow: '#334155' },
    green: { head: '#10b981', ring: '#059669', shadow: '#064e3b' },
  }

  const c = colorMap[color]

  return (
    <div className={`absolute z-30 pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="drop-shadow-md">
        {/* Needle shadow */}
        <path d="M12 18L10 27L14 27Z" fill="rgba(0,0,0,0.3)" />
        {/* Needle metal */}
        <path d="M12 15L12 25" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        {/* Pin base ring */}
        <ellipse cx="12" cy="14" rx="6" ry="3" fill={c.ring} />
        {/* Pin cone body */}
        <path d="M8 8L6 14H18L16 8Z" fill={c.ring} />
        {/* Pin round top head */}
        <circle cx="12" cy="8" r="6" fill={c.head} />
        {/* Specular highlight */}
        <ellipse cx="10" cy="6" rx="2.5" ry="1.5" fill="white" fillOpacity="0.75" />
      </svg>
    </div>
  )
}

// Masking / Scotch Tape Strip
export const Tape: React.FC<{
  position?: 'top' | 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left' | 'center'
  angle?: string
  width?: string
  className?: string
}> = ({ position = 'top', angle = '-2deg', width = 'w-24', className = '' }) => {
  const positionClasses = {
    'top': '-top-3 left-1/2 -translate-x-1/2',
    'top-left': '-top-3 -left-4',
    'top-right': '-top-3 -right-4',
    'bottom-right': '-bottom-3 -right-4',
    'bottom-left': '-bottom-3 -left-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }[position]

  return (
    <div
      className={`absolute z-20 h-6 ${width} masking-tape ${positionClasses} ${className}`}
      style={{ transform: `rotate(${angle})` }}
      aria-hidden="true"
    />
  )
}

// Foldback Binder Clip (Standard)
export const BinderClip: React.FC<{ className?: string; rotation?: string }> = ({
  className = '',
  rotation = 'rotate-0',
}) => (
  <div className={`absolute z-30 select-none pointer-events-none ${rotation} ${className}`} aria-hidden="true">
    <svg width="46" height="42" viewBox="0 0 46 42" fill="none" className="drop-shadow-lg">
      <path
        d="M17 12V4C17 2.34315 18.3431 1 20 1H26C27.6569 1 29 2.34315 29 4V12"
        stroke="#cbd5e1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M15 12V7C15 5.89543 15.8954 5 17 5H29C30.1046 5 31 5.89543 31 7V12"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <polygon points="6,12 40,12 44,38 2,38" fill="#1e293b" />
      <rect x="5" y="36" width="36" height="4" rx="1" fill="#cbd5e1" />
      <line x1="8" y1="14" x2="38" y2="14" stroke="#475569" strokeWidth="1.5" />
    </svg>
  </div>
)

// Left Edge Binder Clip (Clamped on left paper edge with handles facing left)
export const LeftEdgeBinderClip: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute z-30 select-none pointer-events-none ${className}`} aria-hidden="true">
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" className="drop-shadow-xl">
      {/* Upper silver wire handle */}
      <path
        d="M16 14L4 18C1.5 19 1.5 22 4 23L16 27"
        stroke="#cbd5e1"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower silver wire handle */}
      <path
        d="M16 25L4 29C1.5 30 1.5 33 4 34L16 38"
        stroke="#cbd5e1"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Upper wire inner chrome */}
      <path
        d="M16 15L5 19C3.5 19.5 3.5 21.5 5 22L16 26"
        stroke="#94a3b8"
        strokeWidth="1.6"
      />
      {/* Black clamp body on paper edge */}
      <rect x="14" y="10" width="24" height="32" rx="2" fill="#1e293b" />
      {/* Chrome lip on right */}
      <rect x="36" y="10" width="4" height="32" rx="1" fill="#94a3b8" />
      {/* Clamp metal highlight */}
      <line x1="16" y1="12" x2="16" y2="40" stroke="#475569" strokeWidth="1.5" />
    </svg>
  </div>
)



// Paper Star Cutout
export const StarCutout: React.FC<{
  size?: number
  rotation?: string
  className?: string
}> = ({ size = 32, rotation = 'rotate-6', className = '' }) => (
  <div className={`select-none pointer-events-none inline-block drop-shadow-md ${rotation} ${className}`} aria-hidden="true">
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L14.8 8.6L22 9.3L16.6 14.1L18.2 21.2L12 17.5L5.8 21.2L7.4 14.1L2 9.3L9.2 8.6L12 2Z"
        fill="#faf6e9"
        stroke="#d6cbab"
        strokeWidth="0.8"
        strokeDasharray="1.2 1"
      />
    </svg>
  </div>
)

// PaperClip (Realistic silver wire paperclip)
export const PaperClip: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute z-30 pointer-events-none select-none ${className}`} aria-hidden="true">
    <svg width="24" height="46" viewBox="0 0 24 46" fill="none" className="drop-shadow-md">
      <path
        d="M7 16V36C7 39.3137 9.68629 42 13 42C16.3137 42 19 39.3137 19 36V9C19 5.68629 16.3137 3 13 3C9.68629 3 7 5.68629 7 9V32C7 33.6569 8.34315 35 10 35C11.6569 35 13 33.6569 13 32V14"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M7 16V36C7 39.3137 9.68629 42 13 42C16.3137 42 19 39.3137 19 36V9C19 5.68629 16.3137 3 13 3C9.68629 3 7 5.68629 7 9V32C7 33.6569 8.34315 35 10 35C11.6569 35 13 33.6569 13 32V14"
        stroke="#f1f5f9"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  </div>
)

// Hand-drawn spark bursts doodle (e.g., \ | /)
export const SparkDoodle: React.FC<{ color?: string; className?: string }> = ({
  color = '#facc15',
  className = '',
}) => (
  <div className={`absolute z-20 pointer-events-none select-none ${className}`} aria-hidden="true">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4V10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M6 8L10 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 8L18 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
)

// Hand-drawn curved arrow
export const HandDrawnArrow: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#10b981',
}) => (
  <div className={`absolute z-20 pointer-events-none select-none ${className}`} aria-hidden="true">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path
        d="M12 40C12 28 18 16 32 14"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1 0"
      />
      <path
        d="M26 8L34 14L28 22"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

// Tactile Chiclet Keyboard Cutout
export const ChicletKeyboard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`paper-sheet bg-[#e7eaed] p-2.5 rounded-xl border border-[#cbd5e1] drop-shadow-2xl select-none ${className}`}
      aria-hidden="true"
    >
      <div className="flex flex-col gap-1 w-44">
        <div className="flex gap-1 justify-between">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-2 w-3.5 bg-white rounded-xs shadow-xs" />
          ))}
        </div>
        <div className="flex gap-1 justify-between">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-3 w-4 bg-white rounded-xs shadow-xs" />
          ))}
        </div>
        <div className="flex gap-1 justify-between">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-3 w-4 bg-white rounded-xs shadow-xs" />
          ))}
        </div>
        <div className="flex gap-1 items-center justify-between">
          <div className="h-3 w-4 bg-white rounded-xs shadow-xs" />
          <div className="h-3 w-20 bg-white rounded-xs shadow-xs" />
          <div className="h-3 w-4 bg-white rounded-xs shadow-xs" />
        </div>
      </div>
    </div>
  )
}

