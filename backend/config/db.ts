import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool: Pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

pool.on('error', (err: Error) => {
    console.error('Database error', err);
});

export default pool;