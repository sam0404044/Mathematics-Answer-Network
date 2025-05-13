import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

 
export async function POST(
  req,

) {
  
  

      
     const {question_id} = await req.json()
    
  try {
    const [questions] = await db.query(
      "SELECT * FROM `questionForTest` WHERE questionForTest.uid IN (?)",
      [question_id]
    );
    
    return NextResponse.json({ questions: questions});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
