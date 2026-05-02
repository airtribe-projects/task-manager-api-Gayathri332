const { PRIORITY_LEVELS } = require('../services/taskService');

/**
 * Validates a full task body (POST / PUT).
 * Expects: title (string), description (string), completed (boolean).
 * Optional: priority ('low' | 'medium' | 'high').
 */
function validateTaskBody(req, res, next) {
    const { title, description, completed, priority } = req.body;

    if (title === undefined || description === undefined || completed === undefined) {
        return res.status(400).json({
            error: 'title, description, and completed are all required',
        });
    }

    if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'title must be a non-empty string' });
    }

    if (typeof description !== 'string') {
        return res.status(400).json({ error: 'description must be a string' });
    }

    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'completed must be a boolean' });
    }

    if (priority !== undefined && !PRIORITY_LEVELS.includes(priority)) {
        return res.status(400).json({
            error: `priority must be one of: ${PRIORITY_LEVELS.join(', ')}`,
        });
    }

    next();
}

/**
 * Validates the :id param is a positive integer.
 */
function validateIdParam(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: 'id must be a positive integer' });
    }
    req.taskId = id;   // attach parsed id for controllers
    next();
}

/**
 * Validates the :level param for priority routes.
 */
function validatePriorityParam(req, res, next) {
    const { level } = req.params;
    if (!PRIORITY_LEVELS.includes(level)) {
        return res.status(400).json({
            error: `priority level must be one of: ${PRIORITY_LEVELS.join(', ')}`,
        });
    }
    next();
}

module.exports = { validateTaskBody, validateIdParam, validatePriorityParam };