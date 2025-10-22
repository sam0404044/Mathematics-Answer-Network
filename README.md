```markdown
# 數學答題王 | Mathematics Answer Network

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)
![Linode](https://img.shields.io/badge/Linode-VPS-00A95C?style=flat&logo=linode&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat&logo=mysql&logoColor=white)

**🔗 線上平台：** [https://mathwillbebetter.com/](https://mathwillbebetter.com/)

## 📌 專案簡介

**數學答題王**是一個專為高中生設計的互動式數學學習平台，結合題庫系統、遊戲化機制與社群互動，讓數學學習變得更有趣且有效率。

本專案由 **6 人團隊**協力開發，採用前後端分離架構，使用 React 打造流暢的使用者介面，後端採用 Node.js + Express + MySQL，部署在 Linode VPS 上。透過 199+ 次提交的迭代開發，打造出一個功能完整、效能優異的學習平台。

### 解決的痛點

- 📚 **題庫分散** → 整合高中數學各單元題庫
- 😴 **學習枯燥** → 加入遊戲化機制提升動機
- 🎯 **缺乏方向** → 智能推薦適合題目
- 📊 **進度不明** → 視覺化學習成效追蹤
- 👥 **孤軍奮戰** → 社群互動與討論區

## 👥 團隊協作

### 團隊組成（6 人）

- **企劃組長（本人）** - 專案規劃、需求分析、團隊協調、前後端開發
- **前端工程師 x2** - React 組件開發、UI/UX 實作
- **後端工程師 x2** - API 開發、資料庫設計
- **題庫管理員 x1** - 題目整理、分類、審核

### 協作工具

- **GitHub** - 版本控制與程式碼審查
- **Trello** - 專案管理與任務追蹤
- **Slack** - 團隊即時溝通
- **Figma** - UI/UX 設計協作
- **Google Docs** - 需求文件與會議記錄

### 開發流程

```
需求分析 → 任務分配 → 分支開發 → Code Review → 測試 → 合併 → 部署
```

## 🚀 技術棧

### 前端技術

- **React 18** - UI 框架，使用 Hooks 與 Functional Components
- **React Router** - SPA 路由管理
- **Axios** - HTTP 請求處理
- **Context API** - 全局狀態管理（使用者資訊、答題進度）
- **CSS3 + CSS Modules** - 樣式隔離與模組化
- **Chart.js** - 學習數據視覺化
- **MathJax** - 數學公式渲染

### 後端技術

- **Node.js** - JavaScript 執行環境
- **Express.js** - Web 應用框架
- **MySQL** - 關聯式資料庫
- **JWT** - 使用者認證與授權
- **bcrypt** - 密碼加密
- **express-validator** - 輸入驗證
- **multer** - 檔案上傳處理

### 開發工具

- **Git + GitHub** - 版本控制
- **ESLint** - 程式碼規範檢查
- **Prettier** - 程式碼格式化
- **Postman** - API 測試
- **MySQL Workbench** - 資料庫管理

### 部署與維運

- **Linode VPS** - 雲端虛擬主機
- **PM2** - Node.js 進程管理
- **Nginx** - 反向代理與靜態檔案服務
- **SSL/TLS** - HTTPS 加密連線
- **cron** - 定時備份與維護

## ✨ 核心功能

### 1. 使用者系統

```javascript
// JWT 認證實作
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '未授權訪問' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token 無效' });
    req.user = user;
    next();
  });
};

// 註冊流程
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // 密碼加密
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // 儲存使用者
  await db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );
  
  res.json({ success: true, message: '註冊成功' });
});
```

### 2. 題庫系統

**資料庫結構：**

```sql
-- 題目表
CREATE TABLE questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chapter_id INT NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard'),
  content TEXT NOT NULL,
  options JSON,
  answer VARCHAR(10),
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

-- 章節表
CREATE TABLE chapters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  grade INT,
  category VARCHAR(50)
);

