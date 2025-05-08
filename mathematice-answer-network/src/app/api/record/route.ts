import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

 
export async function POST(
  req: Request,

) {
  
  

      
     const {uid} = await req.json()
    
  try {
    const [records] = await db.query(
      "SELECT * from user_answer_record WHERE user_answer_record.userid = ? ORDER BY user_answer_record.time DESC LIMIT 5",
      [uid]
    );
    const [tree_status] = await db.query(
        "SELECT * FROM `user_tree_status` WHERE userid = ? limit 1",
        [uid]
      );
    const [wrong_question_n] = await db.query(
        "SELECT user_wrong_question.wrong_question_number from user_wrong_question WHERE user_wrong_question.userid = ? limit 1",
        [uid]
    );
    return NextResponse.json({ question_record: records ,tree_status:tree_status,wrong_question_n:wrong_question_n});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
