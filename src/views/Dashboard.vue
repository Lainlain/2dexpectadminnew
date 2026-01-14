<template>
  <div class="dashboard">
    <!-- Live Data Card -->
    <div class="live-card" :class="{ 'live-active': isConnected }">
      <div class="live-header">
        <div class="live-indicator">
          <span class="live-dot" :class="{ active: isConnected }"></span>
          <span class="live-text">{{ isConnected ? 'LIVE' : 'OFFLINE' }}</span>
        </div>
        <div class="view-count">
          <span class="material-symbols-outlined">visibility</span>
          <span>{{ liveData?.viewCount || 0 }}</span>
        </div>
      </div>
      
      <div class="live-content">
        <div class="live-status">
          <span class="status-badge" :class="liveData?.live === 'On' ? 'status-on' : 'status-off'">
            {{ liveData?.live === 'On' ? '● OPEN' : '○ CLOSED' }}
          </span>
          <span class="last-update">{{ lastUpdate }}</span>
        </div>
      </div>
    </div>

    <h2 class="mb-2">Dashboard</h2>
    
    <div class="dashboard-grid">
      <RouterLink to="/gifts" class="dashboard-card">
        <span class="material-symbols-outlined dashboard-icon">redeem</span>
        <h3>Gifts/Rewards</h3>
        <p>Manage gift items</p>
      </RouterLink>
      
      <RouterLink to="/sliders" class="dashboard-card">
        <span class="material-symbols-outlined dashboard-icon">view_carousel</span>
        <h3>Banners</h3>
        <p>Manage slider banners</p>
      </RouterLink>
      
      <RouterLink to="/threed" class="dashboard-card">
        <span class="material-symbols-outlined dashboard-icon">casino</span>
        <h3>3D Lottery</h3>
        <p>Manage 3D results</p>
      </RouterLink>
      
      <RouterLink to="/paper" class="dashboard-card">
        <span class="material-symbols-outlined dashboard-icon">image</span>
        <h3>Paper/Guides</h3>
        <p>Manage paper images</p>
      </RouterLink>
      
      <RouterLink to="/appconfig" class="dashboard-card">
        <span class="material-symbols-outlined dashboard-icon">settings_applications</span>
        <h3>App Config</h3>
        <p>App version & settings</p>
      </RouterLink>
      
      <RouterLink to="/notification" class="dashboard-card">
        <span class="material-symbols-outlined dashboard-icon">notifications_active</span>
        <h3>Send Notification</h3>
        <p>Push notifications to users</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { API_CONFIG } from '@/config/api'

const liveData = ref(null)
const isConnected = ref(false)
const lastUpdate = ref('Connecting...')
let eventSource = null

function connectSSE() {
  const sseUrl = `${API_CONFIG.BASE_URL}/api/game/stream`
  console.log('Connecting to SSE:', sseUrl)
  eventSource = new EventSource(sseUrl)
  
  eventSource.onopen = () => {
    isConnected.value = true
    console.log('✅ SSE Connected successfully')
  }
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      liveData.value = data
      const now = new Date()
      lastUpdate.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      console.log('📊 SSE Data:', data)
    } catch (err) {
      console.error('❌ Failed to parse SSE data:', err)
    }
  }
  
  eventSource.onerror = (error) => {
    isConnected.value = false
    lastUpdate.value = 'Connection lost'
    console.error('❌ SSE Error:', error)
    console.log('SSE readyState:', eventSource?.readyState)
    
    // Reconnect after 5 seconds
    setTimeout(() => {
      if (eventSource) {
        eventSource.close()
        connectSSE()
      }
    }, 5000)
  }
}

onMounted(() => {
  connectSSE()
})

onUnmounted(() => {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
})
</script>

<style scoped>
.live-card {
  background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.live-card.live-active {
  box-shadow: 0 4px 20px rgba(13, 71, 161, 0.3);
}

.live-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.live-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #666;
  animation: pulse 2s ease-in-out infinite;
}

.live-dot.active {
  background-color: #4ade80;
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.live-text {
  color: white;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 1px;
}

.view-count {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
}

.view-count .material-symbols-outlined {
  font-size: 18px;
}

.live-content {
  color: white;
}

.lottery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.lottery-item {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  transition: all 0.2s ease;
}

.lottery-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.lottery-item.highlight {
  background-color: rgba(255, 165, 0, 0.2);
  border: 2px solid rgba(255, 165, 0, 0.4);
}

.lottery-label {
  font-size: 11px;
  opacity: 0.8;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lottery-value {
  font-size: 24px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.lottery-value.large {
  font-size: 32px;
  color: #ffa500;
}

.live-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.status-on {
  background-color: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.status-off {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.last-update {
  font-size: 11px;
  opacity: 0.7;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.dashboard-card {
  background: var(--surface);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  color: var(--text-primary);
  box-shadow: 0 1px 3px var(--shadow);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.dashboard-card:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px var(--shadow-lg);
}

.dashboard-icon {
  font-size: 48px;
  color: var(--primary);
}

.dashboard-card h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.dashboard-card p {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}
</style>
