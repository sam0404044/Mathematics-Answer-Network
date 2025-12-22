import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const examYear = formData.get('examYear') as string;
    const examType = formData.get('examType') as string;
    const file = formData.get('file') as File;

    if (!examYear || !examType || !file) {
      return NextResponse.json(
        { error: '請填寫所有欄位並選擇檔案' },
        { status: 400 }
      );
    }

    // 驗證檔案類型
    const allowedTypes = ['application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 'image/png'];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支援的檔案格式，請上傳 PDF、Word 或圖片檔案' },
        { status: 400 }
      );
    }

    // 驗證檔案大小 (最大 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '檔案大小不能超過 10MB' },
        { status: 400 }
      );
    }

    // 將檔案轉換為 Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成檔案名稱
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${examYear}_${examType}_${timestamp}.${fileExtension}`;

    // 儲存檔案到 public/uploads 目錄
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    // 如果目錄不存在，創建它
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    const filePath = join(uploadsDir, fileName);

    // 注意：在生產環境中，應該將檔案儲存到資料庫或雲端儲存
    // 這裡只是示範如何處理檔案上傳
    await writeFile(filePath, buffer);

    // TODO: 將檔案資訊儲存到資料庫
    // await db.query('INSERT INTO exam_files (year, type, filename, uploaded_at) VALUES (?, ?, ?, NOW())', 
    //   [examYear, examType, fileName]);

    return NextResponse.json({
      message: '考卷上傳成功',
      fileName: fileName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '上傳失敗，請稍後再試' },
      { status: 500 }
    );
  }
}

