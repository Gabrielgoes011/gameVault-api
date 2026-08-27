import { Pool } from 'pg';
import 'dotenv/config';

// Create a new instance of the Pool class with the database connection configuration
const pool = new Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default pool;