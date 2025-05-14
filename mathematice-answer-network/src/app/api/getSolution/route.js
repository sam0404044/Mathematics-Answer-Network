import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken"



export async function POST(
  req,

) {




  const { userid, questionId } = await req.json()
  let status = { cost: false, solution: [] }
  try {





    const [records] = await db.query(
      `SELECT * from user_info WHERE id = ?`,
      [jwt.decode(userid).uid]
    );
    if (records[0].plan_status == 2) {
      [status.solution] = await db.query(
        `SELECT * FROM questionForTest WHERE questionForTest.uid = ?`,
        [questionId]
      );
      status.cost = false
    } else {
      if (records[0].points <= 0) {
        status.solution = []
        status.cost = false
      } else {
        [status.solution] = await db.query(
          `SELECT * FROM questionForTest WHERE questionForTest.uid = ?`,
          [questionId]
        );
        await db.query(
          "UPDATE user_info SET points = (points - 1) WHERE user_info.id = ?",
          [jwt.decode(userid).uid]
        )
        status.cost = true
      }
    }

    return NextResponse.json({ status: status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
