# Stronghold TCG - Frontend

React-based frontend application for the Stronghold TCG platform.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **React Router** for navigation

## Development

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### API Integration

The frontend communicates with the backend API through:
- **Base URL**: `http://localhost:5000/api` (development)
- **Proxy**: Configured in `vite.config.js` for seamless development

### Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Header/
│   ├── Menu/
│   └── Modal/
├── pages/         # Page components
│   ├── CreateSet/
│   ├── SetDetails/
│   └── Sets/
├── services/      # API service layer
└── assets/        # Static assets
```

### Environment Variables

Create a `.env` file for environment-specific configuration:
```env
# API Base URL (if different from default)
VITE_API_BASE_URL=http://localhost:5000/api
```

### Deployment

For production deployment:
1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Configure your web server to handle client-side routing
4. Update API base URL for production environment
