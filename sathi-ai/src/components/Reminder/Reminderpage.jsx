import React, { useState, useEffect, useRef } from 'react';

/**
 * ReminderPage.jsx - ENHANCED WITH SOUND & CONFETTI
 * - Updated timestamp: 2025-08-24 08:48:11
 * - Current user: PraTha830
 * - Working push notifications with proper testing, sound effects, and confetti animation
 */

const theme = {
  mint: '#00D4AA',
  deepMint: '#00B389',
  cardBg: 'rgba(255,255,255,0.04)',
  softText: '#A7B1C2',
  accent: '#7EE7C7',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444'
};

// Sound effect manager
const SoundManager = {
  audioContext: null,
  
  init() {
    try {
      // Create AudioContext on user interaction to comply with browser policies
      if (!this.audioContext) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        console.log('[SOUND MANAGER] 🔊 Audio context initialized');
      }
      return true;
    } catch (error) {
      console.error('[SOUND MANAGER] ❌ Failed to initialize audio:', error);
      return false;
    }
  },
  
  playNotificationSound() {
    if (!this.audioContext) {
      if (!this.init()) return;
    }
    
    try {
      console.log('[SOUND MANAGER] 🔔 Playing notification sound');
      
      // Create oscillator for beep sound
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5 note
      
      // Create gain node for volume control
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Play sound with fade out
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('[SOUND MANAGER] ❌ Failed to play sound:', error);
    }
  },
  
  playSuccessSound() {
    if (!this.audioContext) {
      if (!this.init()) return;
    }
    
    try {
      console.log('[SOUND MANAGER] 🎵 Playing success sound');
      
      // First note (higher)
      const osc1 = this.audioContext.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, this.audioContext.currentTime); // D5
      
      // Second note (lower)
      const osc2 = this.audioContext.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, this.audioContext.currentTime + 0.15); // A5
      
      // Gain node for volume control
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      
      // Connect and play first note
      osc1.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      osc1.start();
      osc1.stop(this.audioContext.currentTime + 0.15);
      
      // Connect and play second note after a short delay
      osc2.connect(gainNode);
      osc2.start(this.audioContext.currentTime + 0.15);
      osc2.stop(this.audioContext.currentTime + 0.3);
      
      // Fade out
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('[SOUND MANAGER] ❌ Failed to play sound:', error);
    }
  }
};

