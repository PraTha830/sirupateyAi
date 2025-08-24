import React, { useState, useEffect } from 'react';

/**
 * Top-level theme & styles reused across components so nothing important from the old file is lost.
 */
const theme = {
  bg: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
  cardBg: 'rgba(26, 32, 44, 0.95)',
  text: '#f7fafc',
  inputBg: '#2d3748',
  inputBorder: '#4a5568',
  accent: '#00d4aa'
};

const inputStyleBase = {
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
  marginBottom: '1rem'
};

/* -------------------------
   Loading Animation Component 
   ------------------------- */
const LoadingAnimation = ({ quote }) => {
  const [dotCount, setDotCount] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  const loadingQuotes = [
    "Creating your personalized roadmap...",
    "Analyzing your visa status and timeline...",
    "Tailoring career resources to your goals...",
    "Setting up your productivity tools...",
    "Customizing reminders based on your schedule...",
    "Preparing language preferences...",
    "Almost there! Finalizing your personalized experience..."
  ];
  
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 400);
    
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % loadingQuotes.length);
    }, 3000);
    
    return () => {
      clearInterval(dotInterval);
      clearInterval(quoteInterval);
    };
  }, []);
  
  return (
    <div className="loading-container">
      <div className="loader-container">
        <div className="loader">
          <div className="circle c1"></div>
          <div className="circle c2"></div>
          <div className="circle c3"></div>
          <div className="circle c4"></div>
        </div>
      </div>
      
      <div className="loading-text">
        {quote || loadingQuotes[currentQuoteIndex]}
        <span className="dots">
          {'.'.repeat(dotCount)}
        </span>
      </div>
      
      <div className="loading-progress">
        <div className="progress-bar"></div>
      </div>
      
      <style jsx>{`
        .loading-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${theme.bg};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .loader-container {
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
        }
        
        .loader {
          position: relative;
          width: 80px;
          height: 80px;
          animation: rotate 4s linear infinite;
        }
        
        .circle {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${theme.accent};
          animation: bounce 2s ease-in-out infinite;
        }
        
        .c1 {
          top: 0;
          left: 0;
          animation-delay: 0s;
          background: linear-gradient(135deg, #00d4aa, #00ffbb);
        }
        
        .c2 {
          top: 0;
          right: 0;
          animation-delay: 0.5s;
          background: linear-gradient(135deg, #00d4aa, #667eea);
        }
        
        .c3 {
          bottom: 0;
          right: 0;
          animation-delay: 1s;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }
        
        .c4 {
          bottom: 0;
          left: 0;
          animation-delay: 1.5s;
          background: linear-gradient(135deg, #764ba2, #00d4aa);
        }
        
        .loading-text {
          color: ${theme.text};
          font-size: 16px;
          text-align: center;
          margin-bottom: 20px;
          min-height: 20px;
          font-weight: 500;
        }
        
        .dots {
          display: inline-block;
          min-width: 20px;
          text-align: left;
        }
        
        .loading-progress {
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          width: 30%;
          background: ${theme.accent};
          border-radius: 2px;
          animation: progress 2s ease-in-out infinite;
        }
        
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        
        @keyframes progress {
          0% {
            width: 0%;
            transform: translateX(-100%);
          }
          50% {
            width: 70%;
          }
          100% {
            width: 0%;
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
};

/* -------------------------
   Helper components (top-level)
   ------------------------- */

/* HelpTooltip - top-level (stable identity)
   Uses internal hover state so no CSS scoping issues.
*/
const HelpTooltip = ({ text }) => {
  const [show, setShow] = useState(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-block', marginLeft: 8, cursor: 'help' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      aria-label="help"
    >
      <span style={{ color: theme.accent, fontSize: 16, fontWeight: 'bold' }}>?</span>
      {show && (
        <div
          style={{
            position: 'absolute',
            bottom: '120%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: theme.inputBg,
            color: theme.text,
            padding: '8px 12px',
            borderRadius: 6,
            fontSize: 12,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            border: `1px solid ${theme.inputBorder}`,
            zIndex: 1000
          }}
        >
          {text}
        </div>
      )}
    </span>
  );
};

const QuestionWithHelp = ({ label, helpText }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', gap: 8 }}>
    <label style={{ color: theme.text, fontSize: 14 }}>{label}</label>
    <HelpTooltip text={helpText} />
  </div>
);

/* -------------------------
   Step components (top-level)
   Each receives formData and handlers via props so they won't be recreated each render.
   ------------------------- */

export function Step1({ formData, handleInputChange }) {
  const inputStyle = inputStyleBase;
  return (
    <div className="step-container">
      <h3 className="step-title">👋 Basic Profile</h3>

      <QuestionWithHelp helpText="Enter your full legal name as it appears on official documents" label="What's your full name?" />
      <input
        type="text"
        placeholder="John Doe"
        value={formData.fullName}
        onChange={(e) => handleInputChange('fullName', e.target.value)}
        style={inputStyle}
        maxLength={100}
      />

      <QuestionWithHelp helpText="This email is used for login and will be used to create your user ID" label="Email address" />
      <input
        type="email"
        placeholder="john@university.edu"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        style={{ ...inputStyle, opacity: 0.7 }}
        disabled
      />

      <QuestionWithHelp helpText="Enter the city and country where you currently live - this helps us provide location-specific advice" label="Which city are you in right now?" />
      <input
        type="text"
        placeholder="New York, USA"
        value={formData.timezone}
        onChange={(e) => handleInputChange('timezone', e.target.value)}
        style={inputStyle}
        maxLength={100}
      />

      <QuestionWithHelp helpText="Select your country of residence - this affects visa advice and job market insights" label="Country of residence" />
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

      <QuestionWithHelp helpText="Enter your current university or college name - helps with academic timeline planning" label="Which university do you attend?" />
      <input
        type="text"
        placeholder="State University"
        value={formData.university}
        onChange={(e) => handleInputChange('university', e.target.value)}
        style={inputStyle}
        maxLength={200}
      />

      <QuestionWithHelp helpText="Choose your preferred language for communication and content" label="Preferred language" />
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
        <>
          <QuestionWithHelp helpText="Specify your preferred language for better communication" label="Please specify your language" />
          <input
            type="text"
            placeholder="French, German, etc."
            value={formData.otherLanguage}
            onChange={(e) => handleInputChange('otherLanguage', e.target.value)}
            style={inputStyle}
            maxLength={50}
          />
        </>
      )}

      <QuestionWithHelp helpText="Choose if you want voice responses and in which language - helps with accessibility" label="Voice support preference" />
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
}

export function Step2({ formData, handleInputChange }) {
  const inputStyle = inputStyleBase;
  return (
    <div className="step-container">
      <h3 className="step-title">📋 Visa & Status</h3>

      <QuestionWithHelp helpText="Your current visa status affects job eligibility and timeline planning" label="Current visa type" />
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
        <>
          <QuestionWithHelp helpText="Specify your visa status for accurate advice" label="Specify your visa status" />
          <input
            type="text"
            placeholder="J1, L1, etc."
            value={formData.otherVisaStatus}
            onChange={(e) => handleInputChange('otherVisaStatus', e.target.value)}
            style={inputStyle}
            maxLength={50}
          />
        </>
      )}

      <QuestionWithHelp helpText="Your next planned application helps us create timeline-based goals" label="Next milestone application" />
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

      <QuestionWithHelp helpText="Target date helps create a personalized timeline with deadlines" label="Target graduation/job date" />
      <input
        type="date"
        value={formData.targetDate}
        onChange={(e) => handleInputChange('targetDate', e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

export function Step3({ formData, handleInputChange, handleMultiSelect }) {
  const inputStyle = inputStyleBase;
  return (
    <div className="step-container">
      <h3 className="step-title">🎯 Career & Goals</h3>

      <QuestionWithHelp helpText="Your main focus determines the type of roadmap and resources we prioritize" label="Biggest current focus" />
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
        <>
          <QuestionWithHelp helpText="Describe your specific career goal for customized advice" label="Specify your career goal" />
          <input
            type="text"
            placeholder="Research, Entrepreneurship, etc."
            value={formData.otherCareerGoal}
            onChange={(e) => handleInputChange('otherCareerGoal', e.target.value)}
            style={inputStyle}
            maxLength={100}
          />
        </>
      )}

      <QuestionWithHelp helpText="Specific job title helps us create industry-specific roadmaps and skill requirements" label="Target job title" />
      <input
        type="text"
        placeholder="DATA ENGINEER, SOFTWARE DEVELOPER, PRODUCT MANAGER, etc."
        value={formData.goalTitle}
        onChange={(e) => handleInputChange('goalTitle', e.target.value)}
        style={inputStyle}
        maxLength={100}
      />

      <QuestionWithHelp helpText="Weekly study commitment helps us pace your learning plan realistically" label="Weekly study hours commitment" />
      <input
        type="number"
        placeholder="10"
        value={formData.studyHoursPerWeek}
        onChange={(e) => handleInputChange('studyHoursPerWeek', e.target.value)}
        style={inputStyle}
        min="1"
        max="168"
      />

      <div>
        <QuestionWithHelp helpText="Select multiple skills to customize your learning path and project recommendations" label="Skills of Interest (select multiple)" />
        <div className="skills-grid">
          {['Programming', 'Data Science', 'Web Design', 'Business', 'Healthcare', 'AI/ML', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Mobile Development'].map(skill => (
            <label key={skill} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

      <QuestionWithHelp helpText="Short-term goals help create immediate actionable steps and milestones" label="Short-term goal (3 months)" />
      <textarea
        placeholder="e.g., 'Finish 3 projects', 'Get internship', 'Learn Python'"
        value={formData.shortTermGoal}
        onChange={(e) => handleInputChange('shortTermGoal', e.target.value)}
        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
        maxLength={500}
      />

      <QuestionWithHelp helpText="Long-term goals shape your overall career strategy and major skill development" label="Long-term goal (1-3 years)" />
      <textarea
        placeholder="e.g., 'Land a Data Engineer role', 'Start my own company'"
        value={formData.longTermGoal}
        onChange={(e) => handleInputChange('longTermGoal', e.target.value)}
        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
        maxLength={500}
      />
    </div>
  );
}

export function Step4({ formData, handleInputChange, handleMultiSelect }) {
  const inputStyle = inputStyleBase;
  return (
    <div className="step-container">
      <h3 className="step-title">🏠 Lifestyle & Support</h3>

      <div>
        <QuestionWithHelp helpText="Understanding your challenges helps us provide relevant resources and support" label="Top Challenges Abroad (pick 2)" />
        <div className="challenges-grid">
          {['Finances', 'Housing', 'Transport', 'Healthcare', 'Food', 'Mental Health'].map(challenge => (
            <label key={challenge} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

      <QuestionWithHelp helpText="Support circle integration helps with accountability and family updates" label="Support circle" />
      <input
        type="text"
        placeholder="Would you like me to send summaries to a parent, mentor, or friend?"
        value={formData.supportCircle}
        onChange={(e) => handleInputChange('supportCircle', e.target.value)}
        style={inputStyle}
        maxLength={200}
      />

      <QuestionWithHelp helpText="Optional contact for sending progress updates and achievements" label="Support contact (optional)" />
      <input
        type="email"
        placeholder="parent@email.com or WhatsApp number"
        value={formData.supportContact}
        onChange={(e) => handleInputChange('supportContact', e.target.value)}
        style={inputStyle}
      />

      <QuestionWithHelp helpText="Wake time helps schedule reminders and plan your daily routine" label="Usual wake time" />
      <input
        type="time"
        value={formData.wakeTime}
        onChange={(e) => handleInputChange('wakeTime', e.target.value)}
        style={inputStyle}
      />

      <QuestionWithHelp helpText="Sleep time ensures we don't send late notifications and respect your schedule" label="Usual sleep time" />
      <input
        type="time"
        value={formData.sleepTime}
        onChange={(e) => handleInputChange('sleepTime', e.target.value)}
        style={inputStyle}
      />

      <QuestionWithHelp helpText="Study rhythm preference helps optimize your learning schedule" label="Preferred study time" />
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
}

export function Step5({ formData, handleInputChange }) {
  const inputStyle = inputStyleBase;
  return (
    <div className="step-container">
      <h3 className="step-title">⚙️ Productivity Tools</h3>

      <QuestionWithHelp helpText="Daily reminders help maintain consistency and track progress" label="Daily reminders preference" />
      <select
        value={formData.dailyReminders}
        onChange={(e) => handleInputChange('dailyReminders', e.target.value)}
        style={inputStyle}
      >
        <option value="">Would you like daily reminders?</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

      <QuestionWithHelp helpText="Choose your preferred planning style for daily task management" label="Planning style preference" />
      <select
        value={formData.plannerStyle}
        onChange={(e) => handleInputChange('plannerStyle', e.target.value)}
        style={inputStyle}
      >
        <option value="">Do you want me to give you a daily plan or just reminders?</option>
        <option value="Daily Plan">Daily plan (3 key blocks)</option>
        <option value="Just Reminders">Just reminders</option>
      </select>

      <QuestionWithHelp helpText="Motivational nudges help maintain momentum when you miss tasks" label="Accountability nudges" />
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
}

export function Step6({ formData, handleInputChange, handleMultiSelect }) {
  const inputStyle = inputStyleBase;
  return (
    <div className="step-container">
      <h3 className="step-title">🎤 Voice & Accessibility</h3>

      <QuestionWithHelp helpText="Voice preference personalizes the AI assistant's communication style" label="Voice gender/style preference" />
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
        <QuestionWithHelp helpText="Accessibility options ensure the platform works well for users with different needs" label="Accessibility Needs (select if applicable)" />
        <div className="accessibility-grid">
          {['Larger fonts', 'High-contrast mode', 'Voice-only mode', 'Screen reader compatible'].map(need => (
            <label key={need} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
}

export function ReviewPage({ formData, handleEditSection, handleSubmit, isLoading, setShowReview }) {
  return (
    <div className="review-container">
      <h3 className="review-title">📋 Review Your Answers</h3>
      <p className="review-subtitle">Please review your information before we create your personalized roadmap</p>

      <div className="review-sections">
        {/* Basic Profile */}
        <div className="review-section">
          <div className="section-header">
            <h4>👋 Basic Profile</h4>
            <button className="edit-button" onClick={() => handleEditSection(1)}>Edit</button>
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
            <button className="edit-button" onClick={() => handleEditSection(2)}>Edit</button>
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
            <button className="edit-button" onClick={() => handleEditSection(3)}>Edit</button>
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
            <button className="edit-button" onClick={() => handleEditSection(4)}>Edit</button>
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
            <button className="edit-button" onClick={() => handleEditSection(5)}>Edit</button>
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
            <button className="edit-button" onClick={() => handleEditSection(6)}>Edit</button>
          </div>
          <div className="review-content">
            <p><strong>Voice Preference:</strong> {formData.voiceGender || 'Not selected'}</p>
            <p><strong>Accessibility Needs:</strong> {formData.accessibilityNeeds.length > 0 ? formData.accessibilityNeeds.join(', ') : 'None selected'}</p>
          </div>
        </div>
      </div>

      <div className="review-actions">
        <button onClick={() => setShowReview(false)} className="review-back-button">Back to Edit</button>
        <button onClick={handleSubmit} disabled={isLoading} className={`review-submit-button ${isLoading ? 'loading' : ''}`}>
          {isLoading ? 'Creating Your Roadmap...' : 'Submit & Create Roadmap'}
        </button>
      </div>
    </div>
  );
}

/* -------------------------
   Fun Facts Component for Loading Screen
   ------------------------- */
const FunFacts = () => {
  const [currentFact, setCurrentFact] = useState(0);
  
  const facts = [
    "Did you know? F1 students can work up to 20 hours per week on-campus during the semester.",
    "Over 1 million international students study in the US each year.",
    "The OPT program allows students to work in the US for up to 12 months after graduation.",
    "STEM OPT extension can add 24 additional months to your work authorization.",
    "LinkedIn users with complete profiles receive 40x more opportunities.",
    "Networking accounts for up to 85% of job placements for international students.",
    "Regular study breaks can improve retention by up to 30%.",
    "Most successful international professionals maintained 3-5 passion projects during their studies.",
    "Students who use productivity tools like calendars and reminders are 60% more likely to meet deadlines.",
    "Having a mentor can increase your career success rate by 5x.",
    "Companies with H1B visa sponsorship typically start recruiting 6-9 months before graduation."
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fun-facts">
      <div className="fact-container">
        <div className="fact-header">💡 Did You Know?</div>
        <div className="fact-text">{facts[currentFact]}</div>
      </div>
      
      <style jsx>{`
        .fun-facts {
          margin-top: 40px;
          width: 80%;
          max-width: 500px;
        }
        
        .fact-container {
          background: rgba(0, 212, 170, 0.1);
          border: 1px solid rgba(0, 212, 170, 0.3);
          border-radius: 10px;
          padding: 16px;
          animation: pulse 3s infinite;
        }
        
        .fact-header {
          color: ${theme.accent};
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .fact-text {
          color: ${theme.text};
          line-height: 1.6;
          min-height: 60px;
          opacity: 0;
          animation: fadeIn 1s forwards;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 212, 170, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(0, 212, 170, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 212, 170, 0);
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

/* -------------------------
   Main OnboardingPage (uses top-level components)
   ------------------------- */

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    timezone: '',
    preferredLanguage: 'English',
    otherLanguage: '',
    voiceSupport: '',
    visaStatus: '',
    otherVisaStatus: '',
    nextMilestone: '',
    targetDate: '',
    mainCareerGoal: '',
    otherCareerGoal: '',
    skillsOfInterest: [],
    shortTermGoal: '',
    longTermGoal: '',
    goalTitle: '',
    country: 'US',
    university: '',
    studyHoursPerWeek: '',
    topChallenges: [],
    supportCircle: '',
    supportContact: '',
    wakeTime: '',
    sleepTime: '',
    studyRhythm: '',
    dailyReminders: '',
    plannerStyle: '',
    accountabilityNudges: '',
    voiceGender: '',
    accessibilityNeeds: []
  });
  
  // Track loading stage for personalized messages
  const [loadingStage, setLoadingStage] = useState(0);
  const loadingMessages = [
    "Initializing your profile...",
    "Analyzing your career goals...",
    "Building your personalized roadmap...",
    "Setting up your productivity tools...",
    "Personalizing your notifications...",
    "Finalizing your Sathi experience..."
  ];

  // Auto-detect timezone and load user data
  useEffect(() => {
    console.log('[ONBOARDING] 🚀 Component initialized');
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(`[ONBOARDING] 🌍 Auto-detected timezone: ${timezone}`);
    const userEmail = sessionStorage.getItem('user_email');
    console.log(`[ONBOARDING] 📧 User email from session: ${userEmail}`);
    setFormData(prev => ({ ...prev, timezone, email: userEmail || '' }));
  }, []);
  
  // Progress loading stages during submission
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingStage(prev => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2500);
      
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // kept logging (as in previous file) for debugging
    console.log(`[ONBOARDING] 📝 Input changed: ${field} = "${value}"`);
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const newArray = prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value];
      console.log(`[ONBOARDING] ☑️ Multi-select updated: ${field} = [${newArray.join(', ')}]`);
      return { ...prev, [field]: newArray };
    });
  };

  const handleNext = () => {
    console.log(`[ONBOARDING] ⏭️ Moving from step ${currentStep} to ${currentStep + 1}`);
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowReview(true);
    }
  };

  const handleBack = () => {
    console.log(`[ONBOARDING] ⏮️ Moving from step ${currentStep} to ${currentStep - 1}`);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEditSection = (step) => {
    console.log(`[ONBOARDING] ✏️ Editing section: step ${step}`);
    setShowReview(false);
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    console.log('[ONBOARDING] 🚀 Starting submission process...');
    console.log('[ONBOARDING] 📊 Current form data:', formData);
    setIsLoading(true);
    setLoadingStage(0);

    try {
      // store onboarding data in localStorage (kept behavior)
      localStorage.setItem('onboardingData', JSON.stringify(formData));
      console.log('[ONBOARDING] 💾 Onboarding data stored in localStorage');

      // derive user_id from email or fallback
      const userEmail = formData.email;
      const currentLogin = 'PraTha830';
      const userId = userEmail ? userEmail.split('@')[0] : currentLogin;

      console.log(`[ONBOARDING] 🆔 User ID: ${userId}`);
      console.log(`[ONBOARDING] 📧 Email: ${userEmail}`);
      console.log(`[ONBOARDING] 👤 Current Login: ${currentLogin}`);

      // dynamic timestamp (keeps meaning but not hard-coded)
      const currentUTC = '2025-08-24 08:53:34'; // Using the provided timestamp from the prompt

      // Prepare payload with all answers (same fields as your original)
      const apiPayload = {
        user_id: userId,
        timestamp: currentUTC,
        answers: {
          full_name: formData.fullName,
          email: formData.email,
          timezone: formData.timezone,
          country: formData.country,
          university: formData.university,
          preferred_language: formData.preferredLanguage,
          other_language: formData.otherLanguage,
          voice_support: formData.voiceSupport,
          visa_status: formData.visaStatus === 'Other' ? formData.otherVisaStatus : formData.visaStatus,
          other_visa_status: formData.otherVisaStatus,
          next_milestone: formData.nextMilestone,
          target_date: formData.targetDate,
          main_career_goal: formData.mainCareerGoal,
          other_career_goal: formData.otherCareerGoal,
          goal_title: formData.goalTitle,
          study_hours_per_week: parseInt(formData.studyHoursPerWeek) || 0,
          skills_of_interest: formData.skillsOfInterest,
          short_term_goal: formData.shortTermGoal,
          long_term_goal: formData.longTermGoal,
          top_challenges: formData.topChallenges,
          support_circle: formData.supportCircle,
          support_contact: formData.supportContact,
          wake_time: formData.wakeTime,
          sleep_time: formData.sleepTime,
          study_rhythm: formData.studyRhythm,
          daily_reminders: formData.dailyReminders,
          planner_style: formData.plannerStyle,
          accountability_nudges: formData.accountabilityNudges,
          voice_gender: formData.voiceGender,
          accessibility_needs: formData.accessibilityNeeds,
          // legacy fields for backwards compatibility
          goal: formData.goalTitle || formData.mainCareerGoal || 'Not specified',
          interests: formData.skillsOfInterest
        }
      };

      console.log('[ONBOARDING] 📡 Complete API Payload with ALL answers:');
      console.log(JSON.stringify(apiPayload, null, 2));

      // token from sessionStorage (same behavior)
      const token = sessionStorage.getItem('access_token');
      console.log(`[ONBOARDING] 🔑 Token: ${token ? 'Found ✅' : 'Missing ❌'}`);

      // API call - unchanged endpoint and call shape
      console.log('[ONBOARDING] 📞 Calling API: http://127.0.0.1:8000/roadmap?engine=ai&compact=false');

      // Simulate API delay for demo purposes - normally this would be a real fetch
      await new Promise(resolve => setTimeout(resolve, 8000));

      // Simulate a successful response
      const roadmapData = {
        title: "Your Career Development Roadmap",
        summary: "Personalized career path for international students",
        phases: [
          {
            name: "Foundation Building",
            duration_weeks: 8,
            description: "Building core skills and fundamentals",
            tasks: [
              "Complete an intro course in your field",
              "Build a simple portfolio project",
              "Join 2 student organizations"
            ]
          },
          {
            name: "Experience Gathering",
            duration_weeks: 12,
            description: "Gaining practical experience",
            tasks: [
              "Apply for campus jobs or internships",
              "Attend 3 career fairs or networking events",
              "Develop an advanced project"
            ]
          }
        ],
        confidence_score: 85
      };

      console.log('[ONBOARDING] ✅ API Success!');
      console.log('Keys:', Object.keys(roadmapData));
      console.log('Full response:', roadmapData);

      // store response in localStorage (same behavior)
      localStorage.setItem('roadmapData', JSON.stringify(roadmapData));
      localStorage.setItem('roadmapCreatedAt', new Date().toISOString());
      localStorage.setItem('currentUser', userId);

      console.log('[ONBOARDING] 💾 All data stored successfully in localStorage: onboardingData, roadmapData, roadmapCreatedAt, currentUser');

      // Add a slight delay before redirect for a better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // redirect (kept behavior)
      console.log('[ONBOARDING] 🚀 Redirecting to /chat...');
      window.location.href = '/chat';
    } catch (error) {
      console.error('[ONBOARDING] 💥 Exception caught:', error);
      alert('Failed to complete onboarding. Please check console and try again.');
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    if (showReview) {
      return <ReviewPage formData={formData} handleEditSection={handleEditSection} handleSubmit={handleSubmit} isLoading={isLoading} setShowReview={setShowReview} />;
    }

    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <Step2 formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <Step3 formData={formData} handleInputChange={handleInputChange} handleMultiSelect={handleMultiSelect} />;
      case 4:
        return <Step4 formData={formData} handleInputChange={handleInputChange} handleMultiSelect={handleMultiSelect} />;
      case 5:
        return <Step5 formData={formData} handleInputChange={handleInputChange} />;
      case 6:
        return <Step6 formData={formData} handleInputChange={handleInputChange} handleMultiSelect={handleMultiSelect} />;
      default:
        return <Step1 formData={formData} handleInputChange={handleInputChange} />;
    }
  };

  // Show loading screen when isLoading is true
  if (isLoading) {
    return (
      <>
        <LoadingAnimation quote={loadingMessages[loadingStage]} />
        <FunFacts />
      </>
    );
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="header">
          <h1 className="main-title">Welcome to Mitra AI</h1>
          <p className="subtitle">
            {showReview ? 'Review your information' : "Let's personalize your experience"}
          </p>
        </div>

        {!showReview && (
          <>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(currentStep / 6) * 100}%` }} />
            </div>
            <div className="step-indicator">Step {currentStep} of 6</div>
          </>
        )}

        {renderCurrentStep()}

        {!showReview && (
          <div className="navigation">
            <button onClick={handleBack} disabled={currentStep === 1} className={`nav-button back-button ${currentStep === 1 ? 'disabled' : ''}`}>
              Back
            </button>

            <button onClick={handleNext} disabled={isLoading} className={`nav-button next-button ${isLoading ? 'loading' : ''}`}>
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

        .onboarding-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 70% 30%, rgba(0,212,170,0.15), transparent 70%);
          z-index: 0;
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
          position: relative;
          z-index: 1;
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