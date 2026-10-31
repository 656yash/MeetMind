import { Meeting, Decision, Conflict, TaskItem, WeeklyDigest } from '../types'

export const INITIAL_SPEAKERS = [
  { id: 'spk-1', name: 'Rahul Mehta', role: 'Founder & Brand Creative Director', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', color: '#38BDF8' },
  { id: 'spk-2', name: 'Priya Sharma', role: 'E-commerce & Influencer Marketing Lead', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80', color: '#F5C84C' },
  { id: 'spk-3', name: 'Yash Deshmukh', role: 'Supply Chain & Logistics Operations Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', color: '#2DD4BF' },
  { id: 'spk-4', name: 'Sara Lin', role: 'Head of Sourcing & Garment Quality QA', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', color: '#B69BFF' },
]

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-01',
    title: 'Winter Outerwear Production & Quality Freeze #42',
    project: 'Project Alpha // Winter Apparel Drop',
    date: 'Oct 28, 2026',
    time: '10:45 AM EST',
    duration: '38 min',
    summary: 'The team formally agreed to postpone the Winter Collection public drop to November 15 to allow warehouse QA seam stress testing and zipper durability inspection on the first 5,000 heavyweight wool coats.',
    status: 'confirmed',
    waveformHeights: [15, 30, 45, 20, 60, 85, 90, 40, 25, 55, 70, 95, 80, 50, 30, 65, 85, 45, 20, 75, 90, 65, 40, 80, 60, 35, 70, 90, 50, 25, 40, 60],
    speakers: INITIAL_SPEAKERS,
    transcript: [
      {
        id: 't-101',
        speakerId: 'spk-4',
        timestamp: '04:12',
        seconds: 252,
        text: "Looking at the batch inspection findings, the zipper pulls on our heavyweight wool coats failed seam stress testing under 25kg tension. We cannot greenlight November 10 without risking a 25% customer return rate.",
      },
      {
        id: 't-102',
        speakerId: 'spk-1',
        timestamp: '05:30',
        seconds: 330,
        text: "Understood Sara. Garment quality and brand reputation are non-negotiable. Let us officially push the Winter Collection drop date to November 15.",
        highlightType: 'decision',
        highlightLabel: 'Decision #D-024: Drop Moved to Nov 15 for QA'
      },
      {
        id: 't-103',
        speakerId: 'spk-3',
        timestamp: '06:15',
        seconds: 375,
        text: "That gives our 3PL warehouse team enough buffer to inspect all 5,000 units and palletize size runs from XS to XXL by Friday.",
        highlightType: 'action',
        highlightLabel: 'Task: Warehouse garment inspection & inventory count'
      },
      {
        id: 't-104',
        speakerId: 'spk-2',
        timestamp: '07:05',
        seconds: 425,
        text: "Understood. I will adjust our creator gifting schedule and tell our TikTok & Instagram launch partners to align with November 15.",
      }
    ]
  },
  {
    id: 'meet-02',
    title: 'Black Friday GTM & Influencer Early-Access Sync',
    project: 'Project Alpha // Winter Apparel Drop',
    date: 'Oct 31, 2026',
    time: '03:15 PM EST',
    duration: '29 min',
    summary: 'Marketing raised concern regarding pre-booked Black Friday TikTok creator placements and proposed reverting drop date back to Nov 10, conflicting with Oct 28 garment QA gate.',
    status: 'conflict_flagged',
    waveformHeights: [30, 40, 65, 85, 70, 50, 35, 90, 100, 85, 60, 40, 75, 95, 70, 45, 30, 80, 85, 90, 60, 40, 55, 85, 95, 65, 40, 50, 70, 85, 60, 30],
    speakers: [INITIAL_SPEAKERS[0], INITIAL_SPEAKERS[1], INITIAL_SPEAKERS[2]],
    transcript: [
      {
        id: 't-201',
        speakerId: 'spk-2',
        timestamp: '02:40',
        seconds: 160,
        text: "Team, TikTok Shop and our top 25 fashion creators have locked our Winter Outerwear campaign blast for November 10. If we delay to November 15, our ad CPMs double during peak Black Friday bidding.",
      },
      {
        id: 't-202',
        speakerId: 'spk-2',
        timestamp: '03:18',
        seconds: 198,
        text: "I propose we pull the drop back to November 10 and do spot-checks on customer returns as orders ship.",
        highlightType: 'contradiction',
        highlightLabel: 'CONTRADICTION DETECTED: Clashes with D-024 (Nov 15)'
      },
      {
        id: 't-203',
        speakerId: 'spk-3',
        timestamp: '04:02',
        seconds: 242,
        text: "Wait, on Tuesday Sara clearly warned us about zipper seam tear-outs on batch A. We cannot just ship defective outerwear to 5,000 customers without her QA signoff.",
      },
      {
        id: 't-204',
        speakerId: 'spk-1',
        timestamp: '04:45',
        seconds: 285,
        text: "Let us not override the Oct 28 fabric quality mandate unilaterally. MeetMind has flagged the contradiction for human review.",
      }
    ]
  },
  {
    id: 'meet-03',
    title: 'Supplier Sourcing & Sustainable Fabric Procurement',
    project: 'Sustainable Sourcing Initiative',
    date: 'Nov 02, 2026',
    time: '11:00 AM EST',
    duration: '44 min',
    summary: 'Sourcing team approved contracting Milan EcoWeave for 100% certified recycled wool blend at $24.50/meter, securing $18,000 margin savings while hitting OEKO-TEX eco-certifications.',
    status: 'confirmed',
    waveformHeights: [20, 35, 50, 70, 60, 45, 80, 65, 50, 75, 85, 90, 55, 35, 60, 80, 70, 50, 65, 85, 95, 60, 45, 70, 80, 60, 35, 50, 65, 80, 50, 30],
    speakers: [INITIAL_SPEAKERS[0], INITIAL_SPEAKERS[2], INITIAL_SPEAKERS[3]],
    transcript: [
      {
        id: 't-301',
        speakerId: 'spk-3',
        timestamp: '08:20',
        seconds: 500,
        text: "We benchmarked the Italian EcoWeave supplier against domestic synthetic suppliers. Securing 4,000 meters of OEKO-TEX certified wool blend saves us $18,000 in bulk margins while marketing zero-microplastic outerwear.",
      },
      {
        id: 't-302',
        speakerId: 'spk-1',
        timestamp: '09:40',
        seconds: 580,
        text: "Decision approved: We will proceed with Milan EcoWeave as our primary fabric partner for the 2026 Winter Collection.",
        highlightType: 'decision',
        highlightLabel: 'Decision #D-027: Contract Milan EcoWeave Fabric'
      }
    ]
  }
]

export const INITIAL_DECISIONS: Decision[] = [
  {
    id: 'dec-1',
    code: 'D-024',
    title: 'Winter Outerwear Drop Postponed to Nov 15 for Fabric QA',
    context: 'The creative & sourcing leads agreed to postpone drop from Nov 10 to Nov 15 to ensure warehouse QA resolves zipper seam tear issues on the 5,000 wool coats.',
    owner: 'Rahul Mehta',
    ownerRole: 'Founder & Brand Director',
    sourceMeetingId: 'meet-01',
    sourceMeetingTitle: 'Winter Outerwear Production & Quality Freeze #42',
    sourceTimestamp: '05:30',
    date: 'Oct 28, 2026',
    status: 'confirmed',
    confidence: 96,
    tags: ['Production', 'Quality QA', 'Outerwear', 'GTM'],
    evidenceQuote: "Understood Sara. Garment quality and brand reputation are non-negotiable. Let us officially push the Winter Collection drop date to November 15.",
    tasksGenerated: ['task-1', 'task-2', 'task-3'],
    rotationDeg: -1.2
  },
  {
    id: 'dec-2',
    code: 'D-025',
    title: 'Mandatory Human Signoff Before Syncing Wholesale POs',
    context: 'Strict compliance: AI inventory suggestions must pass human gate before pushing purchase orders to Shopify Plus, NetSuite, or 3PL warehouse systems.',
    owner: 'Yash Deshmukh',
    ownerRole: 'Logistics Lead',
    sourceMeetingId: 'meet-01',
    sourceMeetingTitle: 'Winter Outerwear Production & Quality Freeze #42',
    sourceTimestamp: '14:20',
    date: 'Oct 28, 2026',
    status: 'confirmed',
    confidence: 99,
    tags: ['Inventory', 'Governance', 'Wholesale'],
    evidenceQuote: "No automated agent should dispatch wholesale apparel purchase orders without human merchant verification.",
    tasksGenerated: ['task-4'],
    rotationDeg: 1.5
  },
  {
    id: 'dec-3',
    code: 'D-026',
    title: 'Reinforced Double-Stitch Seam Protocol for Heavy Outerwear',
    context: 'All outerwear coats exceeding 450 GSM must use bonded nylon thread with reinforced bar-tack stitching on stress points.',
    owner: 'Sara Lin',
    ownerRole: 'Head of Sourcing & QA',
    sourceMeetingId: 'meet-01',
    sourceMeetingTitle: 'Winter Outerwear Production & Quality Freeze #42',
    sourceTimestamp: '21:10',
    date: 'Oct 28, 2026',
    status: 'confirmed',
    confidence: 94,
    tags: ['Manufacturing', 'Garment QA', 'Seam Spec'],
    evidenceQuote: "All heavyweight outerwear seams must undergo 25kg tensile pull tests prior to distribution.",
    tasksGenerated: ['task-5'],
    rotationDeg: -0.8
  },
  {
    id: 'dec-4',
    code: 'D-027',
    title: 'Contract Milan EcoWeave for 100% Recycled Wool Fabric',
    context: 'Sourced OEKO-TEX certified recycled Italian wool blend, boosting gross profit margin to 68% per coat while upholding sustainability goals.',
    owner: 'Yash Deshmukh',
    ownerRole: 'Logistics Lead',
    sourceMeetingId: 'meet-03',
    sourceMeetingTitle: 'Supplier Sourcing & Sustainable Fabric Procurement',
    sourceTimestamp: '09:40',
    date: 'Nov 02, 2026',
    status: 'confirmed',
    confidence: 92,
    tags: ['Sourcing', 'Textiles', 'Sustainability'],
    evidenceQuote: "Decision approved: We will proceed with Milan EcoWeave as our primary fabric partner for the 2026 Winter Collection.",
    tasksGenerated: ['task-6'],
    rotationDeg: 1.8
  },
  {
    id: 'dec-5',
    code: 'D-028',
    title: 'Proposal: Revert Drop Date to Nov 10 for Black Friday Creator Blast',
    context: 'Marketing proposed pulling drop forward to capture pre-booked TikTok Shop placements. Contradicts D-024.',
    owner: 'Priya Sharma',
    ownerRole: 'Marketing Lead',
    sourceMeetingId: 'meet-02',
    sourceMeetingTitle: 'Black Friday GTM & Influencer Early-Access Sync',
    sourceTimestamp: '03:18',
    date: 'Oct 31, 2026',
    status: 'contested',
    confidence: 88,
    tags: ['Contested', 'GTM', 'TikTok Shop'],
    previousVersion: 'D-024',
    evidenceQuote: "I propose we pull the drop back to November 10 and do spot-checks on customer returns as orders ship.",
    tasksGenerated: [],
    rotationDeg: -2.0
  }
]

export const INITIAL_CONFLICTS: Conflict[] = [
  {
    id: 'conf-101',
    title: 'Winter Drop Discrepancy: Nov 15 (Confirmed) vs Nov 10 (Marketing Proposal)',
    severity: 'critical',
    status: 'active',
    confidenceScore: 94,
    historicalDecision: {
      decisionCode: 'D-024',
      title: 'Winter Outerwear Drop Postponed to Nov 15 for Fabric QA',
      meetingTitle: 'Winter Outerwear Production & Quality Freeze #42',
      date: 'Oct 28, 2026',
      timestamp: '05:30',
      owner: 'Rahul Mehta (Founder & Creative Director)',
      quote: "Garment quality and brand reputation are non-negotiable. Let us officially push the Winter Collection drop date to November 15."
    },
    newProposal: {
      meetingTitle: 'Black Friday GTM & Influencer Early-Access Sync',
      date: 'Oct 31, 2026',
      timestamp: '03:18',
      proposedBy: 'Priya Sharma (E-commerce Lead)',
      proposalTitle: 'Revert Drop to Nov 10 for TikTok Shop early blast',
      quote: "I propose we pull the drop back to November 10 and do spot-checks on customer returns as orders ship."
    },
    aiExplanation: 'Marketing proposal (Nov 10) contradicts ratified Decision D-024. Sara Lin explicitly identified zipper seam failure on Batch A coats on Oct 28. No quality clearance has been signed off. Launching on Nov 10 risks shipping defective garments and driving a >25% customer return rate.',
    recommendedAction: 'Maintain November 15 drop date or convene emergency review with Sara Lin (Head of Garment QA).'
  },
  {
    id: 'conf-102',
    title: 'Inventory Allocation: 60% D2C E-commerce vs 100% Wholesale Consignment',
    severity: 'warning',
    status: 'active',
    confidenceScore: 89,
    historicalDecision: {
      decisionCode: 'D-026',
      title: 'D2C Store Stock Reserve Allocation',
      meetingTitle: 'Winter Outerwear Production & Quality Freeze #42',
      date: 'Oct 28, 2026',
      timestamp: '21:10',
      owner: 'Sara Lin (Head of Sourcing)',
      quote: "At least 60% of Batch A must be reserved for direct-to-consumer web orders."
    },
    newProposal: {
      meetingTitle: 'Wholesale Partner Sync',
      date: 'Nov 01, 2026',
      timestamp: '16:05',
      proposedBy: 'Rahul Mehta',
      proposalTitle: 'Consign entire initial run to Nordstrom pop-ups',
      quote: "We should allocate the entire 5,000 coats to the flagship department store pop-ups."
    },
    aiExplanation: 'Contradicts direct-to-consumer store allocation agreed in earlier inventory planning call. Reallocating will leave online pre-orders stockout.',
    recommendedAction: 'Cap wholesale consignment at 40% until warehouse replenishment batch arrives.'
  }
]

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Audit Batch A zipper seam reinforcement & tensile stress test',
    description: 'Verify all 5,000 wool coats pass 25kg pull-test without stitch fraying before warehouse packing.',
    owner: 'Sara Lin',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    deadline: 'Nov 04, 2026',
    priority: 'CRITICAL',
    status: 'in_progress',
    sourceMeeting: 'Winter Outerwear Freeze #42',
    sourceTimestamp: '04:12',
    decisionRef: 'D-024',
    approved: true,
    syncTarget: 'Trello',
    synced: true
  },
  {
    id: 'task-2',
    title: 'Update marketing & creator launch schedule',
    description: 'Notify top 25 fashion creators and brand ambassadors of revised 5-day drop date.',
    owner: 'Priya Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    deadline: 'Nov 10, 2026',
    priority: 'HIGH',
    status: 'todo',
    sourceMeeting: 'Winter Outerwear Freeze #42',
    sourceTimestamp: '07:05',
    decisionRef: 'D-024',
    approved: true,
    syncTarget: 'Google Tasks',
    synced: true
  },
  {
    id: 'task-3',
    title: 'Warehouse garment inspection & inventory count',
    description: 'Audit SKU barcode labels and inventory count in Shopify Plus ahead of order rush.',
    owner: 'Yash Deshmukh',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    deadline: 'Nov 07, 2026',
    priority: 'HIGH',
    status: 'todo',
    sourceMeeting: 'Winter Outerwear Freeze #42',
    sourceTimestamp: '06:15',
    decisionRef: 'D-024',
    approved: true,
    syncTarget: 'Notion',
    synced: false
  },
  {
    id: 'task-4',
    title: 'Set up Human Approval Gate for wholesale PO dispatch',
    description: 'Ensure zero automated supplier POs trigger without manual review by merchant manager.',
    owner: 'Yash Deshmukh',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    deadline: 'Nov 02, 2026',
    priority: 'CRITICAL',
    status: 'done',
    sourceMeeting: 'Winter Outerwear Freeze #42',
    sourceTimestamp: '14:20',
    decisionRef: 'D-025',
    approved: true,
    syncTarget: 'Trello',
    synced: true
  },
  {
    id: 'task-5',
    title: 'Finalize Milan EcoWeave fabric supplier contract & customs bond',
    description: 'Lock in delivery schedule for 4,000 meters of OEKO-TEX certified Italian wool blend.',
    owner: 'Yash Deshmukh',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    deadline: 'Nov 06, 2026',
    priority: 'MEDIUM',
    status: 'in_progress',
    sourceMeeting: 'Supplier Sourcing Sync',
    sourceTimestamp: '09:40',
    decisionRef: 'D-027',
    approved: true,
    syncTarget: 'Trello',
    synced: true
  },
  {
    id: 'task-6',
    title: 'Inspect eco-friendly hangtags and recycled packaging',
    description: 'Ensure all shipped outerwear arrives with brand-standard sustainable unboxing presentation.',
    owner: 'Sara Lin',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    deadline: 'Nov 01, 2026',
    priority: 'HIGH',
    status: 'done',
    sourceMeeting: 'Winter Outerwear Freeze #42',
    sourceTimestamp: '21:10',
    decisionRef: 'D-026',
    approved: true,
    syncTarget: 'Google Tasks',
    synced: true
  }
]

