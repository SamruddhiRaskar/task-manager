package database

import (
	"context"
	"time"

	"task-manager/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Take a Task from Go and insert it into PostgreSQL.
func CreateTask(db *pgxpool.Pool, task models.Task) (models.Task, error) {
	query := `
		INSERT INTO tasks (
			title,
			description,
			status,
			priority,
			task_date,
			task_time
		)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING
			id,
			title,
			description,
			status,
			priority,
			task_date,
			task_time,
			created_at,
			updated_at
	`

	// We want those values back.
	var createdTask models.Task

	err := db.QueryRow(
		context.Background(),
		query,
		task.Title,
		task.Description,
		task.Status,
		task.Priority,
		task.TaskDate,
		task.TaskTime,
	).Scan(
		&createdTask.ID,
		&createdTask.Title,
		&createdTask.Description,
		&createdTask.Status,
		&createdTask.Priority,
		&createdTask.TaskDate,
		&createdTask.TaskTime,
		&createdTask.CreatedAt,
		&createdTask.UpdatedAt,
	)

	if err != nil {
		return models.Task{}, err
	}

	return createdTask, nil
}

// GetTasks returns all tasks or only tasks for a specific date.
func GetTasks(db *pgxpool.Pool, date *time.Time) ([]models.Task, error) {
	query := `
		SELECT
			id,
			title,
			description,
			status,
			priority,
			task_date,
			task_time,
			created_at,
			updated_at
		FROM tasks
	`

	var rows pgx.Rows
	var err error

	if date != nil {
		query += ` WHERE task_date = $1`
		query += ` ORDER BY task_date, task_time`

		rows, err = db.Query(
			context.Background(),
			query,
			*date,
		)
	} else {
		query += ` ORDER BY task_date, task_time`

		rows, err = db.Query(
			context.Background(),
			query,
		)
	}

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	// Return [] instead of null when there are no tasks.
	tasks := make([]models.Task, 0)

	for rows.Next() {
		var task models.Task

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.Status,
			&task.Priority,
			&task.TaskDate,
			&task.TaskTime,
			&task.CreatedAt,
			&task.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		tasks = append(tasks, task)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}

func GetTaskByID(db *pgxpool.Pool, id int) (models.Task, error) {
	query := `
		SELECT
			id,
			title,
			description,
			status,
			priority,
			task_date,
			task_time,
			created_at,
			updated_at
		FROM tasks
		WHERE id = $1
	`

	var task models.Task

	err := db.QueryRow(
		context.Background(),
		query,
		id,
	).Scan(
		&task.ID,
		&task.Title,
		&task.Description,
		&task.Status,
		&task.Priority,
		&task.TaskDate,
		&task.TaskTime,
		&task.CreatedAt,
		&task.UpdatedAt,
	)

	if err != nil {
		return models.Task{}, err
	}

	return task, nil
}

func UpdateTask(db *pgxpool.Pool, id int, task models.Task) (models.Task, error) {
	query := `
		UPDATE tasks
		SET
			title = $1,
			description = $2,
			status = $3,
			priority = $4,
			task_date = $5,
			task_time = $6,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $7
		RETURNING
			id,
			title,
			description,
			status,
			priority,
			task_date,
			task_time,
			created_at,
			updated_at
	`

	var updatedTask models.Task

	err := db.QueryRow(
		context.Background(),
		query,
		task.Title,
		task.Description,
		task.Status,
		task.Priority,
		task.TaskDate,
		task.TaskTime,
		id,
	).Scan(
		&updatedTask.ID,
		&updatedTask.Title,
		&updatedTask.Description,
		&updatedTask.Status,
		&updatedTask.Priority,
		&updatedTask.TaskDate,
		&updatedTask.TaskTime,
		&updatedTask.CreatedAt,
		&updatedTask.UpdatedAt,
	)

	if err != nil {
		return models.Task{}, err
	}

	return updatedTask, nil
}

func DeleteTask(db *pgxpool.Pool, id int) error {
	query := `
		DELETE FROM tasks
		WHERE id = $1
	`

	_, err := db.Exec(
		context.Background(),
		query,
		id,
	)

	return err
}