-- 答題記錄
CREATE TABLE answer_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  question_id INT,
  is_correct BOOLEAN,
  time_spent INT,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);
```

### 3. 遊戲化機制

```javascript
// 經驗值計算
const calculateExp = (difficulty, timeSpent, isCorrect) => {
  if (!isCorrect) return 0;
  
  const baseExp = {
    'easy': 10,
    'medium': 20,
    'hard': 35
  };
  
  // 時間加成（越快完成獲得越多經驗）
  const timeBonus = Math.max(0, 60 - timeSpent) / 10;
  
  return Math.floor(baseExp[difficulty] + timeBonus);
};

// 等級系統
const calculateLevel = (totalExp) => {
  return Math.floor(Math.sqrt(totalExp / 100)) + 1;
};

// 成就解鎖
const checkAchievements = async (userId) => {
  const stats = await getUserStats(userId);
  const achievements = [];
  
  if (stats.questionsAnswered >= 100) {
    achievements.push('百題達人');
  }
  
  if (stats.correctRate >= 0.9) {
    achievements.push('精準射手');
  }
  
  if (stats.consecutiveDays >= 7) {
    achievements.push('堅持七天');
  }
  
  return achievements;
};
```

### 4. 智能推薦系統

```javascript
// 根據答題歷史推薦題目
const recommendQuestions = async (userId) => {
  // 1. 取得使用者弱項章節
  const weakChapters = await db.query(`
    SELECT chapter_id, 
           AVG(is_correct) as accuracy
    FROM answer_logs al
    JOIN questions q ON al.question_id = q.id
    WHERE al.user_id = ?
    GROUP BY chapter_id
    HAVING accuracy < 0.7
    ORDER BY accuracy ASC
    LIMIT 3
  `, [userId]);
  
  // 2. 從弱項章節中挑選適當難度題目
  const recommendations = [];
  for (const chapter of weakChapters) {
    const questions = await db.query(`
      SELECT * FROM questions
      WHERE chapter_id = ?
      AND difficulty = 'medium'
      AND id NOT IN (
        SELECT question_id FROM answer_logs WHERE user_id = ?
      )
      ORDER BY RAND()
      LIMIT 5
    `, [chapter.chapter_id, userId]);
    
    recommendations.push(...questions);
  }
  
  return recommendations;
};
```

### 5. 數據視覺化

```javascript
// React 組件 - 學習進度圖表
import { Line } from 'react-chartjs-2';

const LearningProgress = ({ userId }) => {
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    fetch(`/api/stats/progress/${userId}`)
      .then(res => res.json())
      .then(data => {
        setChartData({
          labels: data.dates,
          datasets: [{
            label: '正確率',
            data: data.accuracy,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }, {
            label: '答題數',
            data: data.count,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          }]
        });
      });
  }, [userId]);
  
  return chartData ? <Line data={chartData} /> : <Loading />;
};
```

### 6. MathJax 數學公式渲染

```javascript
// 動態載入數學公式
import { useEffect } from 'react';

const MathContent = ({ latex }) => {
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [latex]);
  
  return (
    <div className="math-content">
      {`$$${latex}$$`}
    </div>
  );
};

