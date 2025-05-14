import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken"
 
export async function POST(
  req,

) {
  
  

      
     const {uid} = await req.json()
    
  try {
    
    const [records] = await db.query(
      "SELECT status,score_now from user_score_status WHERE userid = ?",
      [jwt.decode(uid).uid]
    );
    
    return NextResponse.json({ question_record: records});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
