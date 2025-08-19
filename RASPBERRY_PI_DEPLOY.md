# 🍓 Wiw Dashboard v1.1 - 라즈베리파이 배포 가이드

## 📦 필요한 소프트웨어
```bash
# Node.js 설치 (v18 이상)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 설치 (프로세스 관리)
sudo npm install -g pm2
```

## 🚀 배포 과정

### 1. 저장소 클론
```bash
cd /home/yangsm
git clone https://github.com/ark-poiop/WiW.git
cd WiW
```

### 2. 프론트엔드 빌드
```bash
npm install
npm run build
```

### 3. 서버 설정
```bash
cd server
npm install

# 환경 변수 설정
cp .env.example .env  # 또는 직접 생성
nano .env
```

### 4. .env 파일 설정
```bash
PORT=5178
DB_PATH=/home/yangsm/feedback/feedback.db
ADMIN_TOKEN=your_secure_random_token_here_min_32_chars
ALLOW_ORIGIN=http://localhost:5173
```

### 5. 데이터베이스 디렉터리 생성
```bash
mkdir -p /home/yangsm/feedback
chmod 755 /home/yangsm/feedback
```

### 6. 서버 빌드 & 시작
```bash
cd server
npm run build
pm2 start dist/index.js --name "wiw-feedback"
pm2 save
pm2 startup
```

### 7. 웹서버 설정 (nginx)
```bash
sudo apt install nginx

# nginx 설정
sudo nano /etc/nginx/sites-available/wiw-dashboard
```

nginx 설정 파일:
```nginx
server {
    listen 80;
    server_name your_raspberry_pi_ip;

    # 프론트엔드 (정적 파일)
    location / {
        root /home/yangsm/WiW/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 프록시
    location /api/ {
        proxy_pass http://localhost:5178;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# nginx 설정 활성화
sudo ln -s /etc/nginx/sites-available/wiw-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 관리 명령어

### 서버 상태 확인
```bash
pm2 status
pm2 logs wiw-feedback
```

### 서버 재시작
```bash
pm2 restart wiw-feedback
```

### 업데이트 배포
```bash
cd /home/yangsm/WiW
git pull origin main
npm run build

cd server
npm run build
pm2 restart wiw-feedback
```

### 의견 데이터 확인
```bash
# 관리자 API 호출
curl "http://localhost:5178/api/feedback?limit=20" \
  -H "Authorization: Bearer your_secure_random_token_here"

# 직접 DB 확인
sqlite3 /home/yangsm/feedback/feedback.db
.tables
SELECT * FROM feedback ORDER BY id DESC LIMIT 10;
.quit
```

## 📊 모니터링

### 로그 실시간 확인
```bash
pm2 logs wiw-feedback --lines 50
```

### 시스템 리소스 확인
```bash
pm2 monit
```

### nginx 로그
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔒 보안 권장사항

1. **ADMIN_TOKEN을 강력한 값으로 설정**
2. **방화벽 설정 (포트 80, 22만 열기)**
3. **정기적인 시스템 업데이트**
4. **데이터베이스 백업 스케줄링**

## 🎯 접속 확인

- **웹사이트**: `http://your_raspberry_pi_ip`
- **헬스체크**: `http://your_raspberry_pi_ip/api/health`
- **관리자 API**: 토큰 필요

## ✨ v1.1 주요 기능

- ⭐ 별점 5점 만점 시스템
- 📝 선택적 의견 입력
- 🎨 완전히 새로운 UI/UX
- 🌙 다크모드 지원
- 💾 SQLite 자동 데이터 저장
- 📊 실시간 의견 수집
