const express = require('express');
const { query } = require('../modules/pool.js');
const router = express.Router();
const pool = require('../modules/pool.js');

// Create (POST)
router.post('/', (req, res) => {
    let newTask = req.body;
    console.log('Adding task', newTask);

    let queryText = `INSERT INTO "tasks" ("name", "description", "status")
                    VALUES ($1, $2, 'In progress');`;
    pool.query(queryText, [newTask.taskName, newTask.taskDescription]).then(result => {
        console.log('Added new task successfully');
        res.sendStatus(201);
    }).catch(error => {
        console.log(`Error adding new task`, error);
        res.sendStatus(500);
    });
});

// Read (GET)
router.get('/', (req, res) => {
    console.log('Retreiving data from DB');

    const queryText = `SELECT * FROM "tasks";`;

    pool.query(queryText).then(result => {
        console.log('Retrieved data successfully');
        res.status(200).send(result.rows)
    }).catch(error => {
        console.log(`Error making query ${queryText}`, error);
        res.sendStatus(500);
    });
});

// Update (PUT)


// Delete (DELETE)

module.exports = router;