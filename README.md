# ShopScout

ShopScout is a full-stack ecommerce project with:
- React frontend (`client`)
- Node.js + Express backend (`server`)
- MySQL database (local or Docker)

## Project Structure

- `client` - React app
- `server` - Express API and business logic
- `docker-compose.yml` - Docker services for API + MySQL

## Local Development

### 1) Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 2) Configure environment

Backend env file:
- `server/.env`

Frontend env file:
- `client/.env`

Example frontend value:

```env
REACT_APP_API_URL=http://localhost:5050
```

### 3) Run backend

```bash
cd server
npm run dev
```

### 4) Run frontend

```bash
cd client
npm start
```

## Docker Development

### Start services

```bash
docker compose up -d --build
```

### Check status

```bash
docker compose ps
docker compose logs -f api
```

### Stop services

```bash
docker compose down
```

## AWS Deployment Notes

- Backend runs on EC2 using Docker Compose.
- Domain is configured with Route 53.
- HTTPS is managed with Nginx + Certbot.
- Frontend (Amplify) should point to:

```env
REACT_APP_API_URL=https://api.shopscout.org
```

## One-Command Deploy (EC2)

Use this to update backend code and redeploy containers in one command.

### 1) One-time setup on EC2

```bash
cd ~/ShopScout
chmod +x scripts/deploy.sh
```

Make sure this file exists before running deploy:

```bash
server/.env.docker
```

If missing:

```bash
cp server/.env.docker.example server/.env.docker
nano server/.env.docker
```

### 2) Deploy

```bash
cd ~/ShopScout
./scripts/deploy.sh
```

The script will:
- pull latest `main`
- rebuild and restart Docker services
- run a quick API health check on `http://127.0.0.1:5050`

If health check fails, inspect logs:

```bash
docker compose logs --tail=200 api
```

## Security Notes

- Do not commit real `.env` secrets.
- Keep SSH (`22`) restricted to your IP in EC2 security groups.
- Remove temporary public testing ports when done.

