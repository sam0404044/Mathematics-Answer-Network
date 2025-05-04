// src/lib/db.ts
import mysql from 'mysql2/promise';

// 抓取.env.local中的內容並設定為連線參數
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

export default pool;
