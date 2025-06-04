# AI Video Studio with Groq-Powered Prompt Builder

A comprehensive AI video generation platform featuring intelligent prompt optimization and advanced video creation capabilities.

## Features

- **AI-Powered Prompt Builder**: Uses Groq's language models to optimize video generation prompts
- **Advanced Video Generation**: Integration with MiniMax's T2V models for high-quality video creation
- **Multiple Style Options**: Support for realistic, cartoon, Cole Bennett, glitch, and many other styles
- **Professional Camera Controls**: Extensive camera movements and lighting options
- **Real-time Generation Tracking**: Live status updates with progress monitoring
- **User Authentication**: Secure login system with credit management
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## Quick Start

### 1. Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Configure the following environment variables:
- `DATABASE_URL`: PostgreSQL database connection string
- `GROQ_API_KEY`: API key from console.groq.com
- `MINIMAX_API_KEY`: API key from api.minimaxi.chat
- `JWT_SECRET`: Secret key for authentication

### 2. Database Setup

Push the database schema:

```bash
npm run db:push
```

### 3. Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy

```bash
vercel --prod
```

### 3. Configure Environment Variables

In your Vercel dashboard, add the following environment variables:
- `DATABASE_URL`
- `GROQ_API_KEY`
- `MINIMAX_API_KEY`
- `JWT_SECRET`
- `NODE_ENV=production`

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/auth/user` - Get current user

### Video Generation
- `POST /api/prompt/optimize` - Optimize video prompts with AI
- `POST /api/video/generate` - Start video generation
- `GET /api/video/status/:taskId` - Check generation status
- `GET /api/video/download/:fileId` - Get download URL

### User Management
- `GET /api/credits` - Get user credits
- `POST /api/credits/deduct` - Deduct credits
- `POST /api/credits/add` - Add credits

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Services**: Groq API, MiniMax API
- **Deployment**: Vercel
- **Authentication**: JWT with bcrypt

## License

MIT License