// Confetti animation manager
const ConfettiManager = {
  canvas: null,
  ctx: null,
  confetti: [],
  colors: ['#00D4AA', '#00B389', '#7EE7C7', '#10B981', '#F59E0B'],
  active: false,
  
  init() {
    // Create canvas element
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '9999';
      this.ctx = this.canvas.getContext('2d');
      
      console.log('[CONFETTI] 🎊 Canvas initialized');
    }
  },
  
  createConfetti(count = 150) {
    this.init();
    
    if (!document.body.contains(this.canvas)) {
      document.body.appendChild(this.canvas);
    }
    
    console.log('[CONFETTI] 🎊 Creating confetti particles');
    
    // Clear existing confetti
    this.confetti = [];
    
    // Create new confetti particles
    for (let i = 0; i < count; i++) {
      this.confetti.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * -this.canvas.height,
        size: Math.random() * 10 + 5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * 0.2 - 0.1,
        wobble: Math.random() * 0.1
      });
    }
    
    if (!this.active) {
      this.active = true;
      this.animate();
    }
    
    // Auto cleanup after 4 seconds
    setTimeout(() => {
      if (document.body.contains(this.canvas)) {
        document.body.removeChild(this.canvas);
        this.active = false;
      }
    }, 4000);
  },
  
  animate() {
    if (!this.active) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.confetti.length; i++) {
      const c = this.confetti[i];
      
      // Update position
      c.y += c.speed;
      c.x += Math.sin(c.angle) * 2;
      c.angle += c.wobble;
      
      // Draw confetti
      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate(c.rotation);
      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
      this.ctx.restore();
      
      // Reset if off screen
      if (c.y > this.canvas.height) {
        c.y = Math.random() * -100;
        c.speed = Math.random() * 3 + 2;
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
};

// Enhanced notification system with sound and confetti
const NotificationManager = {
  permission: null,
  
  async init() {
    console.log('[NOTIFICATIONS] 🔔 Initializing notification system...');
    
    if (!("Notification" in window)) {
      console.log('[NOTIFICATIONS] ❌ Browser does not support notifications');
      return false;
    }

    console.log(`[NOTIFICATIONS] 📋 Current permission: ${Notification.permission}`);
    
    if (Notification.permission === "granted") {
      this.permission = "granted";
      console.log('[NOTIFICATIONS] ✅ Notifications already granted');
      return true;
    }

    if (Notification.permission === "denied") {
      console.log('[NOTIFICATIONS] 🚫 Notifications denied by user');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      console.log(`[NOTIFICATIONS] 📝 Permission request result: ${permission}`);
      
      if (permission === "granted") {
        // Send test notification immediately
        this.sendTestNotification();
        return true;
      }
      return false;
    } catch (error) {
      console.error('[NOTIFICATIONS] 💥 Error requesting permission:', error);
      return false;
    }
  },

  sendTestNotification() {
    console.log('[NOTIFICATIONS] 🧪 Sending test notification...');
    this.send("Sathi AI Notifications Enabled! 🎉", {
      body: "You'll now receive reminders for your career goals",
      icon: '/favicon.ico',
      tag: 'test-notification',
      requireInteraction: true
    });
  },

  send(title, options = {}) {
    if (!("Notification" in window)) {
      console.log('[NOTIFICATIONS] ❌ Notifications not supported');
      return false;
    }

    if (Notification.permission !== "granted") {
      console.log(`[NOTIFICATIONS] ⚠️ Permission not granted: ${Notification.permission}`);
      return false;
    }

    try {
      console.log(`[NOTIFICATIONS] 📤 Sending: "${title}"`);
      
      // Play notification sound
      SoundManager.playNotificationSound();
      
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'sathi-reminder',
        requireInteraction: false,
        silent: false, // Let browser play default sound if our custom sound fails
        ...options
      });

      notification.onclick = function() {
        console.log('[NOTIFICATIONS] 👆 Notification clicked');
        
        // Play success sound on click
        SoundManager.playSuccessSound();
        
        // Show confetti on click
        ConfettiManager.createConfetti();
        
        window.focus();
        notification.close();
      };

      notification.onshow = function() {
        console.log('[NOTIFICATIONS] 👁️ Notification shown');
        
        // Show small confetti burst when notification appears
        ConfettiManager.createConfetti(50);
      };

      notification.onerror = function(err) {
        console.error('[NOTIFICATIONS] ❌ Notification error:', err);
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return true;
    } catch (error) {
      console.error('[NOTIFICATIONS] 💥 Error sending notification:', error);
      return false;
    }
  }
};

// Generate smart reminders based on career roadmap
const generateSmartReminders = (roadmapData, onboardingData) => {
  const currentUser = 'PraTha830';
  const currentUTC = '2025-08-24 08:48:11';
  const userWakeTime = onboardingData?.wakeTime || '08:00';
  const studyRhythm = onboardingData?.studyRhythm || 'Morning';
  const goalTitle = onboardingData?.goalTitle || 'Career Goal';
  
  const smartReminders = [
    {
      id: `daily-study-${Date.now()}`,
      title: `Daily ${goalTitle} Study`,
      description: `Time to work on your ${goalTitle} skills - 30 minutes focused session`,
      type: 'daily',
      time: userWakeTime,
      frequency: 'daily',
      enabled: true,
      category: 'study',
      createdAt: currentUTC,
      createdBy: currentUser
    },
    {
      id: `weekly-review-${Date.now() + 1}`,
      title: 'Weekly Progress Review',
      description: 'Review your progress, celebrate wins, and plan next week',
      type: 'weekly',
      time: userWakeTime,
      frequency: 'weekly',
      day: 'Sunday',
      enabled: true,
      category: 'review',
      createdAt: currentUTC,
      createdBy: currentUser
    },
    {
      id: `motivation-boost-${Date.now() + 2}`,
      title: 'Daily Motivation Boost',
      description: `Remember: You're working towards ${goalTitle}. Every step counts!`,
      type: 'daily',
      time: '12:00', // Midday boost
      frequency: 'daily',
      enabled: true,
      category: 'motivation',
      createdAt: currentUTC,
      createdBy: currentUser
    }
  ];

  // Add phase-specific reminders if roadmap exists
  if (roadmapData?.phases) {
    roadmapData.phases.forEach((phase, index) => {
      if (phase.tasks && phase.tasks.length > 0) {
        smartReminders.push({
          id: `phase-${index}-${Date.now()}`,
          title: `${phase.name} Task`,
          description: phase.tasks[0] || `Work on ${phase.name}`,
          type: 'phase',
          time: userWakeTime,
          frequency: 'daily',
          enabled: index < 2, // Only enable first 2 phases by default
          category: 'phase',
          phase: phase.name,
          createdAt: currentUTC,
          createdBy: currentUser
        });
      }
    });
  }

  return smartReminders;
};

