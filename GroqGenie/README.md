# 🎬 GroqGenie - AI Video Studio with Groq-Powered Prompt Builder

> 🏆 **Hackathon Submission** - A comprehensive AI video generation platform featuring intelligent prompt optimization and advanced video creation capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

**GroqGenie** transforms simple text prompts into stunning, professional-quality videos using the power of Groq's lightning-fast language models and MiniMax's advanced text-to-video technology.

## 🌟 Live Demo
- **Production**: [Your Deployment URL]
- **Demo Video**: [Demo Video Link]
- **API Documentation**: [API Docs Link]

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
