import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createTask } from "../services/taskApi";

function AddTask() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    task_date: location.state?.selectedDate || "",
    task_time: "",
    priority: "medium",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!formData.task_date) {
      setError("Please select a date.");
      return;
    }

    setSaving(true);

    try {
      await createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: "pending",
        priority: formData.priority,
        task_date: formData.task_date,
        task_time: formData.task_time || null,
      });

      setSuccess("Task created successfully.");

      setTimeout(() => {
        navigate("/", {
          state: {
            selectedDate: formData.task_date,
          },
        });
      }, 500);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <main>
      <header className="form-page-header">
        <button
          type="button"
          className="back-button"
          onClick={handleBack}
        >
          ← Back to Tasks
        </button>

        <p>Create</p>
        <h1>Add New Task</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="task_date">Date</label>

          <input
            id="task_date"
            name="task_date"
            type="date"
            value={formData.task_date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="title">Task Name</label>

          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter task name"
            value={formData.title}
            onChange={handleChange}
            maxLength="150"
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            placeholder="Enter task description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="task_time">Time</label>

            <input
              id="task_time"
              name="task_time"
              type="time"
              value={formData.task_time}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="priority">Priority</label>

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="form-message error-message">
            {error}
          </p>
        )}

        {success && (
          <p className="form-message success-message">
            {success}
          </p>
        )}

        <button
          type="submit"
          className="form-submit-button"
          disabled={saving}
        >
          {saving ? "Creating..." : "Create Task"}
        </button>
      </form>
    </main>
  );
}

export default AddTask;