// Celebration component for confetti animation
const Celebration = ({ show, onComplete }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!show) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const confetti = [];
    const colors = [theme.mint, theme.accent, theme.success, theme.warning, '#FFFFFF'];
    
    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Create confetti particles
    for (let i = 0; i < 100; i++) {
      confetti.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 5 + 3,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * 0.2 - 0.1,
        opacity: 1
      });
    }
    
    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let active = false;
      
      for (let i = 0; i < confetti.length; i++) {
        const c = confetti[i];
        if (c.opacity <= 0) continue;
        
        active = true;
        
        // Update position
        c.x += Math.cos(c.angle) * c.speed;
        c.y += Math.sin(c.angle) * c.speed + 1; // Add gravity
        c.rotation += 0.01;
        c.opacity -= 0.005;
        
        // Draw confetti
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.globalAlpha = c.opacity;
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
        ctx.restore();
      }
      
      if (active) {
        animationId = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };
    
    // Start animation
    animate();
    
    // Play sound
    SoundManager.playSuccessSound();
    
    // Cleanup
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [show, onComplete]);
  
  if (!show) return null;
  
  return (
    <div className="celebration-container">
      <canvas ref={canvasRef} className="confetti-canvas"></canvas>
      <style jsx>{`
        .celebration-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 9999;
        }
        .confetti-canvas {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

const ReminderCard = ({ reminder, onEdit, onDelete, onToggle, onTestNotification }) => {
  const getFrequencyDisplay = () => {
    if (reminder.frequency === 'daily') return 'Daily';
    if (reminder.frequency === 'weekly') return `Weekly (${reminder.day || 'Sunday'})`;
    return reminder.frequency;
  };

  const getCategoryColor = () => {
    switch (reminder.category) {
      case 'study': return theme.mint;
      case 'review': return theme.accent;
      case 'phase': return theme.success;
      case 'motivation': return theme.warning;
      default: return theme.softText;
    }
  };

  return (
    <div className={`reminder-card ${reminder.enabled ? 'enabled' : 'disabled'}`}>
      <div className="reminder-header">
        <div className="reminder-meta">
          <div className="reminder-title">{reminder.title}</div>
          <div className="reminder-desc">{reminder.description}</div>
        </div>
        <div className="reminder-controls">
          <button 
            className={`toggle-btn ${reminder.enabled ? 'active' : ''}`}
            onClick={() => onToggle(reminder.id)}
          >
            {reminder.enabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
      
      <div className="reminder-details">
        <div className="detail-item">
          <span className="detail-label">Time:</span>
          <span className="detail-value">{reminder.time}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Frequency:</span>
          <span className="detail-value">{getFrequencyDisplay()}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Category:</span>
          <span className="detail-value" style={{ color: getCategoryColor() }}>
            {reminder.category}
          </span>
        </div>
      </div>

      <div className="reminder-actions">
        <button 
          className="action-btn test" 
          onClick={() => onTestNotification(reminder)}
          title="Send test notification now"
        >
          🔔 Test
        </button>
        <button className="action-btn edit" onClick={() => onEdit(reminder)}>
          Edit
        </button>
        <button className="action-btn delete" onClick={() => onDelete(reminder.id)}>
          Delete
        </button>
      </div>

      <style jsx>{`
        .reminder-card {
          background: ${theme.cardBg};
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 12px;
          transition: all 0.3s ease;
        }
        .reminder-card.enabled {
          border-color: ${theme.mint};
          box-shadow: 0 4px 20px rgba(0,212,170,0.1);
        }
        .reminder-card.disabled {
          opacity: 0.6;
        }
        .reminder-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .reminder-title {
          color: white;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 4px;
        }
        .reminder-desc {
          color: ${theme.softText};
          font-size: 14px;
        }
        .toggle-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: ${theme.softText};
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .toggle-btn.active {
          background: ${theme.mint};
          color: #042028;
          border-color: ${theme.mint};
        }
        .reminder-details {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .detail-item {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .detail-label {
          color: ${theme.softText};
          font-size: 12px;
          font-weight: 600;
        }
        .detail-value {
          color: white;
          font-size: 12px;
        }
        .reminder-actions {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          padding: 6px 12px;
          border-radius: 8px;
          border: none;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .action-btn.test {
          background: rgba(245,158,11,0.2);
          color: ${theme.warning};
        }
        .action-btn.edit {
          background: rgba(126,231,199,0.2);
          color: ${theme.accent};
        }
        .action-btn.delete {
          background: rgba(239,68,68,0.2);
          color: ${theme.danger};
        }
        .action-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

const ReminderForm = ({ reminder, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: reminder?.title || '',
    description: reminder?.description || '',
    time: reminder?.time || '09:00',
    frequency: reminder?.frequency || 'daily',
    day: reminder?.day || 'Sunday',
    category: reminder?.category || 'study',
    enabled: reminder?.enabled ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReminder = {
      ...reminder,
      ...formData,
      id: reminder?.id || `reminder-${Date.now()}`,
      createdAt: reminder?.createdAt || '2025-08-24 08:48:11',
      createdBy: reminder?.createdBy || 'PraTha830',
      updatedAt: '2025-08-24 08:48:11'
    };
    
    // Initialize sound on form submission (user interaction)
    SoundManager.init();
    
    onSave(newReminder);
  };

  return (
    <div className="reminder-form-overlay">
      <div className="reminder-form">
        <h3 className="form-title">{reminder ? 'Edit Reminder' : 'Add New Reminder'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Daily study session"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Work on programming skills for 1 hour"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="study">Study</option>
                <option value="review">Review</option>
                <option value="phase">Phase Task</option>
                <option value="motivation">Motivation</option>
                <option value="personal">Personal</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {formData.frequency === 'weekly' && (
              <div className="form-group">
                <label>Day</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({...formData, day: e.target.value})}
                >
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {reminder ? 'Update' : 'Create'} Reminder
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .reminder-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .reminder-form {
          background: #1a202c;
          border-radius: 16px;
          padding: 24px;
          width: 100%;
          max-width: 500px;
          margin: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .form-title {
          color: white;
          margin: 0 0 20px 0;
          font-size: 20px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-group label {
          display: block;
          color: ${theme.softText};
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05);
          color: white;
          font-size: 14px;
          box-sizing: border-box;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: ${theme.mint};
        }
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }
        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn.primary {
          background: ${theme.mint};
          color: #042028;
        }
        .btn.secondary {
          background: transparent;
          color: ${theme.softText};
          border: 1px solid rgba(255,255,255,0.2);
        }
        .btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default function ReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [onboardingData, setOnboardingData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('checking');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    console.log('[REMINDER PAGE] 🚀 Component initialized');
    
    // Load data from localStorage
    try {
      const onboarding = JSON.parse(localStorage.getItem('onboardingData'));
      const roadmap = JSON.parse(localStorage.getItem('roadmapData'));
      const savedReminders = JSON.parse(localStorage.getItem('sathi_reminders')) || [];
      
      console.log('[REMINDER PAGE] 📊 Loaded onboarding:', onboarding);
      console.log('[REMINDER PAGE] 🗺️ Loaded roadmap:', roadmap);
      console.log('[REMINDER PAGE] ⏰ Loaded reminders:', savedReminders);
      
      setOnboardingData(onboarding);
      setRoadmapData(roadmap);

      // If no saved reminders, generate smart ones
      if (savedReminders.length === 0 && (onboarding || roadmap)) {
        console.log('[REMINDER PAGE] 🧠 Generating smart reminders...');
        const smartReminders = generateSmartReminders(roadmap, onboarding);
        setReminders(smartReminders);
        localStorage.setItem('sathi_reminders', JSON.stringify(smartReminders));
        console.log('[REMINDER PAGE] ✅ Smart reminders generated:', smartReminders);
      } else {
        setReminders(savedReminders);
      }

      // Initialize notifications based on user preferences
      const wantsNotifications = onboarding?.accountabilityNudges === 'Yes' || onboarding?.dailyReminders === 'Yes';
      console.log('[REMINDER PAGE] 🔔 User wants notifications:', wantsNotifications);
      
      if (wantsNotifications) {
        initNotifications();
      } else {
        setNotificationStatus('disabled-by-user');
      }
    } catch (error) {
      console.error('[REMINDER PAGE] ❌ Error loading data:', error);
    }
  }, []);

  const initNotifications = async () => {
    console.log('[REMINDER PAGE] 🔔 Initializing notifications...');
    setNotificationStatus('requesting');
    
    // Initialize sound system on user interaction
    SoundManager.init();
    
    const enabled = await NotificationManager.init();
    setNotificationsEnabled(enabled);
    setNotificationStatus(enabled ? 'enabled' : 'denied');
    
    console.log('[REMINDER PAGE] 📋 Notification result:', enabled);
    
    if (enabled) {
      // Trigger confetti celebration when notifications are enabled
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const saveReminders = (newReminders) => {
    console.log('[REMINDER PAGE] 💾 Saving reminders:', newReminders);
    setReminders(newReminders);
    localStorage.setItem('sathi_reminders', JSON.stringify(newReminders));
  };

  const handleAddReminder = () => {
    console.log('[REMINDER PAGE] ➕ Adding new reminder');
    
    // Initialize sound on user interaction
    SoundManager.init();
    
    setEditingReminder(null);
    setShowForm(true);
  };

  const handleEditReminder = (reminder) => {
    console.log('[REMINDER PAGE] ✏️ Editing reminder:', reminder.id);
    setEditingReminder(reminder);
    setShowForm(true);
  };

  const handleSaveReminder = (reminderData) => {
    console.log('[REMINDER PAGE] 💾 Saving reminder:', reminderData);
    
    if (editingReminder) {
      const updated = reminders.map(r => r.id === editingReminder.id ? reminderData : r);
      saveReminders(updated);
    } else {
      saveReminders([...reminders, reminderData]);
    }
    setShowForm(false);
    setEditingReminder(null);

    // Send confirmation notification with sound and confetti
    if (notificationsEnabled) {
      const action = editingReminder ? 'Updated' : 'Created';
      NotificationManager.send(`Reminder ${action}! 🎉`, {
        body: `"${reminderData.title}" has been ${action.toLowerCase()}`,
        tag: 'reminder-update'
      });
      
      // Show celebration
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } else {
      // Still play sound even if notifications are disabled
      SoundManager.playSuccessSound();
      
      // Show celebration
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const handleDeleteReminder = (id) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      console.log('[REMINDER PAGE] 🗑️ Deleting reminder:', id);
      const filtered = reminders.filter(r => r.id !== id);
      saveReminders(filtered);
      
      if (notificationsEnabled) {
        NotificationManager.send('Reminder Deleted', {
          body: 'The reminder has been removed from your list',
          tag: 'reminder-delete'
        });
      } else {
        // Still play sound
        SoundManager.playNotificationSound();
      }
    }
  };

  const handleToggleReminder = (id) => {
    console.log('[REMINDER PAGE] 🔄 Toggling reminder:', id);
    const updated = reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    saveReminders(updated);
    
    const reminder = updated.find(r => r.id === id);
    if (notificationsEnabled && reminder) {
      NotificationManager.send(`Reminder ${reminder.enabled ? 'Enabled' : 'Disabled'}`, {
        body: `"${reminder.title}" is now ${reminder.enabled ? 'active' : 'inactive'}`,
        tag: 'reminder-toggle'
      });
    } else if (reminder) {
      // Still play sound
      SoundManager.playNotificationSound();
    }
  };

  const handleTestNotification = (reminder) => {
    console.log('[REMINDER PAGE] 🧪 Testing notification for:', reminder.title);
    
    // Always initialize sound system on user interaction
    SoundManager.init();
    
    if (!notificationsEnabled) {
      alert('Notifications are not enabled. Please enable them first.');
      return;
    }

    NotificationManager.send(`🔔 Test: ${reminder.title}`, {
      body: reminder.description,
      tag: `test-${reminder.id}`,
      requireInteraction: true
    });
    
    // Show mini celebration
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const sendBulkTestNotification = () => {
    console.log('[REMINDER PAGE] 🧪 Sending bulk test notification...');
    
    // Always initialize sound system on user interaction
    SoundManager.init();
    
    if (!notificationsEnabled) {
      initNotifications();
      return;
    }

    const enabledReminders = reminders.filter(r => r.enabled);
    NotificationManager.send(`📋 You have ${enabledReminders.length} active reminders!`, {
      body: 'Click to view your reminder dashboard',
      tag: 'bulk-test',
      requireInteraction: true
    });
    
    // Show celebration
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const enabledCount = reminders.filter(r => r.enabled).length;
  const userPreference = onboardingData?.accountabilityNudges === 'Yes' || onboardingData?.dailyReminders === 'Yes';

  const getNotificationStatusText = () => {
    switch (notificationStatus) {
      case 'checking': return 'Checking notification support...';
      case 'requesting': return 'Requesting permission...';
      case 'enabled': return 'Notifications enabled ✅';
      case 'denied': return 'Notifications blocked by browser';
      case 'disabled-by-user': return 'Notifications disabled in settings';
      default: return 'Unknown status';
    }
  };

  const playTestSound = () => {
    // Initialize sound on user interaction
    SoundManager.init();
    SoundManager.playNotificationSound();
    
    // Show small confetti
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  return (
    <div className="reminder-page">
      <div className="container">
        <header className="header">
          <div>
            <h1 className="title">Smart Reminders</h1>
            <p className="subtitle">
              Stay on track with your career goals through personalized reminders
            </p>
          </div>

          <div className="header-actions">
            <div className="stats">
              <div className="stat-item">
                <div className="stat-value">{enabledCount}</div>
                <div className="stat-label">Active</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{reminders.length}</div>
                <div className="stat-label">Total</div>
              </div>
            </div>

            <button className="btn primary" onClick={handleAddReminder}>
              + Add Reminder
            </button>
          </div>
        </header>

        {userPreference && (
          <div className="notification-status">
            <div className="status-icon">🔔</div>
            <div className="status-text">
              <strong>{getNotificationStatusText()}</strong>
              <p>Based on your onboarding preferences, we'll send you helpful nudges</p>
            </div>
            <div className="status-actions">
              {!notificationsEnabled && (
                <button 
                  className="btn ghost"
                  onClick={initNotifications}
                  disabled={notificationStatus === 'requesting'}
                >
                  {notificationStatus === 'requesting' ? 'Requesting...' : 'Enable'}
                </button>
              )}
              {notificationsEnabled && (
                <button 
                  className="btn ghost"
                  onClick={sendBulkTestNotification}
                >
                  🧪 Test Notifications
                </button>
              )}
            </div>
          </div>
        )}

        <main className="reminder-grid">
          <section className="reminders-list">
            <h3 className="section-title">Your Reminders</h3>
            {reminders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⏰</div>
                <h4>No reminders yet</h4>
                <p>Create your first reminder to stay on track with your career goals</p>
                <button className="btn primary" onClick={handleAddReminder}>
                  Create Reminder
                </button>
              </div>
            ) : (
              <div className="reminders-container">
                {reminders.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onEdit={handleEditReminder}
                    onDelete={handleDeleteReminder}
                    onToggle={handleToggleReminder}
                    onTestNotification={handleTestNotification}
                  />
                ))}
              </div>
            )}
          </section>

          <aside className="reminder-insights">
            <div className="insights-card">
              <h3 className="section-title">Sound & Notifications</h3>
              <div className="test-section">
                <p className="test-desc">Test your notification features:</p>
                <div className="test-buttons">
                  <button 
                    className="btn primary"
                    onClick={sendBulkTestNotification}
                    disabled={!notificationsEnabled}
                  >
                    🔔 Notification + Sound
                  </button>
                  <button 
                    className="btn secondary"
                    onClick={playTestSound}
                  >
                    🔊 Sound Only
                  </button>
                </div>
                <p className="test-note">
                  Status: {getNotificationStatusText()}
                </p>
              </div>
            </div>

            <div className="insights-card">
              <h3 className="section-title">Quick Tips</h3>
              <div className="tip-item">
                <div className="tip-icon">💡</div>
                <div className="tip-text">Use the "🔔 Test" button on reminders to hear sound effects</div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">🎯</div>
                <div className="tip-text">Notifications now include celebratory confetti animations</div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">📱</div>
                <div className="tip-text">Allow notifications when prompted by browser</div>
              </div>
            </div>

            <div className="insights-card">
              <h3 className="section-title">Your Preferences</h3>
              <div className="pref-item">
                <span className="pref-label">Daily Reminders:</span>
                <span className="pref-value">{onboardingData?.dailyReminders || 'Not set'}</span>
              </div>
              <div className="pref-item">
                <span className="pref-label">Nudges:</span>
                <span className="pref-value">{onboardingData?.accountabilityNudges || 'Not set'}</span>
              </div>
              <div className="pref-item">
                <span className="pref-label">Study Time:</span>
                <span className="pref-value">{onboardingData?.studyRhythm || 'Not set'}</span>
              </div>
            </div>
          </aside>
        </main>

        {showForm && (
          <ReminderForm
            reminder={editingReminder}
            onSave={handleSaveReminder}
            onCancel={() => setShowForm(false)}
          />
        )}
        
        {/* Celebration confetti */}
        <Celebration 
          show={showCelebration} 
          onComplete={() => setShowCelebration(false)} 
        />
      </div>

      <style jsx>{`
        .reminder-page {
          min-height: 100vh;
          background: linear-gradient(180deg, rgba(0,212,170,0.06), rgba(0,212,170,0.01));
          padding: 40px;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto;
          color: white;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        .title {
          font-size: 28px;
          margin: 0 0 8px 0;
          background: linear-gradient(90deg, ${theme.mint}, ${theme.accent});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          color: ${theme.softText};
          margin: 0;
          max-width: 600px;
        }
        .header-actions {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        .stats {
          display: flex;
          gap: 12px;
        }
        .stat-item {
          text-align: center;
          background: ${theme.cardBg};
          padding: 12px 16px;
          border-radius: 10px;
          min-width: 60px;
        }
        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: ${theme.mint};
        }
        .stat-label {
          font-size: 12px;
          color: ${theme.softText};
          margin-top: 2px;
        }
        .btn {
          padding: 12px 20px;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn.primary {
          background: ${theme.mint};
          color: #042028;
          box-shadow: 0 4px 15px rgba(0,212,170,0.3);
        }
        .btn.secondary {
          background: transparent;
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05);
        }
        .btn.ghost {
          background: transparent;
          color: ${theme.mint};
          border: 1px solid ${theme.mint};
        }
        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .notification-status {
          display: flex;
          gap: 16px;
          align-items: center;
          background: ${theme.cardBg};
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .status-icon {
          font-size: 24px;
        }
        .status-text {
          flex: 1;
        }
        .status-text strong {
          color: white;
          display: block;
          margin-bottom: 4px;
        }
        .status-text p {
          color: ${theme.softText};
          margin: 0;
          font-size: 14px;
        }
        .status-actions {
          display: flex;
          gap: 8px;
        }
        .reminder-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
          align-items: start;
        }
        .section-title {
          color: white;
          font-size: 18px;
          margin: 0 0 16px 0;
        }
        .reminders-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .empty-state {
          background: ${theme.cardBg};
          border-radius: 12px;
          padding: 40px;
          text-align: center;
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
          margin: 0 0 20px 0;
        }
        .insights-card {
          background: ${theme.cardBg};
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .test-section {
          text-align: center;
        }
        .test-desc {
          color: ${theme.softText};
          margin: 0 0 12px 0;
        }
        .test-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
          flex-direction: column;
        }
        .test-note {
          color: ${theme.softText};
          font-size: 12px;
          margin: 8px 0 0 0;
        }
        .tip-item, .pref-item {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
          color: ${theme.softText};
          font-size: 14px;
        }
        .tip-icon {
          font-size: 16px;
        }
        .pref-label {
          font-weight: 600;
        }
        .pref-value {
          color: white;
        }
        @media (max-width: 992px) {
          .reminder-grid {
            grid-template-columns: 1fr;
          }
          .header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}