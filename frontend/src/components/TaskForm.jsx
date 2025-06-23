import React, { useState} from "react";

const TaskForm = ({ onCreate })    => {
    const [title ,  setTitle] = useState("");
    const [ due_date, setDueDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) return alert("Please enter a title");
        onCreate({ title});
        setTitle("");
    };
    return (
        <form onSubmit={handleSubmit} style= {{ marginBottom: "2rem"}}>
            <input
            type = "text"
            placeholder="Enter a task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
            <input
            type="date"
            value={due_date}
            onChange={(e) => setDueDate(e.target.value)}
            />
            
        </form>
       
    );
};
export default TaskForm;
