// src/lib/db.ts
import mysql from 'mysql2/promise';

// 抓取.env.local中的內容並設定為連線參數
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DATABASE_CONNECTION_LIMIT || 10),
    queueLimit: 0,
    connectTimeout: Number(process.env.DATABASE_CONNECT_TIMEOUT || 10000),
    enableKeepAlive: true,
});

export default pool;
