import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  getDate,
  getDaysInMonth,
  startOfMonth,
} from "date-fns";
import { motion } from "framer-motion";
import TaskModal from "./TaskModal";
import { fetchTasks, updateTask, deleteTask, createTask } from "../services/api";

const ScrollbarHide = () => (
  <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

const GlassCalendarFullScreen = ({setView}) => {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [tasksForDate, setTasksForDate] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    fetchTasks().then((res) => setTasks(res.data));
  }, []);

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const totalDays = getDaysInMonth(currentMonth);
    const days = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(start.getFullYear(), start.getMonth(), i + 1);
      days.push({
        date,
        isToday: isToday(date),
        isSelected: isSameDay(date, selectedDate),
      });
    }
    return days;
  }, [currentMonth, selectedDate]);

  
  const eventsForDate = (date) => {
    return tasks.filter(
      (task) => new Date(task.due_date).toDateString() === date.toDateString()
    );
  };

  // Click on day selects it and opens modal showing tasks
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setTasksForDate(eventsForDate(date));
    setIsCreatingNew(false);
    setModalOpen(true);
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleCreate = (newTaskData) => {
    createTask(newTaskData).then((res) => {
      setTasks((prev) => [...prev, res.data]);
      setModalOpen(false);
    });
  };

  const handleEdit = (id, updatedData) => {
    updateTask(id, updatedData).then(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
      );
      setModalOpen(false);
    });
  };

  const handleDelete = (id) => {
    deleteTask(id).then(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setModalOpen(false);
    });
  };

  // Open modal in create mode for the currently selected date
  const openCreateModalForSelectedDate = () => {
    setTasksForDate([]); 
    setIsCreatingNew(true);
    setModalOpen(true);
  };


  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 4, 4, 0.38)",
        backdropFilter: "blur(30px)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        userSelect: "none",
      }}
    >
      <ScrollbarHide />

      {/* Header */}
      <header
        style={{
          padding: "1.7rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <button
          className="tab-button"
          onClick={() => setView("landing")}
          style={{
            marginRight: "1rem",
            background: "rgba(0,0,0,0.15)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ← Back to Home
        </button>
        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            aria-label="Previous month"
            onClick={handlePrevMonth}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.7)",
              padding: "0.25rem",
              borderRadius: "9999px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <ChevronLeft size={24} />
          </button>

          <motion.h1
            key={format(currentMonth, "MMMM yyyy")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ fontWeight: "bold", fontSize: "2.5rem", userSelect: "none" }}
          >
            {format(currentMonth, "MMMM yyyy")}
          </motion.h1>

          <button
            aria-label="Next month"
            onClick={handleNextMonth}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.7)",
              padding: "0.25rem",
              borderRadius: "9999px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Settings */}
        <button
          aria-label="Settings"
          style={{
            borderRadius: "50%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.7)",
            padding: "0.5rem",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.3)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Settings size={24} />
        </button>
      </header>

      {/* Weekday Headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          padding: "1rem 2rem 0",
          textAlign: "center",
          fontWeight: "600",
          fontSize: "0.8rem",
          opacity: 0.6,
          userSelect: "none",
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div
        style={{
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "12px",
          padding: "1rem 2rem",
          overflowY: "auto",
        }}
      >
        {/* Blank slots */}
        {Array(startOfMonth(currentMonth).getDay())
          .fill(null)
          .map((_, i) => (
            <div key={"empty-" + i} />
          ))}

        {monthDays.map(({ date, isToday, isSelected }) => (
          <button
            key={format(date, "yyyy-MM-dd")}
            onClick={() => handleDateClick(date)}
            aria-label={`Select ${format(date, "do MMMM yyyy")}`}
            style={{
              background: isSelected
                ? "linear-gradient(135deg, #ec4899, #f97316)"
                : "transparent",
              color: isSelected ? "white" : "rgba(255,255,255,0.8)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontWeight: "600",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              position: "relative",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              !isSelected && (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")
            }
            onMouseLeave={(e) =>
              !isSelected && (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {getDate(date)}
            {isToday && !isSelected && (
              <span
                style={{
                  position: "absolute",
                  bottom: 6,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#ec4899",
                }}
              />
            )}
            {eventsForDate(date).length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#f97316",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Footer with Add Note and + Button */}
      <div
        style={{
          marginTop: "auto",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.9rem",
          color: "rgba(255,255,255,0.7)",
          borderTop: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <button
          onClick={openCreateModalForSelectedDate}
          aria-label="Add new event"
          style={{
            background:
              "linear-gradient(135deg, #ec4899, #f97316)",
            borderRadius: "16px",
            padding: "8px 16px",
            fontWeight: "bold",
            color: "white",
            cursor: "pointer",
            border: "none",
            boxShadow: "0 4px 10px rgba(255, 115, 54, 0.6)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #f97316, #ec4899)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #ec4899, #f97316)")}
        >
          <Plus size={20} />
          New Event
        </button>
      </div>

      {/* TaskModal for creating or editing */}
      {modalOpen && (
        <TaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          tasks={tasksForDate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={isCreatingNew ? handleCreate : undefined}
          selectedDate={selectedDate}
          isCreatingNew={isCreatingNew}
          setIsCreatingNew={setIsCreatingNew}
          refreshTasks={() => fetchTasks().then((res) => setTasks(res.data))}
        />
      )}
    </div>
  );
};

export default GlassCalendarFullScreen;
