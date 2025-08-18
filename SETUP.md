# Stronghold TCG - Full Stack Setup Guide

This guide will help you migrate from localStorage to a PostgreSQL database backend.

## Architecture Overview

- **Frontend**: React + TypeScript + Tailwind CSS (Vite) - `/client`
- **Backend**: Express.js + PostgreSQL - `/server`
- **Database**: PostgreSQL with UUID primary keys and proper relationships

## Project Structure

```
stronghold-tcg/
├── client/          # React frontend application
│   ├── src/         # React components and pages
│   ├── public/      # Static assets
│   ├── package.json # Client dependencies
│   └── vite.config.js
├── server/          # Express.js backend API
│   ├── routes/      # API routes
│   ├── package.json # Server dependencies
│   └── schema.sql   # Database schema
├── package.json     # Root monorepo configuration
└── README.md
```

## Quick Start

### 1. Install All Dependencies

From the root directory:
```bash
npm run install:all
```

### 2. Database Setup (PostgreSQL required)

First, ensure PostgreSQL is installed and running on your system.

Create the database:
```bash
# Connect to PostgreSQL (adjust connection as needed)
psql -U postgres

# Create database and user
CREATE DATABASE stronghold_tcg;
CREATE USER tcg_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE stronghold_tcg TO tcg_user;
\q
```

### 3. Backend Configuration

Navigate to the server directory and set up environment:
```bash
cd server
cp .env.example .env
```

Edit `.env` file with your database credentials:
```env
DATABASE_URL=postgresql://tcg_user:your_password@localhost:5432/stronghold_tcg
PORT=5000
```

### 4. Initialize Database

From the root directory:
```bash
npm run init-db
```

### 5. Start Development Servers

From the root directory:
```bash
# Start both client and server together
npm run dev

# Or start individually:
# Client only (frontend)
npm run dev:client

# Server only (backend API)
npm run dev:server
```

### 6. Verify Setup

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health
- Test API: http://localhost:5000/api/sets

## API Endpoints

### Sets Management
- `GET /api/sets` - List all sets
- `GET /api/sets?game=pokemon` - Filter sets by game
- `GET /api/sets/:id` - Get specific set with cards
- `POST /api/sets` - Create new set
- `PUT /api/sets/:id` - Update set
- `DELETE /api/sets/:id` - Delete set

### Example API Usage

Create a set:
```bash
curl -X POST http://localhost:5000/api/sets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Base Set",
    "game": "pokemon", 
    "cards": [
      {"name": "Charizard", "number": 4},
      {"name": "Blastoise", "number": 2}
    ]
  }'
```

## Migration from localStorage

The frontend has been updated to use the new API instead of localStorage. Your existing localStorage data won't be automatically migrated, but you can:

1. Export your current localStorage data
2. Use the API to recreate your sets
3. Or manually re-enter your sets using the web interface

## Development Notes

### Database Schema
- Sets and cards are stored in separate tables with proper foreign key relationships
- UUIDs are used for primary keys for better scalability
- Automatic timestamps track creation and update times
- Unique constraints prevent duplicate card numbers within sets

### Frontend Changes
- `src/services/api.ts` - New API service layer
- Components now use async/await for data operations
- Added loading states and error handling
- Maintained all existing UI functionality

### Error Handling
- Database transaction support for atomic operations
- Comprehensive error messages
- Validation for required fields and constraints
- Health check endpoint for monitoring

## Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running: `pg_isready`
2. Check connection string in `.env`
3. Ensure database and user exist
4. Check firewall/networking settings

### API Issues
1. Check server logs for errors
2. Verify backend is running on port 5000
3. Test health endpoint: `curl http://localhost:5000/api/health`

### Frontend Issues
1. Ensure API proxy is working (vite.config.js)
2. Check browser console for errors
3. Verify backend is accessible from frontend

## Production Deployment

### Backend
1. Set production environment variables
2. Use connection pooling for database
3. Enable proper logging
4. Set up process management (PM2, systemd, etc.)

### Frontend
1. Build optimized version: `npm run build`
2. Serve static files through web server
3. Configure API_BASE_URL for production

### Database
1. Set up proper backup strategy
2. Configure SSL for connections
3. Optimize database settings for production load