// 範例使用
<MathContent latex="\frac{-b \pm \sqrt{b^2-4ac}}{2a}" />
```

## 📂 專案結構

```
Mathematics-Answer-Network/
│
├── mathematice-answer-network/
│   │
│   ├── client/                    # 前端 React 應用
│   │   ├── src/
│   │   │   ├── components/        # React 組件
│   │   │   │   ├── Auth/          # 登入註冊組件
│   │   │   │   ├── Question/      # 題目顯示組件
│   │   │   │   ├── Dashboard/     # 儀表板
│   │   │   │   └── Common/        # 共用組件
│   │   │   │
│   │   │   ├── pages/             # 頁面組件
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Practice.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── Leaderboard.jsx
│   │   │   │
│   │   │   ├── contexts/          # React Context
│   │   │   │   ├── AuthContext.js
│   │   │   │   └── QuestionContext.js
│   │   │   │
│   │   │   ├── services/          # API 服務
│   │   │   │   ├── api.js
│   │   │   │   └── auth.js
│   │   │   │
│   │   │   ├── utils/             # 工具函數
│   │   │   │   ├── mathHelper.js
│   │   │   │   └── validator.js
│   │   │   │
│   │   │   ├── App.jsx            # 根組件
│   │   │   └── index.js           # 入口文件
│   │   │
│   │   ├── public/
│   │   └── package.json
│   │
│   ├── server/                    # 後端 Node.js 應用
│   │   ├── routes/                # API 路由
│   │   │   ├── auth.js            # 認證路由
│   │   │   ├── questions.js       # 題目路由
│   │   │   ├── users.js           # 使用者路由
│   │   │   └── stats.js           # 統計路由
│   │   │
│   │   ├── controllers/           # 控制器
│   │   │   ├── authController.js
│   │   │   ├── questionController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── models/                # 資料模型
│   │   │   ├── User.js
│   │   │   ├── Question.js
│   │   │   └── AnswerLog.js
│   │   │
│   │   ├── middleware/            # 中間件
│   │   │   ├── auth.js            # JWT 驗證
│   │   │   ├── validator.js       # 輸入驗證
│   │   │   └── errorHandler.js    # 錯誤處理
│   │   │
│   │   ├── config/                # 配置文件
│   │   │   ├── database.js        # 資料庫連線
│   │   │   └── jwt.js             # JWT 配置
│   │   │
│   │   ├── utils/                 # 工具函數
│   │   │   ├── encryption.js
│   │   │   └── logger.js
│   │   │
│   │   ├── app.js                 # Express 應用
│   │   ├── server.js              # 伺服器入口
│   │   └── package.json
│   │
│   └── database/                  # 資料庫相關
│       ├── schema.sql             # 資料表結構
│       ├── seed.sql               # 初始資料
│       └── migrations/            # 資料庫遷移
│
├── package.json
├── package-lock.json
└── README.md
```

## 🎯 技術亮點

### 1. 前後端分離架構

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP/HTTPS
       ▼
┌─────────────────┐
│  Nginx (Port 80)│ ← 反向代理
└──────┬──────────┘
       │
       ├─→ /api/* ──→ ┌────────────────┐
       │              │  Express Server │
       │              │  (Port 3000)    │
       │              └────────┬───────┘
       │                       │
       │                       ▼
       │              ┌─────────────────┐
       │              │  MySQL Database │
       │              └─────────────────┘
       │
       └─→ /* ────→ ┌──────────────────┐
                    │  React Static    │
                    │  (build/)        │
                    └──────────────────┘
```

### 2. RESTful API 設計

```javascript
// API 端點設計
GET    /api/questions              // 取得題目列表
GET    /api/questions/:id          // 取得單一題目
POST   /api/questions              // 新增題目（管理員）
PUT    /api/questions/:id          // 更新題目
DELETE /api/questions/:id          // 刪除題目

POST   /api/auth/register          // 註冊
POST   /api/auth/login             // 登入
POST   /api/auth/logout            // 登出
GET    /api/auth/me                // 取得當前使用者

POST   /api/answers                // 提交答案
GET    /api/answers/history        // 答題歷史
GET    /api/stats/user/:id         // 使用者統計
GET    /api/stats/leaderboard      // 排行榜

// 統一響應格式
{
  "success": true,
  "data": { ... },
  "message": "操作成功",
  "timestamp": "2025-10-22T10:30:00Z"
}
```

### 3. React 組件化開發

