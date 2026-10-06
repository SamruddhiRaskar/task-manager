import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getTask,
  updateTask,
} from "../services/taskApi";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    task_date: "",
    task_time: "",
    priority: "medium",
    status: "pending",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTask() {
      setError("");

      try {
        const task = await getTask(id);

        setFormData({
          title: task.title,
          description: task.description || "",
          task_date: task.task_date.slice(0, 10),
          task_time: task.task_time || "",
          priority: task.priority,
          status: task.status,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [id]);

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
      await updateTask(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        task_date: formData.task_date,
        task_time: formData.task_time || null,
      });

      navigate("/", {
        state: {
          selectedDate: formData.task_date,
        },
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <main>
        <p>Loading task...</p>
      </main>
    );
  }

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

        <p>Edit</p>
        <h1>Edit Task</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="task_date">
            Date
          </label>

          <input
            id="task_date"
            name="task_date"
            type="date"
            value={formData.task_date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="title">
            Task Name
          </label>

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
          <label htmlFor="description">
            Description
          </label>

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
            <label htmlFor="task_time">
              Time
            </label>

            <input
              id="task_time"
              name="task_time"
              type="time"
              value={formData.task_time}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="priority">
              Priority
            </label>

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">
              Pending
            </option>

            <option value="in_progress">
              In Progress
            </option>

            <option value="completed">
              Completed
            </option>
          </select>
        </div>

        {error && (
          <p className="form-message error-message">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="form-submit-button"
          disabled={saving}
        >
          {saving
            ? "Updating..."
            : "Update Task"}
        </button>
      </form>
    </main>
  );
}

export default EditTask;