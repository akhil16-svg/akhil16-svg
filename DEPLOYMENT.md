# 🚀 Deployment Guide

## Quick Deploy Options

### 1. **Render.com** (Recommended - Free Tier Available)

**Backend Deployment:**
1. Create account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new "Web Service"
4. Set build command: `cd backend && pip install -r requirements.txt`
5. Set start command: `cd backend && python app.py`
6. Add environment variables:
   ```
   FLASK_ENV=production
   DATABASE_URL=sqlite:///flashcards.db
   SECRET_KEY=your-secure-random-key
   ```

**Frontend Deployment:**
1. Create a new "Static Site" on Render
2. Set build command: `cd frontend && npm install && npm run build`
3. Set publish directory: `frontend/dist`
4. Update `frontend/src/api.js` with your backend URL

### 2. **Railway** (Easy Full-Stack Deploy)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

Create `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "cd backend && python app.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 3. **Vercel + PlanetScale** (Serverless)

**Frontend (Vercel):**
```bash
npm i -g vercel
cd frontend
vercel --prod
```

**Backend (Vercel Serverless):**
Create `api/` directory in root and move backend files there.

### 4. **Heroku** (Classic Option)

Create `Procfile`:
```
web: cd backend && python app.py
```

Create `runtime.txt`:
```
python-3.9.20
```

Deploy:
```bash
heroku create your-app-name
git push heroku main
```

### 5. **Docker Deployment**

Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim

# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm

# Copy and build frontend
COPY frontend/ /app/frontend/
WORKDIR /app/frontend
RUN npm install && npm run build

# Setup backend
COPY backend/ /app/backend/
WORKDIR /app/backend
RUN pip install -r requirements.txt

# Seed database
RUN python seed.py

EXPOSE 5000
CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t flashcard-app .
docker run -p 5000:5000 flashcard-app
```

### 6. **DigitalOcean App Platform**

Create `.do/app.yaml`:
```yaml
name: flashcard-app
services:
- name: backend
  source_dir: backend
  github:
    repo: your-username/flashcard-app
    branch: main
  run_command: python app.py
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  
- name: frontend
  source_dir: frontend
  github:
    repo: your-username/flashcard-app
    branch: main
  build_command: npm install && npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```

## Environment Variables for Production

```bash
# Backend (.env)
FLASK_ENV=production
SECRET_KEY=your-very-secure-secret-key-here
DATABASE_URL=sqlite:///flashcards.db
# For PostgreSQL: postgresql://user:pass@host:port/dbname

# Frontend (update api.js)
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## Database Options

### SQLite (Default - Good for Small Apps)
- Included with Python
- Single file database
- Perfect for personal use or small teams

### PostgreSQL (Recommended for Production)
```bash
pip install psycopg2-binary
```

Update `models.py`:
```python
# Add to app.py
import os
if os.getenv('DATABASE_URL'):
    app.config['SQLALCHEMY_DATABASE_URL'] = os.getenv('DATABASE_URL')
```

### MongoDB (Alternative)
```bash
pip install pymongo flask-pymongo
```

## Performance Optimizations

### Backend Optimizations
```python
# Add to app.py
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# Enable gzip compression
from flask_compress import Compress
Compress(app)

# Add caching
from flask_caching import Cache
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
```

### Frontend Optimizations
```bash
# Build with optimizations
npm run build

# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
```

## Monitoring & Analytics

### Add Health Check Endpoint
```python
@app.route('/health')
def health():
    return {'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()}
```

### Add Basic Analytics
```python
from collections import defaultdict
import json

# Simple analytics storage
analytics = defaultdict(int)

@app.route('/api/analytics', methods=['POST'])
def track_event():
    event = request.json.get('event')
    analytics[event] += 1
    return {'status': 'tracked'}
```

## Security Considerations

### Production Security
```python
# Add to app.py
from flask_talisman import Talisman

# Enable HTTPS redirect and security headers
Talisman(app, force_https=True)

# Rate limiting
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
```

### Environment Security
```bash
# Generate secure secret key
python -c "import secrets; print(secrets.token_hex(32))"

# Use environment variables, never commit secrets
export SECRET_KEY=your-generated-key
export DATABASE_URL=your-database-url
```

## Backup Strategy

### Database Backup
```bash
# SQLite backup
cp flashcards.db flashcards_backup_$(date +%Y%m%d).db

# PostgreSQL backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Automated Backups
```python
# Add to app.py
import schedule
import shutil
from datetime import datetime

def backup_database():
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    shutil.copy2('flashcards.db', f'backups/flashcards_{timestamp}.db')

schedule.every().day.at("02:00").do(backup_database)
```

## Scaling Considerations

### Horizontal Scaling
- Use Redis for session storage
- Implement database connection pooling
- Add load balancer (nginx)

### Vertical Scaling
- Monitor memory usage
- Optimize database queries
- Enable database indexing

## Cost Optimization

### Free Tier Options
- **Render**: 750 hours/month free
- **Railway**: $5 credit monthly
- **Vercel**: Unlimited static sites
- **Heroku**: 550-1000 dyno hours/month

### Paid Recommendations
- **Render**: $7/month for web service
- **Railway**: Pay-per-use pricing
- **DigitalOcean**: $5/month droplet

## Troubleshooting Deployment

### Common Issues
1. **Build Failures**: Check Node.js/Python versions
2. **Database Connection**: Verify DATABASE_URL format
3. **CORS Errors**: Update Flask-CORS configuration
4. **Static Files**: Ensure correct build output directory

### Debug Commands
```bash
# Check logs
heroku logs --tail
railway logs
vercel logs

# Test locally with production settings
FLASK_ENV=production python app.py
npm run build && npm run preview
```

---

**Choose the deployment option that best fits your needs and budget!** 🚀