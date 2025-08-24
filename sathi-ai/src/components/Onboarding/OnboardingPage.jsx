import React, { useState, useEffect } from 'react';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Profile
    fullName: '',
    email: '',
    timezone: '',
    preferredLanguage: 'English',
    otherLanguage: '',
    voiceSupport: 'English',
    
    // Visa & Status
    visaStatus: '',
    otherVisaStatus: '',
    nextMilestone: '',
    targetDate: '',
    
    // Career & Goals
    mainCareerGoal: '',
    otherCareerGoal: '',
    skillsOfInterest: [],
    shortTermGoal: '',
    longTermGoal: '',
    goalTitle: '',
    
    // Additional Required Fields
    country: 'US',
    university: '',
    studyHoursPerWeek: '',
    
    // Lifestyle & Support
    topChallenges: [],
    supportCircle: '',
    supportContact: '',
    wakeTime: '',
    sleepTime: '',
    studyRhythm: '',
    
    // Productivity Tools
    dailyReminders: '',
    plannerStyle: '',
    accountabilityNudges: '',
    
    // Voice & Accessibility
    voiceGender: '',
    accessibilityNeeds: []
  });

  // Auto-detect timezone
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setFormData(prev => ({ ...prev, timezone }));
    
    // Get email from session storage
    const userEmail = sessionStorage.getItem('user_email');
    if (userEmail) {
      setFormData(prev => ({ ...prev, email: userEmail }));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowReview(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEditSection = (step) => {
    setShowReview(false);
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Store all onboarding data in session
      sessionStorage.setItem('onboardingData', JSON.stringify(formData));
      
      // Prepare API payload
      const apiPayload = {
        user_id: "PraTha830",
        answers: {
          country: formData.country,
          visa_status: formData.visaStatus === 'Other' ? formData.otherVisaStatus : formData.visaStatus,
          goal: formData.goalTitle || formData.mainCareerGoal,
          study_hours_per_week: parseInt(formData.studyHoursPerWeek),
          university: formData.university,
          interests: formData.skillsOfInterest
        }
      };

      // Get token from session
      const token = sessionStorage.getItem('access_token');
      
      // Call roadmap API
      const response = await fetch('http://127.0.0.1:8000/roadmap?engine=ai&compact=false', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      if (response.ok) {
        const roadmapData = await response.json();
        
        // Store roadmap response in session
        sessionStorage.setItem('roadmapData', JSON.stringify(roadmapData));
        
        // Redirect to chat
        window.location.href = '/chat';
        
      } else {
        const errorData = await response.json();
        alert('Failed to generate roadmap: ' + (errorData.detail || 'Please try again'));
      }
      
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const theme = {
    bg: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    cardBg: 'rgba(26, 32, 44, 0.95)',
    text: '#f7fafc',
    inputBg: '#2d3748',
    inputBorder: '#4a5568',
    accent: '#00d4aa'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: `1px solid ${theme.inputBorder}`,
    background: theme.inputBg,
    color: theme.text,
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
   // maxLength: 500 // Reasonable limit, won't block typing
  };

  const ReviewPage = () => (
    <div className="review-container">
      <h3 className="review-title">📋 Review Your Answers</h3>
      <p className="review-subtitle">Please review your information before we create your personalized roadmap</p>
      
      <div className="review-sections">
        {/* Basic Profile */}
        <div className="review-section">
          <div className="section-header">
            <h4>👋 Basic Profile</h4>
            <button 
              className="edit-button"
              onClick={() => handleEditSection(1)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <p><strong>Name:</strong> {formData.fullName || 'Not provided'}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Location:</strong> {formData.timezone || 'Not provided'}</p>
            <p><strong>Country:</strong> {formData.country}</p>
            <p><strong>University:</strong> {formData.university || 'Not provided'}</p>
            <p><strong>Language:</strong> {formData.preferredLanguage}{formData.otherLanguage && ` (${formData.otherLanguage})`}</p>
            <p><strong>Voice Support:</strong> {formData.voiceSupport || 'Not selected'}</p>
          </div>
        </div>

        {/* Visa & Status */}
        <div className="review-section">
          <div className="section-header">
            <h4>📋 Visa & Status</h4>
            <button 
              className="edit-button"
              onClick={() => handleEditSection(2)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <p><strong>Visa Status:</strong> {formData.visaStatus === 'Other' ? formData.otherVisaStatus : formData.visaStatus || 'Not selected'}</p>
            <p><strong>Next Milestone:</strong> {formData.nextMilestone || 'Not selected'}</p>
            <p><strong>Target Date:</strong> {formData.targetDate || 'Not provided'}</p>
          </div>
        </div>

        {/* Career & Goals */}
        <div className="review-section">
          <div className="section-header">
            <h4>🎯 Career & Goals</h4>
            <button 
              className="edit-button"
              onClick={() => handleEditSection(3)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <p><strong>Career Goal:</strong> {formData.mainCareerGoal === 'Other' ? formData.otherCareerGoal : formData.mainCareerGoal || 'Not selected'}</p>
            <p><strong>Goal Title:</strong> {formData.goalTitle || 'Not provided'}</p>
            <p><strong>Study Hours/Week:</strong> {formData.studyHoursPerWeek || 'Not provided'}</p>
            <p><strong>Skills of Interest:</strong> {formData.skillsOfInterest.length > 0 ? formData.skillsOfInterest.join(', ') : 'None selected'}</p>
            <p><strong>Short-term Goal:</strong> {formData.shortTermGoal || 'Not provided'}</p>
            <p><strong>Long-term Goal:</strong> {formData.longTermGoal || 'Not provided'}</p>
          </div>
        </div>

        {/* Lifestyle & Support */}
        <div className="review-section">
          <div className="section-header">
            <h4>🏠 Lifestyle & Support</h4>
            <button 
              className="edit-button"
              onClick={() => handleEditSection(4)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <p><strong>Top Challenges:</strong> {formData.topChallenges.length > 0 ? formData.topChallenges.join(', ') : 'None selected'}</p>
            <p><strong>Support Circle:</strong> {formData.supportCircle || 'Not provided'}</p>
            <p><strong>Support Contact:</strong> {formData.supportContact || 'Not provided'}</p>
            <p><strong>Wake Time:</strong> {formData.wakeTime || 'Not provided'}</p>
            <p><strong>Sleep Time:</strong> {formData.sleepTime || 'Not provided'}</p>
            <p><strong>Study Rhythm:</strong> {formData.studyRhythm || 'Not selected'}</p>
          </div>
        </div>

        {/* Productivity Tools */}
        <div className="review-section">
          <div className="section-header">
            <h4>⚙️ Productivity Tools</h4>
            <button 
              className="edit-button"
              onClick={() => handleEditSection(5)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <p><strong>Daily Reminders:</strong> {formData.dailyReminders || 'Not selected'}</p>
            <p><strong>Planner Style:</strong> {formData.plannerStyle || 'Not selected'}</p>
            <p><strong>Accountability Nudges:</strong> {formData.accountabilityNudges || 'Not selected'}</p>
          </div>
        </div>

        {/* Voice & Accessibility */}
        <div className="review-section">
          <div className="section-header">
            <h4>🎤 Voice & Accessibility</h4>
            <button 
              className="edit-button"
              onClick={() => handleEditSection(6)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <p><strong>Voice Preference:</strong> {formData.voiceGender || 'Not selected'}</p>
            <p><strong>Accessibility Needs:</strong> {formData.accessibilityNeeds.length > 0 ? formData.accessibilityNeeds.join(', ') : 'None selected'}</p>
          </div>
        </div>
      </div>

      <div className="review-actions">
        <button
          onClick={() => setShowReview(false)}
          className="review-back-button"
        >
          Back to Edit
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`review-submit-button ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? 'Creating Your Roadmap...' : 'Submit & Create Roadmap'}
        </button>
      </div>
    </div>
  );

  const Step1 = () => (
    <div className="step-container">
      <h3 className="step-title">👋 Basic Profile</h3>
      
      <input
        type="text"
        placeholder="What's your full name?"
        value={formData.fullName}
        onChange={(e) => handleInputChange('fullName', e.target.value)}
        style={inputStyle}
       // maxLength={500}
      />
      
      <input
        type="email"
        placeholder="Email address"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        style={inputStyle}
        disabled
      />
      
      <input
        type="text"
        placeholder="Which city are you in right now?"
        value={formData.timezone}
        onChange={(e) => handleInputChange('timezone', e.target.value)}
        style={inputStyle}
      />

      <select
        value={formData.country}
        onChange={(e) => handleInputChange('country', e.target.value)}
        style={inputStyle}
      >
        <option value="US">United States</option>
        <option value="Canada">Canada</option>
        <option value="UK">United Kingdom</option>
        <option value="India">India</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="text"
        placeholder="Which university do you attend?"
        value={formData.university}
        onChange={(e) => handleInputChange('university', e.target.value)}
        style={inputStyle}
      />
      
      <select
        value={formData.preferredLanguage}
        onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
        style={inputStyle}
      >
        <option value="English">English</option>
        <option value="Spanish">Spanish</option>
        <option value="Hindi">Hindi</option>
        <option value="Chinese">Chinese</option>
        <option value="Other">Other</option>
      </select>
      
      {formData.preferredLanguage === 'Other' && (
        <input
          type="text"
          placeholder="Please specify your preferred language"
          value={formData.otherLanguage}
          onChange={(e) => handleInputChange('otherLanguage', e.target.value)}
          style={inputStyle}
        />
      )}
      
      <select
        value={formData.voiceSupport}
        onChange={(e) => handleInputChange('voiceSupport', e.target.value)}
        style={inputStyle}
      >
        <option value="">Do you want me to talk back to you?</option>
        <option value="English">English only</option>
        <option value="Native">Native language only</option>
        <option value="Both">Both English and native</option>
      </select>
    </div>
  );

  const Step2 = () => (
    <div className="step-container">
      <h3 className="step-title">📋 Visa & Status</h3>
      
      <select
        value={formData.visaStatus}
        onChange={(e) => handleInputChange('visaStatus', e.target.value)}
        style={inputStyle}
      >
        <option value="">What's your current visa type?</option>
        <option value="F1">F1 Student Visa</option>
        <option value="OPT">OPT</option>
        <option value="H1B">H1B</option>
        <option value="Green Card">Green Card</option>
        <option value="Citizen">US Citizen</option>
        <option value="Other">Other</option>
      </select>
      
      {formData.visaStatus === 'Other' && (
        <input
          type="text"
          placeholder="Please specify your visa status"
          value={formData.otherVisaStatus}
          onChange={(e) => handleInputChange('otherVisaStatus', e.target.value)}
          style={inputStyle}
        />
      )}
      
      <select
        value={formData.nextMilestone}
        onChange={(e) => handleInputChange('nextMilestone', e.target.value)}
        style={inputStyle}
      >
        <option value="">What are you planning to apply for next?</option>
        <option value="OPT">OPT Application</option>
        <option value="H1B">H1B Visa</option>
        <option value="Green Card">Green Card</option>
        <option value="Graduate School">Graduate School</option>
        <option value="Job Search">Full-time Job</option>
        <option value="Other">Other</option>
      </select>
      
      <input
        type="date"
        placeholder="Target graduation/job date"
        value={formData.targetDate}
        onChange={(e) => handleInputChange('targetDate', e.target.value)}
        style={inputStyle}
      />
    </div>
  );

  const Step3 = () => (
    <div className="step-container">
      <h3 className="step-title">🎯 Career & Goals</h3>
      
      <select
        value={formData.mainCareerGoal}
        onChange={(e) => handleInputChange('mainCareerGoal', e.target.value)}
        style={inputStyle}
      >
        <option value="">What's your biggest focus right now?</option>
        <option value="Internship">Internship</option>
        <option value="Full-time Job">Full-time Job</option>
        <option value="Higher Studies">Higher Studies</option>
        <option value="Skill Development">Skill Development</option>
        <option value="Networking">Networking</option>
        <option value="Other">Other</option>
      </select>
      
      {formData.mainCareerGoal === 'Other' && (
        <input
          type="text"
          placeholder="Please specify your career goal"
          value={formData.otherCareerGoal}
          onChange={(e) => handleInputChange('otherCareerGoal', e.target.value)}
          style={inputStyle}
        />
      )}

      <input
        type="text"
        placeholder="Goal Title: DATA ENGINEER, SOFTWARE DEVELOPER, PRODUCT MANAGER, etc."
        value={formData.goalTitle}
        onChange={(e) => handleInputChange('goalTitle', e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="How many hours can you commit to learn this per week?"
        value={formData.studyHoursPerWeek}
        onChange={(e) => handleInputChange('studyHoursPerWeek', e.target.value)}
        style={inputStyle}
        min="1"
        max="168"
      />
      
      <div>
        <p style={{ color: theme.text, marginBottom: '1rem' }}>Skills of Interest (select multiple):</p>
        <div className="skills-grid">
          {['Programming', 'Data Science', 'Web Design', 'Business', 'Healthcare', 'AI/ML', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Mobile Development'].map(skill => (
            <label key={skill} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.skillsOfInterest.includes(skill)}
                onChange={() => handleMultiSelect('skillsOfInterest', skill)}
                style={{ marginRight: '0.5rem' }}
              />
              {skill}
            </label>
          ))}
        </div>
      </div>
      
      <textarea
        placeholder="Short-term goal (3 months): e.g., 'Finish 3 projects', 'Get internship'"
        value={formData.shortTermGoal}
        onChange={(e) => handleInputChange('shortTermGoal', e.target.value)}
        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
      />
      
      <textarea
        placeholder="Long-term goal (1-3 years): e.g., 'Land a Data Engineer role'"
        value={formData.longTermGoal}
        onChange={(e) => handleInputChange('longTermGoal', e.target.value)}
        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
      />
    </div>
  );

  const Step4 = () => (
    <div className="step-container">
      <h3 className="step-title">🏠 Lifestyle & Support</h3>
      
      <div>
        <p style={{ color: theme.text, marginBottom: '1rem' }}>Top Challenges Abroad (pick 2):</p>
        <div className="challenges-grid">
          {['Finances', 'Housing', 'Transport', 'Healthcare', 'Food', 'Mental Health'].map(challenge => (
            <label key={challenge} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.topChallenges.includes(challenge)}
                onChange={() => handleMultiSelect('topChallenges', challenge)}
                style={{ marginRight: '0.5rem' }}
                disabled={formData.topChallenges.length >= 2 && !formData.topChallenges.includes(challenge)}
              />
              {challenge}
            </label>
          ))}
        </div>
      </div>
      
      <input
        type="text"
        placeholder="Support circle: Would you like me to send summaries to a parent, mentor, or friend?"
        value={formData.supportCircle}
        onChange={(e) => handleInputChange('supportCircle', e.target.value)}
        style={inputStyle}
      />
      
      <input
        type="email"
        placeholder="Support contact email/WhatsApp (optional)"
        value={formData.supportContact}
        onChange={(e) => handleInputChange('supportContact', e.target.value)}
        style={inputStyle}
      />
      
      <input
        type="time"
        placeholder="When do you usually wake up?"
        value={formData.wakeTime}
        onChange={(e) => handleInputChange('wakeTime', e.target.value)}
        style={inputStyle}
      />
      
      <input
        type="time"
        placeholder="When do you usually sleep?"
        value={formData.sleepTime}
        onChange={(e) => handleInputChange('sleepTime', e.target.value)}
        style={inputStyle}
      />
      
      <select
        value={formData.studyRhythm}
        onChange={(e) => handleInputChange('studyRhythm', e.target.value)}
        style={inputStyle}
      >
        <option value="">Do you prefer to study in morning, afternoon, or night?</option>
        <option value="Morning">Morning</option>
        <option value="Afternoon">Afternoon</option>
        <option value="Night">Night</option>
        <option value="Flexible">Flexible</option>
      </select>
    </div>
  );

  const Step5 = () => (
    <div className="step-container">
      <h3 className="step-title">⚙️ Productivity Tools</h3>
      
      <select
        value={formData.dailyReminders}
        onChange={(e) => handleInputChange('dailyReminders', e.target.value)}
        style={inputStyle}
      >
        <option value="">Would you like daily reminders?</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      
      <select
        value={formData.plannerStyle}
        onChange={(e) => handleInputChange('plannerStyle', e.target.value)}
        style={inputStyle}
      >
        <option value="">Do you want me to give you a daily plan or just reminders?</option>
        <option value="Daily Plan">Daily plan (3 key blocks)</option>
        <option value="Just Reminders">Just reminders</option>
      </select>
      
      <select
        value={formData.accountabilityNudges}
        onChange={(e) => handleInputChange('accountabilityNudges', e.target.value)}
        style={inputStyle}
      >
        <option value="">Do you like motivational nudges if you miss tasks?</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  );

  const Step6 = () => (
    <div className="step-container">
      <h3 className="step-title">🎤 Voice & Accessibility</h3>
      
      <select
        value={formData.voiceGender}
        onChange={(e) => handleInputChange('voiceGender', e.target.value)}
        style={inputStyle}
      >
        <option value="">Voice Gender/Style Preference</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Neutral">Neutral</option>
        <option value="No Preference">No Preference</option>
      </select>
      
      <div>
        <p style={{ color: theme.text, marginBottom: '1rem' }}>Accessibility Needs (select if applicable):</p>
        <div className="accessibility-grid">
          {['Larger fonts', 'High-contrast mode', 'Voice-only mode', 'Screen reader compatible'].map(need => (
            <label key={need} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.accessibilityNeeds.includes(need)}
                onChange={() => handleMultiSelect('accessibilityNeeds', need)}
                style={{ marginRight: '0.5rem' }}
              />
              {need}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    if (showReview) return <ReviewPage />;
    
    switch (currentStep) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      case 5: return <Step5 />;
      case 6: return <Step6 />;
      default: return <Step1 />;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        {/* Header */}
        <div className="header">
          <h1 className="main-title">Welcome to Sathi AI</h1>
          <p className="subtitle">
            {showReview ? 'Review your information' : "Let's personalize your experience"}
          </p>
        </div>

        {/* Progress Bar - Hide on review */}
        {!showReview && (
          <>
            <div className="progress-container">
              <div 
                className="progress-bar"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
            <div className="step-indicator">Step {currentStep} of 6</div>
          </>
        )}

        {/* Form Content */}
        {renderCurrentStep()}

        {/* Navigation Buttons - Hide on review */}
        {!showReview && (
          <div className="navigation">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`nav-button back-button ${currentStep === 1 ? 'disabled' : ''}`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading}
              className={`nav-button next-button ${isLoading ? 'loading' : ''}`}
            >
              {currentStep === 6 ? 'Review Answers' : 'Next'}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .onboarding-container {
          height: 100vh;
          width: 100vw;
          background: ${theme.bg};
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .onboarding-card {
          width: 100%;
          max-width: 700px;
          background: ${theme.cardBg};
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          margin: 20px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .main-title {
          font-size: 2rem;
          font-weight: 700;
          color: ${theme.text};
          background: linear-gradient(135deg, #00d4aa, #667eea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #a0aec0;
          font-size: 1rem;
        }

        .progress-container {
          width: 100%;
          height: 6px;
          background: #2d3748;
          border-radius: 3px;
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(135deg, #00d4aa, #667eea);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .step-indicator {
          font-size: 0.9rem;
          color: #a0aec0;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .step-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .step-title {
          font-size: 1.5rem;
          color: ${theme.text};
          margin-bottom: 1rem;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.5rem;
        }

        .challenges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.5rem;
        }

        .accessibility-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          color: ${theme.text};
          cursor: pointer;
        }

        .navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          gap: 1rem;
        }

        .nav-button {
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button {
          background: transparent;
          color: ${theme.text};
          border: 2px solid ${theme.accent};
        }

        .back-button.disabled {
          background: #4a5568;
          border-color: #4a5568;
          cursor: not-allowed;
          opacity: 0.5;
        }

        .next-button {
          background: linear-gradient(135deg, #00d4aa, #667eea);
          color: white;
          border: none;
          box-shadow: 0 4px 15px rgba(0,212,170,0.3);
        }

        .next-button.loading {
          background: linear-gradient(135deg, #6b7280, #9ca3af);
          cursor: not-allowed;
        }

        .next-button:hover:not(.loading) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,212,170,0.4);
        }

        .back-button:hover:not(.disabled) {
          background: ${theme.accent};
          color: #1a202c;
          transform: translateY(-2px);
        }

        /* Review Page Styles */
        .review-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .review-title {
          font-size: 1.8rem;
          color: ${theme.text};
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .review-subtitle {
          color: #a0aec0;
          text-align: center;
          margin-bottom: 2rem;
        }

        .review-sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .review-section {
          background: rgba(45, 55, 72, 0.5);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-header h4 {
          color: ${theme.text};
          font-size: 1.2rem;
          margin: 0;
        }

        .edit-button {
          background: transparent;
          color: ${theme.accent};
          border: 1px solid ${theme.accent};
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-button:hover {
          background: ${theme.accent};
          color: #1a202c;
        }

        .review-content {
          color: #a0aec0;
          line-height: 1.6;
        }

        .review-content p {
          margin: 0.5rem 0;
        }

        .review-content strong {
          color: ${theme.text};
        }

        .review-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          gap: 1rem;
        }

        .review-back-button {
          padding: 12px 24px;
          background: transparent;
          color: ${theme.text};
          border: 2px solid ${theme.accent};
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .review-back-button:hover {
          background: ${theme.accent};
          color: #1a202c;
          transform: translateY(-2px);
        }

        .review-submit-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #00d4aa, #667eea);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,212,170,0.3);
        }

        .review-submit-button.loading {
          background: linear-gradient(135deg, #6b7280, #9ca3af);
          cursor: not-allowed;
        }

        .review-submit-button:hover:not(.loading) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,212,170,0.4);
        }
      `}</style>
    </div>
  );
};

export default OnboardingPage;