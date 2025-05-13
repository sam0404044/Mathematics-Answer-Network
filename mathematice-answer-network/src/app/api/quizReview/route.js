import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken"

 
export async function POST(
  req,

) {
  
  

    
     const {userid,cost_time,answer} = await req.json()
     let wrong_question = await answer.answer_info.filter( x => x.answer?.sort().toString() !== x.right_answer?.sort().toString())
     
     let answer_review = {
      has_review:true,
      solve_status:  wrong_question.length ? false : true,
      answer_info:answer.answer_info,
      cost_time:cost_time
     }
     
    
  try {
    console.log(answer_review)
    await db.query(
        "UPDATE user_answer_record SET user_answer_record.answer_review = ? WHERE user_answer_record.userid = ? ORDER BY user_answer_record.time DESC LIMIT 1",
        [JSON.stringify(answer_review) ,jwt.decode(userid).uid]
    );


    return NextResponse.json({userid:userid,cost_time:cost_time,answer:answer});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
