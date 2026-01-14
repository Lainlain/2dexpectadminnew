# 🚀 Vue Admin Deployment Guide

## Quick Setup

```bash
cd Vue
./start-dev.sh
```

This will:
1. Install dependencies (if needed)
2. Create `.env.local` file
3. Start dev server on port 3000

## Production Deployment

### Option 1: Static Hosting (Recommended)

Build and deploy to any static host (Netlify, Vercel, Cloudflare Pages, etc.):

```bash
cd Vue
npm install
npm run build
```

Upload `dist/` folder to your hosting provider.

**Important**: Configure your host to:
1. Redirect all routes to `index.html` (SPA mode)
2. Set `VITE_API_URL` environment variable to your production API URL

### Option 2: Deploy with Backend Server

Serve Vue app from Go server:

```bash
# Build Vue app
cd Vue
npm run build

# Copy dist folder to Go server
cp -r dist/* ../Go/admin/public/

# Add static route in Go/main.go
r.Static("/admin-app", "./admin/public")
```

Then access at: `https://atth.online/admin-app`

### Option 3: Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name admin.atth.online;

    root /var/www/vue-admin/dist;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:4545;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /uploads {
        proxy_pass http://localhost:4545;
    }
}
```

## Environment Variables

### Development (`.env.local`)
```bash
VITE_API_URL=http://localhost:4545
```

### Production

**Netlify/Vercel**:
```
VITE_API_URL=https://atth.online
```

**Cloudflare Pages**:
```
VITE_API_URL=https://atth.online
```

## Branding for New Project

1. Update `src/config/api.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'https://your-api.com',
  APP_NAME: 'Your App Name',
  APP_TITLE: 'Your App Admin',
  THEME: {
    PRIMARY: '#YOUR_COLOR',
    // ... customize all colors
  },
}
```

2. Update `index.html`:
```html
<title>Your App Admin</title>
<meta name="theme-color" content="#YOUR_COLOR">
```

3. Update `package.json`:
```json
{
  "name": "your-app-admin",
  "version": "1.0.0"
}
```

4. Rebuild:
```bash
npm run build
```

## Troubleshooting

### API Connection Failed

Check CORS is enabled in Go server:
```go
r.Use(func(c *gin.Context) {
    c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
    // ...
})
```

### Routes Not Working in Production

Ensure your host redirects all routes to `index.html`:

**Netlify**: Create `public/_redirects`:
```
/*    /index.html   200
```

**Vercel**: Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Images Not Loading

Check `BASE_URL` in `src/config/api.js` points to correct server.

## Performance Tips

1. **Enable Gzip** on your host
2. **Use CDN** for static assets
3. **Enable HTTP/2**
4. **Set cache headers** for `dist/assets/*`

## Security

⚠️ **No Authentication Yet**: This is admin panel accessible to anyone!

TODO (future):
- Add JWT authentication
- Implement role-based access
- Add session management
- Enable HTTPS only

## Monitoring

Add analytics to `index.html`:
```html
<!-- Google Analytics, Plausible, etc. -->
```

## Updates

To update dependencies:
```bash
npm update
npm audit fix
```

## Support

Issues? Check:
1. Backend server running on port 4545
2. CORS enabled
3. `.env.local` configured correctly
4. Browser console for errors
