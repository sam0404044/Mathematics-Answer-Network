# Ubuntu 虛擬機部署

以下流程適用於 Ubuntu 24.04、Node.js 24、MySQL 8、Nginx 與 PM2。

## 1. DNS

在網域管理介面建立：

- `A` 記錄：`@` 指向虛擬機公網 IP。
- `A` 記錄：`www` 指向虛擬機公網 IP。

等待 DNS 生效後再申請 HTTPS。

## 2. 安裝系統套件

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y nginx mysql-server git curl ufw
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 3. 建立應用帳號與防火牆

```bash
sudo adduser mathapp
sudo usermod -aG sudo mathapp
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw enable
```

不要對外開放 MySQL 的 3306；應用和 MySQL 在同一台機器時只需使用
`127.0.0.1`。

## 4. 建立資料庫

```bash
sudo mysql
```

在 MySQL 執行：

```sql
CREATE USER 'math_app'@'127.0.0.1' IDENTIFIED BY '請換成長隨機密碼';
CREATE DATABASE math_answer_network CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES
  ON math_answer_network.* TO 'math_app'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

## 5. 上傳程式

建議先將程式推送至私人 GitHub repository，再在虛擬機執行：

```bash
sudo mkdir -p /var/www/math-answer-network
sudo chown mathapp:mathapp /var/www/math-answer-network
su - mathapp
git clone <repository-url> /var/www/math-answer-network
cd /var/www/math-answer-network/mathematice-answer-network
npm ci
```

## 6. 設定環境變數

```bash
cp .env.example .env.local
nano .env.local
```

至少設定 `BASE_URL`、資料庫帳密與長度至少 32 字元的 `JWT_SECRET`。
可用以下指令產生 JWT 密鑰：

```bash
openssl rand -base64 48
```

正式環境的 Google callback 必須是：

```text
https://你的網域/api/auth/google/callback
```

## 7. 建立資料表與匯入題目

```bash
mysql -h 127.0.0.1 -u math_app -p math_answer_network < database/schema.sql
npm run db:seed
```

## 8. 建置與啟動

```bash
npm run check
npm run build
pm2 start npm --name math-answer-network -- start
pm2 save
pm2 startup
```

執行 `pm2 startup` 顯示的 `sudo` 指令，讓服務在重新開機後自動啟動。

## 9. Nginx

建立 `/etc/nginx/sites-available/math-answer-network`：

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/math-answer-network /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 10. HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

## 11. 驗證

```bash
curl https://example.com/api/health
pm2 status
pm2 logs math-answer-network --lines 100
```

健康檢查必須回傳 `status: healthy` 與 `database: connected`，再依序測試註冊、
登出、登入、作答、成績頁與個人紀錄。
