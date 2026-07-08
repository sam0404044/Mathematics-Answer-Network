import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { answersEqual, normalizeAnswer, parseJsonArray } from "@/lib/quiz";
import { cleanText, positiveInteger } from "@/lib/validation";

function submittedAnswers(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 100) return null;
  const result = [];
  const seen = new Set();
  for (const item of value) {
    const uid = positiveInteger(item?.uid);
    if (!uid || seen.has(uid) || !Array.isArray(item?.answer) || item.answer.length > 5) {
      return null;
    }
    seen.add(uid);
    result.push({ uid, answer: normalizeAnswer(item.answer) });
  }
  return result;
}

export async function POST(req) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const answers = submittedAnswers(body?.answer?.answer_info);
  const costTime = positiveInteger(body?.cost_time, 24 * 60 * 60) ?? 0;
  const questionBank = cleanText(body?.question_bank, { max: 100 });
  const mode = [1, 2, 3].includes(Number(body?.status)) ? Number(body.status) : 1;
  if (!answers || !questionBank) {
    return NextResponse.json({ error: "作答資料格式無效" }, { status: 400 });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const ids = answers.map((item) => item.uid);
    const [questions] = await connection.query(
      "SELECT uid, answer FROM questionForTest WHERE uid IN (?)",
      [ids],
    );
    const correctById = new Map(
      questions.map((question) => [Number(question.uid), normalizeAnswer(question.answer)]),
    );
    if (correctById.size !== ids.length) {
      await connection.rollback();
      return NextResponse.json({ error: "部分題目不存在" }, { status: 400 });
    }

    const canonicalItems = answers.map((item) => ({
      uid: item.uid,
      answer: item.answer,
      right_answer: correctById.get(item.uid),
    }));
    const correctCount = canonicalItems.filter((item) =>
      answersEqual(item.answer, item.right_answer),
    ).length;
    const answer = {
      answer_info: canonicalItems,
      answer_status: { total: canonicalItems.length, correct: correctCount },
    };
    const storedAttempt = { answer_info: answer, cost_time: costTime };
    const wrong = canonicalItems.filter(
      (item) => !answersEqual(item.answer, item.right_answer),
    );
    const rightIds = new Set(
      canonicalItems
        .filter((item) => answersEqual(item.answer, item.right_answer))
        .map((item) => item.uid),
    );

    const [statusRows] = await connection.query(
      "SELECT wrong_question_set FROM user_score_status WHERE userid = ? FOR UPDATE",
      [session.uid],
    );
    const previousWrong = parseJsonArray(statusRows[0]?.wrong_question_set);
    const wrongIds = new Set(wrong.map((item) => item.uid));
    const mergedWrong = previousWrong
      .filter((item) => item && !rightIds.has(Number(item.uid)) && !wrongIds.has(Number(item.uid)))
      .concat(wrong);

    await connection.query(
      `INSERT INTO user_score_status (userid, wrong_question_set)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE wrong_question_set = VALUES(wrong_question_set)`,
      [session.uid, JSON.stringify(mergedWrong)],
    );

    if (mode === 2) {
      await connection.query(
        `INSERT INTO user_score_status (userid, last_review, score_now, status)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           last_review = VALUES(last_review),
           score_now = VALUES(score_now),
           status = VALUES(status)`,
        [session.uid, JSON.stringify(storedAttempt), JSON.stringify(storedAttempt), mode],
      );
    } else if (mode === 3) {
      await connection.query(
        `INSERT INTO user_score_status (userid, last_set, score_now, status)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           last_set = VALUES(last_set),
           score_now = VALUES(score_now),
           status = VALUES(status)`,
        [session.uid, JSON.stringify(storedAttempt), JSON.stringify(storedAttempt), mode],
      );
    } else {
      await connection.query(
        `INSERT INTO user_score_status
           (userid, last_quiz, last_review, score_now, wrong_question_set, status)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           last_quiz = VALUES(last_quiz),
           last_review = VALUES(last_review),
           score_now = VALUES(score_now),
           wrong_question_set = VALUES(wrong_question_set),
           status = VALUES(status)`,
        [
          session.uid,
          JSON.stringify(storedAttempt),
          JSON.stringify(storedAttempt),
          JSON.stringify(storedAttempt),
          JSON.stringify(mergedWrong),
          mode,
        ],
      );
      await connection.query(
        `INSERT INTO user_tree_status (userid, complete_test)
         VALUES (?, 1)
         ON DUPLICATE KEY UPDATE complete_test = complete_test + 1`,
        [session.uid],
      );
      await connection.query(
        `INSERT INTO user_answer_record (userid, answer, cost_time, question_bank)
         VALUES (?, ?, ?, ?)`,
        [session.uid, JSON.stringify(answer), costTime, questionBank],
      );
    }

    await connection.commit();
    return NextResponse.json({
      success: true,
      result: answer.answer_status,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("[Quiz Submit Error]", error);
    return NextResponse.json({ error: "作答資料儲存失敗" }, { status: 503 });
  } finally {
    connection?.release();
  }
}
