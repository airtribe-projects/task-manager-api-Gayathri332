const { tasks: seedTasks } = require('../../task.json');

// Valid priority levels
const PRIORITY_LEVELS = ['low', 'medium', 'high'];

// Mutable in-memory store seeded from task.json
let tasks = seedTasks.map(t => ({
    ...t,
    priority: t.priority || 'medium',   // back-fill priority for seed data
    createdAt: t.createdAt || new Date().toISOString(),
}));

let nextId = Math.max(...tasks.map(t => t.id)) + 1;

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Reset store to seed state (used by tests between runs) */
function reset() {
    tasks = seedTasks.map(t => ({
        ...t,
        priority: t.priority || 'medium',
        createdAt: t.createdAt || new Date().toISOString(),
    }));
    nextId = Math.max(...tasks.map(t => t.id)) + 1;
}

// ── Queries ────────────────────────────────────────────────────────────────────

/**
 * Get all tasks with optional filtering and sorting.
 *
 * @param {object} options
 * @param {boolean|undefined} options.completed  - filter by completion status
 * @param {'asc'|'desc'|undefined} options.sort  - sort by createdAt
 * @param {'low'|'medium'|'high'|undefined} options.priority - filter by priority
 */
function getAllTasks({ completed, sort, priority } = {}) {
    let result = [...tasks];

    // Filter by completed
    if (completed !== undefined) {
        result = result.filter(t => t.completed === completed);
    }

    // Filter by priority
    if (priority !== undefined) {
        result = result.filter(t => t.priority === priority);
    }

    // Sort by createdAt
    if (sort === 'asc') {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'desc') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
}

/** Find a single task by numeric id. Returns the task or undefined. */
function getTaskById(id) {
    return tasks.find(t => t.id === id);
}

/** Get all tasks matching a given priority level. */
function getTasksByPriority(level) {
    return tasks.filter(t => t.priority === level);
}

// ── Mutations ──────────────────────────────────────────────────────────────────

/**
 * Create a new task.
 * @param {{ title: string, description: string, completed: boolean, priority?: string }} data
 */
function createTask({ title, description, completed, priority = 'medium' }) {
    const task = {
        id: nextId++,
        title: title.trim(),
        description,
        completed,
        priority,
        createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
}

/**
 * Update an existing task. Returns the updated task or undefined if not found.
 * @param {number} id
 * @param {{ title: string, description: string, completed: boolean, priority?: string }} data
 */
function updateTask(id, { title, description, completed, priority }) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;

    tasks[index] = {
        ...tasks[index],
        title: title.trim(),
        description,
        completed,
        priority: priority || tasks[index].priority,
    };
    return tasks[index];
}

/**
 * Delete a task. Returns the deleted task or undefined if not found.
 * @param {number} id
 */
function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    const [deleted] = tasks.splice(index, 1);
    return deleted;
}

module.exports = {
    PRIORITY_LEVELS,
    reset,
    getAllTasks,
    getTaskById,
    getTasksByPriority,
    createTask,
    updateTask,
    deleteTask,
};