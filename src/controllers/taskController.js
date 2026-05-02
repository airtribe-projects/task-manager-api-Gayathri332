const taskService = require('../services/taskService');

// GET /tasks
// Optional query params: ?completed=true|false  &sort=asc|desc  &priority=low|medium|high
function getAllTasks(req, res) {
    const { completed, sort, priority } = req.query;

    // Parse completed query param into a boolean (or leave undefined to skip filter)
    let completedFilter;
    if (completed === 'true')  completedFilter = true;
    if (completed === 'false') completedFilter = false;

    // Validate sort value
    if (sort !== undefined && !['asc', 'desc'].includes(sort)) {
        return res.status(400).json({ error: 'sort must be "asc" or "desc"' });
    }

    // Validate priority query param
    if (priority !== undefined && !taskService.PRIORITY_LEVELS.includes(priority)) {
        return res.status(400).json({
            error: `priority must be one of: ${taskService.PRIORITY_LEVELS.join(', ')}`,
        });
    }

    const tasks = taskService.getAllTasks({
        completed: completedFilter,
        sort,
        priority,
    });

    res.status(200).json(tasks);
}

// GET /tasks/:id
function getTaskById(req, res) {
    const task = taskService.getTaskById(req.taskId);
    if (!task) {
        return res.status(404).json({ error: `Task with id ${req.taskId} not found` });
    }
    res.status(200).json(task);
}

// GET /tasks/priority/:level
function getTasksByPriority(req, res) {
    const tasks = taskService.getTasksByPriority(req.params.level);
    res.status(200).json(tasks);
}

// POST /tasks
function createTask(req, res) {
    const { title, description, completed, priority } = req.body;
    const task = taskService.createTask({ title, description, completed, priority });
    res.status(201).json(task);
}

// PUT /tasks/:id
function updateTask(req, res) {
    const { title, description, completed, priority } = req.body;
    const task = taskService.updateTask(req.taskId, { title, description, completed, priority });
    if (!task) {
        return res.status(404).json({ error: `Task with id ${req.taskId} not found` });
    }
    res.status(200).json(task);
}

// DELETE /tasks/:id
function deleteTask(req, res) {
    const deleted = taskService.deleteTask(req.taskId);
    if (!deleted) {
        return res.status(404).json({ error: `Task with id ${req.taskId} not found` });
    }
    res.status(200).json({ message: 'Task deleted successfully', task: deleted });
}

module.exports = {
    getAllTasks,
    getTaskById,
    getTasksByPriority,
    createTask,
    updateTask,
    deleteTask,
};