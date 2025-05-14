import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ year: string }> }) {
    const { year } = await params;

    try {
        const [rows] = await db.query('SELECT * FROM questionForTest WHERE questionYear   = ?', [
            year,
        ]);
        return NextResponse.json({ questions: rows }); // ✅ 回傳格式符合前端期待
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
