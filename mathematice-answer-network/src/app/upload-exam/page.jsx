"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import Notice from "../components/Notice";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UploadExam() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    examYear: "",
    examType: "",
    file: null,
  });

  if (!auth) return null;
  const { isLogin } = auth;

  // 如果未登录，重定向到登录页
  if (isLogin === false) {
    router.push("/login");
    return null;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.examYear || !formData.examType || !formData.file) {
      setMessage("請填寫所有欄位並選擇檔案");
      setShowModal(true);
      return;
    }

    setIsUploading(true);
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("examYear", formData.examYear);
      uploadFormData.append("examType", formData.examType);
      uploadFormData.append("file", formData.file);

      const res = await fetch("/api/upload-exam", {
        method: "POST",
        body: uploadFormData,
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("考卷上傳成功！");
        setShowModal(true);
        setFormData({
          examYear: "",
          examType: "",
          file: null,
        });
        // 重置文件输入
        const fileInput = document.getElementById("file-input");
        if (fileInput) fileInput.value = "";
      } else {
        setMessage(result.error || "上傳失敗，請稍後再試");
        setShowModal(true);
      }
    } catch (error) {
      setMessage("上傳失敗，請稍後再試");
      setShowModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <div className={styles.container} style={{ flex: 1 }}>
        <div className={styles.pageWrapper}>
          {/* 關閉按鈕 */}
          <button className={styles.closeBtn}>
            <Link href="/">
              <Image src="/img/close.svg" alt="關閉" width={30} height={30} />
            </Link>
          </button>

          {/* 標題 */}
          <div className={styles.header}>
            <h1>上傳考卷</h1>
            <p>請填寫考卷資訊並上傳檔案</p>
          </div>

          {/* 表單 */}
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="examYear">考卷年份：</label>
                <input
                  type="text"
                  id="examYear"
                  name="examYear"
                  value={formData.examYear}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, examYear: e.target.value }))
                  }
                  placeholder="例如：112、113"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="examType">考卷類型：</label>
                <select
                  id="examType"
                  name="examType"
                  value={formData.examType}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, examType: e.target.value }))
                  }
                  required
                >
                  <option value="">請選擇類型</option>
                  <option value="學測">學測</option>
                  <option value="指考">指考</option>
                  <option value="分科測驗">分科測驗</option>
                  <option value="模擬考">模擬考</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="file-input">選擇檔案：</label>
                <input
                  type="file"
                  id="file-input"
                  name="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                />
                {formData.file && (
                  <p className={styles.fileName}>已選擇：{formData.file.name}</p>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isUploading}
              >
                {isUploading ? "上傳中..." : "上傳考卷"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Notice
        show={showModal}
        onClose={() => setShowModal(false)}
        message={message}
      />
      <Footer />
    </div>
  );
}

