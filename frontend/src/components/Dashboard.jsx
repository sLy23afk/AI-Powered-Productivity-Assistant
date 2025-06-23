import React, {useEffect, useState} from "react";
import { fetchAnalyticsOverview } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import TaskCalendar from "./TaskCalendar";
import TaskForm from "./TaskForm";

const API = import.meta.env.VITE_REACT_APP_BACKEND_URL ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api` : "http://localhost:5000/";

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch tasks on component mount
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API}tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async ({ title, due_date }) => {
    if (!title.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}tasks`,
        { title, due_date: due_date || null, description: '' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTasks(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId, completed) => {
    try {
      await axios.patch(`${API}tasks/${taskId}`,
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
            <div className="app-container">
      <div className="aurora-bg">
        <div className="aurora-gradient aurora-1"></div>
        <div className="aurora-gradient aurora-2"></div>
        <div className="aurora-gradient aurora-3"></div>
      </div>

      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-nav">
            <h1 className="dashboard-title">Welcome back, {user ? user.name : 'User'}!</h1>
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
                <TaskForm onCreate={handleCreateTask} />
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
                        💡 AI Suggestion: Break this into smaller sub-tasks
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="calendar-section">
              <div className="calendar-card">
                <h3>📅 Smart Calendar</h3>
                <div className="calendar-placeholder">
                  <div className="calendar-icon">🗓️</div>
                  <h4>Calendar View Coming Soon</h4>
                  <p>AI-powered scheduling and task timeline visualization</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-section">
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
                      <div className="bar" style={{height: '60%'}}></div>
                      <div className="bar" style={{height: '80%'}}></div>
                      <div className="bar" style={{height: '45%'}}></div>
                      <div className="bar" style={{height: '90%'}}></div>
                      <div className="bar" style={{height: '75%'}}></div>
                      <div className="bar" style={{height: '85%'}}></div>
                      <div className="bar" style={{height: '70%'}}></div>
                    </div>
                    <p>Weekly productivity overview</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};


// const Dashboard = () => {
//     const [data, setData] = useState(null);

//     useEffect(() => {
//       fetchAnalyticsOverview()
//         .then((res) => setData(res.data))
//         .catch((err) => console.error("Analytics fetch failed", err));
//     }, []);

//     if (!data) return <p>Loading dashboard...</p>;

//     const weeklyData = Object.entries(data.weekly_task_distribution).map(([date, count]) => ({
//       date,
//       count
//     }));

//     return (
//       <div className="p-6 space-y-6">
//         <h2 className="text-2xl font-bold">Analytics Dashboard</h2>

//         <div className="flex gap-6">
//           <div className="p-4 shadow rounded bg-white">
//             <p className="text-gray-600">Total Tasks</p>
//             <h3 className="text-xl font-bold">{data.total_tasks}</h3>
//           </div>
//           <div className="p-4 shadow rounded bg-white">
//             <p className="text-gray-600">Completed Tasks</p>
//             <h3 className="text-xl font-bold">{data.completed_tasks}</h3>
//           </div>
//         </div>

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-2">Tasks Created in the Past Week</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={weeklyData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis allowDecimals={false} />
//               <Tooltip />
//               <Bar dataKey="count" fill="#8884d8" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-2">All Tasks</h3>
//           {data.tasks.length === 0 ? (
//             <p>No tasks found.</p>
//           ) : (
//             <ul className="list-disc list-inside">
//               {data.tasks.map((task) => (
//                 <li key={task.id}>
//                   <strong>{task.title}</strong> - Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     );
// };

// export default Dashboard;
