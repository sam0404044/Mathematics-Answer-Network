import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";


 
export async function POST(
  req,

) {
  
  

    
     const {userid,cost_time,answer,question_bank} = await req.json()
     let wrong_question = answer.answer_info.filter( x => x.answer?.sort().toString() !== x.right_answer?.sort().toString())
     
     let answer_review = {
      has_review:false,
      solve_status: false ,
      answer_info:wrong_question,
      cost_time:cost_time
     }
     
    
  try {
    await db.query(
        "INSERT INTO user_answer_record (user_answer_record.userid,user_answer_record.answer,user_answer_record.cost_time,user_answer_record.question_bank,user_answer_record.answer_review) VALUES( ? , ? , ?, ?,?)",
        [userid,JSON.stringify(answer),cost_time,question_bank,JSON.stringify(answer_review)]
    );

    console.dir(question_bank)
    return NextResponse.json({userid:userid,cost_time:cost_time,answer:answer,question_bank:question_bank});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