```javascript
// 可複用的題目卡片組件
const QuestionCard = ({ question, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = () => {
    setIsSubmitted(true);
    onAnswer({
      questionId: question.id,
      answer: selectedOption,
      isCorrect: selectedOption === question.answer
    });
  };
  
  return (
    <div className="question-card">
      <div className="difficulty-badge">{question.difficulty}</div>
      <div className="question-content">
        <MathContent latex={question.content} />
      </div>
      
      <div className="options">
        {question.options.map((option, index) => (
          <OptionButton
            key={index}
            option={option}
            isSelected={selectedOption === option}
            isCorrect={isSubmitted && option === question.answer}
            isWrong={isSubmitted && selectedOption === option && option !== question.answer}
            onClick={() => !isSubmitted && setSelectedOption(option)}
          />
        ))}
      </div>
      
      {!isSubmitted && (
        <button onClick={handleSubmit} disabled={!selectedOption}>
          提交答案
        </button>
      )}
      
      {isSubmitted && question.explanation && (
        <div className="explanation">
          <h4>詳解：</h4>
          <MathContent latex={question.explanation} />
        </div>
      )}
    </div>
  );
};
```

### 4. 效能優化

```javascript
// React.memo 避免不必要的重新渲染
const QuestionList = React.memo(({ questions }) => {
  return questions.map(q => <QuestionCard key={q.id} question={q} />);
});

// useMemo 快取計算結果
const Statistics = ({ answerLogs }) => {
  const stats = useMemo(() => {
    return {
      total: answerLogs.length,
      correct: answerLogs.filter(log => log.isCorrect).length,
      accuracy: answerLogs.filter(log => log.isCorrect).length / answerLogs.length
    };
  }, [answerLogs]);
  
  return <StatsDisplay stats={stats} />;
};

// 懶加載路由
const Practice = lazy(() => import('./pages/Practice'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/practice" element={<Practice />} />
    <Route path="/leaderboard" element={<Leaderboard />} />
  </Routes>
</Suspense>
```

### 5. 資料庫優化

```sql
-- 索引優化
CREATE INDEX idx_user_id ON answer_logs(user_id);
CREATE INDEX idx_question_id ON answer_logs(question_id);
CREATE INDEX idx_chapter_difficulty ON questions(chapter_id, difficulty);
CREATE INDEX idx_answered_at ON answer_logs(answered_at);

-- 複合索引（常一起查詢的欄位）
CREATE INDEX idx_user_question ON answer_logs(user_id, question_id);

-- 查詢優化範例
-- 使用 EXPLAIN 分析查詢效能
EXPLAIN SELECT * FROM answer_logs 
WHERE user_id = 1 
AND answered_at > DATE_SUB(NOW(), INTERVAL 7 DAY);
```

## 🛠️ 開發環境設定

### 本地開發

```bash
# 1. Clone 專案
git clone https://github.com/sam0404044/Mathematics-Answer-Network.git
cd Mathematics-Answer-Network/mathematice-answer-network

# 2. 安裝後端依賴
cd server
npm install

# 3. 設定環境變數
cp .env.example .env
# 編輯 .env 填入資料庫連線資訊、JWT Secret 等

# 4. 建立資料庫
mysql -u root -p < ../database/schema.sql
mysql -u root -p < ../database/seed.sql

# 5. 啟動後端伺服器
npm run dev  # 使用 nodemon 自動重啟

# 6. 安裝前端依賴（另開終端機）
cd ../client
npm install

# 7. 啟動前端開發伺服器
npm start    # 預設 http://localhost:3001
```

### 環境變數設定

```bash
# .env (後端)
PORT=3000
NODE_ENV=development

# 資料庫
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=math_answer_network

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3001
```

## 🚀 部署流程

### Linode VPS 部署

```bash
# 1. 連線到 Linode 伺服器
ssh user@your_linode_ip

# 2. 安裝環境
sudo apt update
sudo apt install nodejs npm nginx mysql-server

# 3. Clone 專案
git clone https://github.com/sam0404044/Mathematics-Answer-Network.git
cd Mathematics-Answer-Network/mathematice-answer-network

# 4. 安裝依賴
cd server && npm install --production
cd ../client && npm install

# 5. 建置前端
npm run build

# 6. 設定 Nginx
sudo nano /etc/nginx/sites-available/mathwillbebetter.com
```

