<template>
  <div class="notification-page">
    <h2 class="page-title">📢 Send Push Notification</h2>

    <!-- Success Toast -->
    <transition name="toast">
      <div v-if="showToast" class="toast-notification">
        <span class="material-symbols-outlined">check_circle</span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

    <div class="notification-container">
      <div class="notification-card">
        <div class="card-content">
          <div class="form-group">
            <label class="form-label">Topic</label>
            <select v-model="notification.topic" class="form-input">
              <option value="all">All Users</option>
              <option value="gifts">Gifts Subscribers</option>
              <option value="live">Live Updates</option>
              <option value="threed">3D Lottery</option>
            </select>
            <span class="form-hint">Select user group to send notification</span>
          </div>

          <div class="form-group">
            <label class="form-label">Title</label>
            <input 
              v-model="notification.title" 
              type="text" 
              class="form-input"
              placeholder="🎉 New Update Available!"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea 
              v-model="notification.body" 
              class="form-textarea"
              placeholder="Check out the latest features and updates..."
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Image (Optional)</label>
            <input 
              type="file" 
              @change="handleImageSelect"
              accept="image/*"
              class="hidden"
              id="notification-image"
            />
            <label for="notification-image" class="btn-upload">
              <span class="material-symbols-outlined">image</span>
              {{ notification.imageUrl ? 'Change Image' : 'Upload Image' }}
            </label>
            <div v-if="notification.imageUrl" class="image-preview">
              <img :src="notification.imageUrl" alt="Notification image" />
              <button @click="notification.imageUrl = ''" class="btn-remove-image">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Card -->
      <div class="preview-container">
        <div class="preview-label">📱 Notification Preview</div>
        <div class="preview-card">
          <div class="preview-header">
            <div class="preview-app-info">
              <span class="preview-app-icon">🎯</span>
              <span class="preview-app-name">2D Expect</span>
            </div>
            <span class="preview-time">now</span>
          </div>
          <div v-if="notification.imageUrl" class="preview-image">
            <img :src="notification.imageUrl" alt="Preview" />
          </div>
          <div class="preview-content">
            <div class="preview-title">{{ notification.title || 'Notification Title' }}</div>
            <div class="preview-body">{{ notification.body || 'Your notification message will appear here...' }}</div>
          </div>
        </div>
      </div>

      <!-- Send Button -->
      <div class="action-section">
        <button 
          @click="sendNotification" 
          class="btn btn-primary btn-send" 
          :disabled="!canSend || sending"
        >
          <span v-if="!sending" class="material-symbols-outlined">send</span>
          <span v-else class="material-symbols-outlined rotating">sync</span>
          {{ sending ? 'Sending...' : 'Send Notification' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApiStore } from '../stores/api'
import axios from 'axios'
import { API_CONFIG } from '@/config/api'

const apiStore = useApiStore()

const showToast = ref(false)
const toastMessage = ref('')
const sending = ref(false)

const notification = ref({
  topic: 'all',
  title: '',
  body: '',
  imageUrl: ''
})

const canSend = computed(() => {
  return notification.value.title.trim() && notification.value.body.trim()
})

const showSuccessToast = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const getFullImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_CONFIG.BASE_URL}${url}`
}

const handleImageSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const imageUrl = await apiStore.uploadImage(file)
    notification.value.imageUrl = getFullImageUrl(imageUrl)
    console.log('Image uploaded:', notification.value.imageUrl)
  } catch (error) {
    console.error('Image upload failed:', error)
  }
}

const sendNotification = async () => {
  if (!canSend.value) {
    console.log('Cannot send: title or body is empty')
    return
  }

  console.log('Sending notification...', {
    topic: notification.value.topic,
    title: notification.value.title,
    body: notification.value.body,
    image_url: notification.value.imageUrl
  })

  sending.value = true
  try {
    const response = await axios.post(`${API_CONFIG.BASE_URL}/api/admin/send-notification`, {
      topic: notification.value.topic,
      title: notification.value.title,
      body: notification.value.body,
      image_url: notification.value.imageUrl
    })

    console.log('Response:', response.data)

    if (response.data.success) {
      showSuccessToast('Notification sent successfully! 🎉')
      // Reset form
      notification.value = {
        topic: 'all',
        title: '',
        body: '',
        imageUrl: ''
      }
      // Reset file input
      const fileInput = document.getElementById('notification-image')
      if (fileInput) fileInput.value = ''
    } else {
      throw new Error(response.data.message || 'Failed to send')
    }
  } catch (error) {
    console.error('Failed to send notification:', error)
    console.error('Error details:', error.response?.data)
    showSuccessToast(`Error: ${error.response?.data?.error || error.message}`)
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.notification-page {
  padding-bottom: 20px;
}

.notification-container {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .notification-container {
    grid-template-columns: 1fr 1fr;
  }
}

.notification-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.notification-card:hover {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
}

.card-content {
  padding: 24px;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 7px;
  color: #1e3a5f;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s ease;
  background: #fafafa;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-input:hover,
.form-textarea:hover {
  border-color: #2196f3;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2196f3;
  background: white;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.12), 0 3px 10px rgba(33, 150, 243, 0.15);
  transform: translateY(-1px);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
  min-height: 100px;
  line-height: 1.6;
}

.form-hint {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  line-height: 1.4;
}

.btn-upload {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 18px;
  border: 2px dashed #2196f3;
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f9ff 100%);
  color: #2196f3;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
}

.btn-upload:hover {
  background: linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%);
  border-color: #1976d2;
  border-style: solid;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
}

.btn-upload .material-symbols-outlined {
  font-size: 22px;
}

.image-preview {
  position: relative;
  margin-top: 12px;
  width: 100%;
  max-width: 250px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  box-shadow: 0 5px 15px rgba(0,0,0,0.12);
  transition: all 0.3s ease;
}

.image-preview:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.16);
  transform: translateY(-2px);
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.btn-remove-image {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.95) 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0,0,0,0.4);
}

.btn-remove-image:hover {
  background: linear-gradient(135deg, #f44336 0%, #e53935 100%);
  transform: scale(1.2);
  box-shadow: 0 5px 15px rgba(244, 67, 54, 0.5);
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-remove-image .material-symbols-outlined {
  font-size: 18px;
}

/* Preview Container */
.preview-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.preview-label {
  font-size: 14px;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 16px;
  text-align: center;
}

.preview-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border: 1px solid #e0e0e0;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
}

.preview-app-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-app-icon {
  font-size: 20px;
}

.preview-app-name {
  font-size: 13px;
  font-weight: 700;
  color: white;
}

.preview-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
}

.preview-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-content {
  padding: 16px;
}

.preview-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 8px;
  line-height: 1.4;
}

.preview-body {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

/* Action Section */
.action-section {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.btn-send {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 40px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
  transition: all 0.3s ease;
  min-width: 250px;
}

.btn-send:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}


/* Success Toast */
.toast-notification {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2e7d32 0%, #43a047 100%);
  color: white;
  padding: 16px 28px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.4);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 600;
  z-index: 10000;
  animation: slideDown 0.3s ease;
}

.toast-notification .material-symbols-outlined {
  font-size: 24px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotating 1s linear infinite;
}

.hidden {
  display: none;
}
</style>
