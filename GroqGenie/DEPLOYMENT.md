# Deployment Guide

## Prerequisites

1. **Database**: Set up a PostgreSQL database (recommended: Neon, PlanetScale, or Supabase)
2. **API Keys**: 
   - Groq API key from https://console.groq.com/
   - MiniMax API key from https://api.minimaxi.chat/
3. **Vercel Account**: Sign up at https://vercel.com/

## Steps to Deploy

### 1. Prepare Environment Variables

Create these environment variables in your Vercel project:

```
DATABASE_URL=postgresql://your-db-connection-string
GROQ_API_KEY=your-groq-api-key
MINIMAX_API_KEY=your-minimax-api-key
JWT_SECRET=your-jwt-secret-minimum-32-characters
NODE_ENV=production
```

### 2. Deploy to Vercel

Option A - CLI Deployment:
```bash
npm install -g vercel
vercel --prod
```

Option B - GitHub Integration:
1. Push code to GitHub repository
2. Connect repository in Vercel dashboard
3. Configure environment variables
4. Deploy automatically

### 3. Post-Deployment Setup

1. **Database Migration**: The database schema will be automatically applied on first API call
2. **Domain Configuration**: Update CORS settings in `api/index.ts` with your actual domain
3. **Test API Endpoints**: Verify all endpoints are working correctly

## Important Notes

- The application uses serverless functions for the backend
- File uploads are limited to 10MB
- Video generation may take 2-5 minutes depending on complexity
- Credit system is implemented for usage tracking

## Troubleshooting

- **Database Connection**: Ensure your DATABASE_URL is accessible from Vercel
- **API Keys**: Verify all API keys are correctly set in environment variables
- **CORS Issues**: Update allowed origins in the API configuration
- **Build Errors**: Check that all dependencies are properly installed

## Performance Optimization

The deployment is optimized for:
- Static asset serving through Vercel's CDN
- Serverless API functions with 30-second timeout
- Automatic code splitting and minification
- Progressive web app capabilities