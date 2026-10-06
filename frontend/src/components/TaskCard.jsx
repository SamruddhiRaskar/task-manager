import { useNavigate } from "react-router-dom";

function TaskCard({ task, onStatusChange, onDelete }) {
  const navigate = useNavigate();

  // Convert PostgreSQL time into a user-friendly format.
  // Example: "13:11:00.000000" → "1:11 PM"
  const formatTime = (time) => {
    if (!time) {
      return "No time";
    }

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleStatusChange = (event) => {
    onStatusChange(task.id, event.target.value);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    onDelete(task.id);
  };

  return (
    <article className="task-card">
      <div className="task-time">
        {formatTime(task.task_time)}
      </div>

      <div className="task-content">
        <h3>{task.title}</h3>

        {task.description && (
          <p>{task.description}</p>
        )}

        <div className="task-details">
          <span>Priority: {task.priority}</span>

          <label>
            Status:

            <select
              value={task.status}
              onChange={handleStatusChange}
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
          </label>
        </div>

        <div>
          <button
            type="button"
            onClick={() => navigate(`/edit/${task.id}`)}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;