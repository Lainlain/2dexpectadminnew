# 2D Expect Admin - Vue.js Web App

Mobile-first admin panel for 2D Expect lottery system built with Vue 3, Vite, and Material Design.

## ✨ Features

- **Mobile-First Design** - Optimized for mobile devices with touch-friendly interface
- **Material Design** - Clean, compact UI matching Android app theme
- **Responsive Layout** - Works on all screen sizes
- **Real-time Updates** - Direct API integration with Go backend
- **Image Upload** - Multi-image upload support
- **RESTful API** - Full CRUD operations for all resources

## 📁 Project Structure

```
Vue/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css          # Material Design styles
│   ├── components/               # Reusable components (future)
│   ├── config/
│   │   └── api.js               # ⭐ API endpoints & branding config
│   ├── layouts/
│   │   └── MainLayout.vue       # App bar + navigation drawer
│   ├── router/
│   │   └── index.js             # Vue Router configuration
│   ├── stores/
│   │   └── api.js               # Pinia store for API calls
│   ├── views/
│   │   ├── Dashboard.vue        # Main dashboard
│   │   ├── Gifts.vue            # Gift list
│   │   ├── GiftForm.vue         # Create/edit gift
│   │   ├── Sliders.vue          # Banner list
│   │   ├── SliderForm.vue       # Create/edit banner
│   │   ├── ThreeD.vue           # 3D lottery management
│   │   └── Paper.vue            # Paper/guides management
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Go backend server running on port 4545

### Installation

```bash
cd Vue
npm install
```

### Development

```bash
npm run dev
```

App will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Production files will be in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Branding & Reuse

All branding and API configuration is centralized in **`src/config/api.js`**:

### Change App Name

```javascript
export const API_CONFIG = {
  APP_NAME: '2D Expect',           // Change this
  APP_TITLE: '2D Expect Admin',    // Change this
  APP_SHORT_NAME: '2D Admin',      // Change this
  // ...
}
```

### Change Theme Colors

```javascript
export const API_CONFIG = {
  THEME: {
    PRIMARY: '#0D47A1',           // Main color
    SECONDARY: '#00897B',         // Secondary color
    ACCENT: '#FF6F00',           // Accent color
    // ... all colors customizable
  },
}
```

### Change API Base URL

```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4545',
}
```

Or use environment variable:

```bash
# .env.local
VITE_API_URL=https://your-api-server.com
```

### Reuse for Other Projects

1. Update `src/config/api.js`:
   - Change `APP_NAME`, `APP_TITLE`
   - Update `THEME` colors
   - Modify `API_ENDPOINTS` if needed

2. Update `index.html`:
   - Change `<title>` tag
   - Update meta tags

3. Update `package.json`:
   - Change `name` field

4. (Optional) Replace favicon in `public/`

That's it! The entire app is rebranded.

## 📱 API Integration

### All Available Routes

The app integrates with all backend routes:

#### Game API (Public)
- `GET /api/game/current` - Current lottery data
- `GET /api/game/stream` - SSE stream
- `GET /api/game/history` - 2D history
- `GET /api/game/rewards` - Gift list (public)
- `GET /api/game/banners` - Banner list (public)
- `GET /api/game/3d` - 3D lottery results
- `GET /api/game/guides/types` - Paper types

#### Admin API
- **Gifts**: CRUD operations on `/api/admin/gifts`
- **Sliders**: CRUD operations on `/api/admin/sliders`
- **3D Lottery**: CRUD operations on `/api/game/3d`
- **Paper**: CRUD operations on `/api/admin/paper/*`
- **Image Upload**: `POST /api/admin/upload-image`
- **Image Delete**: `DELETE /api/admin/delete-image/:filename`

All endpoints are defined in `src/config/api.js`.

## 🎯 Features by Page

### Dashboard
- Quick access cards to all sections
- Material icons for each module

### Gifts/Rewards
- List all gifts with images
- Create/edit gifts
- Upload gift images
- Delete gifts
- Category badges (Daily/Weekly/Monthly/Special)

### Banners/Sliders
- List all banners with images
- Create/edit banners
- Upload banner images
- Delete banners
- Active/inactive status
- Order management

### 3D Lottery
- View all 3D results sorted by date
- Add new results
- Delete results
- Date-based management

### Paper/Guides
- Create paper types (Morning, Evening, etc.)
- Upload multiple images per type
- Grid view of images
- Delete types and images
- Expandable type sections

## 🛠️ Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official router
- **Pinia** - State management
- **Axios** - HTTP client
- **Material Symbols** - Google's Material Icons
- **Inter Font** - Modern sans-serif typeface

## 🎨 Design System

### Colors (Material Design 3)

```css
--primary: #0D47A1        /* Blue accent */
--secondary: #00897B      /* Teal */
--accent: #FF6F00        /* Orange */
--success: #2E7D32       /* Green */
--error: #BA1A1A         /* Red */
--background: #F5F5F5    /* Light gray */
--surface: #FFFFFF       /* White */
```

### Typography

- **Font Family**: Inter (400, 500, 600, 700)
- **Sizes**: 12px, 13px, 14px, 16px, 18px, 20px, 24px
- **Line Height**: 1.5 for body text, 1.2 for headings

### Components

- **Cards**: 12px border radius, subtle shadow
- **Buttons**: 8px border radius, 40px min height
- **Forms**: 8px border radius, consistent spacing
- **Lists**: Tap-friendly 12px padding

## 📦 Build Configuration

### Vite Proxy

API calls are proxied in development:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:4545',
    changeOrigin: true,
  },
}
```

### Production Build

- Minified and optimized
- Code splitting
- Tree shaking
- ~150KB gzipped

## 🔒 Future Enhancements

- [ ] Authentication (JWT tokens)
- [ ] User management
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] Bulk operations
- [ ] Export data (CSV/Excel)
- [ ] Dark mode toggle
- [ ] PWA support
- [ ] Offline functionality

## 📝 Notes

- **Mobile-First**: Designed for mobile devices, scales up to desktop
- **No Server-Side Rendering**: SPA only (client-side routing)
- **CORS**: Requires CORS enabled on backend (already configured)
- **Image URLs**: Automatically handles production HTTPS URLs

## 🐛 Troubleshooting

### API Connection Issues

1. Check backend is running: `curl http://localhost:4545/api/version`
2. Check CORS headers in browser console
3. Verify `BASE_URL` in `src/config/api.js`

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

### Image Upload Not Working

1. Check backend `/api/admin/upload-image` endpoint
2. Verify `uploads/` folder permissions
3. Check file size limits

## 📄 License

Same as main project (2D Expect)

## 👨‍💻 Author

Created for 2D Expect Admin System
# 2dexpectadmin
# 2dexpectadminnew
# 2dexpectadminnew
