/**
 * API Configuration
 * 
 * BRANDING GUIDE:
 * Update these constants when rebranding or deploying to different projects
 */

export const API_CONFIG = {
  // Base URLs
  BASE_URL: 'https://api.atth.online',
  
  // App Identity
  APP_NAME: '2D Expect',
  APP_TITLE: '2D Expect Admin',
  APP_SHORT_NAME: '2D Admin',
  
  // Theme Colors (matching Android app)
  THEME: {
    PRIMARY: '#0D47A1',           // Blue accent
    PRIMARY_LIGHT: '#1976D2',
    PRIMARY_DARK: '#004BA0',
    SECONDARY: '#00897B',         // Teal
    ACCENT: '#FF6F00',           // Orange
    SUCCESS: '#2E7D32',          // Green
    ERROR: '#BA1A1A',            // Red
    WARNING: '#F57C00',          // Amber
    BACKGROUND: '#F5F5F5',       // Light gray
    SURFACE: '#FFFFFF',          // White
    TEXT_PRIMARY: '#212121',     // Dark gray
    TEXT_SECONDARY: '#757575',   // Medium gray
    TEXT_HINT: '#9E9E9E',       // Light gray
  },
}

/**
 * API Endpoints
 * All endpoints are prefixed with BASE_URL
 */
export const API_ENDPOINTS = {
  // Game/Lottery API (public)
  GAME: {
    CURRENT: '/api/game/current',
    STREAM: '/api/game/stream',
    UPDATE: '/api/game/update',
    HISTORY: '/api/game/history',
    REWARDS: '/api/game/rewards',
    BANNERS: '/api/game/banners',
    THREED: '/api/game/3d',
    GUIDES_TYPES: '/api/game/guides/types',
    GUIDES_IMAGES: '/api/game/guides/types',
  },
  
  // Admin API (requires auth in future)
  ADMIN: {
    // Gifts/Rewards
    GIFTS: '/api/admin/gifts',
    GIFT_BY_ID: (id) => `/api/admin/gifts/${id}`,
    
    // Sliders/Banners
    SLIDERS: '/api/admin/sliders',
    SLIDER_BY_ID: (id) => `/api/admin/sliders/${id}`,
    
    // 3D Lottery
    THREED: '/api/admin/threed',
    
    // Paper/Guides
    PAPER_TYPES: '/api/admin/paper/types',
    PAPER_TYPE_BY_ID: (id) => `/api/admin/paper/types/${id}`,
    PAPER_IMAGES: '/api/admin/paper/images',
    PAPER_IMAGES_BATCH: '/api/admin/paper/images/batch',
    PAPER_IMAGE_BY_ID: (id) => `/api/admin/paper/images/${id}`,
    
    // Image Upload
    UPLOAD_IMAGE: '/api/admin/upload-image',
    DELETE_IMAGE: (filename) => `/api/admin/delete-image/${filename}`,
  },
  
  // Version/Health
  VERSION: '/api/version',
  
  // Uploads path
  UPLOADS: '/uploads',
}

/**
 * Helper function to build full image URL
 */
export function getImageUrl(filename) {
  if (!filename) return ''
  if (filename.startsWith('http')) return filename
  return `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOADS}/${filename}`
}

/**
 * Helper function to build full API URL
 */
export function getApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}
