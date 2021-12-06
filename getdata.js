const { Pool } = require('pg');

const pool = new Pool({
    user:process.env.user
    host:process.env.host
    database:process.env.database,
    password: process.env.password
    port: process.env.port
})

pool.on('error', (err, client) => {
    console.error('Error:', err)
})

const query = `
SELECT *
FROM interactions_interactions
`;

(async () => {
    try {
        const client = await pool.connect();
        const res = await client.query(query);

        for (let row of res.rows) 
            
            console.log(row)
        }
        catch (err) {
            console.error(err);
        }
    } 
)();
