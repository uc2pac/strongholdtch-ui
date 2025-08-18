# Stronghold TCG Backend

This is the backend API for the Stronghold TCG application, providing endpoints for managing Trading Card Game sets and cards.

## Features

- **PostgreSQL Database**: Robust data storage with proper relationships
- **RESTful API**: Full CRUD operations for sets and cards
- **Transaction Support**: Atomic operations for data consistency
- **Game Categorization**: Support for different TCG games (Pokémon, Lorcana, Magic, Yu-Gi-Oh!, Other)
- **Error Handling**: Comprehensive error responses
- **Health Checks**: Database connectivity monitoring

## Database Schema

### Sets Table
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Set name
- `game` (VARCHAR) - TCG game type
- `created_at` (TIMESTAMP) - Creation time
- `updated_at` (TIMESTAMP) - Last update time

### Cards Table
- `id` (UUID) - Primary key
- `set_id` (UUID) - Foreign key to sets table
- `name` (VARCHAR) - Card name
- `number` (INTEGER) - Card number within set
- `created_at` (TIMESTAMP) - Creation time

## API Endpoints

### Sets
- `GET /api/sets` - List all sets (with optional `?game=` filter)
- `GET /api/sets/:id` - Get specific set with cards
- `POST /api/sets` - Create new set
- `PUT /api/sets/:id` - Update existing set
- `DELETE /api/sets/:id` - Delete set

### Health Check
- `GET /api/health` - Check API and database status

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database connection string
   ```

3. **Initialize database:**
   ```bash
   npm run init-db
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Check health:**
   ```bash
   curl http://localhost:5000/api/health
   ```

### Environment Variables

Create a `.env` file with:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
PORT=5000
```

### Database Setup

If you need to create a PostgreSQL database:

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE stronghold_tcg;
CREATE USER tcg_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE stronghold_tcg TO tcg_user;
```

Then update your `.env` file:
```env
DATABASE_URL=postgresql://tcg_user:your_password@localhost:5432/stronghold_tcg
```

## Development

### Scripts
- `npm start` - Production server
- `npm run dev` - Development server with auto-restart
- `npm run init-db` - Initialize database schema

### API Testing

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

Get all sets:
```bash
curl http://localhost:5000/api/sets
```

Filter by game:
```bash
curl http://localhost:5000/api/sets?game=pokemon
```

## Production Deployment

1. Set production environment variables
2. Run database initialization: `npm run init-db`
3. Start production server: `npm start`

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include descriptive messages:
```json
{
  "error": "Set not found"
}
```
