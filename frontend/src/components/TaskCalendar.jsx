import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import TaskModal from "./TaskModal";
import { fetchTasks, updateTask, deleteTask } from "../services/api";
// import "react-calendar/dist/Calendar.css";

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tasksForDate, setTasksForDate] = useState([]);

  useEffect(() => {
    fetchTasks().then((res) => setTasks(res.data));
  }, []);

  const handleDateClick = (date) => {
    const selected = new Date(date).toDateString();
    const filteredTasks = tasks.filter(
      (task) => new Date(task.due_date).toDateString() === selected
    );
    setTasksForDate(filteredTasks);
    setSelectedDate(selected);
    setModalOpen(true);
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

  return (
    <>
    <div className = "calendar-design">
      <Calendar onClickDay={handleDateClick} />
      {modalOpen && (
        <TaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          tasks={tasksForDate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      </div>
    </>
  );
};

export default TaskCalendar;
