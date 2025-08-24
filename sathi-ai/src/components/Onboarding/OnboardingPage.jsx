import React, { useState, useEffect, useCallback } from 'react';

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

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      if (prev[field] === value) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

  const handleMultiSelect = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  }, []);

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
      sessionStorage.setItem('onboardingData', JSON.stringify(formData));
      
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

      const token = sessionStorage.getItem('access_token');
      
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
        sessionStorage.setItem('roadmapData', JSON.stringify(roadmapData));
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

  // ✅ INLINE STYLES LIKE YOUR WORKING EXAMPLE
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
    marginBottom: '1.5rem'
  };

  const textareaStyle = {
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
    marginBottom: '1.5rem',
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'inherit'
  };

  const Step1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.5rem', color: theme.text, marginBottom: '1rem' }}>
        👋 Basic Profile
      </h3>
      
      <input
        type="text"
        placeholder="What's your full name?"
        value={formData.fullName}
        onChange={(e) => handleInputChange('fullName', e.target.value)}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
        onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
        maxLength={100}
      />
      
      <input
        type="email"
        placeholder="Email address"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
        onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
        disabled
      />
      
      <input
        type="text"
        placeholder="Which city are you in right now?"
        value={formData.timezone}
        onChange={(e) => handleInputChange('timezone', e.target.value)}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
        onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
        maxLength={100}
      />

      <select
        value={formData.country}
        onChange={(e) => handleInputChange('country', e.target.value)}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
        onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
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
        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
        onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
        maxLength={200}
      />
      
      <select
        value={formData.preferredLanguage}
        onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
        onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
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
          onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
          onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
          maxLength={50}
        />
      )}
      
      <select
        value={formData.voiceSupport}
        onChange={(e) => handleInputChange('voiceSupport', e.target.value)}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
        onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
      >
        <option value="">Do you want me to talk back to you?</option>
        <option value="English">English only</option>
        <option value="Native">Native language only</option>
        <option value="Both">Both English and native</option>
      </select>
    </div>
  );

  const Step3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.5rem', color: theme.text, marginBottom: '1rem' }}>
        🎯 Career & Goals
      </h3>
      
      <select
        value={formData.mainCareerGoal}
        onChange={(e) => handleInputChange('mainCareerGoal', e.target.value)}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
        onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
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
          onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
          onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
          maxLength={100}
        />
      )}

      <input
        type="text"
        placeholder="Goal Title: DATA ENGINEER, SOFTWARE DEVELOPER, PRODUCT MANAGER, etc."
        value={formData.goalTitle}
        onChange={(e) => handleInputChange('goalTitle', e.target.value)}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
        onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
        maxLength={100}
      />

      <input
        type="number"
        placeholder="How many hours can you commit to learn this per week?"
        value={formData.studyHoursPerWeek}
        onChange={(e) => handleInputChange('studyHoursPerWeek', e.target.value)}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
        onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
        min="1"
        max="168"
      />
      
      <div>
        <p style={{ color: theme.text, marginBottom: '1rem' }}>Skills of Interest (select multiple):</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
          {['Programming', 'Data Science', 'Web Design', 'Business', 'Healthcare', 'AI/ML', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Mobile Development'].map(skill => (
            <label key={skill} style={{ display: 'flex', alignItems: 'center', color: theme.text, cursor: 'pointer', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.skillsOfInterest.includes(skill)}
                onChange={() => handleMultiSelect('skillsOfInterest', skill)}
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
        style={textareaStyle}
        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
        onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
        maxLength={500}
      />
      
      <textarea
        placeholder="Long-term goal (1-3 years): e.g., 'Land a Data Engineer role'"
        value={formData.longTermGoal}
        onChange={(e) => handleInputChange('longTermGoal', e.target.value)}
        style={textareaStyle}
        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
        onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
        maxLength={500}
      />
    </div>
  );

  const renderCurrentStep = () => {
    if (showReview) return <div>Review Page (placeholder)</div>;
    
    switch (currentStep) {
      case 1: return <Step1 />;
      case 3: return <Step3 />;
      default: return <Step1 />;
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: theme.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '700px',
        background: theme.cardBg,
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        margin: '20px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: theme.text,
            background: 'linear-gradient(135deg, #00d4aa, #667eea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Welcome to Sathi AI
          </h1>
          <p style={{ color: '#a0aec0', fontSize: '1rem' }}>
            Let's personalize your experience
          </p>
        </div>

        {!showReview && (
          <>
            <div style={{
              width: '100%',
              height: '6px',
              background: '#2d3748',
              borderRadius: '3px',
              marginBottom: '2rem',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(currentStep / 6) * 100}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #00d4aa, #667eea)',
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.9rem', color: '#a0aec0', marginBottom: '1.5rem', textAlign: 'center' }}>
              Step {currentStep} of 6
            </div>
          </>
        )}

        {renderCurrentStep()}

        {!showReview && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '2rem',
            gap: '1rem'
          }}>
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              style={{
                padding: '12px 24px',
                background: currentStep === 1 ? '#4a5568' : 'transparent',
                color: theme.text,
                border: `2px solid ${currentStep === 1 ? '#4a5568' : theme.accent}`,
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: currentStep === 1 ? 0.5 : 1
              }}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #00d4aa, #667eea)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,212,170,0.3)'
              }}
            >
              {currentStep === 6 ? 'Review Answers' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;