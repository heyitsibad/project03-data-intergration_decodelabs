const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { validateCreateTask, validateUpdateTask } = require("../middleware/validateTask");

// GET  /api/tasks          - Get all tasks (supports ?completed=true/false&sort=oldest&page=1&limit=10)
// POST /api/tasks          - Create a new task
router.route("/").get(getAllTasks).post(validateCreateTask, createTask);

// GET    /api/tasks/:id    - Get task by ID
// PUT    /api/tasks/:id    - Update task by ID
// DELETE /api/tasks/:id    - Delete task by ID
router.route("/:id").get(getTaskById).put(validateUpdateTask, updateTask).delete(deleteTask);

module.exports = router;
