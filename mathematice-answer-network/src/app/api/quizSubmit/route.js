import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken"



export async function POST(
  req,

) {



  
  const { userid, cost_time, answer, question_bank, status } = await req.json()

  let answer_info = {
    answer_info: answer,
    cost_time: cost_time
  }
  
  try {




    switch (status) {
      case 1:
        await db.query("INSERT INTO user_score_status (userid,last_quiz,last_review,wrong_question_set,status) values(?,?,?,?,?) ON DUPLICATE KEY UPDATE last_quiz = ? , last_review = ? ,status = ?",
          [jwt.decode(userid).uid, JSON.stringify(answer_info), JSON.stringify(answer_info),JSON.stringify(answer.answer_info), status, JSON.stringify(answer_info), JSON.stringify(answer_info), status]
        )
        await db.query("INSERT INTO user_tree_status (userid,complete_test) values(?,1) ON DUPLICATE KEY UPDATE `complete_test`= (`complete_test` + 1)",
          [jwt.decode(userid).uid]
        )
        await db.query(
          "INSERT INTO user_answer_record (user_answer_record.userid,user_answer_record.answer,user_answer_record.cost_time,user_answer_record.question_bank) VALUES( ? , ? , ?,?)",
          [jwt.decode(userid).uid, JSON.stringify(answer), cost_time, question_bank]
        );
        break;

      case 2:

        await db.query("INSERT INTO user_score_status (userid,last_review,status) values(?,?,?) ON DUPLICATE KEY UPDATE last_review = ?,status = ?",
          [jwt.decode(userid).uid, JSON.stringify(answer_info), status, JSON.stringify(answer_info), status]
        )
        break;

      case 3:

        await db.query("INSERT INTO user_score_status (userid,wrong_question_set,status) values(?,?,?) ON DUPLICATE KEY UPDATE wrong_question_set = ?,status = ?",
          [jwt.decode(userid).uid, JSON.stringify(answer_info), status, JSON.stringify(answer_info), status]
        )
        break;

      default:
        await db.query("INSERT INTO user_score_status (userid,last_quiz,last_review,status) values(?,?,?,?) ON DUPLICATE KEY UPDATE last_quiz = ? , last_review = ? ,status = ?",
          [jwt.decode(userid).uid, JSON.stringify(answer_info), JSON.stringify(answer_info), status, JSON.stringify(answer_info), JSON.stringify(answer_info), status]
        )
        await db.query("INSERT INTO user_tree_status (userid,complete_test) values(?,1) ON DUPLICATE KEY UPDATE `complete_test`= (`complete_test` + 1)",
          [jwt.decode(userid).uid]
        )
        await db.query(
          "INSERT INTO user_answer_record (user_answer_record.userid,user_answer_record.answer,user_answer_record.cost_time,user_answer_record.question_bank) VALUES( ? , ? , ?,?)",
          [jwt.decode(userid).uid, JSON.stringify(answer), cost_time, question_bank]
        );
        break;
    }


    return NextResponse.json({ userid: userid, cost_time: cost_time, answer: answer, question_bank: question_bank });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
