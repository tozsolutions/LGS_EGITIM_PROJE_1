# Deployment Guide

This guide covers deploying the LGS Eğitim Platformu to various platforms.

## 🚀 Quick Deploy Options

### Vercel (Recommended for Full-Stack)

1. **Fork/Clone the repository**
2. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```
3. **Set Environment Variables:**
   - `JWT_SECRET`: Strong secret key (min 32 chars)
   - `ADMIN_EMAIL`: Admin email address
   - `ADMIN_PASSWORD`: Secure admin password
   - `NODE_ENV`: production

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### Netlify (Frontend Only)

1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```
2. **Deploy to Netlify:**
   - Drag and drop the `client/dist` folder to Netlify
   - Or connect your GitHub repository

### Docker (Self-Hosted)

1. **Build and run:**
   ```bash
   npm run docker:build
   npm run docker:run
   ```

2. **With Docker Compose:**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - JWT_SECRET=your-secret-key
       volumes:
         - ./data:/app/data
   ```

## 🔧 Platform-Specific Instructions

### Vercel Deployment

#### Prerequisites
- Node.js 18+ 
- Vercel account

#### Steps
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add JWT_SECRET
   vercel env add ADMIN_EMAIL
   vercel env add ADMIN_PASSWORD
   ```

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

#### Environment Variables
Set these in your Vercel dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `JWT_SECRET` | JWT signing key | `your-super-secure-32-char-key` |
| `ADMIN_EMAIL` | Admin email | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Admin password | `SecurePassword123!` |
| `CORS_ORIGIN` | Frontend URL | `https://yourdomain.vercel.app` |

### Netlify Deployment

#### For Static Frontend Only
1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy:**
   - Manual: Drag `client/dist` to Netlify
   - Git: Connect repository and set build command to `cd client && npm run build`

#### For Full-Stack with Netlify Functions
1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### Railway Deployment

1. **Connect GitHub repository to Railway**
2. **Set Environment Variables:**
   - All variables from `.env.production.example`
3. **Deploy automatically on push**

### Render Deployment

1. **Create Web Service from GitHub**
2. **Set Build Command:** `npm run build`
3. **Set Start Command:** `npm start`
4. **Set Environment Variables**

### Heroku Deployment

1. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set ADMIN_EMAIL=admin@yourdomain.com
   heroku config:set ADMIN_PASSWORD=your-password
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

### DigitalOcean App Platform

1. **Create App from GitHub**
2. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. **Set Environment Variables**

## 🐳 Docker Deployment

### Single Container
```bash
# Build
docker build -t lgs-egitim-app .

# Run
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret-key \
  -e ADMIN_EMAIL=admin@domain.com \
  -e ADMIN_PASSWORD=password \
  lgs-egitim-app
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      JWT_SECRET: your-super-secure-jwt-secret
      ADMIN_EMAIL: admin@yourdomain.com
      ADMIN_PASSWORD: SecurePassword123
      CORS_ORIGIN: https://yourdomain.com
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Optional: Add nginx reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - app
    restart: unless-stopped
```

## 🗄️ Database Configuration

### SQLite (Default - Development)
- File-based database
- Good for development and small deployments
- Automatic setup with migrations

### PostgreSQL (Recommended - Production)
```bash
# Environment variable
DATABASE_URL=postgresql://username:password@host:port/database

# Or individual settings
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lgs_egitim
DB_USER=username
DB_PASSWORD=password
```

### MySQL
```bash
DATABASE_URL=mysql://username:password@host:port/database
```

## 🔒 Security Checklist

### Before Deployment:
- [ ] Change default JWT_SECRET
- [ ] Set strong ADMIN_PASSWORD
- [ ] Configure proper CORS_ORIGIN
- [ ] Set NODE_ENV=production
- [ ] Review rate limiting settings
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure file upload limits
- [ ] Review database security

### Environment Variables Security:
- [ ] Never commit .env files
- [ ] Use platform secret management
- [ ] Rotate secrets regularly
- [ ] Use strong, unique passwords
- [ ] Enable 2FA where possible

## 🔍 Monitoring & Logging

### Application Logs
```bash
# View logs
tail -f logs/app.log

# Error logs
tail -f logs/error.log
```

### Health Checks
- Endpoint: `/health`
- Returns JSON with status and timestamp
- Use for load balancer health checks

### Monitoring Endpoints
- `/health` - Basic health check
- `/api/v1/analytics/admin` - Admin analytics (auth required)

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures:**
   ```bash
   # Clear cache and rebuild
   npm run clean
   npm install
   npm run build
   ```

2. **Database Connection:**
   ```bash
   # Check database file permissions
   ls -la database.sqlite
   
   # Run migrations manually
   npm run migrate
   npm run seed
   ```

3. **Port Issues:**
   ```bash
   # Check if port is in use
   lsof -i :3000
   
   # Kill process using port
   kill -9 <PID>
   ```

4. **Environment Variables:**
   ```bash
   # Verify environment variables
   printenv | grep JWT_SECRET
   ```

### Performance Optimization

1. **Enable Compression:**
   - Already enabled in Express app
   - Configure nginx for additional compression

2. **CDN Setup:**
   - Use Cloudflare or similar for static assets
   - Configure caching headers

3. **Database Optimization:**
   - Add database indexes
   - Use connection pooling
   - Consider read replicas for high traffic

## 📊 Scaling

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Deploy multiple app instances
- Share session state (Redis)
- Use external database

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Enable caching
- Use CDN for static assets

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Test health endpoint
4. Check platform-specific documentation
5. Contact support if needed

---

**Happy Deploying!** 🚀