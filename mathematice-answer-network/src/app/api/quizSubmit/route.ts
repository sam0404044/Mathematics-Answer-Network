import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

 
export async function POST(
  req: Request,

) {
  
  

      
     const {userid,cost_time,answer} = await req.json()
     
     
    
  try {
    await db.query(
        "INSERT INTO user_answer_record (user_answer_record.userid,user_answer_record.answer,user_answer_record.cost_time) VALUES( ? , ? , ?)",
        [userid,JSON.stringify(answer),cost_time]
    );
    
    return NextResponse.json({userid:userid,cost_time:cost_time,answer:answer});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
