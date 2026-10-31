export interface Speaker {
  id: string
  name: string
  role: string
  avatar: string
  color: string
}

export interface TranscriptSnippet {
  id: string
  speakerId: string
  timestamp: string
  seconds: number
  text: string
  highlightType?: 'decision' | 'action' | 'contradiction'
  highlightLabel?: string
}

export interface Meeting {
  id: string
  title: string
  project: string
  date: string
  time: string
  duration: string
  audioUrl?: string
  speakers: Speaker[]
  transcript: TranscriptSnippet[]
  waveformHeights: number[]
  summary: string
  status: 'confirmed' | 'conflict_flagged' | 'draft'
}

export interface Decision {
  id: string
  code: string // e.g. "D-024"
  title: string
  context: string
  owner: string
  ownerRole: string
  sourceMeetingId: string
  sourceMeetingTitle: string
  sourceTimestamp: string
  date: string
  status: 'confirmed' | 'superseded' | 'contested' | 'pending_approval'
  confidence: number
  tags: string[]
  previousVersion?: string
  supersededBy?: string
  evidenceQuote: string
  tasksGenerated: string[]
  rotationDeg?: number
}

export interface Conflict {
  id: string
  title: string
  severity: 'critical' | 'warning' | 'advisory'
  status: 'active' | 'resolved' | 'dismissed'
  historicalDecision: {
    decisionCode: string
    title: string
    meetingTitle: string
    date: string
    timestamp: string
    owner: string
    quote: string
  }
  newProposal: {
    meetingTitle: string
    date: string
    timestamp: string
    proposedBy: string
    proposalTitle: string
    quote: string
  }
  aiExplanation: string
  confidenceScore: number
  recommendedAction: string
  resolutionAction?: 'kept_historical' | 'adopted_proposal' | 'scheduled_review'
}

export interface TaskItem {
  id: string
  title: string
  description: string
  owner: string
  ownerAvatar: string
  deadline: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'todo' | 'in_progress' | 'done'
  sourceMeeting: string
  sourceTimestamp: string
  decisionRef: string
  approved: boolean
  syncTarget: 'Trello' | 'Google Tasks' | 'Notion' | 'Slack' | 'Jira' | 'GitHub'
  synced: boolean
  integrationIssueKey?: string
  lastReminderSent?: string
}

export interface WeeklyDigest {
  weekTitle: string
  dateRange: string
  completedTasks: number
  totalTasks: number
  pendingApprovals: number
  activeConflicts: number
  highlights: string[]
  changedDecisions: {
    decision: string
    from: string
    to: string
    rationale: string
    impact: string
  }[]
  nextWeekPriorities: string[]
  handwrittenVerdict: string
}
