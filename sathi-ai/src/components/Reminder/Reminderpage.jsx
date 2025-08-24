import React, { useState, useEffect } from 'react';

/**
 * TipsPage.jsx - Smart Tips Dashboard
 * - Current Date: 2025-08-24 08:24:32
 * - Current User: PraTha830
 * - Features: Context-aware tips, categories, search, progress tracking
 */

const theme = {
  mint: '#00D4AA',
  deepMint: '#00B389',
  cardBg: 'rgba(255,255,255,0.04)',
  softText: '#A7B1C2',
  accent: '#7EE7C7',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6'
};

// Comprehensive tips database
const tipsDatabase = [
  // Academic Success
  {
    id: 'academic-1',
    title: 'Pomodoro Technique for Focused Study',
    category: 'academic',
    difficulty: 'beginner',
    timeToComplete: '25 minutes',
    description: 'Use 25-minute focused study sessions with 5-minute breaks to maximize productivity.',
    steps: [
      'Set a timer for 25 minutes',
      'Focus on one task completely',
      'Take a 5-minute break',
      'Repeat 3-4 cycles, then take longer break'
    ],
    relevantFor: ['F1', 'OPT'],
    careerGoals: ['all'],
    tags: ['productivity', 'time-management', 'study'],
    points: 10
  },
  {
    id: 'academic-2',
    title: 'Building Relationships with Professors',
    category: 'academic',
    difficulty: 'intermediate',
    timeToComplete: '1 week',
    description: 'Establish meaningful connections with faculty for better academic support and references.',
    steps: [
      'Attend office hours regularly',
      'Ask thoughtful questions in class',
      'Send follow-up emails after discussions',
      'Show genuine interest in their research'
    ],
    relevantFor: ['F1'],
    careerGoals: ['all'],
    tags: ['networking', 'relationships', 'academic'],
    points: 25
  },
  {
    id: 'academic-3',
    title: 'Academic Writing for Non-Native Speakers',
    category: 'academic',
    difficulty: 'intermediate',
    timeToComplete: '30 minutes daily',
    description: 'Improve your academic writing style and clarity for better grades.',
    steps: [
      'Read academic papers in your field daily',
      'Use Grammarly for grammar checking',
      'Practice writing clear thesis statements',
      'Get feedback from writing center'
    ],
    relevantFor: ['F1', 'OPT'],
    careerGoals: ['all'],
    tags: ['writing', 'communication', 'academic'],
    points: 20
  },

  // Career Development
  {
    id: 'career-1',
    title: 'LinkedIn Coffee Chat Strategy',
    category: 'career',
    difficulty: 'beginner',
    timeToComplete: '30 minutes',
    description: 'Reach out to 3 alumni in your field this week for informational interviews.',
    steps: [
      'Search LinkedIn for alumni at target companies',
      'Send personalized connection requests',
      'Ask for 15-minute informational interviews',
      'Prepare thoughtful questions about their journey'
    ],
    relevantFor: ['F1', 'OPT', 'H1B'],
    careerGoals: ['Software Developer', 'Data Engineer', 'Product Manager'],
    tags: ['networking', 'linkedin', 'interviews'],
    points: 30
  },
  {
    id: 'career-2',
    title: 'Resume Optimization for US Market',
    category: 'career',
    difficulty: 'intermediate',
    timeToComplete: '2 hours',
    description: 'Adapt your resume format and content for American recruiters and ATS systems.',
    steps: [
      'Use chronological format with clear headers',
      'Add quantified achievements with numbers',
      'Include relevant keywords from job descriptions',
      'Keep it to 1-2 pages maximum'
    ],
    relevantFor: ['F1', 'OPT', 'H1B'],
    careerGoals: ['all'],
    tags: ['resume', 'job-search', 'ats'],
    points: 25
  },
  {
    id: 'career-3',
    title: 'Mock Interview Practice Schedule',
    category: 'career',
    difficulty: 'intermediate',
    timeToComplete: '1 hour weekly',
    description: 'Practice technical and behavioral interviews consistently to build confidence.',
    steps: [
      'Schedule weekly mock interviews with friends',
      'Use platforms like Pramp or InterviewBuddy',
      'Record yourself answering common questions',
      'Get feedback and iterate on weak points'
    ],
    relevantFor: ['F1', 'OPT'],
    careerGoals: ['Software Developer', 'Data Engineer'],
    tags: ['interviews', 'practice', 'confidence'],
    points: 35
  },

  // Life in USA
  {
    id: 'life-1',
    title: 'Building Credit Score as International Student',
    category: 'life',
    difficulty: 'beginner',
    timeToComplete: '1 day setup',
    description: 'Start building your US credit history early with student-friendly options.',
    steps: [
      'Apply for a secured credit card',
      'Set up automatic small recurring payments',
      'Never exceed 30% of credit limit',
      'Check credit score monthly with Credit Karma'
    ],
    relevantFor: ['F1', 'OPT', 'H1B'],
    careerGoals: ['all'],
    tags: ['credit', 'finance', 'banking'],
    points: 40
  },
  {
    id: 'life-2',
    title: 'Healthcare Navigation Guide',
    category: 'life',
    difficulty: 'beginner',
    timeToComplete: '1 hour',
    description: 'Understand US healthcare system and maximize your student insurance.',
    steps: [
      'Understand your insurance plan details',
      'Find in-network providers near campus',
      'Know when to use urgent care vs ER',
      'Keep digital copies of important health records'
    ],
    relevantFor: ['F1', 'OPT'],
    careerGoals: ['all'],
    tags: ['healthcare', 'insurance', 'safety'],
    points: 20
  },
  {
    id: 'life-3',
    title: 'Cultural Adaptation Strategies',
    category: 'life',
    difficulty: 'intermediate',
    timeToComplete: 'Ongoing',
    description: 'Navigate cultural differences and build confidence in American social settings.',
    steps: [
      'Join international student organizations',
      'Attend cultural events and campus activities',
      'Practice small talk and American communication styles',
      'Find a cultural mentor or buddy'
    ],
    relevantFor: ['F1'],
    careerGoals: ['all'],
    tags: ['culture', 'social', 'adaptation'],
    points: 30
  },

  // Financial Tips
  {
    id: 'financial-1',
    title: 'Student Budget Optimization',
    category: 'financial',
    difficulty: 'beginner',
    timeToComplete: '2 hours',
    description: 'Create a realistic budget that maximizes your limited student income.',
    steps: [
      'Track all expenses for one month',
      'Use the 50/30/20 rule (needs/wants/savings)',
      'Find student discounts for everything',
      'Use apps like Mint or YNAB for tracking'
    ],
    relevantFor: ['F1', 'OPT'],
    careerGoals: ['all'],
    tags: ['budgeting', 'money', 'savings'],
    points: 25
  },
  {
    id: 'financial-2',
    title: 'Scholarship and Grant Hunting',
    category: 'financial',
    difficulty: 'intermediate',
    timeToComplete: '3 hours weekly',
    description: 'Systematically search and apply for scholarships to reduce financial burden.',
    steps: [
      'Use Fastweb, Scholarships.com, and CollegeBoard',
      'Apply to 5-10 small scholarships monthly',
      'Create template essays you can customize',
      'Set calendar reminders for deadlines'
    ],
    relevantFor: ['F1'],
    careerGoals: ['all'],
    tags: ['scholarships', 'grants', 'funding'],
    points: 45
  },

  // Visa & Legal
  {
    id: 'visa-1',
    title: 'OPT Application Timeline Mastery',
    category: 'visa',
    difficulty: 'advanced',
    timeToComplete: '4 hours',
    description: 'Plan your OPT application 6 months ahead to avoid last-minute stress.',
    steps: [
      'Meet with international student advisor',
      'Gather all required documents early',
      'Submit application 90 days before graduation',
      'Prepare backup plans if application delays'
    ],
    relevantFor: ['F1'],
    careerGoals: ['all'],
    tags: ['opt', 'visa', 'timeline'],
    points: 50
  },
  {
    id: 'visa-2',
    title: 'H1B Preparation Strategy',
    category: 'visa',
    difficulty: 'advanced',
    timeToComplete: '6 months',
    description: 'Position yourself for H1B success by choosing the right employers and timing.',
    steps: [
      'Target H1B-friendly companies',
      'Build strong performance record during OPT',
      'Understand salary requirements and prevailing wages',
      'Prepare alternative plans (masters, different visa types)'
    ],
    relevantFor: ['OPT'],
    careerGoals: ['all'],
    tags: ['h1b', 'visa', 'employment'],
    points: 60
  },
  {
    id: 'visa-3',
    title: 'Document Organization System',
    category: 'visa',
    difficulty: 'beginner',
    timeToComplete: '1 hour',
    description: 'Create a foolproof system to manage all your important immigration documents.',
    steps: [
      'Scan all documents and store in cloud',
      'Create physical backup folder',
      'Set reminders for document expiration dates',
      'Keep copies with trusted friend/family'
    ],
    relevantFor: ['F1', 'OPT', 'H1B'],
    careerGoals: ['all'],
    tags: ['documents', 'organization', 'backup'],
    points: 15
  }
];

