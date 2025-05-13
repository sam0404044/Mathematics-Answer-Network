import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken"

export async function POST(
  req,

) {




  const { uid } = await req.json()
  let decode_uid = await jwt.decode(uid).uid

  try {
    
    const [records] = await db.query(
      "SELECT * from user_answer_record WHERE user_answer_record.userid = ? ORDER BY user_answer_record.time DESC LIMIT 5",
      [decode_uid]
    );
    await db.query(
      "INSERT IGNORE INTO user_tree_status (userid,complete_test) values(?,0)",
      [decode_uid]
    );

    const [tree_status] = await db.query(
      "SELECT * FROM user_tree_status WHERE userid = ?",
      [decode_uid]
    );
    await db.query(
      "INSERT IGNORE INTO user_wrong_question (userid) values(?)",
      [decode_uid]
    );
    const [wrong_question_n] = await db.query(
      "SELECT user_wrong_question.wrong_question_number from user_wrong_question WHERE user_wrong_question.userid = ? limit 1",
      [decode_uid]
    );
    return NextResponse.json({ question_record: records, tree_status: tree_status, wrong_question_n: wrong_question_n });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
