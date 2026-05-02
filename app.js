const express = require('express');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/tasks', taskRoutes);

//catch all errors
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ───────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// ── Start server (skipped when imported by tests) ─────────────────────────────
if (require.main === module) {
    app.listen(port, (err) => {
        if (err) return console.error('Something bad happened', err);
        console.log(`Server is listening on ${port}`);
    });
}

module.exports = app;