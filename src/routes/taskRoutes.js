const { Router } = require('express');
const controller = require('../controllers/taskController');
const {
    validateTaskBody,
    validateIdParam,
    validatePriorityParam,
} = require('../middleware/validate');

const router = Router();

// ── Collection routes ──────────────────────────────────────────────────────────
router.get('/',     controller.getAllTasks);
router.post('/',    validateTaskBody, controller.createTask);

// ── Priority filter (must come before /:id) ────────────────────────────────────
router.get('/priority/:level', validatePriorityParam, controller.getTasksByPriority);

// ── Single-resource routes ─────────────────────────────────────────────────────
router.get('/:id',    validateIdParam, controller.getTaskById);
router.put('/:id',    validateIdParam, validateTaskBody, controller.updateTask);
router.delete('/:id', validateIdParam, controller.deleteTask);

module.exports = router;