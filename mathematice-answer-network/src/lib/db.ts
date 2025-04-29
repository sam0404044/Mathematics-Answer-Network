// src/lib/db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

// console.log('DB HOST:', process.env.DATABASE_HOST);
// console.log('DB USER:', process.env.DATABASE_USER);
export default pool;
