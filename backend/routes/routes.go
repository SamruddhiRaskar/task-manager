package routes

import (
	"net/http"

	"task-manager/handlers"
)

func SetupRoutes(taskHandler *handlers.TaskHandler) *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/tasks", taskHandler.CreateTask)
	mux.HandleFunc("GET /api/tasks", taskHandler.GetTasks)
	mux.HandleFunc("GET /api/tasks/{id}", taskHandler.GetTaskByID)
	mux.HandleFunc("PUT /api/tasks/{id}", taskHandler.UpdateTask)
	mux.HandleFunc("DELETE /api/tasks/{id}", taskHandler.DeleteTask)

	return mux
}

//his file defines the API routes of the application.
//A route connects an HTTP method and URL path to a specific handler function.
//For example:POST /api/tasks → CreateTask()
//The route does not perform the actual task operation. It only directs the request to the appropriate handler.
//Flow:Client → URL → Route → Handler
