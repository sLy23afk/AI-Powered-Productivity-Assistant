import './index.css';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import TaskForm from './components/TaskForm';
import TaskCalendar from './components/TaskCalendar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { createTask } from './services/api';
import Aurora from '../Reactbits/Aurora/Aurora';
import SplitText from '../Reactbits/SplitText/SplitText';











function App() {
  const [token, setToken] = useState(null);
  const homeRef = useRef(null);
  const dashboardRef = useRef(null);

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const [tasks, setTasks] = useState([]);

  const handleCreate = async (taskData) => {
    try {
      const response = await createTask(taskData);
    } catch (error) {
      console.error("Task creation failed", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const animateHoverIn = (ref) => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll('.split-parent > *');
    gsap.to(chars, {
      y: -10,
      opacity: 1,
      stagger: 0.05,
      duration: 0.3,
      ease: 'power3.out',
    });
  };

  const animateHoverOut = (ref) => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll('.split-parent > *');
    gsap.to(chars, {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 0.3,
      ease: 'power3.out',
    });
  };

  return (
    <>
      <div className="aurora-bg">
        <div className="main-content"></div>
        <div className="aurora-gradient aurora-1"></div>
        <div className="aurora-gradient aurora-2"></div>
        <div className="aurora-gradient aurora-3"></div>
      </div>
      {/* <div className="aurora-container">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.6}
          amplitude={1.0}
          speed={0.5}
        /> */}
  
      <Router>
        <div className="app-container">
          <header className="app-header">
            <div className="header-content">
              <div className="logo-container">
                  <img 
                    src="https://avatars.githubusercontent.com/in/1201222?s=120&u=2686cf91179bbafbc7a71bfbc43004cf9ae1acea&v=4" 
                    alt="Logo"
                    className="logo-img"
                  />
              <div className="logo-glow"></div>
              </div>
              <h1 className="app-title" style = {{ justifyContent: "center", alignItems: "center"}}>
                <div className="app-title-glow">
                <SplitText
                  text= " AI Productivity Assistant"
                  className="text-2xl font-semibold text-center"
                  delay={120}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-10px"
                  textAlign="right"
                  onLetterAnimationComplete={handleAnimationComplete}
                />
                </div>
              </h1>
              <p className="app-subtitle">Supercharge your productivity with intelligent task management</p>
            </div>
          </header>
          <nav className="app-nav">
            <Link
              to="/">
            
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Smart Scheduling</h3>
              <p>Intelligent calendar integration and planning</p>
            </div>
            </Link>
            <Link
              to="/dashboard"
              onMouseEnter={() => animateHoverIn(dashboardRef)}
              onMouseLeave={() => animateHoverOut(dashboardRef)}
            >
              <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>Track progress and productivity metrics</p>
            </div>
            </Link>
            {token ? (
              <button onClick={handleLogout}>🚪 Logout</button>
            ) : (
              <Link to="/login">
                <div className="cta-section">
                  <button className="cta-button">
                    <span>Get Started</span>
                    <div className="button-glow"></div>
                  </button>
                </div>
              </Link>
            )}
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                token ? (
                  <>
                    <TaskForm onCreate={handleCreate} />
                    <TaskCalendar />
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login setToken={handleLogin} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
