import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken"



export async function POST(
  req,

) {




  const { userid} = await req.json()

  try {


  

    
    const [records] = await db.query(
      `SELECT * from user_info WHERE id = ?`,
      [jwt.decode(userid).uid]
    );


    return NextResponse.json({ question_record: records });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
