import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import TaskCalendar from "./components/TaskCalendar"
import { fetchAnalyticsOverview } from "./services/api";
import Login from "./components/Login";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}`;

// Landing Page Component
function LandingPage({ onShowAuth }) {
  return (
    <div className="app-container">
      {/* Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-gradient aurora-1"></div>
        <div className="aurora-gradient aurora-2"></div>
        <div className="aurora-gradient aurora-3"></div>
        <div className="aurora-gradient aurora-4"></div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
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
            <h1 className="app-title">AI Productivity Assistant</h1>
            <p className="app-subtitle">Supercharge your productivity with intelligent task management</p>
          </div>
        </header>

        {/* Feature Cards */}
        <div className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>AI Task Analysis</h3>
              <p>Smart suggestions and insights for your tasks</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Smart Scheduling</h3>
              <p>Intelligent calendar integration and planning</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>Track progress and productivity metrics</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-time Sync</h3>
              <p>Seamless synchronization across devices</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <button className="cta-button" onClick={() => onShowAuth('login')}>
            <span>Get Started</span>
            <div className="button-glow"></div>
          </button>
          <p className="auth-links">
            Already have an account? 
            <button className="link-button" onClick={() => onShowAuth('login')}>Sign In</button> | 
            <button className="link-button" onClick={() => onShowAuth('register')}>Create Account</button>
          </p>
        </div>
      </div>
    </div>
  );
}



// Dashboard Component
function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [fetchingAnalytics, setFetchingAnalytics] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fetchingTasks, setFetchingTasks] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      setFetchingTasks(true);
      try {
        const response = await axios.get(`${API}/tasks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to fetch tasks');
      } finally {
        setFetchingTasks(false);
      }
    };
    fetchTasks();
  }, [user]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (activeTab !== 'analytics' || !user) return;
      setFetchingAnalytics(true);
      try {
        const response = await fetchAnalyticsOverview();
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        alert('Failed to fetch analytics data');
      } finally {
        setFetchingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, [activeTab, user]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      alert("Task title cannot be empty.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/tasks`, 
        { title: newTask },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const { id, title, due_date, priority, status, suggestion } = response.data;
      const filteredTask = { id, title, due_date, priority, status };
      setTasks(prev => [filteredTask, ...prev]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
      alert(error.response?.data?.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId, completed) => {
    try {
      await axios.patch(`${API}/tasks/${taskId}`, 
        { completed: !completed },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, completed: !completed } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0
  };

  return (
    <div className="app-container" style={{ overflowY: 'auto' }}>
      <div className="aurora-bg">
        <div className="aurora-gradient aurora-1"></div>
        <div className="aurora-gradient aurora-2"></div>
        <div className="aurora-gradient aurora-3"></div>
        <div className="aurora-gradient aurora-4"></div>
      </div>
      
      <div className="dashboard-container" style={{ top: '0', left: '0' }}>
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-nav">
            <h1 className="dashboard-title">Welcome back, {user.name}!</h1>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              📝 Tasks
            </button>
            <button 
              className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              📅 Calendar
            </button>
            <button 
              className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📊 Analytics
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          {activeTab === 'tasks' && (
            <div className="tasks-section">
              {/* Add Task Form */}
              <div className="add-task-card">
                <h3>Add New Task</h3>
                <form onSubmit={addTask} className="add-task-form">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What would you like to accomplish?"
                    className="task-input"
                    disabled={loading}
                  />
                  <button type="submit" className="add-task-button" disabled={loading}>
                    {loading ? '⏳' : '➕'} Add Task
                  </button>
                </form>
              </div>

              {/* Tasks List */}
              <div className="tasks-grid">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No tasks yet</h3>
                  <p>Add your first task to get started with AI-powered productivity!</p>
                </div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                    <div className="task-content">
                      <button
                        className="task-checkbox"
                        onClick={() => toggleTask(task.id, task.completed)}
                      >
                        {task.completed ? '✅' : '⏳'}
                      </button>
                      <div className="task-details">
                        <h4 className="task-title">{task.title}</h4>
                        <p className="task-meta">
                          Created: {new Date(task.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="task-ai-suggestion">
                      <div className="dropdown-container">
                        <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
                          💡 AI Suggestions {isOpen ? '▲' : '▼'}
                        </button>
                        {isOpen && (
                          <ul className="dropdown-list">
                            {/* TODO: Define suggestions array or replace with actual data */}
                            <li className="dropdown-item">Suggestion 1</li>
                            <li className="dropdown-item">Suggestion 2</li>
                            <li className="dropdown-item">Suggestion 3</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="calendar-section">
              <TaskCalendar />
             </div>
           )}
          {activeTab === 'analytics' && (
            <div className="analytics-section">
              {fetchingAnalytics ? (
                <p>Loading analytics data...</p>
              ) : analyticsData ? (
                <>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">📊</div>
                      <div className="stat-content">
                        <h3>{analyticsData.total_tasks}</h3>
                        <p>Total Tasks</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">✅</div>
                      <div className="stat-content">
                        <h3>{analyticsData.completed_tasks}</h3>
                        <p>Completed</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">⏳</div>
                      <div className="stat-content">
                        <h3>{analyticsData.pending_tasks}</h3>
                        <p>Pending</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">🎯</div>
                      <div className="stat-content">
                        <h3>{analyticsData.completionRate ?? Math.round((analyticsData.completed_tasks / analyticsData.total_tasks) * 100)}%</h3>
                        <p>Completion Rate</p>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-charts">
                    <div className="chart-card">
                      <h3>📈 Productivity Trends</h3>
                      <div className="chart-placeholder">
                        <div className="chart-bars">
                          {Object.entries(analyticsData.weekly_task_distribution).map(([date, count]) => (
                            <div key={date} className="bar" style={{ height: `${(count / Math.max(...Object.values(analyticsData.weekly_task_distribution))) * 100}%` }}></div>
                          ))}
                        </div>
                        <p>Weekly productivity overview</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p>No analytics data available.</p>
              )}
            </div>
          )}
        </main>

    </div>
  );
}

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'auth', 'dashboard'
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [user, setUser] = useState(null);

  const handleShowAuth = (mode) => {
    setAuthMode(mode);
    setView('auth');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('landing');
  };

  const handleBack = () => {
    setView('landing');
  };

  return (
    <>
      {view === 'landing' && <LandingPage onShowAuth={handleShowAuth} />}
      {view === 'auth' && <Login mode={authMode} onBack={handleBack} onLogin={handleLogin} />}
      {view === 'dashboard' && user && <Dashboard user={user} onLogout={handleLogout} />}
    </>
  );
}

export default App;
