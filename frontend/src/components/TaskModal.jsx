import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./TaskModal.css";

Modal.setAppElement("#root");

const TaskModal = ({ isOpen, onClose, tasks, onEdit, onDelete }) => {
  const [editTaskId, setEditTaskId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      setEditTaskId(null);
      setNewTitle("");
    }
  }, [tasks, isOpen]);

  const startEdit = (task) => {
    setEditTaskId(task.id);
    setNewTitle(task.title);
  };

  const handleEdit = () => {
    if (newTitle.trim() === "") return alert("Title is required");
    onEdit(editTaskId, { title: newTitle });
    setEditTaskId(null);
    setNewTitle("");
  };

  const handleDelete = (id) => {
    onDelete(id);
    if (editTaskId === id) {
      setEditTaskId(null);
      setNewTitle("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="glass-modal"
      overlayClassName="glass-overlay"
    >
      <h2>Tasks for Selected Date</h2>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: "1rem" }}>
              {editTaskId === task.id ? (
                <>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <div>
                    <button onClick={handleEdit}>Save</button>
                    <button
                      onClick={() => {
                        setEditTaskId(null);
                        setNewTitle("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{task.title}</span>
                  <button
                    onClick={() => startEdit(task)}
                    style={{ marginLeft: "1rem" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    style={{ marginLeft: "0.5rem", color: "red" }}
                  >
                    Delete
                  </button>
                  <div>
                    <h4>Suggestions:</h4>
                    <ul>
                      {(task.suggestions || []).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks for this date.</p>
      )}
      <button className="close-btn" onClick={onClose}>
        Close
      </button>
    </Modal>
  );
};

export default TaskModal;










