# Deployment Guide

## Production Checklist

1. Set strong `JWT_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`
2. Configure MongoDB Atlas connection string
3. Enable Redis for caching
4. Set up Cloudinary/AWS S3 for media
5. Configure Razorpay/Stripe production keys
6. Set `NODE_ENV=production`
7. Enable HTTPS and update `CLIENT_URL`

## Vercel (Frontend)

```bash
cd client
npm run build
# Deploy dist/ folder
```

Set environment variable: `VITE_API_URL=https://api.yourdomain.com/api/v1`

## Railway / Render (Backend)

- Start command: `node src/server.js`
- Add all env vars from `.env.example`
- Attach MongoDB and Redis add-ons

## CI/CD

GitHub Actions example workflows can be added under `.github/workflows/` for:
- Lint & build on PR
- Deploy on merge to main
