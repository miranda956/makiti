const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: "mk-postgres1.cmgk6hqap8r5.eu-west-3.rds.amazonaws.com",
    database: 'postgres',
    password: "68RPteTBBZRQGT0h3Z791oEL0mHDYlot3IPX",
    port: 5432,
})

pool.on('error', (err, client) => {
    console.error('Error:', err)
})

const query = `
SELECT *
FROM products_products
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
