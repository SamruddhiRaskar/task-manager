import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DateSelector from "../components/DateSelector";
import Stats from "../components/Stats";
import TaskCard from "../components/TaskCard";
import {
  deleteTask,
  getTasks,
  updateTask,
} from "../services/taskApi";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tasks, setTasks] = useState([]);

  const [selectedDate, setSelectedDate] = useState(() => {
    if (location.state?.selectedDate) {
      return new Date(
        `${location.state.selectedDate}T00:00:00`
      );
    }

    return new Date();
  });

  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatSelectedDate = (date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  };

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      setError("");

      try {
        const date = formatDateForAPI(selectedDate);

        const data = await getTasks(date);

        setTasks(data);
      } catch (error) {
        setError(error.message);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }

    setStatusFilter("all");

    loadTasks();
  }, [selectedDate]);

  const handleStatusChange = async (
    taskId,
    newStatus
  ) => {
    setError("");

    const task = tasks.find(
      (task) => task.id === taskId
    );

    if (!task) {
      return;
    }

    try {
      const updatedTask = await updateTask(taskId, {
        title: task.title,
        description: task.description,
        status: newStatus,
        priority: task.priority,
        task_date: formatDateForAPI(selectedDate),
        task_time: task.task_time || null,
      });

      setTasks((previousTasks) =>
        previousTasks.map((currentTask) =>
          currentTask.id === taskId
            ? updatedTask
            : currentTask
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError("");

    try {
      await deleteTask(taskId);

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task.id !== taskId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  );

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter(
          (task) => task.status === statusFilter
        );

  return (
    <main>
      <header>
        <h1>Task Manager</h1>

        <p>
          {formatSelectedDate(selectedDate)}
        </p>
      </header>

      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <section>
        <h2>{formatSelectedDate(selectedDate)}</h2>

        <Stats
          total={tasks.length}
          pending={pendingTasks.length}
          completed={completedTasks.length}
        />
      </section>

      <section>
        <h2>Tasks</h2>

        <div className="status-filter-container">
          <label htmlFor="status-filter">
            Filter by status:
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="all">
              All
            </option>

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

        {loading && (
          <p>Loading tasks...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!loading &&
          !error &&
          tasks.length === 0 && (
            <p>
              No tasks for this date.
            </p>
          )}

        {!loading &&
          !error &&
          tasks.length > 0 &&
          filteredTasks.length === 0 && (
            <p>
              No tasks match this status.
            </p>
          )}

        {!loading &&
          !error &&
          filteredTasks.length > 0 && (
            <div>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={
                    handleStatusChange
                  }
                  onDelete={
                    handleDeleteTask
                  }
                />
              ))}
            </div>
          )}
      </section>

      <button
        type="button"
        onClick={() => navigate("/add")}
      >
        + Add New Task
      </button>
    </main>
  );
}

export default Home;