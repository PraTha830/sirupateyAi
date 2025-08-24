import React, { useState, useEffect, useRef } from 'react';

/**
 * MitraChat - A friendly AI chat interface for the Sathi platform
 * - Personalized welcome using user's name
 * - Voice assistant "coming soon" feature
 * - Responsive, modern design with mint theme
 * - Interactive chat experience simulating a friendly conversation
 */

const MitraChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sample greeting options that feel personal and friendly
  const greetings = [
    "Namaste! How can I assist you today?",
    "Namaskar! I'm Mitra, your AI companion. How can I help you?",
    "Hello! I'm here to support your journey. What's on your mind?",
    "Namaste! Ready to chat whenever you are.",
    "Hi there! I'm Mitra, your personal assistant. How can I help?"
  ];

  // Sample responses for common questions to simulate AI answering
  const sampleResponses = {
    "hello": ["Hello! How are you doing today?", "Hi there! What can I help you with?"],
    "hi": ["Hey! What's on your mind today?", "Hello! How can I assist you?"],
    "how are you": ["I'm doing well, thanks for asking! How about you?", "I'm great! Thanks for checking in. How can I help you today?"],
    "help": ["I'd be happy to help! You can ask me about visa information, career advice, academic support, or just chat!"],
    "visa": ["I can help with visa information! Are you looking for details about F1, OPT, or H1B visas?"],
    "job": ["Looking for job advice? I can help with resume tips, interview preparation, or job search strategies."],
    "study": ["Need study help? I can offer time management tips, study resources, or help you plan your academic schedule."],
    "thank you": ["You're welcome! I'm always here to help.", "Anytime! Is there anything else you'd like to know?"],
    "thanks": ["You're welcome! Happy to assist.", "My pleasure! What else can I help with?"]
  };

  // Get saved user data and onboarding information
  useEffect(() => {
    try {
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData')) || {};
      const currentUser = localStorage.getItem('currentUser') || 'PraTha830';
      
      // Set user profile from stored data
      setUserProfile({
        name: onboardingData.fullName || currentUser,
        interests: onboardingData.skillsOfInterest || [],
        goal: onboardingData.goalTitle || onboardingData.mainCareerGoal || 'career development',
        language: onboardingData.preferredLanguage || 'English'
      });
      
      console.log('[MITRA CHAT] Loaded user profile:', onboardingData);
    } catch (error) {
      console.error('[MITRA CHAT] Error loading user data:', error);
      setUserProfile({ name: 'PraTha830', interests: [], goal: 'career development' });
    }
  }, []);

  // Add initial greeting message when component loads and user profile is set
  useEffect(() => {
    if (userProfile && messages.length === 0) {
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      const personalizedGreeting = `Namaste, ${userProfile.name}! ${randomGreeting}`;
      
      // Simulate typing effect for initial greeting
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          { 
            id: Date.now(), 
            text: personalizedGreeting, 
            sender: 'ai',
            timestamp: new Date().toISOString()
          }
        ]);
        setIsTyping(false);
      }, 1500);
    }
  }, [userProfile]);

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus on input field when component loads
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Simulate AI response based on user message content
  const getAIResponse = (userMessage) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Check for exact matches in sample responses
    for (const [key, responses] of Object.entries(sampleResponses)) {
      if (lowercaseMessage.includes(key)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Generate personalized response if no match found
    const personalizedResponses = [
      `I'm searching for information about ${userMessage}. Can you tell me more about what you're looking for?`,
      `That's an interesting question about ${userMessage}. Could you provide more details so I can help better?`,
      `I'd be happy to help with information about ${userMessage}. What specific aspects are you interested in?`,
      `I'm analyzing your question about ${userMessage}. Can you elaborate a bit more?`
    ];
    
    return personalizedResponses[Math.floor(Math.random() * personalizedResponses.length)];
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate network request delay (500-2000ms)
    const responseDelay = Math.floor(Math.random() * 1500) + 500;
    
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: getAIResponse(inputValue.trim()),
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, responseDelay);
  };

  // Format timestamp into readable time
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '';
    }
  };

  // Show voice assistant coming soon modal
  const handleVoiceAssistant = () => {
    setShowVoiceModal(true);
    
    // Auto close modal after 4 seconds
    setTimeout(() => {
      setShowVoiceModal(false);
    }, 4000);
  };

  return (
    <div className="mitra-chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <h1 className="chat-title">Mitra Chat</h1>
          <p className="chat-subtitle">Your friendly AI companion for international student success</p>
        </div>
        
        <div className="header-actions">
          <button className="voice-button" onClick={handleVoiceAssistant}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
            <span>Voice</span>
          </button>
          
          <button className="clear-button" onClick={() => setMessages([])}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Clear Chat</span>
          </button>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              {message.sender === 'ai' && (
                <div className="avatar">
                  <span>M</span>
                </div>
              )}
              <div className="message-bubble">
                {message.text}
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai-message">
            <div className="message-content">
              <div className="avatar">
                <span>M</span>
              </div>
              <div className="message-bubble typing">
                <span className="typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <form className="chat-input-container" onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!inputValue.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
      
      {/* Voice Assistant Coming Soon Modal */}
      {showVoiceModal && (
        <div className="voice-modal">
          <div className="voice-modal-content">
            <div className="voice-icon-container">
              <div className="voice-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </div>
              
              <div className="voice-waves">
                <div className="wave wave1"></div>
                <div className="wave wave2"></div>
                <div className="wave wave3"></div>
              </div>
            </div>
            
            <h3>Voice Assistant Coming Soon!</h3>
            <p>We're working on an exciting voice interface for more natural conversations.</p>
            <div className="eta">Expected Release: September 2025</div>
          </div>
        </div>
      )}
      
      {/* Styles */}
      <style jsx>{`
        .mitra-chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: #0f172a;
          color: #f8fafc;
          font-family: 'Inter', sans-serif;
        }
        
        /* Header Styles */
        .chat-header {
          background: linear-gradient(90deg, #0f172a, #1e293b);
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .chat-title {
          font-size: 24px;
          margin: 0;
          background: linear-gradient(90deg, #00d4aa, #67e8f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .chat-subtitle {
          color: #94a3b8;
          margin: 4px 0 0;
          font-size: 14px;
        }
        
        .header-actions {
          display: flex;
          gap: 12px;
        }
        
        .voice-button, .clear-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .voice-button:hover, .clear-button:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-1px);
        }
        
        /* Messages Area */
        .chat-messages {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .message {
          display: flex;
          margin-bottom: 8px;
        }
        
        .user-message {
          justify-content: flex-end;
        }
        
        .ai-message {
          justify-content: flex-start;
        }
        
        .message-content {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 80%;
        }
        
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(45deg, #00d4aa, #0ea5e9);
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
        }
        
        .message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
          color: #f8fafc;
          max-width: 100%;
          line-height: 1.5;
        }
        
        .user-message .message-bubble {
          background: linear-gradient(135deg, #0284c7, #0ea5e9);
          border-bottom-right-radius: 4px;
        }
        
        .ai-message .message-bubble {
          background: #1e293b;
          border-bottom-left-radius: 4px;
        }
        
        .message-time {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          position: absolute;
          bottom: 2px;
          right: 8px;
        }
        
        /* Typing indicator */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 4px;
        }
        
        .dot {
          width: 8px;
          height: 8px;
          background: #94a3b8;
          border-radius: 50%;
          animation: bounce 1.5s infinite ease-in-out;
        }
        
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        
        /* Input Area */
        .chat-input-container {
          padding: 16px 24px;
          background: #1e293b;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .chat-input {
          flex: 1;
          padding: 14px 16px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #f8fafc;
          font-size: 16px;
          outline: none;
          transition: all 0.2s ease;
        }
        
        .chat-input:focus {
          border-color: #00d4aa;
          box-shadow: 0 0 0 2px rgba(0,212,170,0.2);
        }
        
        .send-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #00d4aa, #0ea5e9);
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .send-button:hover {
          transform: scale(1.05);
        }
        
        .send-button:disabled {
          background: #334155;
          color: #64748b;
          cursor: not-allowed;
          transform: none;
        }
        
        /* Voice Modal */
        .voice-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease forwards;
        }
        
        .voice-modal-content {
          background: linear-gradient(135deg, #0f172a, #1e293b);
          border-radius: 16px;
          padding: 32px;
          width: 90%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(255,255,255,0.1);
          animation: slideUp 0.3s ease forwards;
        }
        
        .voice-icon-container {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
        }
        
        .voice-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #00d4aa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          position: relative;
          z-index: 2;
        }
        
        .voice-waves {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }
        
        .wave {
          position: absolute;
          border: 2px solid #00d4aa;
          border-radius: 50%;
          opacity: 0;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          animation: ripple 2s linear infinite;
        }
        
        .wave2 {
          animation-delay: 0.5s;
        }
        
        .wave3 {
          animation-delay: 1s;
        }
        
        .voice-modal-content h3 {
          color: #f8fafc;
          margin: 0 0 12px;
          font-size: 22px;
        }
        
        .voice-modal-content p {
          color: #94a3b8;
          margin: 0 0 20px;
          line-height: 1.5;
        }
        
        .eta {
          background: rgba(0,212,170,0.1);
          color: #00d4aa;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          display: inline-block;
        }
        
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .chat-header {
            padding: 12px 16px;
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-actions {
            margin-top: 12px;
          }
          
          .chat-messages {
            padding: 16px;
          }
          
          .message-content {
            max-width: 90%;
          }
          
          .chat-input-container {
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default MitraChat;