// Smart tip recommendation engine
const getPersonalizedTips = (onboardingData, roadmapData, completedTips = []) => {
  const userVisa = onboardingData?.visaStatus || 'F1';
  const userGoal = onboardingData?.goalTitle || onboardingData?.mainCareerGoal || 'all';
  const studyHours = parseInt(onboardingData?.studyHoursPerWeek) || 10;
  
  // Filter tips based on user profile
  let relevantTips = tipsDatabase.filter(tip => {
    const visaMatch = tip.relevantFor.includes(userVisa) || tip.relevantFor.includes('all');
    const goalMatch = tip.careerGoals.includes(userGoal) || tip.careerGoals.includes('all');
    const notCompleted = !completedTips.includes(tip.id);
    
    return visaMatch && goalMatch && notCompleted;
  });

  // Prioritize based on user needs
  relevantTips = relevantTips.sort((a, b) => {
    let scoreA = 0, scoreB = 0;
    
    // Prioritize career tips if close to graduation
    if (userVisa === 'F1' && userGoal !== 'Higher Studies') {
      if (a.category === 'career') scoreA += 10;
      if (b.category === 'career') scoreB += 10;
    }
    
    // Prioritize academic tips for low study hours
    if (studyHours < 10) {
      if (a.category === 'academic') scoreA += 5;
      if (b.category === 'academic') scoreB += 5;
    }
    
    // Prioritize by difficulty (beginner first)
    const difficultyScore = { beginner: 3, intermediate: 2, advanced: 1 };
    scoreA += difficultyScore[a.difficulty] || 0;
    scoreB += difficultyScore[b.difficulty] || 0;
    
    return scoreB - scoreA;
  });

  return relevantTips.slice(0, 12); // Return top 12 personalized tips
};

