// Mock data for ideas
export const mockIdeas = [
  {
    id: 1,
    title: 'AI-Powered Code Review Assistant',
    problemStatement: 'Manual code reviews are time-consuming and prone to human oversight.',
    proposedSolution: 'Develop an AI assistant that automatically reviews code for bugs, performance issues, and best practices.',
    domain: 'AI',
    expectedImpact: 'Reduce code review time by 60% and improve code quality significantly.',
    status: 'Approved',
    innovatorId: 1,
    innovatorName: 'Alice Johnson',
    submittedDate: '2026-01-15',
    reviewerId: 1,
    reviewerName: 'Dr. Sarah Miller',
    scores: {
      innovation: 9,
      feasibility: 8,
      impact: 9
    },
    feedback: 'Excellent idea with strong practical applications. Well thought out solution.',
    attachments: []
  },
  {
    id: 2,
    title: 'Blockchain-Based Supply Chain',
    problemStatement: 'Current supply chains lack transparency and are vulnerable to fraud.',
    proposedSolution: 'Implement a blockchain system to track products from manufacture to delivery.',
    domain: 'FinTech',
    expectedImpact: 'Increase supply chain transparency by 80% and reduce fraud cases.',
    status: 'Under Review',
    innovatorId: 2,
    innovatorName: 'Bob Smith',
    submittedDate: '2026-01-20',
    reviewerId: 2,
    reviewerName: 'Prof. John Davis',
    scores: null,
    feedback: null,
    attachments: []
  },
  {
    id: 3,
    title: 'Telemedicine Platform for Rural Areas',
    problemStatement: 'Rural areas have limited access to healthcare professionals.',
    proposedSolution: 'Create a mobile-first telemedicine platform with AI-assisted diagnosis.',
    domain: 'Healthcare',
    expectedImpact: 'Provide healthcare access to 50,000+ rural residents.',
    status: 'Needs Improvement',
    innovatorId: 3,
    innovatorName: 'Carol White',
    submittedDate: '2026-01-10',
    reviewerId: 1,
    reviewerName: 'Dr. Sarah Miller',
    scores: {
      innovation: 7,
      feasibility: 6,
      impact: 8
    },
    feedback: 'Good concept but needs more detail on implementation and regulatory compliance.',
    attachments: []
  },
  {
    id: 4,
    title: 'Smart Campus Energy Management',
    problemStatement: 'University campuses waste significant energy due to inefficient management.',
    proposedSolution: 'IoT-based system to monitor and optimize energy usage across campus buildings.',
    domain: 'Sustainability',
    expectedImpact: 'Reduce campus energy consumption by 30% and save $200K annually.',
    status: 'Submitted',
    innovatorId: 4,
    innovatorName: 'David Brown',
    submittedDate: '2026-02-01',
    reviewerId: null,
    reviewerName: null,
    scores: null,
    feedback: null,
    attachments: []
  },
  {
    id: 5,
    title: 'Personalized Learning Platform',
    problemStatement: 'One-size-fits-all education doesn\'t work for diverse learning styles.',
    proposedSolution: 'AI-driven platform that adapts content and pace to individual student needs.',
    domain: 'Web',
    expectedImpact: 'Improve student engagement by 45% and learning outcomes by 25%.',
    status: 'Approved',
    innovatorId: 5,
    innovatorName: 'Emma Wilson',
    submittedDate: '2026-01-25',
    reviewerId: 2,
    reviewerName: 'Prof. John Davis',
    scores: {
      innovation: 8,
      feasibility: 9,
      impact: 8
    },
    feedback: 'Very practical and well-researched. Ready for implementation.',
    attachments: []
  },
  {
    id: 6,
    title: 'Waste Segregation AI Robot',
    problemStatement: 'Manual waste segregation is inefficient and often incorrect.',
    proposedSolution: 'Autonomous robot using computer vision to identify and sort waste automatically.',
    domain: 'Sustainability',
    expectedImpact: 'Improve waste sorting accuracy to 95% and reduce manual labor.',
    status: 'Submitted',
    innovatorId: 1,
    innovatorName: 'Alice Johnson',
    submittedDate: '2026-02-05',
    reviewerId: null,
    reviewerName: null,
    scores: null,
    feedback: null,
    attachments: []
  },
  {
    id: 7,
    title: 'Mental Health Chatbot',
    problemStatement: 'Students lack immediate access to mental health support.',
    proposedSolution: 'AI chatbot providing 24/7 initial mental health screening and resources.',
    domain: 'Healthcare',
    expectedImpact: 'Provide immediate support to 1000+ students monthly.',
    status: 'Under Review',
    innovatorId: 2,
    innovatorName: 'Bob Smith',
    submittedDate: '2026-02-08',
    reviewerId: 1,
    reviewerName: 'Dr. Sarah Miller',
    scores: null,
    feedback: null,
    attachments: []
  },
  {
    id: 8,
    title: 'Decentralized Academic Credentials',
    problemStatement: 'Academic credentials are easy to forge and hard to verify.',
    proposedSolution: 'Blockchain-based system for issuing and verifying academic certificates.',
    domain: 'FinTech',
    expectedImpact: 'Eliminate credential fraud and enable instant verification globally.',
    status: 'Rejected',
    innovatorId: 3,
    innovatorName: 'Carol White',
    submittedDate: '2026-01-18',
    reviewerId: 2,
    reviewerName: 'Prof. John Davis',
    scores: {
      innovation: 6,
      feasibility: 4,
      impact: 7
    },
    feedback: 'Interesting concept but current implementation plan is not feasible with available resources.',
    attachments: []
  }
]

// Mock users data
export const mockUsers = [
  { id: 1, name: 'Alice Johnson', role: 'innovator', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', role: 'innovator', email: 'bob@example.com' },
  { id: 3, name: 'Carol White', role: 'innovator', email: 'carol@example.com' },
  { id: 4, name: 'David Brown', role: 'innovator', email: 'david@example.com' },
  { id: 5, name: 'Emma Wilson', role: 'innovator', email: 'emma@example.com' },
  { id: 6, name: 'Dr. Sarah Miller', role: 'reviewer', email: 'sarah.m@example.com' },
  { id: 7, name: 'Prof. John Davis', role: 'reviewer', email: 'john.d@example.com' },
  { id: 8, name: 'Admin User', role: 'admin', email: 'admin@example.com' }
]

// Mock reviewers for assignment
export const mockReviewers = [
  { id: 1, name: 'Dr. Sarah Miller', expertise: ['AI', 'Healthcare', 'Web'] },
  { id: 2, name: 'Prof. John Davis', expertise: ['FinTech', 'Sustainability', 'Web'] },
  { id: 3, name: 'Dr. Emily Chen', expertise: ['Healthcare', 'AI'] },
  { id: 4, name: 'Prof. Michael Brown', expertise: ['Sustainability', 'FinTech'] }
]

// Innovation domains
export const innovationDomains = [
  'AI',
  'Web',
  'FinTech',
  'Healthcare',
  'Sustainability',
  'IoT',
  'Data Science',
  'Cybersecurity',
  'EdTech',
  'Other'
]

// Status options
export const statusOptions = [
  'Submitted',
  'Under Review',
  'Needs Improvement',
  'Approved',
  'Rejected'
]
