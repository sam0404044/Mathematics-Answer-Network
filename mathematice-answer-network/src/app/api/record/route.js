import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "未登入" }, { status: 401 });

  try {
    const [records] = await db.query(
      `SELECT id, answer, answer_review, cost_time, question_bank, time
       FROM user_answer_record
       WHERE userid = ?
       ORDER BY time DESC
       LIMIT 5`,
      [session.uid],
    );
    await db.query(
      "INSERT IGNORE INTO user_tree_status (userid, complete_test) VALUES (?, 0)",
      [session.uid],
    );
    const [treeStatus] = await db.query(
      `SELECT complete_test, status, gap, total_tree
       FROM user_tree_status
       WHERE userid = ?`,
      [session.uid],
    );
    return NextResponse.json({
      question_record: records,
      tree_status: treeStatus,
    });
  } catch (error) {
    console.error("[Record Error]", error);
    return NextResponse.json({ error: "服務暫時無法使用" }, { status: 503 });
  }
}