const TipCard = ({ tip, onComplete, onFavorite, isFavorited, isCompleted }) => {
  const [expanded, setExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const getDifficultyColor = () => {
    switch (tip.difficulty) {
      case 'beginner': return theme.success;
      case 'intermediate': return theme.warning;
      case 'advanced': return theme.danger;
      default: return theme.softText;
    }
  };

  const getCategoryIcon = () => {
    switch (tip.category) {
      case 'academic': return '🎓';
      case 'career': return '💼';
      case 'life': return '🏠';
      case 'financial': return '💰';
      case 'visa': return '📋';
      default: return '💡';
    }
  };

  return (
    <div className={`tip-card ${expanded ? 'expanded' : ''} ${isCompleted ? 'completed' : ''}`}>
      <div className="tip-header" onClick={() => setExpanded(!expanded)}>
        <div className="tip-meta">
          <div className="tip-title-row">
            <span className="tip-icon">{getCategoryIcon()}</span>
            <span className="tip-title">{tip.title}</span>
            <span className="tip-points">+{tip.points}pts</span>
          </div>
          <div className="tip-info">
            <span className="tip-difficulty" style={{ color: getDifficultyColor() }}>
              {tip.difficulty}
            </span>
            <span className="tip-time">⏱️ {tip.timeToComplete}</span>
          </div>
        </div>
        <div className="tip-actions">
          <button 
            className={`favorite-btn ${isFavorited ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onFavorite(tip.id); }}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
          <button className="expand-btn">
            {expanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="tip-body">
          <p className="tip-description">{tip.description}</p>
          
          <div className="tip-steps">
            <h4>Action Steps:</h4>
            {tip.steps.map((step, index) => (
              <div 
                key={index} 
                className={`step-item ${index <= currentStep ? 'active' : ''}`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-text">{step}</div>
                {index <= currentStep && <div className="step-check">✓</div>}
              </div>
            ))}
          </div>

          <div className="tip-tags">
            {tip.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          <div className="tip-footer">
            <button 
              className={`complete-btn ${isCompleted ? 'completed' : ''}`}
              onClick={() => onComplete(tip.id)}
            >
              {isCompleted ? '✅ Completed' : '✓ Mark Complete'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .tip-card {
          background: ${theme.cardBg};
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .tip-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,212,170,0.1);
        }
        .tip-card.expanded {
          border-color: ${theme.mint};
          box-shadow: 0 12px 30px rgba(0,212,170,0.15);
        }
        .tip-card.completed {
          border-color: ${theme.success};
          background: rgba(16,185,129,0.05);
        }
        .tip-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .tip-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .tip-icon {
          font-size: 16px;
        }
        .tip-title {
          color: white;
          font-weight: 700;
          font-size: 16px;
        }
        .tip-points {
          background: ${theme.mint};
          color: #042028;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
        }
        .tip-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .tip-difficulty {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .tip-time {
          font-size: 12px;
          color: ${theme.softText};
        }
        .tip-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .favorite-btn, .expand-btn {
          background: transparent;
          border: none;
          font-size: 16px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        .favorite-btn:hover, .expand-btn:hover {
          background: rgba(255,255,255,0.1);
        }
        .tip-body {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px dashed rgba(255,255,255,0.1);
        }
        .tip-description {
          color: ${theme.softText};
          margin: 0 0 16px 0;
          line-height: 1.5;
        }
        .tip-steps h4 {
          color: white;
          margin: 0 0 12px 0;
          font-size: 14px;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 8px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .step-item:hover {
          background: rgba(255,255,255,0.03);
        }
        .step-item.active {
          background: rgba(0,212,170,0.1);
        }
        .step-number {
          width: 24px;
          height: 24px;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: white;
        }
        .step-item.active .step-number {
          background: ${theme.mint};
          color: #042028;
        }
        .step-text {
          flex: 1;
          color: ${theme.softText};
          font-size: 14px;
        }
        .step-item.active .step-text {
          color: white;
        }
        .step-check {
          color: ${theme.success};
          font-weight: 700;
        }
        .tip-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin: 16px 0;
        }
        .tag {
          background: rgba(255,255,255,0.1);
          color: ${theme.softText};
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
        .tip-footer {
          margin-top: 16px;
        }
        .complete-btn {
          background: ${theme.mint};
          color: #042028;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .complete-btn:hover {
          transform: translateY(-1px);
        }
        .complete-btn.completed {
          background: ${theme.success};
          color: white;
        }
      `}</style>
    </div>
  );
};

export default function TipsPage() {
  const [onboardingData, setOnboardingData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTips, setCompletedTips] = useState([]);
  const [favoriteTips, setFavoriteTips] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [dailyTips, setDailyTips] = useState([]);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);

  const currentUser = 'PraTha830';
  const currentUTC = '2025-08-24 08:24:32';

  useEffect(() => {
    console.log('[TIPS PAGE] 🚀 Initializing Smart Tips Dashboard...');
    
    // Load data from localStorage
    try {
      const onboarding = JSON.parse(localStorage.getItem('onboardingData'));
      const roadmap = JSON.parse(localStorage.getItem('roadmapData'));
      const completed = JSON.parse(localStorage.getItem('sathi_completed_tips')) || [];
      const favorites = JSON.parse(localStorage.getItem('sathi_favorite_tips')) || [];
      const points = parseInt(localStorage.getItem('sathi_user_points')) || 0;
      
      console.log('[TIPS PAGE] 📊 User profile loaded:', { onboarding, roadmap });
      console.log('[TIPS PAGE] ✅ Progress loaded:', { completed: completed.length, favorites: favorites.length, points });
      
      setOnboardingData(onboarding);
      setRoadmapData(roadmap);
      setCompletedTips(completed);
      setFavoriteTips(favorites);
      setUserPoints(points);

      // Generate personalized daily tips
      const personalizedTips = getPersonalizedTips(onboarding, roadmap, completed);
      setDailyTips(personalizedTips.slice(0, 3)); // Top 3 for daily tips
      
      console.log('[TIPS PAGE] 🎯 Daily tips generated:', personalizedTips.slice(0, 3).map(t => t.title));
      
    } catch (error) {
      console.error('[TIPS PAGE] ❌ Error loading data:', error);
    }
  }, []);

  const categories = [
    { id: 'all', name: 'All Tips', icon: '📚', count: tipsDatabase.length },
    { id: 'academic', name: 'Academic', icon: '🎓', count: tipsDatabase.filter(t => t.category === 'academic').length },
    { id: 'career', name: 'Career', icon: '💼', count: tipsDatabase.filter(t => t.category === 'career').length },
    { id: 'life', name: 'Life in USA', icon: '🏠', count: tipsDatabase.filter(t => t.category === 'life').length },
    { id: 'financial', name: 'Financial', icon: '💰', count: tipsDatabase.filter(t => t.category === 'financial').length },
    { id: 'visa', name: 'Visa & Legal', icon: '📋', count: tipsDatabase.filter(t => t.category === 'visa').length }
  ];

  const filteredTips = tipsDatabase.filter(tip => {
    const categoryMatch = selectedCategory === 'all' || tip.category === selectedCategory;
    const searchMatch = searchQuery === '' || 
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });

  const handleCompleteTip = (tipId) => {
    console.log('[TIPS PAGE] ✅ Completing tip:', tipId);
    
    if (completedTips.includes(tipId)) return;
    
    const tip = tipsDatabase.find(t => t.id === tipId);
    const newCompleted = [...completedTips, tipId];
    const newPoints = userPoints + (tip?.points || 0);
    
    setCompletedTips(newCompleted);
    setUserPoints(newPoints);
    
    localStorage.setItem('sathi_completed_tips', JSON.stringify(newCompleted));
    localStorage.setItem('sathi_user_points', newPoints.toString());
    
    console.log('[TIPS PAGE] 🎉 Tip completed! New points:', newPoints);
  };

  const handleFavoriteTip = (tipId) => {
    console.log('[TIPS PAGE] ❤️ Toggling favorite for tip:', tipId);
    
    const newFavorites = favoriteTips.includes(tipId)
      ? favoriteTips.filter(id => id !== tipId)
      : [...favoriteTips, tipId];
    
    setFavoriteTips(newFavorites);
    localStorage.setItem('sathi_favorite_tips', JSON.stringify(newFavorites));
  };

  const getProgressStats = () => {
    const totalTips = tipsDatabase.length;
    const completedCount = completedTips.length;
    const progressPercentage = Math.round((completedCount / totalTips) * 100);
    
    return { totalTips, completedCount, progressPercentage };
  };

  const { totalTips, completedCount, progressPercentage } = getProgressStats();

  return (
    <div className="tips-page">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1 className="title">Smart Tips & Tricks</h1>
            <p className="subtitle">
              Personalized guidance for your journey as an international student
            </p>
          </div>

          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-value">{userPoints}</div>
              <div className="stat-label">Points Earned</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{completedCount}/{totalTips}</div>
              <div className="stat-label">Tips Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{progressPercentage}%</div>
              <div className="stat-label">Progress</div>
            </div>
          </div>
        </header>

        {/* Daily Tips Section */}
        {dailyTips.length > 0 && (
          <section className="daily-section">
            <div className="daily-header">
              <h2 className="section-title">📅 Your Daily Recommendations</h2>
              <p className="section-subtitle">Personalized based on your profile and goals</p>
            </div>
            <div className="daily-tips">
              {dailyTips.map(tip => (
                <div key={tip.id} className="daily-tip-card">
                  <div className="daily-tip-header">
                    <span className="daily-tip-icon">{tip.category === 'academic' ? '🎓' : tip.category === 'career' ? '💼' : tip.category === 'life' ? '🏠' : tip.category === 'financial' ? '💰' : '📋'}</span>
                    <div className="daily-tip-meta">
                      <div className="daily-tip-title">{tip.title}</div>
                      <div className="daily-tip-info">
                        <span className="daily-tip-time">⏱️ {tip.timeToComplete}</span>
                        <span className="daily-tip-points">+{tip.points}pts</span>
                      </div>
                    </div>
                  </div>
                  <p className="daily-tip-desc">{tip.description}</p>
                  <div className="daily-tip-actions">
                    <button 
                      className="daily-action-btn"
                      onClick={() => handleCompleteTip(tip.id)}
                      disabled={completedTips.includes(tip.id)}
                    >
                      {completedTips.includes(tip.id) ? '✅ Done' : '🚀 Start Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="controls-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search tips, categories, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Tips Grid */}
        <main className="tips-grid">
          <section className="tips-list">
            <div className="tips-header">
              <h3 className="section-title">
                {selectedCategory === 'all' ? 'All Tips' : categories.find(c => c.id === selectedCategory)?.name}
                <span className="tips-count">({filteredTips.length})</span>
              </h3>
            </div>
            
            <div className="tips-container">
              {filteredTips.map(tip => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  onComplete={handleCompleteTip}
                  onFavorite={handleFavoriteTip}
                  isFavorited={favoriteTips.includes(tip.id)}
                  isCompleted={completedTips.includes(tip.id)}
                />
              ))}
            </div>

            {filteredTips.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h4>No tips found</h4>
                <p>Try adjusting your search or category filter</p>
              </div>
            )}
          </section>

          <aside className="tips-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">🎯 Your Progress</h3>
              <div className="progress-chart">
                <div className="progress-circle">
                  <div className="progress-value">{progressPercentage}%</div>
                </div>
                <div className="progress-details">
                  <div className="progress-item">
                    <span className="progress-label">Completed:</span>
                    <span className="progress-count">{completedCount}</span>
                  </div>
                  <div className="progress-item">
                    <span className="progress-label">Remaining:</span>
                    <span className="progress-count">{totalTips - completedCount}</span>
                  </div>
                  <div className="progress-item">
                    <span className="progress-label">Points:</span>
                    <span className="progress-count">{userPoints}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h3 className="sidebar-title">❤️ Favorites</h3>
              {favoriteTips.length === 0 ? (
                <p className="sidebar-empty">No favorites yet. Click the 🤍 icon to save tips!</p>
              ) : (
                <div className="favorites-list">
                  {favoriteTips.slice(0, 5).map(tipId => {
                    const tip = tipsDatabase.find(t => t.id === tipId);
                    return tip ? (
                      <div key={tipId} className="favorite-item">
                        <span className="favorite-title">{tip.title}</span>
                        <span className="favorite-category">{tip.category}</span>
                      </div>
                    ) : null;
                  })}
                  {favoriteTips.length > 5 && (
                    <div className="favorites-more">+{favoriteTips.length - 5} more</div>
                  )}
                </div>
              )}
            </div>

            <div className="sidebar-card">
              <h3 className="sidebar-title">🏆 Quick Stats</h3>
              <div className="quick-stats">
                <div className="quick-stat">
                  <span className="quick-stat-label">Your Level:</span>
                  <span className="quick-stat-value">
                    {userPoints < 100 ? 'Beginner' : userPoints < 300 ? 'Intermediate' : 'Advanced'}
                  </span>
                </div>
                <div className="quick-stat">
                  <span className="quick-stat-label">Streak:</span>
                  <span className="quick-stat-value">3 days 🔥</span>
                </div>
                <div className="quick-stat">
                  <span className="quick-stat-label">Next Goal:</span>
                  <span className="quick-stat-value">{Math.ceil((userPoints + 50) / 50) * 50} pts</span>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>

      <style jsx>{`
        .tips-page {
          min-height: 100vh;
          background: linear-gradient(180deg, rgba(0,212,170,0.06), rgba(0,212,170,0.01));
          padding: 40px;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto;
          color: white;
        }
        .container {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        /* Header Styles */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        .title {
          font-size: 32px;
          margin: 0 0 8px 0;
          background: linear-gradient(90deg, ${theme.mint}, ${theme.accent});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          color: ${theme.softText};
          margin: 0;
          max-width: 500px;
        }
        .header-stats {
          display: flex;
          gap: 16px;
        }
        .stat-card {
          background: ${theme.cardBg};
          padding: 16px 20px;
          border-radius: 12px;
          text-align: center;
          min-width: 100px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: ${theme.mint};
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 12px;
          color: ${theme.softText};
          text-transform: uppercase;
          font-weight: 600;
        }

        /* Daily Tips Styles */
        .daily-section {
          margin-bottom: 32px;
        }
        .daily-header {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 20px;
          color: white;
          margin: 0 0 4px 0;
        }
        .section-subtitle {
          color: ${theme.softText};
          margin: 0;
          font-size: 14px;
        }
        .daily-tips {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 16px;
        }
        .daily-tip-card {
          background: linear-gradient(135deg, rgba(0,212,170,0.1), rgba(0,212,170,0.05));
          border: 1px solid ${theme.mint};
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        .daily-tip-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,212,170,0.2);
        }
        .daily-tip-header {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .daily-tip-icon {
          font-size: 20px;
        }
        .daily-tip-title {
          color: white;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 6px;
        }
        .daily-tip-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .daily-tip-time {
          color: ${theme.softText};
          font-size: 12px;
        }
        .daily-tip-points {
          background: ${theme.mint};
          color: #042028;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
        }
        .daily-tip-desc {
          color: ${theme.softText};
          margin: 0 0 16px 0;
          line-height: 1.4;
        }
        .daily-action-btn {
          background: ${theme.mint};
          color: #042028;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        .daily-action-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,212,170,0.3);
        }
        .daily-action-btn:disabled {
          background: ${theme.success};
          color: white;
          cursor: not-allowed;
        }

        /* Controls Styles */
        .controls-section {
          margin-bottom: 32px;
        }
        .search-bar {
          margin-bottom: 20px;
        }
        .search-input {
          width: 100%;
          max-width: 500px;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.2);
          background: ${theme.cardBg};
          color: white;
          font-size: 16px;
          box-sizing: border-box;
        }
        .search-input:focus {
          outline: none;
          border-color: ${theme.mint};
          box-shadow: 0 0 0 3px rgba(0,212,170,0.1);
        }
        .category-filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .category-btn {
          background: ${theme.cardBg};
          border: 1px solid rgba(255,255,255,0.1);
          color: ${theme.softText};
          padding: 12px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }
        .category-btn:hover {
          border-color: ${theme.mint};
          color: white;
          transform: translateY(-1px);
        }
        .category-btn.active {
          background: ${theme.mint};
          color: #042028;
          border-color: ${theme.mint};
        }
        .category-icon {
          font-size: 16px;
        }
        .category-count {
          background: rgba(255,255,255,0.2);
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 11px;
        }
        .category-btn.active .category-count {
          background: rgba(4,32,40,0.3);
        }

        /* Tips Grid Styles */
        .tips-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 32px;
          align-items: start;
        }
        .tips-header {
          margin-bottom: 20px;
        }
        .tips-count {
          color: ${theme.softText};
          font-weight: 400;
        }
        .tips-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .empty-state {
          text-align: center;
          padding: 60px;
          background: ${theme.cardBg};
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .empty-state h4 {
          color: white;
          margin: 0 0 8px 0;
        }
        .empty-state p {
          color: ${theme.softText};
          margin: 0;
        }

        /* Sidebar Styles */
        .sidebar-card {
          background: ${theme.cardBg};
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .sidebar-title {
          color: white;
          font-size: 16px;
          margin: 0 0 16px 0;
        }
        .progress-chart {
          text-align: center;
        }
        .progress-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: conic-gradient(${theme.mint} ${progressPercentage * 3.6}deg, rgba(255,255,255,0.1) 0deg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
          position: relative;
        }
        .progress-circle::before {
          content: '';
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #1a202c;
          position: absolute;
        }
        .progress-value {
          font-size: 14px;
          font-weight: 700;
          color: white;
          position: relative;
          z-index: 1;
        }
        .progress-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: ${theme.softText};
          font-size: 14px;
        }
        .progress-count {
          color: white;
          font-weight: 600;
        }
        .sidebar-empty {
          color: ${theme.softText};
          font-size: 14px;
          text-align: center;
          margin: 0;
        }
        .favorites-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .favorite-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px;
          background: rgba(255,255,255,0.03);
          border-radius: 6px;
        }
        .favorite-title {
          color: white;
          font-size: 13px;
          font-weight: 600;
        }
        .favorite-category {
          color: ${theme.softText};
          font-size: 11px;
          text-transform: uppercase;
        }
        .favorites-more {
          color: ${theme.softText};
          font-size: 12px;
          text-align: center;
          margin-top: 8px;
        }
        .quick-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .quick-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .quick-stat-label {
          color: ${theme.softText};
          font-size: 14px;
        }
        .quick-stat-value {
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .tips-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
          }
          .header-stats {
            justify-content: space-between;
          }
          .daily-tips {
            grid-template-columns: 1fr;
          }
          .category-filters {
            grid-template-columns: repeat(2, 1fr);
            display: grid;
          }
        }
      `}</style>
    </div>
  );
}