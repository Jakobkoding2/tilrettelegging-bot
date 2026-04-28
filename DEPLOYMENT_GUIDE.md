# Deployment Guide

## 1. Prerequisites
- **Node.js**: v20 or later
- **Redis**: v6 or later (Required for Job Queue)
- **Docker**: For containerized deployment

## 2. Environment Variables
Ensure these keys are set in `.env` or your cloud secrets manager:

```env
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.com
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=...
JWT_SECRET=change_this_to_a_long_random_string
REDIS_HOST=localhost
REDIS_PORT=6379
CLAMAV_HOST=127.0.0.1
CLAMAV_PORT=3310
```
