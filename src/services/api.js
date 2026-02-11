import { mockIdeas, mockUsers, mockReviewers } from '../mock/data'

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Local storage keys
const STORAGE_KEYS = {
  IDEAS: 'innovation_ideas',
  USERS: 'innovation_users',
  CURRENT_USER: 'current_user'
}

// Initialize data in localStorage if not exists
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.IDEAS)) {
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(mockIdeas))
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers))
  }
}

// Ideas Service
export const ideasService = {
  // Get all ideas
  async getAll() {
    await delay()
    initializeStorage()
    const ideas = JSON.parse(localStorage.getItem(STORAGE_KEYS.IDEAS) || '[]')
    return ideas
  },

  // Get idea by ID
  async getById(id) {
    await delay()
    const ideas = await this.getAll()
    return ideas.find(idea => idea.id === parseInt(id))
  },

  // Get ideas by innovator ID
  async getByInnovator(innovatorId) {
    await delay()
    const ideas = await this.getAll()
    return ideas.filter(idea => idea.innovatorId === innovatorId)
  },

  // Get ideas assigned to reviewer
  async getByReviewer(reviewerId) {
    await delay()
    const ideas = await this.getAll()
    return ideas.filter(idea => idea.reviewerId === reviewerId)
  },

  // Create new idea
  async create(ideaData) {
    await delay()
    const ideas = await this.getAll()
    const newIdea = {
      ...ideaData,
      id: Math.max(...ideas.map(i => i.id), 0) + 1,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      scores: null,
      feedback: null,
      reviewerId: null,
      reviewerName: null
    }
    ideas.push(newIdea)
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas))
    return newIdea
  },

  // Update idea
  async update(id, updates) {
    await delay()
    const ideas = await this.getAll()
    const index = ideas.findIndex(idea => idea.id === parseInt(id))
    if (index !== -1) {
      ideas[index] = { ...ideas[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas))
      return ideas[index]
    }
    throw new Error('Idea not found')
  },

  // Submit review
  async submitReview(id, reviewData) {
    await delay()
    const ideas = await this.getAll()
    const index = ideas.findIndex(idea => idea.id === parseInt(id))
    if (index !== -1) {
      ideas[index] = {
        ...ideas[index],
        scores: reviewData.scores,
        feedback: reviewData.feedback,
        status: reviewData.status
      }
      localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas))
      return ideas[index]
    }
    throw new Error('Idea not found')
  },

  // Assign reviewer
  async assignReviewer(ideaId, reviewerId) {
    await delay()
    const ideas = await this.getAll()
    const reviewer = mockReviewers.find(r => r.id === reviewerId)
    const index = ideas.findIndex(idea => idea.id === parseInt(ideaId))
    
    if (index !== -1 && reviewer) {
      ideas[index].reviewerId = reviewerId
      ideas[index].reviewerName = reviewer.name
      if (ideas[index].status === 'Submitted') {
        ideas[index].status = 'Under Review'
      }
      localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas))
      return ideas[index]
    }
    throw new Error('Idea or reviewer not found')
  },

  // Get statistics
  async getStats() {
    await delay()
    const ideas = await this.getAll()
    
    const stats = {
      total: ideas.length,
      submitted: ideas.filter(i => i.status === 'Submitted').length,
      underReview: ideas.filter(i => i.status === 'Under Review').length,
      approved: ideas.filter(i => i.status === 'Approved').length,
      rejected: ideas.filter(i => i.status === 'Rejected').length,
      needsImprovement: ideas.filter(i => i.status === 'Needs Improvement').length,
      byDomain: {}
    }

    // Count by domain
    ideas.forEach(idea => {
      stats.byDomain[idea.domain] = (stats.byDomain[idea.domain] || 0) + 1
    })

    return stats
  }
}

// Reviewers Service
export const reviewersService = {
  async getAll() {
    await delay()
    return mockReviewers
  },

  async getById(id) {
    await delay()
    return mockReviewers.find(r => r.id === id)
  }
}

// Users Service
export const usersService = {
  async getAll() {
    await delay()
    initializeStorage()
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
  },

  async getById(id) {
    await delay()
    const users = await this.getAll()
    return users.find(u => u.id === id)
  }
}
