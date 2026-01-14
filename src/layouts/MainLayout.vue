<template>
  <div class="main-layout">
    <!-- App Bar -->
    <header class="app-bar">
      <button class="btn-icon" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <h1 class="app-bar-title">{{ currentRoute?.meta?.title || 'Admin' }}</h1>
      <button class="btn-icon" @click="showInfo" aria-label="Info">
        <span class="material-symbols-outlined">info</span>
      </button>
    </header>

    <!-- Navigation Drawer -->
    <aside class="nav-drawer" :class="{ open: menuOpen }">
      <div class="nav-drawer-overlay" @click="menuOpen = false"></div>
      <nav class="nav-drawer-content">
        <div class="nav-header">
          <h2 class="nav-title">{{ API_CONFIG.APP_TITLE }}</h2>
          <button class="btn-icon" @click="menuOpen = false" aria-label="Close">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <ul class="nav-list">
          <li v-for="route in navRoutes" :key="route.path">
            <RouterLink 
              :to="route.path" 
              class="nav-item"
              :class="{ active: $route.path === route.path }"
              @click="menuOpen = false"
            >
              <span class="material-symbols-outlined">{{ route.meta.icon }}</span>
              <span>{{ route.meta.title }}</span>
            </RouterLink>
          </li>
        </ul>
        
        <div class="nav-footer">
          <p class="nav-version">Version {{ version }}</p>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { API_CONFIG } from '@/config/api'
import { useApiStore } from '@/stores/api'

console.log('MainLayout component loading...')

const route = useRoute()
const apiStore = useApiStore()
const menuOpen = ref(false)
const version = ref('1.0.0')

const currentRoute = computed(() => route)

const navRoutes = [
  { path: '/', meta: { title: 'Dashboard', icon: 'dashboard' } },
  { path: '/gifts', meta: { title: 'Gifts/Rewards', icon: 'redeem' } },
  { path: '/sliders', meta: { title: 'Banners/Sliders', icon: 'view_carousel' } },
  { path: '/threed', meta: { title: '3D Lottery', icon: 'casino' } },
  { path: '/paper', meta: { title: 'Paper/Guides', icon: 'image' } },
]

function showInfo() {
  alert(`${API_CONFIG.APP_TITLE}\nVersion: ${version.value}\nAPI: ${API_CONFIG.BASE_URL}`)
}

// Fetch version after mount (non-blocking)
onMounted(() => {
  console.log('MainLayout mounted')
  apiStore.fetchVersion().then(data => {
    if (data?.version) version.value = data.version
  }).catch(error => {
    console.error('Version fetch failed:', error)
    // Keep default version on error
  })
})
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* App Bar */
.app-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  box-shadow: 0 2px 4px var(--shadow);
  min-height: 56px;
}

.app-bar-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
}

.app-bar .btn-icon {
  color: white;
  background-color: transparent;
}

.app-bar .btn-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Navigation Drawer */
.nav-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  pointer-events: none;
}

.nav-drawer.open {
  pointer-events: auto;
}

.nav-drawer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-drawer.open .nav-drawer-overlay {
  opacity: 1;
}

.nav-drawer-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 280px;
  max-width: 80vw;
  height: 100%;
  background-color: var(--surface);
  box-shadow: 2px 0 8px var(--shadow-lg);
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.nav-drawer.open .nav-drawer-content {
  transform: translateX(0);
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--divider);
  background-color: var(--primary);
  color: white;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
}

.nav-header .btn-icon {
  color: white;
}

.nav-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  color: var(--text-primary);
  text-decoration: none;
  transition: background-color 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.nav-item.active {
  background-color: rgba(13, 71, 161, 0.1);
  color: var(--primary);
}

.nav-item .material-symbols-outlined {
  font-size: 24px;
}

.nav-footer {
  padding: 16px;
  border-top: 1px solid var(--divider);
  text-align: center;
}

.nav-version {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile optimization */
@media (max-width: 768px) {
  .main-content {
    padding: 12px;
  }
}
</style>
