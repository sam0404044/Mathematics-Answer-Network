import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

 
export async function POST(
  req,

) {
  
  

      
     const {uid} = await req.json()
    
  try {
    const [records] = await db.query(
      "SELECT * from user_answer_record WHERE user_answer_record.userid = ? ORDER BY user_answer_record.time DESC LIMIT 1",
      [uid]
    );
    
    return NextResponse.json({ question_record: records});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
