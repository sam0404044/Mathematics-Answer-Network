import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken"



export async function POST(
  req,

) {




<<<<<<< HEAD
  const { userid, mode } = await req.json()



  try {


=======
  const {userid,mode} = await req.json()
  
    
    
  try {
    
    
>>>>>>> origin/main
    let quiz_status
    switch (mode) {
      case 1:
        quiz_status = "last_quiz"
        break;

      case 2:
        quiz_status = "last_review"
        break;
<<<<<<< HEAD

      case 3:
        quiz_status = "wrong_question_set"
        break;

=======
    
      case 3:
        quiz_status = "wrong_question_set"
        break;
    
>>>>>>> origin/main
      default:
        quiz_status = "last_quiz"
        break;
    }
    
<<<<<<< HEAD

    
=======
>>>>>>> origin/main
    const [records] = await db.query(
      `SELECT ${quiz_status} from user_score_status WHERE userid = ?`,
      [jwt.decode(userid).uid]
    );
<<<<<<< HEAD


    return NextResponse.json({ question_record: records });
=======
  
    
    return NextResponse.json({ question_record:records });
>>>>>>> origin/main
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
