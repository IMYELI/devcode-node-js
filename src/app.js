require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const { migration, db } = require('./db');

const port = process.env.PORT || 3030;
const host = process.env.HOST || 'localhost';

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
// ACTIVITY
app.get('/activity-groups', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT activity_id AS id, title, email, created_at AS createdAt, updated_at AS updatedAt FROM activities`
        );

        res.status(200).json({
            status: 'Success',
            message: 'Success',
            data: rows,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.get('/activity-groups/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT activity_id AS id, title, email, created_at AS createdAt, updated_at AS updatedAt FROM activities WHERE activity_id = ?`,
            [req.params.id]
        );
        // Check if data not found
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Not Found',
                message: `Activity with ID ${req.params.id} Not Found`,
            });
        }
        res.status(200).json({
            status: 'Success',
            message: 'Success',
            data: rows,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.post('/activity-groups', async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({
                status: 'Bad Request',
                message: 'title cannot be null',
            });
        }
        const [insert] = await db.query(
            `INSERT INTO activities(title,email) VALUES(?,?)`,
            [req.body.title, req.body.email]
        );
        const insertedId = insert.insertId;

        const [row] = await db.query(
            `SELECT activity_id AS id, title, email, created_at AS createdAt, updated_at AS updatedAt FROM activities WHERE activity_id = ?`,
            [insertedId]
        );

        res.status(201).json({
            status: 'Success',
            message: 'Success',
            data: row,
        });
    } catch (err) {
        return res
            .status(500)
            .json({ status: 'Bad Request', message: err.message });
    }
});

app.patch('/activity-groups/:id', async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({
                status: 'Bad Request',
                message: 'title cannot be null',
            });
        }

        const [updated] = await db.query(
            `UPDATE activities SET title = ? WHERE activity_id = ?`,
            [req.body.title, req.params.id]
        );

        if (updated.affectedRows === 0) {
            return res.status(404).json({
                status: 'Not Found',
                message: `Activity with ID ${req.params.id} Not Found`,
            });
        }

        const [row] = await db.query(
            `SELECT activity_id AS id, title, email, created_at AS createdAt, updated_at AS updatedAt FROM activities WHERE activity_id = ?`,
            [req.params.id]
        );

        res.status(200).json({
            status: 'Success',
            message: 'Success',
            data: row,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.delete('/activity-groups/:id', async (req, res) => {
    try {
        const [deleted] = await db.query(
            `DELETE FROM activities WHERE activity_id = ?`,
            [req.params.id]
        );

        if (deleted.affectedRows === 0) {
            return res.status(404).json({
                status: 'Not Found',
                message: `Activity with ID ${req.params.id} Not Found`,
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'Success',
            data: {},
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// TODOS
app.get('/todo-items', async (req, res) => {
    try {
        if (req.query.activity_group_id) {
            const [rows] = await db.query(
                `SELECT todo_id AS id, activity_group_id, title, is_active, priority, created_at AS createdAt, updated_at AS updatedAt FROM todos WHERE activity_group_id = ?`,
                [req.query.activity_group_id]
            );
            return res
                .status(200)
                .json({ status: 'Success', message: 'Success', data: rows });
        }

        const [rows] = await db.query(
            `SELECT todo_id AS id, activity_group_id, title, is_active, priority, created_at AS createdAt, updated_at AS updatedAt FROM todos`
        );

        res.status(200).json({
            status: 'Success',
            message: 'Success',
            data: rows,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.get('/todo-items/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT todo_id AS id, activity_group_id, title, is_active, priority, created_at AS createdAt, updated_at AS updatedAt FROM todos WHERE todo_id = ?`,
            [req.params.id]
        );
        // Check if data not found
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Not Found',
                message: `Todo with ID ${req.params.id} Not Found`,
            });
        }
        res.status(200).json({
            status: 'Success',
            message: 'Success',
            data: rows,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.post('/todo-items', async (req, res) => {
    try {
        if (
            !req.body.title ||
            !req.body.activity_group_id ||
            !req.body.is_active
        ) {
            return res.status(400).json({
                status: 'Bad Request',
                message: 'title cannot be null',
            });
        }
        const [insert] = await db.query(
            `INSERT INTO todos(title,activity_group_id,is_active) VALUES(?,?,?)`,
            [req.body.title, req.body.activity_group_id, req.body.is_active]
        );
        const insertedId = insert.insertId;

        const [row] = await db.query(
            `SELECT todo_id AS id, title, activity_group_id, is_active, priority, created_at AS createdAt, updated_at AS updatedAt FROM todos WHERE todo_id = ?`,
            [insertedId]
        );

        res.status(201).json({
            status: 'Success',
            message: 'Success',
            data: row,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.patch('/todo-items/:id', async (req, res) => {
    try {
        //Check if data not found
        const [rows] = await db.query(`SELECT * FROM todos WHERE todo_id = ?`, [
            req.params.id,
        ]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Not Found',
                message: `Todo with ID ${req.params.id} Not Found`,
            });
        }

        if (req.body.title != null) {
            const [updated] = await db.query(
                `UPDATE todos SET title = ? WHERE todo_id = ?`,
                [req.body.title, req.params.id]
            );
        }

        if (req.body.is_active != null) {
            const [updated] = await db.query(
                `UPDATE todos SET is_active = ? WHERE todo_id = ?`,
                [req.body.is_active, req.params.id]
            );
        }

        if (req.body.priority != null) {
            const [updated] = await db.query(
                `UPDATE todos SET priority = ? WHERE todo_id = ?`,
                [req.body.priority, req.params.id]
            );
        }

        const [row] = await db.query(
            `SELECT todo_id AS id, activity_group_id, title, is_active, priority, created_at AS createdAt, updated_at AS updatedAt FROM todos WHERE todo_id = ?`,
            [req.params.id]
        );

        res.status(200).json({
            status: 'Success',
            message: 'Success',
            data: row,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.delete('/todo-items/:id', async (req, res) => {
    try {
        //Check if data not found
        const [rows] = await db.query(`SELECT * FROM todos WHERE todo_id = ?`, [
            req.params.id,
        ]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Not Found',
                message: `Todo with ID ${req.params.id} Not Found`,
            });
        }

        const [deleted] = await db.query(
            `DELETE FROM todos WHERE todo_id = ?`,
            [req.params.id]
        );

        res.status(200).json({
            status: 'Success',
            message: 'Success',
            data: {},
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// 404 endpoint middleware
app.all('*', (req, res) => {
    res.status(404).json({ message: `${req.originalUrl} not found!` });
});

// error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message || 'An error occurred.',
    });
});

const run = async () => {
    await migration(); // 👈 running migration before server
    app.listen(port); // running server
    console.log(`Server run on http://${host}:${port}/`);
};

run();
