package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"task-manager/database"
	"task-manager/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type TaskHandler struct {
	DB *pgxpool.Pool
}

// TaskRequest represents the JSON format received from the frontend.
type TaskRequest struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Status      string  `json:"status"`
	Priority    string  `json:"priority"`
	TaskDate    string  `json:"task_date"`
	TaskTime    *string `json:"task_time"`
}

func writeJSON(w http.ResponseWriter, statusCode int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, statusCode int, message string) {
	writeJSON(w, statusCode, map[string]string{
		"error": message,
	})
}

func isValidStatus(status string) bool {
	return status == "pending" ||
		status == "in_progress" ||
		status == "completed"
}

func isValidPriority(priority string) bool {
	return priority == "low" ||
		priority == "medium" ||
		priority == "high"
}

func validateTaskRequest(task TaskRequest) string {
	task.Title = strings.TrimSpace(task.Title)

	if task.Title == "" {
		return "Task title is required."
	}

	if len(task.Title) > 150 {
		return "Task title must be 150 characters or less."
	}

	if !isValidStatus(task.Status) {
		return "Invalid status. Use pending, in_progress, or completed."
	}

	if !isValidPriority(task.Priority) {
		return "Invalid priority. Use low, medium, or high."
	}

	if task.TaskDate == "" {
		return "Task date is required."
	}

	_, err := time.Parse("2006-01-02", task.TaskDate)

	if err != nil {
		return "Invalid date. Use YYYY-MM-DD."
	}

	return ""
}

func convertTaskRequest(request TaskRequest) (models.Task, error) {
	taskDate, err := time.Parse(
		"2006-01-02",
		request.TaskDate,
	)

	if err != nil {
		return models.Task{}, err
	}

	return models.Task{
		Title:       strings.TrimSpace(request.Title),
		Description: strings.TrimSpace(request.Description),
		Status:      request.Status,
		Priority:    request.Priority,
		TaskDate:    taskDate,
		TaskTime:    request.TaskTime,
	}, nil
}

func (h *TaskHandler) CreateTask(w http.ResponseWriter, r *http.Request) {
	var request TaskRequest

	err := json.NewDecoder(r.Body).Decode(&request)

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			"Invalid JSON request.",
		)
		return
	}

	if request.Status == "" {
		request.Status = "pending"
	}

	if request.Priority == "" {
		request.Priority = "medium"
	}

	validationError := validateTaskRequest(request)

	if validationError != "" {
		writeError(
			w,
			http.StatusBadRequest,
			validationError,
		)
		return
	}

	task, err := convertTaskRequest(request)

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			"Invalid date. Use YYYY-MM-DD.",
		)
		return
	}

	createdTask, err := database.CreateTask(
		h.DB,
		task,
	)

	if err != nil {
		writeError(
			w,
			http.StatusInternalServerError,
			"Failed to create task.",
		)
		return
	}

	writeJSON(
		w,
		http.StatusCreated,
		createdTask,
	)
}

func (h *TaskHandler) GetTasks(w http.ResponseWriter, r *http.Request) {
	var date *time.Time

	dateValue := r.URL.Query().Get("date")

	if dateValue != "" {
		parsedDate, err := time.Parse(
			"2006-01-02",
			dateValue,
		)

		if err != nil {
			writeError(
				w,
				http.StatusBadRequest,
				"Invalid date. Use YYYY-MM-DD.",
			)
			return
		}

		date = &parsedDate
	}

	tasks, err := database.GetTasks(
		h.DB,
		date,
	)

	if err != nil {
		writeError(
			w,
			http.StatusInternalServerError,
			"Failed to fetch tasks.",
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		tasks,
	)
}

func (h *TaskHandler) GetTaskByID(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(
		r.PathValue("id"),
	)

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			"Invalid task ID.",
		)
		return
	}

	task, err := database.GetTaskByID(
		h.DB,
		id,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			writeError(
				w,
				http.StatusNotFound,
				"Task not found.",
			)
			return
		}

		writeError(
			w,
			http.StatusInternalServerError,
			"Failed to fetch task.",
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		task,
	)
}

func (h *TaskHandler) UpdateTask(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(
		r.PathValue("id"),
	)

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			"Invalid task ID.",
		)
		return
	}

	var request TaskRequest

	err = json.NewDecoder(r.Body).Decode(&request)

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			"Invalid JSON request.",
		)
		return
	}

	validationError := validateTaskRequest(request)

	if validationError != "" {
		writeError(
			w,
			http.StatusBadRequest,
			validationError,
		)
		return
	}

	task, err := convertTaskRequest(request)

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			"Invalid date. Use YYYY-MM-DD.",
		)
		return
	}

	updatedTask, err := database.UpdateTask(
		h.DB,
		id,
		task,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			writeError(
				w,
				http.StatusNotFound,
				"Task not found.",
			)
			return
		}

		writeError(
			w,
			http.StatusInternalServerError,
			"Failed to update task.",
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		updatedTask,
	)
}

func (h *TaskHandler) DeleteTask(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(
		r.PathValue("id"),
	)

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			"Invalid task ID.",
		)
		return
	}

	err = database.DeleteTask(
		h.DB,
		id,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			writeError(
				w,
				http.StatusNotFound,
				"Task not found.",
			)
			return
		}

		writeError(
			w,
			http.StatusInternalServerError,
			"Failed to delete task.",
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
