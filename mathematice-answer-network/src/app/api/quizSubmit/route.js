import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken"



export async function POST(
  req,

) {




  const { userid, cost_time, answer, question_bank, status } = await req.json()
  const wrong_question = await answer.answer_info.filter(x => x.answer?.sort().toString() !== x.right_answer?.sort().toString())
  const right_question = await answer.answer_info.filter(x => x.answer?.sort().toString() == x.right_answer?.sort().toString())
  const wrong_question_uid_array = wrong_question.map(x => x.uid)
  const right_question_uid_array = right_question.map(x => x.uid)
  let answer_info = {
    answer_info: answer,
    cost_time: cost_time
  }
  function add_wrong(records) { 
    return records.filter(x => !wrong_question_uid_array.includes(x.uid)).concat(wrong_question)
  }
  function sub_correct(records) {
    return records.filter(x => !right_question_uid_array.includes(x.uid))

   }
  try {




    switch (status) {
      case 1:
        const [records] = await db.query(
          "SELECT wrong_question_set from user_score_status WHERE user_score_status.userid = ?",
          [jwt.decode(userid).uid]
        );
        let new_record = records[0].wrong_question_set
        try{
          new_record = await add_wrong(sub_correct(new_record))
        }catch(err){
          new_record = wrong_question
        }
        await db.query("INSERT INTO user_score_status (userid,last_quiz,last_review,wrong_question_set,status) values(?,?,?,?,?) ON DUPLICATE KEY UPDATE last_quiz = ? , last_review = ?, wrong_question_set = ?,status = ?",
          [jwt.decode(userid).uid, JSON.stringify(answer_info), JSON.stringify(answer_info), JSON.stringify(answer.answer_info), status, JSON.stringify(answer_info), JSON.stringify(answer_info),JSON.stringify(new_record), status]
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
          [jwt.decode(userid).uid, JSON.stringify(answer_info), status, JSON.stringify(answer_info.answer_info), status]
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
