const pg = require('pg');

let config = {};

if (process.env.DATABASE_URL) {
    config = {
        connectionString: process.env.DATABASE_URL,
        ssl: {rejectUnauthorized: false}
    };
} else {
    config = {
        database: 'todo-list',
        host: 'localhost',
        port: 5432,
        max: 10,
        idleTimeoutMillis: 30000
    }; 
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
    console.log('connected to postgres');
});

pool.on('error', (error) => {
    console.log('error connecting to postgres', error)
});

module.exports = pool;