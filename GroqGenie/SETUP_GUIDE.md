# 🚀 GroqGenie Setup Guide

## 📋 Prerequisites

Before setting up GroqGenie, ensure you have the following:

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control
- **PostgreSQL** database (local or cloud)

### Required API Keys
1. **Groq API Key**
   - Visit [console.groq.com](https://console.groq.com/)
   - Create an account and generate an API key
   - Free tier available with generous limits

2. **MiniMax API Key**
   - Visit [api.minimaxi.chat](https://api.minimaxi.chat/)
   - Sign up and obtain your API key
   - Required for video generation

3. **Database Setup**
   - **Option 1**: Local PostgreSQL installation
   - **Option 2**: Cloud providers (Neon, Supabase, PlanetScale)
   - **Option 3**: Docker PostgreSQL container

4. **Stripe Account** (Optional)
   - Only required if you want payment functionality
   - Get keys from [stripe.com](https://stripe.com/)

## 🛠️ Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd GroqGenie
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@hostname:port/database

# API Keys
GROQ_API_KEY=your_groq_api_key_here
MINIMAX_API_KEY=your_minimax_api_key_here

# Authentication
JWT_SECRET=your_jwt_secret_minimum_32_characters_long

# Stripe (Optional - for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Environment
NODE_ENV=development
```

### 4. Database Setup

Push the database schema:
```bash
npm run db:push
```

This will create all necessary tables in your PostgreSQL database.

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:8000`

## 🗄️ Database Setup Options

### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb groqgenie

# Update .env
DATABASE_URL=postgresql://localhost:5432/groqgenie
```

### Option 2: Neon (Recommended)
1. Visit [neon.tech](https://neon.tech/)
2. Create a free account
3. Create a new project
4. Copy the connection string to your `.env` file

### Option 3: Supabase
1. Visit [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

### Option 4: Docker
```bash
# Run PostgreSQL in Docker
docker run --name groqgenie-db   -e POSTGRES_PASSWORD=password   -e POSTGRES_DB=groqgenie   -p 5432:5432   -d postgres:15

# Update .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/groqgenie
```

## 🔑 API Key Setup

### Groq API Key
1. Go to [console.groq.com](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

### MiniMax API Key
1. Visit [api.minimaxi.chat](https://api.minimaxi.chat/)
2. Create an account
3. Generate an API key
4. Add to your `.env` file

### JWT Secret
Generate a secure random string (minimum 32 characters):
```bash
# Generate random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚀 Deployment Setup

### Vercel Deployment
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add all environment variables from your `.env` file
   - Redeploy if necessary

### Environment Variables for Production
```env
DATABASE_URL=your_production_database_url
GROQ_API_KEY=your_groq_api_key
MINIMAX_API_KEY=your_minimax_api_key
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
STRIPE_SECRET_KEY=your_production_stripe_key (optional)
```

## 🧪 Testing the Setup

### 1. Check Database Connection
```bash
npm run check
```

### 2. Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Test registration
curl -X POST http://localhost:8000/api/register   -H "Content-Type: application/json"   -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

### 3. Test Frontend
1. Open `http://localhost:8000` in your browser
2. Try registering a new account
3. Test the video generation interface

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running and connection string is correct.

#### API Key Error
```
Error: Invalid API key
```
**Solution**: Verify your API keys are correct and have proper permissions.

#### Build Errors
```
Error: Cannot resolve module
```
**Solution**: Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Port Already in Use
```
Error: Port 8000 is already in use
```
**Solution**: Kill the process or use a different port:
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or set different port
PORT=3000 npm run dev
```

### Environment Variables Checklist
- [ ] `DATABASE_URL` - Valid PostgreSQL connection string
- [ ] `GROQ_API_KEY` - Valid Groq API key
- [ ] `MINIMAX_API_KEY` - Valid MiniMax API key
- [ ] `JWT_SECRET` - Secure random string (32+ chars)
- [ ] `NODE_ENV` - Set to "development" or "production"

### Database Schema Issues
If you encounter schema issues:
```bash
# Reset database (WARNING: This will delete all data)
npm run db:push --force

# Or manually reset
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run db:push
```

## 📞 Getting Help

If you encounter issues:
1. Check the [troubleshooting section](#troubleshooting)
2. Review the [API documentation](API_DOCUMENTATION.md)
3. Check the [GitHub issues](https://github.com/your-username/groqgenie/issues)
4. Join our [Discord community](#) (if available)

## 🎯 Next Steps

After successful setup:
1. Explore the [Features documentation](FEATURES.md)
2. Read the [API documentation](API_DOCUMENTATION.md)
3. Check out the [deployment guide](DEPLOYMENT.md)
4. Start building amazing videos with GroqGenie! 🎬
