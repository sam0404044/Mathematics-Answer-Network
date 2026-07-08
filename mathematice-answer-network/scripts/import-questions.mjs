import { readFile } from "fs/promises";
import mysql from "mysql2/promise";

const required = ["DATABASE_USER", "DATABASE_PASSWORD", "DATABASE_NAME"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing environment variables: ${missing.join(", ")}`);
}

const source = JSON.parse(
  await readFile(new URL("../public/json/question.json", import.meta.url), "utf8"),
);
if (!Array.isArray(source.questions)) {
  throw new Error("public/json/question.json does not contain a questions array");
}

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT || 3306),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

try {
  await connection.beginTransaction();
  for (const question of source.questions) {
    const options = Array.isArray(question.options) ? question.options : [];
    const type = question.question_type === "multiple" ||
      question.question_type === "mutiple"
      ? "multiple"
      : "single";
    await connection.execute(
      `INSERT INTO questionForTest
         (uid, question, option_a, option_b, option_c, option_d, option_e,
          answer, explanation, questionYear, type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         question = VALUES(question),
         option_a = VALUES(option_a),
         option_b = VALUES(option_b),
         option_c = VALUES(option_c),
         option_d = VALUES(option_d),
         option_e = VALUES(option_e),
         answer = VALUES(answer),
         explanation = VALUES(explanation),
         questionYear = VALUES(questionYear),
         type = VALUES(type)`,
      [
        question.id,
        question.question,
        options[0] ?? null,
        options[1] ?? null,
        options[2] ?? null,
        options[3] ?? null,
        options[4] ?? null,
        JSON.stringify(question.answer),
        question.explanation ?? null,
        source.exam_title,
        type,
      ],
    );
  }
  await connection.commit();
  console.log(`Imported ${source.questions.length} questions.`);
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
