import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken"
import { u } from "framer-motion/client";

 
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
      console.log(userid,cost_time,answer,question_bank)
    
  try {
    await db.query("INSERT INTO user_tree_status (userid,complete_test) values(?,1) ON DUPLICATE KEY UPDATE `complete_test`= (`complete_test` + 1)",
      [jwt.decode(userid).uid]
    )
    
    await db.query(
        "INSERT INTO user_answer_record (user_answer_record.userid,user_answer_record.answer,user_answer_record.cost_time,user_answer_record.question_bank,user_answer_record.answer_review) VALUES( ? , ? , ?, ?,?)",
        [jwt.decode(userid).uid,JSON.stringify(answer),cost_time,question_bank,JSON.stringify(answer_review)]
    );


    return NextResponse.json({userid:userid,cost_time:cost_time,answer:answer,question_bank:question_bank});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
