// TaskModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./TaskModal.css";

Modal.setAppElement("#root");

const TaskModal = ({
  isOpen,
  onClose,
  tasks,
  onEdit,
  onDelete,
  onCreate,
  selectedDate,
  isCreatingNew,
  setIsCreatingNew,
}) => {
  const [editTaskId, setEditTaskId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      setEditTaskId(null);
      setNewTitle("");
    }
    if (!isCreatingNew) {
      setNewTitle("");
    }
  }, [tasks, isOpen, isCreatingNew]);

  const startEdit = (task) => {
    setEditTaskId(task.id);
    setNewTitle(task.title);
    setIsCreatingNew(false);
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

  const handleCreate = () => {
    if (newTitle.trim() === "") return alert("Title is required");
    if (!onCreate) return alert("Create handler is not defined");
    onCreate({ title: newTitle, due_date: selectedDate });
    setNewTitle("");
    setIsCreatingNew(false);
  };

  const cancelCreate = () => {
    setIsCreatingNew(false);
    setNewTitle("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        onClose();
        setIsCreatingNew(false);
        setEditTaskId(null);
        setNewTitle("");
      }}
      className="glass-modal"
      overlayClassName="glass-overlay"
    >
      <h2>
        {isCreatingNew
          ? `Add Task for ${selectedDate?.toLocaleDateString()}`
          : "Tasks for Selected Date"}
      </h2>

      {isCreatingNew ? (
        <div>
          <input
            type="text"
            placeholder="New task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
          />
          <button onClick={handleCreate} style={{ marginRight: "8px" }}>
            Save
          </button>
          <button onClick={cancelCreate}>Cancel</button>
        </div>
      ) : (
        <>
          {tasks && tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task.id} style={{ marginBottom: "1rem" }}>
                  {editTaskId === task.id ? (
                    <>
                      <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                      />
                      <div>
                        <button onClick={handleEdit}>Save</button>
                        <button
                          onClick={() => {
                            setEditTaskId(null);
                            setNewTitle("");
                          }}
                          style={{ marginLeft: "8px" }}
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
          <button
            onClick={() => setIsCreatingNew(true)}
            style={{
              marginTop: "1rem",
              backgroundColor: "#f97316",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Add New Task
          </button>
        </>
      )}

      <button
        className="close-btn"
        onClick={onClose}
        style={{ marginTop: "1rem" }}
      >
        Close
      </button>
    </Modal>
  );
};

export default TaskModal;
