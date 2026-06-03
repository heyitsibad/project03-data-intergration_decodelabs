// Middleware: Validate request body for creating a task
const validateCreateTask = (req, res, next) => {
  const { title, completed } = req.body;

  // title is required on create
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: ["'title' is required and must be a non-empty string"],
    });
  }

  // completed must be boolean if provided
  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: ["'completed' must be a boolean (true or false)"],
    });
  }

  // Sanitize
  req.body.title = title.trim();
  next();
};

// Middleware: Validate request body for updating a task
const validateUpdateTask = (req, res, next) => {
  const { title, completed } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      errors.push("'title' must be a non-empty string");
    }
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      errors.push("'completed' must be a boolean (true or false)");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  if (title !== undefined) req.body.title = title.trim();
  next();
};

module.exports = { validateCreateTask, validateUpdateTask };