### Nginx 配置

```nginx
server {
    listen 80;
    server_name mathwillbebetter.com www.mathwillbebetter.com;
    
    # 前端靜態檔案
    location / {
        root /var/www/math-answer-network/client/build;
        try_files $uri /index.html;
    }
    
    # API 代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 進程管理

```bash
# 安裝 PM2
npm install -g pm2

# 啟動應用
cd server
pm2 start server.js --name "math-api"

# 設定自動重啟
pm2 startup
pm2 save

# 監控
pm2 status
pm2 logs math-api
pm2 monit
```

## 📊 團隊協作實踐

### Git 工作流程

```bash
# 功能開發流程
git checkout main
git pull origin main
git checkout -b feature/add-ranking-system

# 開發完成後
git add .
git commit -m "feat: add ranking system with weekly leaderboard"
git push origin feature/add-ranking-system

# 在 GitHub 建立 Pull Request
# Code Review 通過後合併到 main
```

### Commit Message 規範

```
feat: 新功能
fix: 錯誤修復
docs: 文件更新
style: 格式調整（不影響代碼運行）
refactor: 重構
test: 測試相關
chore: 建置流程或輔助工具變動

範例：
feat: add user profile statistics dashboard
fix: resolve calculation error in accuracy rate
docs: update API documentation for question endpoints
```

### Code Review 檢查清單

- [ ] 程式碼符合專案風格規範
- [ ] 函數命名清晰且有意義
- [ ] 適當的註解說明
- [ ] 沒有 console.log 等調試代碼
- [ ] 錯誤處理完善
- [ ] 效能考量（避免不必要的渲染）
- [ ] 安全性檢查（SQL Injection、XSS 等）

## 📈 專案管理

### Trello 看板結構

```
待辦事項 (To Do)
├─ [前端] 實作使用者個人頁面
├─ [後端] 優化題目推薦演算法
└─ [題庫] 補充三角函數單元題目

進行中 (In Progress)
├─ [前端] 答題計時器功能 (冠宏)
└─ [後端] 排行榜 API (小明)

測試中 (Testing)
├─ [前端] 數據視覺化圖表
└─ [後端] JWT 認證機制

