const express = require('express');
const { query } = require('../modules/pool.js');
const router = express.Router();
const pool = require('../modules/pool.js');

// Create (POST)

router.post('/', (req, res) => {
    // Posts a new tasks to the DB
    const newTask = req.body;
    console.log('Adding task', newTask);

    const queryText = `INSERT INTO "tasks" ("name", "description", "status")
                       VALUES ($1, $2, 'In progress');`;

    pool.query(queryText, [newTask.name, newTask.description]).then(result => {
        console.log('Added new task successfully');
        res.sendStatus(201);
    }).catch(error => {
        console.log(`Error adding new task`, error);
        res.sendStatus(500);
    });
});

// Read (GET)

router.get('/', (req, res) => {
    // Retrieves all tasks from the DB
    console.log('Retreiving data from DB');

    const queryText = `SELECT * FROM "tasks" ORDER BY "id" ASC;`;

    pool.query(queryText).then(result => {
        console.log('Retrieved data successfully');
        res.status(200).send(result.rows)
    }).catch(error => {
        console.log(`Error making query ${queryText}`, error);
        res.sendStatus(500);
    });
});

// Update (PUT)

router.put('/:id', (req, res) => {
    // Updates status of a task based on fed id and status change
    const statusChange = req.body.statusChange
    const taskId = req.params.id;
    console.log(`Updating status to ${statusChange} at id:`, taskId);

    const queryText = `UPDATE "tasks" SET "status" = $1
                       WHERE "id" = $2;`;

    pool.query(queryText, [statusChange, taskId]).then(result => {
        console.log(`Updated task at id: ${taskId} to ${statusChange} successfully`);
        res.sendStatus(200);
    }).catch(error => {
        console.log(`Error making query ${queryText}`, error);
        res.sendStatus(500);
    });
})

// Delete (DELETE)

router.delete('/:id', (req, res) => {
    // Deletes a task based on id
    const taskId = req.params.id;
    console.log('Deleting task at id:', taskId);

    const queryText = `DELETE FROM "tasks" WHERE id=$1`

    pool.query(queryText, [taskId]).then(result => {
        console.log(`Deleted task at id: ${taskId} successfully`);
        res.sendStatus(204);
    }).catch(error => {
        console.log(`Error making query ${queryText}`, error);
        res.sendStatus(500);
    });
});

module.exports = router;