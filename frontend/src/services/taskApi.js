const API_URL = "http://localhost:8080/api/tasks";

// Get all tasks.
// If a date is provided, get only tasks for that date.
export async function getTasks(date = "") {
  let url = API_URL;

  if (date) {
    url = `${API_URL}?date=${date}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

// Get one task using its ID.
export async function getTask(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch task");
  }

  return response.json();
}

// Create a new task.
export async function createTask(task) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create task");
  }

  return response.json();
}

// Update an existing task.
export async function updateTask(id, task) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update task");
  }

  return response.json();
}

// Delete a task.
export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}