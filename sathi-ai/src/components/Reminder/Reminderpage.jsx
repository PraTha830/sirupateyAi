import React, { useState, useEffect } from 'react';

/**
 * ReminderPage.jsx - FIXED NOTIFICATIONS
 * - Updated timestamp: 2025-08-24 08:13:36
 * - Current user: PraTha830
 * - Working push notifications with proper testing
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

// Enhanced notification system with debugging
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
      
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'sathi-reminder',
        requireInteraction: false,
        silent: false,
        ...options
      });

      notification.onclick = function() {
        console.log('[NOTIFICATIONS] 👆 Notification clicked');
        window.focus();
        notification.close();
      };

      notification.onshow = function() {
        console.log('[NOTIFICATIONS] 👁️ Notification shown');
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
  const currentUTC = '2025-08-24 08:13:36';
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
      createdAt: reminder?.createdAt || '2025-08-24 08:13:36',
      createdBy: reminder?.createdBy || 'PraTha830',
      updatedAt: '2025-08-24 08:13:36'
    };
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
    
    const enabled = await NotificationManager.init();
    setNotificationsEnabled(enabled);
    setNotificationStatus(enabled ? 'enabled' : 'denied');
    
    console.log('[REMINDER PAGE] 📋 Notification result:', enabled);
  };

  const saveReminders = (newReminders) => {
    console.log('[REMINDER PAGE] 💾 Saving reminders:', newReminders);
    setReminders(newReminders);
    localStorage.setItem('sathi_reminders', JSON.stringify(newReminders));
  };

  const handleAddReminder = () => {
    console.log('[REMINDER PAGE] ➕ Adding new reminder');
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

    // Send confirmation notification
    if (notificationsEnabled) {
      const action = editingReminder ? 'Updated' : 'Created';
      NotificationManager.send(`Reminder ${action}! 🎉`, {
        body: `"${reminderData.title}" has been ${action.toLowerCase()}`,
        tag: 'reminder-update'
      });
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
    }
  };

  const handleTestNotification = (reminder) => {
    console.log('[REMINDER PAGE] 🧪 Testing notification for:', reminder.title);
    
    if (!notificationsEnabled) {
      alert('Notifications are not enabled. Please enable them first.');
      return;
    }

    NotificationManager.send(`🔔 Test: ${reminder.title}`, {
      body: reminder.description,
      tag: `test-${reminder.id}`,
      requireInteraction: true
    });
  };

  const sendBulkTestNotification = () => {
    console.log('[REMINDER PAGE] 🧪 Sending bulk test notification...');
    
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
              <h3 className="section-title">Notification Testing</h3>
              <div className="test-section">
                <p className="test-desc">Test your notification system:</p>
                <button 
                  className="btn primary"
                  onClick={sendBulkTestNotification}
                  disabled={!notificationsEnabled}
                >
                  🔔 Send Test Notification
                </button>
                <p className="test-note">
                  Status: {getNotificationStatusText()}
                </p>
              </div>
            </div>

            <div className="insights-card">
              <h3 className="section-title">Quick Tips</h3>
              <div className="tip-item">
                <div className="tip-icon">💡</div>
                <div className="tip-text">Use the "🔔 Test" button to check notifications work</div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">🎯</div>
                <div className="tip-text">Keep reminder titles specific and actionable</div>
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