完成 (Done)
├─ [前端] 登入註冊頁面 ✓
├─ [後端] 題目 CRUD API ✓
└─ [部署] Linode 伺服器設定 ✓
```

### 每週例會

- **時間：** 每週三晚上 8:00
- **議程：**
  1. 上週進度回顧
  2. 遇到的問題討論
  3. 本週任務分配
  4. 技術分享（輪流）

## 🎓 學習成效

### 技術能力提升

| 技術領域 | 學習重點 | 實際應用 |
|---------|---------|---------|
| **React** | Hooks、Context API、效能優化 | 前端核心架構 |
| **Node.js** | Express 路由、中間件、異步處理 | 後端 API 開發 |
| **MySQL** | 資料表設計、索引優化、複雜查詢 | 資料庫架構 |
| **JWT** | Token 生成、驗證、刷新機制 | 使用者認證 |
| **Linux** | SSH、Nginx、PM2、cron | 伺服器維運 |
| **Git** | 分支管理、衝突解決、PR 流程 | 團隊協作 |

### 軟實力提升

- ✅ **專案管理** - 需求分析、任務分配、進度追蹤
- ✅ **團隊領導** - 協調溝通、衝突解決、激勵團隊
- ✅ **文檔撰寫** - API 文件、開發規範、會議記錄
- ✅ **Code Review** - 代碼審查、知識分享
- ✅ **問題解決** - 技術難題突破、bug 排查

## 🔧 開發筆記

### 遇到的挑戰與解決方案

#### 1. MathJax 渲染效能問題

**問題：** 大量數學公式導致頁面卡頓

**解決方案：**
```javascript
// 使用 IntersectionObserver 實現懶加載
const LazyMathContent = ({ latex }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={ref}>
      {isVisible && <MathContent latex={latex} />}
    </div>
  );
};
```

#### 2. 資料庫連線池耗盡

**問題：** 高並發時出現 "Too many connections" 錯誤

**解決方案：**
```javascript
// 使用連線池並設定適當參數
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,      // 連線池大小
  queueLimit: 0,            // 等待隊列無限制
  waitForConnections: true, // 等待可用連線
  acquireTimeout: 30000     // 取得連線超時時間
});
```

#### 3. 前後端開發環境 CORS 問題

**問題：** 跨域請求被阻擋

**解決方案：**
```javascript
// 後端設定 CORS
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));
```

## 📊 數據統計

### 專案指標

- 👥 **團隊成員：** 6 人
- 💻 **程式碼提交：** 199+ commits
- 📝 **程式碼量：** JavaScript 58.4% | CSS 25.0% | TypeScript 16.6%
- 📚 **題庫數量：** 1000+ 題（涵蓋高中數學各單元）
- 👨‍🎓 **註冊使用者：** 500+ 人
- ⭐ **GitHub Stars：** 1

### 開發時程

```
專案啟動        資料庫設計        前端開發        後端API         測試與部署        上線營運
    │               │               │               │               │               │
    ▼               ▼               ▼               ▼               ▼               ▼
  Week 1          Week 2-3        Week 4-8        Week 6-10       Week 11-12      Week 13+
  需求分析        Schema設計       React組件      Express路由      整合測試        維護更新
  團隊組建        題庫整理         UI/UX實作      JWT認證         Bug修復         新功能
```

## 🔮 未來規劃

### 短期目標（1-3 個月）

- [ ] 加入即時對戰模式
- [ ] 實作錯題本功能
- [ ] 優化手機版介面
- [ ] 加入影片解題教學
- [ ] 社群討論區

### 長期目標（6-12 個月）

- [ ] AI 智能出題系統
- [ ] 個人化學習路徑
- [ ] 多科目擴展（物理、化學）
- [ ] 線上直播課程
- [ ] 手機 App 開發（React Native）

## 📧 聯絡方式

- 👤 **企劃組長：** 陳冠宏
- 🔗 GitHub: [@sam0404044](https://github.com/sam0404044)
- 📝 專案連結: [Mathematics-Answer-Network](https://github.com/sam0404044/Mathematics-Answer-Network)
- 🌐 線上平台: [https://mathwillbebetter.com/](https://mathwillbebetter.com/)

---

⭐ **專案亮點總結**

本專案展示了以下能力：

### 技術能力
- ✅ **全端開發** - React + Node.js + MySQL 完整技術棧
- ✅ **系統架構** - 前後端分離、RESTful API 設計
- ✅ **資料庫設計** - 正規化、索引優化、複雜查詢
- ✅ **使用者認證** - JWT、bcrypt 加密
- ✅ **伺服器維運** - Linode VPS、Nginx、PM2
- ✅ **效能優化** - React.memo、useMemo、懶加載

### 專案管理能力
- ✅ **團隊領導** - 擔任企劃組長，協調 6 人團隊
- ✅ **需求分析** - 從零開始規劃整個系統架構
- ✅ **任務管理** - Trello 看板、每週例會、進度追蹤
- ✅ **版本控制** - Git 工作流程、Code Review
- ✅ **文檔管理** - API 文件、開發規範、會議記錄

### 產品思維
- ✅ **使用者導向** - 遊戲化機制提升學習動機
- ✅ **數據驅動** - 學習數據分析與視覺化
- ✅ **持續優化** - 根據使用者反饋迭代改進

**這是一個從規劃、開發到上線的完整專案經驗，展現了全方位的技術與管理能力！**
```
