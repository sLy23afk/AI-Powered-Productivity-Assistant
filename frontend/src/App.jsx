import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import TaskCalendar from "./components/TaskCalendar"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}`;

// Landing Page Component
function LandingPage({ onShowAuth, user, setView }) {
  return (
    <div className="app-container" style={{}}>
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
            <div className="feature-card" onClick={() => setView('tanalysis')}>
              <div className="feature-icon">🧠</div>
              <h3>AI Task Analysis</h3>
              <p>Smart suggestions and insights for your tasks</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Smart Scheduling</h3>
              <p>Intelligent calendar integration and planning</p>
            </div>
            <div className="feature-card" onClick= {() => setView('dashboard')}>
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
          {!user && (
            <>
              <button className="cta-button" onClick={() => onShowAuth('login')}>
                <span>Get Started</span>
                <div className="button-glow"></div>
              </button>
              <p className="auth-links">
              Already have an account? 
                <button className="link-button" onClick={() => onShowAuth('login')}>Sign In</button> | 
                <button className="link-button" onClick={() => onShowAuth('register')}>Create Account</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
// Authentication Component
function AuthForm({ mode, onBack, onLogin, onSwitchMode }) {
  // Setup state depending on mode
  const [formData, setFormData] = useState(
    mode === "register"
      ? { username: "", email: "", password: "" }
      : { email: "", password: "" }
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // On mode change, reset state to proper structure
    if (mode === "register") {
      setFormData({ username: "", email: "", password: "" });
    } else {
      setFormData({ email: "", password: "" });
    }
  }, [mode]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email: formData.email, password: formData.password }
          : { username: formData.username, email: formData.email, password: formData.password };

      const response = await axios.post(`${API}${endpoint}`, payload);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        onLogin(response.data.user);
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="aurora-bg">
        <div className="aurora-gradient aurora-1"></div>
        <div className="aurora-gradient aurora-2"></div>
        <div className="aurora-gradient aurora-3"></div>
      </div>
      <div className="auth-container">
        <div className="auth-card">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <div className="auth-header">
            <h2 className="auth-title">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="auth-subtitle">
              {mode === "login"
                ? "Sign in to access your productivity dashboard"
                : "Join thousands of productive users"}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">

            {mode === "register" && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter your username"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your password"
                minLength={6}
              />
            </div>
            <button type="submit" className="auth-submit-button" disabled={loading}>
              {loading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
              )}
              <div className="button-glow"></div>
            </button>
          </form>
          <div className="auth-footer">
            <p>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                className="link-button"
                onClick={() => onSwitchMode(mode === "login" ? "register" : "login")}
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

//Task-Analysis Component
function TAnalysis({user, onLogout, setView}) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingTasks, setFetchingTasks] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      setFetchingTasks(true);
      try {
        const response = await axios.get(`${API}/tasks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Failed to fetch tasks");
      } finally {
        setFetchingTasks(false);
      }
    };
    fetchTasks();
  }, [user]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      alert("Task title cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/tasks`,
        { title: newTask },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const { id, title, due_date, priority, status } = response.data;
      const filteredTask = { id, title, due_date, priority, status };
      setTasks((prev) => [filteredTask, ...prev]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert(error.response?.data?.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId, completed) => {
    try {
      await axios.patch(
        `${API}/tasks/${taskId}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="app-container" style={{ overflowY: "auto" }}>
      {/* Aurora background */}
      <div className="aurora-bg">
        <div className="aurora-gradient aurora-1"></div>
        <div className="aurora-gradient aurora-2"></div>
        <div className="aurora-gradient aurora-3"></div>
        <div className="aurora-gradient aurora-4"></div>
      </div>

      <div className="dashboard-container" style={{ top: "0", left: "0" }}>
        {/* Header */}
        <header
          className="dashboard-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <button
              className="back-to-home-button"
              onClick={() => setView("landing")}
            >
              ← Back to Home
            </button>
          </div>
          <div
            className="dashboard-nav"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <h1 className="dashboard-title" style= {{alignItems:"center"}}>Welcome back, {user.username}!</h1>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Tasks Section */}
        <main className="dashboard-main">
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
                  {loading ? "⏳" : "➕"} Add Task
                </button>
              </form>
            </div>

            {/* Tasks List */}
            <div className="tasks-grid">
              {fetchingTasks ? (
                <p>Loading tasks...</p>
              ) : tasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No tasks yet</h3>
                  <p>Add your first task to get started with AI-powered productivity!</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-card ${task.completed ? "completed" : ""}`}
                  >
                    <div className="task-content">
                      <button
                        className="task-checkbox"
                        onClick={() => toggleTask(task.id, task.completed)}
                      >
                        {task.completed ? "✅" : "⏳"}
                      </button>
                      <div className="task-details">
                        <h4 className="task-title">{task.title}</h4>
                        <p className="task-meta">
                          Created: {new Date(task.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ user, onLogout, setView }) {
  const [activeTab, setActiveTab] = useState("analytics");
  const [stats, setStats] = useState(null);
  const [weeklyDistribution, setWeeklyDistribution] = useState({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchAnalytics = async () => {
      setLoadingStats(true);
      setErrorStats(null);
      try {
        const response = await axios.get(`${API}/analytics/overview`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = response.data;

        setStats({
          total: data.total_tasks,
          completed: data.completed_tasks,
          pending: data.pending_tasks,
          overdue: data.overdue_tasks,
          completionRate: data.total_tasks > 0 
            ? Math.round((data.completed_tasks / data.total_tasks) * 100)
            : 0,
        });
        setWeeklyDistribution(data.weekly_task_distribution || {});
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setErrorStats(error.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoadingStats(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  return (
    <div className="app-container" style={{ overflowY: "auto" }}>
      <div className="aurora-bg">
        <div className="aurora-gradient aurora-1"></div>
        <div className="aurora-gradient aurora-2"></div>
        <div className="aurora-gradient aurora-3"></div>
        <div className="aurora-gradient aurora-4"></div>
      </div>

      <div className="dashboard-container" style={{ top: "0", left: "0" }}>
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <button className="tab-button" onClick={() => setView("landing")}>
              ← Back to Home
            </button>
          </div>
          <div className="dashboard-nav">
            <h1 className="dashboard-title">Welcome back, {user.username}!</h1>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              📊 Analytics
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          {activeTab === "calendar" && (
            <div className="calendar-section">
              <TaskCalendar />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="analytics-section">
              {loadingStats ? (
                <p>Loading analytics...</p>
              ) : errorStats ? (
                <p style={{ color: "red" }}>{errorStats}</p>
              ) : stats ? (
                <>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">📊</div>
                      <div className="stat-content">
                        <h3>{stats.total}</h3>
                        <p>Total Tasks</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">✅</div>
                      <div className="stat-content">
                        <h3>{stats.completed}</h3>
                        <p>Completed</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">⏳</div>
                      <div className="stat-content">
                        <h3>{stats.pending}</h3>
                        <p>Pending</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">⏰</div>
                      <div className="stat-content">
                        <h3>{stats.overdue}</h3>
                        <p>Overdue</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">🎯</div>
                      <div className="stat-content">
                        <h3>{stats.completionRate}%</h3>
                        <p>Completion Rate</p>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-charts">
                    <div className="chart-card">
                      <h3>📈 Productivity Trends</h3>
                      <div className="chart-placeholder">
                        <div className="chart-bars">
                          {/* Render bars for last 7 days */}
                          {Object.entries(weeklyDistribution)
                            .sort(([dayA], [dayB]) => new Date(dayA) - new Date(dayB))
                            .map(([day, count]) => (
                              <div
                                key={day}
                                className="bar"
                                style={{ height: `${Math.min(count * 15, 100)}%` }}
                                title={`${day}: ${count} tasks`}
                              ></div>
                            ))}
                        </div>
                        <p>Weekly productivity overview</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p>No analytics data found.</p>
              )}
            </div>
          )}
        </main>
      </div>
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
    setView('landing');
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
      {view === 'landing' && <LandingPage onShowAuth={handleShowAuth} user={user} setView={setView} />}
      {view === 'auth' && <AuthForm mode={authMode} onBack={handleBack} onLogin={handleLogin} onSwitchMode={handleShowAuth} />}
      {view === 'dashboard' && user && <Dashboard user={user} onLogout={handleLogout} setView={setView} />}
      {view == 'tanalysis' && user && <TAnalysis user={user} onLogout={handleLogout} setView={setView} />}
    </>
  );
}

export default App;