import { readFile } from "fs/promises";
import mysql from "mysql2/promise";

const database = process.env.DATABASE_NAME;
const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
if (!database || !user || !password) {
  throw new Error("DATABASE_NAME, DATABASE_USER and DATABASE_PASSWORD are required");
}
if (!/^[A-Za-z0-9_]+$/.test(database) || !/^[A-Za-z0-9_]+$/.test(user)) {
  throw new Error("Database and user names may only contain letters, numbers and underscores");
}

const root = await mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
});

try {
  const databaseId = mysql.escapeId(database);
  const account = `${mysql.escape(user)}@'127.0.0.1'`;
  await root.query(
    `CREATE DATABASE IF NOT EXISTS ${databaseId}
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await root.query(
    `CREATE USER IF NOT EXISTS ${account} IDENTIFIED BY ${mysql.escape(password)}`,
  );
  await root.query(
    `ALTER USER ${account} IDENTIFIED BY ${mysql.escape(password)}`,
  );
  await root.query(
    `GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES
     ON ${databaseId}.* TO ${account}`,
  );
} finally {
  await root.end();
}

const schema = await readFile(
  new URL("../database/schema.sql", import.meta.url),
  "utf8",
);
const application = await mysql.createConnection({
  host: "127.0.0.1",
  port: Number(process.env.DATABASE_PORT || 3306),
  user,
  password,
  database,
  multipleStatements: true,
});

try {
  await application.query(schema);
  console.log("Local database schema is ready.");
} finally {
  await application.end();
}
