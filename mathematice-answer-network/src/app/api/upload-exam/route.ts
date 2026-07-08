import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { cleanText } from "@/lib/validation";

const fileTypes = {
  "application/pdf": {
    extension: "pdf",
    signature: (buffer: Buffer) => buffer.subarray(0, 4).toString() === "%PDF",
  },
  "image/jpeg": {
    extension: "jpg",
    signature: (buffer: Buffer) =>
      buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
  },
  "image/png": {
    extension: "png",
    signature: (buffer: Buffer) =>
      buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  },
  "application/msword": {
    extension: "doc",
    signature: (buffer: Buffer) =>
      buffer.subarray(0, 8).equals(Buffer.from([208, 207, 17, 224, 161, 177, 26, 225])),
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    extension: "docx",
    signature: (buffer: Buffer) =>
      buffer[0] === 0x50 && buffer[1] === 0x4b,
  },
} as const;

function safeSegment(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}-]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 50);
}

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "未登入" }, { status: 401 });

  try {
    const formData = await req.formData();
    const yearText = cleanText(formData.get("examYear"), { max: 20 });
    const typeText = cleanText(formData.get("examType"), { max: 50 });
    const file = formData.get("file");
    if (!yearText || !typeText || !(file instanceof File)) {
      return NextResponse.json({ error: "請完整填寫考試資料與檔案" }, { status: 400 });
    }
    if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "檔案大小必須介於 1 byte 到 10 MB" }, { status: 400 });
    }

    const fileType = fileTypes[file.type as keyof typeof fileTypes];
    if (!fileType) {
      return NextResponse.json({ error: "僅接受 PDF、Word、JPG 與 PNG" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!fileType.signature(buffer)) {
      return NextResponse.json({ error: "檔案內容與宣告格式不符" }, { status: 400 });
    }

    const examYear = safeSegment(yearText);
    const examType = safeSegment(typeText);
    if (!examYear || !examType) {
      return NextResponse.json({ error: "考試資料格式無效" }, { status: 400 });
    }
    const fileName = `${examYear}_${examType}_${randomUUID()}.${fileType.extension}`;
    const uploadsDir = join(process.cwd(), "storage", "uploads");
    const filePath = join(uploadsDir, fileName);
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(filePath, buffer, { flag: "wx" });

    try {
      await db.query(
        `INSERT INTO exam_files (user_id, exam_year, exam_type, filename, mime_type, file_size)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [session.uid, yearText, typeText, fileName, file.type, file.size],
      );
    } catch (error) {
      await unlink(filePath).catch(() => undefined);
      throw error;
    }

    return NextResponse.json({ message: "上傳成功", fileName }, { status: 201 });
  } catch (error) {
    console.error("[Upload Exam Error]", error);
    return NextResponse.json({ error: "檔案上傳失敗" }, { status: 503 });
  }
}
