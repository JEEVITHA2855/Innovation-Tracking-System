import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Lightbulb, Search, BarChart3, Shield, ArrowRight, Sparkles, CheckCircle, Users } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Lightbulb,
      title: 'Idea Submission',
      description: 'Submit innovative ideas with detailed descriptions, expected impact, and domain classification.',
      color: 'text-yellow-500',
      bg: 'bg-yellow-50'
    },
    {
      icon: Search,
      title: 'Review & Evaluation',
      description: 'Expert reviewers score ideas on innovation, feasibility, and impact with detailed feedback.',
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Track trends, domain distributions, approval rates, and top-performing innovations.',
      color: 'text-green-500',
      bg: 'bg-green-50'
    }
  ]

  const stats = [
    { label: 'Ideas Submitted', value: '500+' },
    { label: 'Innovations Approved', value: '120+' },
    { label: 'Active Reviewers', value: '25+' },
    { label: 'Departments', value: '10+' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Navigation */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">InnoTrack</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#stats" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Impact</a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-5 py-2 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Innovation Management Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Turn Bold Ideas Into
              <span className="text-primary-600"> Real Impact</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              A centralized platform to submit, review, and track innovative ideas across your organization. 
              Empowering teams to drive meaningful change through structured innovation management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-white text-gray-700 px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-primary-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Innovation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From idea submission to approval, our platform covers every step of the innovation lifecycle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className={`${feature.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple, structured, and transparent innovation workflow.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Submit', desc: 'Innovators submit ideas with details and domain classification', icon: Lightbulb },
              { step: '02', title: 'Assign', desc: 'Admins assign expert reviewers based on domain expertise', icon: Users },
              { step: '03', title: 'Review', desc: 'Reviewers evaluate and score ideas on key criteria', icon: CheckCircle },
              { step: '04', title: 'Track', desc: 'Monitor progress, view analytics, and drive implementation', icon: BarChart3 },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="text-center">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <Icon className="w-7 h-7 text-primary-600" />
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Every Role</h2>
            <p className="text-lg text-gray-600">Tailored dashboards and workflows for innovators, reviewers, and administrators.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                role: 'Innovator',
                desc: 'Submit ideas, track their progress through the review pipeline, and receive expert feedback.',
                color: 'bg-blue-600',
                features: ['Submit new ideas', 'Track idea status', 'View reviewer feedback']
              },
              {
                role: 'Reviewer',
                desc: 'Evaluate assigned ideas with structured scoring on innovation, feasibility, and impact.',
                color: 'bg-green-600',
                features: ['Score ideas (1-10)', 'Provide detailed feedback', 'Approve or request changes']
              },
              {
                role: 'Admin',
                desc: 'Oversee the entire innovation pipeline with analytics, reviewer management, and reporting.',
                color: 'bg-purple-600',
                features: ['View all ideas', 'Assign reviewers', 'Analytics dashboard']
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className={`${item.color} text-white text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4`}>
                  {item.role}
                </div>
                <p className="text-gray-600 mb-6">{item.desc}</p>
                <ul className="space-y-3">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Innovate?</h2>
          <p className="text-primary-100 text-lg mb-8">
            Join your organization's innovation platform and start making an impact today.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-primary-600 px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-primary-50 transition-colors"
          >
            Create Your Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">InnoTrack</span>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} Innovation Tracking System. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
