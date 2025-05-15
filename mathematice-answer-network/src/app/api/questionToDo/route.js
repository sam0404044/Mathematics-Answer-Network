import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken"



export async function POST(
  req,

) {




  const { userid, mode } = await req.json()



  try {


    let quiz_status
    switch (mode) {
      // case 1:
      //   quiz_status = "last_quiz"
      //   break;

      case 2:
        quiz_status = "score_now"
        break;

      case 3:
        quiz_status = "wrong_question_set"
        break;

      default:
        quiz_status = "score_now"
        break;
    }
    

    
    const [records] = await db.query(
      `SELECT ${quiz_status} from user_score_status WHERE userid = ?`,
      [jwt.decode(userid).uid]
    );


    return NextResponse.json({ question_record: records });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
