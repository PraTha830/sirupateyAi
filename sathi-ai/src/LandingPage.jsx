import React, { useState } from 'react';

const LandingPage = () => {
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'login', 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentView === 'login') {
      setIsLoading(true);
      
      try {
        // Call the authentication API
        const response = await fetch('http://127.0.0.1:8000/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: formData.email // Using email as user_id
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Store the token in session storage
          sessionStorage.setItem('access_token', data.access_token);
          sessionStorage.setItem('token_type', data.token_type);
          sessionStorage.setItem('user_email', formData.email);
          
          // Redirect to onboarding page
          window.location.href = '/onboarding';
          
        } else {
          // Handle error response
          const errorData = await response.json();
          alert('Login failed: ' + (errorData.detail || 'Invalid credentials'));
        }
        
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
      
    } else {
      // Handle signup
      alert('Signup successful!');
    }
  };

  const theme = {
    bg: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    cardBg: 'rgba(26, 32, 44, 0.95)',
    text: '#f7fafc',
    inputBg: '#2d3748',
    inputBorder: '#4a5568'
  };

  // Welcome Screen
  if (currentView === 'welcome') {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        background: theme.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          textAlign: 'center',
          color: theme.text,
          maxWidth: '500px',
          padding: '20px'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: '700',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #00d4aa, #667eea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.1'
          }}>
            Sathi AI
          </h1>

          <p style={{
            fontSize: '1.1rem',
            marginBottom: '2.5rem',
            opacity: '0.9',
            lineHeight: '1.6',
            color: '#a0aec0'
          }}>
            Your intelligent companion for modern productivity
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setCurrentView('login')}
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #00d4aa, #667eea)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,212,170,0.3)',
                minWidth: '120px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,212,170,0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,212,170,0.3)';
              }}
            >
              Sign In
            </button>
            
            <button
              onClick={() => setCurrentView('signup')}
              style={{
                padding: '12px 30px',
                background: 'transparent',
                color: theme.text,
                border: '2px solid #00d4aa',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '120px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#00d4aa';
                e.target.style.color = '#1a202c';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = theme.text;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login/Signup Form
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: theme.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: theme.cardBg,
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        margin: '20px'
      }}>
        {/* Back Button */}
        <button
          onClick={() => setCurrentView('welcome')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            marginBottom: '1rem',
            color: theme.text,
            opacity: '0.7',
            transition: 'opacity 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.opacity = '1'}
          onMouseOut={(e) => e.target.style.opacity = '0.7'}
        >
          ←
        </button>

        {/* Title */}
        <h2 style={{
          fontSize: '2.2rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '0.5rem',
          color: theme.text,
          background: 'linear-gradient(135deg, #00d4aa, #667eea)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Sathi AI
        </h2>

        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '0.5rem',
          color: theme.text
        }}>
          {currentView === 'login' ? 'Welcome back' : 'Create account'}
        </h3>

        <p style={{
          textAlign: 'center',
          color: '#a0aec0',
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}>
          {currentView === 'login' 
            ? 'Sign in to your account' 
            : 'Join Sathi AI today'
          }
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {currentView === 'signup' && (
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${theme.inputBorder}`,
                  background: theme.inputBg,
                  color: theme.text,
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
                onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
              />
            </div>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: `1px solid ${theme.inputBorder}`,
                background: theme.inputBg,
                color: theme.text,
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
              onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingRight: '45px',
                borderRadius: '10px',
                border: `1px solid ${theme.inputBorder}`,
                background: theme.inputBg,
                color: theme.text,
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
              onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: theme.text,
                opacity: '0.6'
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {currentView === 'signup' && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${theme.inputBorder}`,
                  background: theme.inputBg,
                  color: theme.text,
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
                onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              background: isLoading 
                ? 'linear-gradient(135deg, #6b7280, #9ca3af)' 
                : 'linear-gradient(135deg, #00d4aa, #667eea)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,212,170,0.3)'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,212,170,0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,212,170,0.3)';
              }
            }}
          >
            {isLoading 
              ? 'Signing In...' 
              : (currentView === 'login' ? 'Sign In' : 'Create Account')
            }
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: '#a0aec0',
          fontSize: '0.9rem'
        }}>
          {currentView === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setCurrentView(currentView === 'login' ? 'signup' : 'login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#00d4aa',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            {currentView === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;