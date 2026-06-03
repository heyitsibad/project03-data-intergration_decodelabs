const Task = require("../models/Task");

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getAllTasks = async (req, res) => {
  try {
    const { completed, sort, limit = 10, page = 1 } = req.query;

    const filter = {};
    if (completed !== undefined) {
      filter.completed = completed === "true";
    }

    const sortOption = sort === "oldest" ? { created_at: 1 } : { created_at: -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sortOption).limit(Number(limit)).skip(skip),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching tasks",
      error: error.message,
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID '${req.params.id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${req.params.id}'`,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching task",
      error: error.message,
    });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
  try {
    const { title, completed } = req.body;

    const task = await Task.create({ title, completed });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while creating task",
      error: error.message,
    });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
  try {
    const { title, completed } = req.body;

    if (title === undefined && completed === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update: 'title' or 'completed'",
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID '${req.params.id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${req.params.id}'`,
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while updating task",
      error: error.message,
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID '${req.params.id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${req.params.id}'`,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while deleting task",
      error: error.message,
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