export const INITIAL_DIGEST: WeeklyDigest = {
  weekTitle: 'Weekly Apparel Executive Digest #44',
  dateRange: 'Oct 26 – Nov 01, 2026',
  completedTasks: 8,
  totalTasks: 12,
  pendingApprovals: 2,
  activeConflicts: 1,
  highlights: [
    '3 Production & GTM Meetings processed across 111 minutes of audio',
    '4 Binding Collection Decisions ratified with 94%+ AI confidence',
    '1 Critical Drop Date Contradiction detected & flagged before fulfillment disaster',
    'Milan EcoWeave fabric partnership locked, securing $18k in gross margin savings'
  ],
  changedDecisions: [
    {
      decision: 'Winter Outerwear Drop Date Revision',
      from: 'November 10',
      to: 'November 15',
      rationale: 'Required 5-day quality buffer for zipper seam stress testing by Sara Lin.',
      impact: 'Prevented shipping 5,000 defective coats and avoided an estimated $65,000 in return logistics costs.'
    }
  ],
  nextWeekPriorities: [
    'Resolve active Conflict #conf-101 (TikTok Shop early drop vs Garment QA signoff)',
    'Run final warehouse barcode palletizing audit with Yash Deshmukh',
    'Obtain merchant signoff on external Shopify Plus sync for task #task-3',
    'Conduct final press lookbook review before launch on Nov 12'
  ],
  handwrittenVerdict: "Fulfillment momentum is rock solid. Postponing the drop to Nov 15 was the right brand quality call—do NOT let marketing rush uninspected coats into customer hands without Sara's stamp."
}
