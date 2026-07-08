import mysql from "mysql2/promise";

const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3100";
const email = `smoke-${Date.now()}@example.test`;
const password = "SmokeTest123";
const results = [];
let cookie = "";

async function request(name, path, options = {}, expected = 200) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    redirect: "manual",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...options.headers,
    },
  });
  results.push({ name, status: response.status, expected });
  if (response.status !== expected) {
    const body = await response.text();
    throw new Error(`${name} returned ${response.status}: ${body}`);
  }
  return response;
}

const cleanup = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });
  try {
    await connection.execute("DELETE FROM user_info WHERE email = ?", [email]);
  } finally {
    await connection.end();
  }
};

try {
  await request("health", "/api/health");
  await request(
    "register",
    "/api/register",
    {
      method: "POST",
      body: JSON.stringify({
        userName: "Smoke Test",
        userEmail: email,
        userPwd: password,
        userSchool: "Test School",
        userGrade: 10,
        userGender: "other",
      }),
    },
    201,
  );
  const login = await request(
    "login",
    "/api/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password, rememberMe: false }),
    },
    303,
  );
  cookie = login.headers.get("set-cookie")?.split(";")[0] || "";
  if (!cookie.startsWith("login_data=")) throw new Error("Login cookie missing");

  const me = await (await request("current user", "/api/user/me")).json();
  if (me.email !== email || !me.uid) throw new Error("Current user mismatch");

  const quiz = await (
    await request("generate quiz", "/api/generateQuiz", {
      method: "POST",
      body: JSON.stringify({ questionCount: 3 }),
    })
  ).json();
  if (!Array.isArray(quiz.questions) || quiz.questions.length !== 3) {
    throw new Error("Quiz did not return three questions");
  }
  if (quiz.questions.some((question) => "answer" in question || "explanation" in question)) {
    throw new Error("Quiz response exposed answers");
  }

  await request("submit quiz", "/api/quizSubmit", {
    method: "POST",
    body: JSON.stringify({
      cost_time: 12,
      question_bank: "smoke-test",
      status: 1,
      answer: {
        answer_info: quiz.questions.map((question) => ({
          uid: question.id,
          answer: [],
        })),
      },
    }),
  });

  const score = await (
    await request("score", "/api/score", {
      method: "POST",
      body: JSON.stringify({}),
    })
  ).json();
  if (!score.question_record?.[0]?.score_now) {
    throw new Error("Score record missing");
  }

  const record = await (
    await request("record", "/api/record", {
      method: "POST",
      body: JSON.stringify({}),
    })
  ).json();
  if (record.question_record?.length !== 1 || !record.tree_status?.[0]) {
    throw new Error("Answer history or tree status missing");
  }

  console.table(results);
  console.log("End-to-end smoke test passed.");
} finally {
  await cleanup();
}
