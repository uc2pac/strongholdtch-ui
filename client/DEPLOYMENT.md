# 🚀 Render Deployment Guide for Stronghold TCG

## Client Deployment (Frontend to Render Static Site)

### 1. Render Configuration

In your Render dashboard:

**Build Settings:**
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: `20.x` (set in package.json)

**Environment Variables:**
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

### 2. Deploy from Monorepo

Since your frontend is in the `client/` subdirectory, you have two options:

#### Option A: Deploy from Client Subdirectory
1. In Render, set **Root Directory** to `client`
2. Keep build command as `npm run build`
3. Keep publish directory as `dist`

#### Option B: Create Separate Repository
1. Create a new repository with just the client code
2. Copy the entire `client/` folder contents to the root
3. Deploy normally

### 3. Fixed Dependencies

The following changes were made to fix the deployment issues:

1. **Downgraded Tailwind CSS**: From v4.x to v3.x (more stable)
2. **Downgraded Vite**: From v7.x to v5.x (better compatibility)
3. **Updated Node.js**: From 18.x to 20.x (active LTS)
4. **Traditional Tailwind Setup**: Using standard PostCSS configuration

**PostCSS Configuration** (`postcss.config.js`):
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 4. File Structure After Changes

```
client/
├── src/
│   ├── index.css          # Updated with @tailwind directives
│   └── ...
├── postcss.config.js      # New PostCSS configuration
├── tailwind.config.js     # New Tailwind configuration
├── vite.config.js         # Updated to remove @tailwindcss/vite
└── package.json           # Updated dependencies
```

### 5. Common Render Issues & Solutions

#### Issue: "Cannot find module lightningcss"
**Solution**: ✅ Fixed by downgrading to Tailwind v3.x

#### Issue: Node.js version warnings
**Solution**: ✅ Fixed by updating to Node 20.x in package.json

#### Issue: Build fails in subdirectory
**Solutions**:
1. Set Root Directory to `client` in Render
2. Or use separate repository for client code

### 6. Production Environment Variables

Set these in Render dashboard:

```env
# API endpoint (replace with your actual backend URL)
VITE_API_BASE_URL=https://stronghold-tcg-api.onrender.com/api

# Optional: Enable production optimizations
NODE_ENV=production
```

### 7. Server Deployment (Backend)

For the server component, deploy separately:

**Root Directory**: `server`
**Build Command**: `npm install`
**Start Command**: `npm start`

**Environment Variables**:
```env
DATABASE_URL=postgresql://...
PORT=5000
NODE_ENV=production
```

### 8. Custom Build Script (Alternative)

If you want to deploy from the monorepo root, add this to your root package.json:

```json
{
  "scripts": {
    "build:client": "cd client && npm run build",
    "start:client": "cd client && npm run preview"
  }
}
```

Then set:
- **Build Command**: `npm run build:client`
- **Publish Directory**: `client/dist`

### 9. Testing Before Deployment

Test locally:
```bash
cd client
npm install
npm run build
npm run preview
```

If this works locally, it should work on Render.

### 10. Troubleshooting

1. **Check build logs** in Render dashboard
2. **Verify Node.js version** in deployment logs
3. **Test build locally** with exact same commands
4. **Check environment variables** are set correctly

The configuration is now optimized for Render deployment! 🎯
