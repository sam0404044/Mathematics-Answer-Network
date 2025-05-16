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
    
    
    return NextResponse.json({ question_record: records, tree_status: tree_status});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
