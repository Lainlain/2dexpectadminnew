<template>
  <div class="appconfig-page">
    <h2 class="page-title">App Configuration</h2>

    <!-- Success Toast -->
    <transition name="toast">
      <div v-if="showToast" class="toast-notification">
        <span class="material-symbols-outlined">check_circle</span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
    
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading configuration...</p>
    </div>

    <div v-else class="config-container">
      <!-- Mobile Section Selector -->
      <div class="section-selector">
        <select v-model="activeTab" class="section-select">
          <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
            {{ tab.label }}
          </option>
        </select>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- App Version Tab -->
        <div v-if="activeTab === 'version'" class="tab-pane">
          <div class="section-header">
            <h3>📱 App Version Management</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Latest Version</label>
              <input 
                v-model="config.appVersion.latestVersion" 
                type="text" 
                class="form-input"
                placeholder="1.0.0"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Version Code</label>
              <input 
                v-model.number="config.appVersion.latestVersionCode" 
                type="number" 
                class="form-input"
                placeholder="1"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Minimum Version Code</label>
              <input 
                v-model.number="config.appVersion.minimumVersionCode" 
                type="number" 
                class="form-input"
                placeholder="1"
              />
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.appVersion.forceUpdate" />
                <span>Force Update</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Update Title</label>
            <input 
              v-model="config.appVersion.updateTitle" 
              type="text" 
              class="form-input"
              placeholder="Update Available"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Update Message</label>
            <textarea 
              v-model="config.appVersion.updateMessage" 
              class="form-textarea"
              placeholder="A new version is available. Please update to continue."
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Download URL</label>
            <input 
              v-model="config.appVersion.downloadUrl" 
              type="url" 
              class="form-input"
              placeholder="https://play.google.com/store/apps/details?id=com.twod.expect"
            />
            <span class="form-hint">Play Store or direct APK download link</span>
          </div>
        </div>

        <!-- Ads & Monetization Tab -->
        <div v-if="activeTab === 'ads'" class="tab-pane">
          <div class="section-header">
            <h3>💰 Ads & Monetization</h3>
          </div>

          <div class="form-group">
            <label class="form-label">Native Ad Timer (seconds)</label>
            <input 
              v-model.number="config.adConfig.nativeAdTimer" 
              type="number" 
              class="form-input"
              placeholder="30"
            />
            <span class="form-hint">Time interval for native ad refresh</span>
          </div>

          <div class="section-divider"></div>

          <h4 class="subsection-title">AdMob Ad Units</h4>
          
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Banner Ad Unit ID</label>
              <input 
                v-model="config.adUnits.banner" 
                type="text" 
                class="form-input"
                placeholder="ca-app-pub-xxxxx/xxxxx"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Interstitial Ad Unit ID</label>
              <input 
                v-model="config.adUnits.interstitial" 
                type="text" 
                class="form-input"
                placeholder="ca-app-pub-xxxxx/xxxxx"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Native Ad Unit ID</label>
              <input 
                v-model="config.adUnits.native" 
                type="text" 
                class="form-input"
                placeholder="ca-app-pub-xxxxx/xxxxx"
              />
            </div>

            <div class="form-group">
              <label class="form-label">App Open Ad Unit ID</label>
              <input 
                v-model="config.adUnits.appOpen" 
                type="text" 
                class="form-input"
                placeholder="ca-app-pub-xxxxx/xxxxx"
              />
            </div>
          </div>
        </div>

        <!-- In-App Messages Tab -->
        <div v-if="activeTab === 'messages'" class="tab-pane">
          <div class="section-header">
            <h3>💬 In-App Messages</h3>
            <button @click="addMessage" class="btn btn-sm btn-primary">
              <span class="material-symbols-outlined">add</span>
              Add Message
            </button>
          </div>

          <div v-if="config.messages.length === 0" class="empty-state-small">
            <span class="material-symbols-outlined">chat_bubble_outline</span>
            <p>No messages configured</p>
          </div>

          <div v-else class="message-list">
            <div v-for="(message, index) in config.messages" :key="index" class="message-item">
              <div class="message-header">
                <span class="badge" :class="`badge-${message.type}`">
                  {{ message.type }}
                </span>
                <button @click="confirmDeleteMessage(index)" class="btn-icon-small">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label-sm">Message ID</label>
                  <input 
                    v-model="message.id" 
                    type="text" 
                    class="form-input-sm"
                    placeholder="welcome_msg_1"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label-sm">Type</label>
                  <select v-model="message.type" class="form-select-sm">
                    <option value="info">Info</option>
                    <option value="promo">Promo</option>
                    <option value="warning">Warning</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label-sm">Title</label>
                <input 
                  v-model="message.title" 
                  type="text" 
                  class="form-input-sm"
                  placeholder="Welcome!"
                />
              </div>

              <div class="form-group">
                <label class="form-label-sm">Message</label>
                <textarea 
                  v-model="message.message" 
                  class="form-textarea-sm"
                  placeholder="Your message here..."
                  rows="3"
                ></textarea>
              </div>

              <!-- Image Upload -->
              <div class="form-group">
                <label class="form-label-sm">Image (Optional)</label>
                <input 
                  type="file" 
                  @change="handleMessageImageSelect($event, index)"
                  accept="image/*"
                  class="hidden"
                  :id="`message-image-${index}`"
                />
                <label :for="`message-image-${index}`" class="btn-upload-sm">
                  <span class="material-symbols-outlined">image</span>
                  {{ message.imageUrl ? 'Change Image' : 'Upload Image' }}
                </label>
                <div v-if="message.imageUrl" class="image-preview-sm">
                  <img :src="message.imageUrl" alt="Message image" />
                  <button @click="message.imageUrl = ''" class="btn-remove-image">
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              <!-- Action Button Fields -->
              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label-sm">Action Button Text (Optional)</label>
                  <input 
                    v-model="message.actionButtonText" 
                    type="text" 
                    class="form-input-sm"
                    placeholder="Learn More"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label-sm">Action URL (Optional)</label>
                  <input 
                    v-model="message.actionButtonUrl" 
                    type="url" 
                    class="form-input-sm"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label-sm">Start Date</label>
                  <input 
                    v-model="message.startDate" 
                    type="date" 
                    class="form-input-sm"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label-sm">End Date</label>
                  <input 
                    v-model="message.endDate" 
                    type="date" 
                    class="form-input-sm"
                  />
                </div>
              </div>

              <div class="form-checkboxes">
                <label class="checkbox-label-sm">
                  <input type="checkbox" v-model="message.showOnce" />
                  <span>Show Once</span>
                </label>
                <label class="checkbox-label-sm">
                  <input type="checkbox" v-model="message.dismissible" />
                  <span>Dismissible</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="save-section">
          <button 
            @click="saveConfig" 
            class="btn btn-primary btn-save"
            :disabled="saving"
          >
            <span v-if="!saving" class="material-symbols-outlined">save</span>
            <span v-else class="material-symbols-outlined rotating">sync</span>
            {{ saving ? 'Saving...' : 'Save Configuration' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content">
        <p class="modal-message">Are you sure you want to delete this message?</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn-cancel">Cancel</button>
          <button @click="deleteMessage" class="btn-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApiStore } from '../stores/api'
import axios from 'axios'

const apiStore = useApiStore()

const CONFIG_BASE_URL = 'http://localhost:8585'
const IMAGE_BASE_URL = 'http://localhost:4545'

const loading = ref(true)
const saving = ref(false)
const activeTab = ref('version')
const showToast = ref(false)
const toastMessage = ref('')

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
  return `${IMAGE_BASE_URL}${url}`
}

const tabs = [
  { id: 'version', label: 'App Version', icon: 'smartphone' },
  { id: 'ads', label: 'Ads & Monetization', icon: 'ads_click' },
  { id: 'messages', label: 'In-App Messages', icon: 'chat' }
]

const config = ref({
  appVersion: {
    latestVersion: '',
    latestVersionCode: 1,
    minimumVersionCode: 1,
    forceUpdate: false,
    updateTitle: '',
    updateMessage: '',
    downloadUrl: ''
  },
  adConfig: {
    nativeAdTimer: 30
  },
  adUnits: {
    banner: '',
    interstitial: '',
    native: '',
    appOpen: ''
  },
  messages: []
})

const showDeleteModal = ref(false)
const messageToDelete = ref(null)

const loadConfig = async () => {
  try {
    const response = await axios.get(`${CONFIG_BASE_URL}/api/2dexpect/config`)
    console.log('API Response:', response.data)
    
    const data = response.data

    // App Version
    const appVersion = data.app_version || {}
    config.value.appVersion = {
      latestVersion: appVersion.latest_version || '',
      latestVersionCode: appVersion.latest_version_code || 1,
      minimumVersionCode: appVersion.minimum_version_code || 1,
      forceUpdate: appVersion.force_update || false,
      updateTitle: appVersion.update_title || '',
      updateMessage: appVersion.update_message || '',
      downloadUrl: appVersion.download_url || ''
    }

    // Ad Config
    const adConfig = data.ad_config || {}
    config.value.adConfig = {
      nativeAdTimer: adConfig.native_ad_timer_seconds || 30
    }

    // Ad Units
    const adUnits = data.ad_units || {}
    config.value.adUnits = {
      banner: adUnits.banner_ad_unit || '',
      interstitial: adUnits.interstitial_ad_unit || '',
      native: adUnits.native_ad_unit || '',
      appOpen: adUnits.app_open_ad_unit || ''
    }

    // Messages - map snake_case to camelCase
    const messages = data.in_app_messages || []
    config.value.messages = messages.map(msg => ({
      id: msg.id || '',
      type: msg.type || 'info',
      title: msg.title || '',
      message: msg.message || '',
      imageUrl: msg.image_url || '',
      actionButtonText: msg.action_text || '',
      actionButtonUrl: msg.action_url || '',
      startDate: msg.start_date || '',
      endDate: msg.end_date || '',
      showOnce: msg.show_once || false,
      dismissible: msg.dismissible !== false
    }))

    console.log('Loaded config:', config.value)
  } catch (error) {
    console.error('Failed to load config:', error)
    apiStore.showError('Failed to load configuration')
  } finally {
    loading.value = false
  }
}

const saveConfig = async () => {
  saving.value = true
  try {
    // Convert camelCase to snake_case for API
    const payload = {
      app_version: {
        latest_version: config.value.appVersion.latestVersion,
        latest_version_code: config.value.appVersion.latestVersionCode,
        minimum_version_code: config.value.appVersion.minimumVersionCode,
        force_update: config.value.appVersion.forceUpdate,
        update_title: config.value.appVersion.updateTitle,
        update_message: config.value.appVersion.updateMessage,
        download_url: config.value.appVersion.downloadUrl
      },
      ad_config: {
        native_ad_timer_seconds: config.value.adConfig.nativeAdTimer
      },
      ad_units: {
        banner_ad_unit: config.value.adUnits.banner,
        interstitial_ad_unit: config.value.adUnits.interstitial,
        native_ad_unit: config.value.adUnits.native,
        app_open_ad_unit: config.value.adUnits.appOpen
      },
      in_app_messages: config.value.messages.map(msg => ({
        id: msg.id,
        type: msg.type,
        title: msg.title,
        message: msg.message,
        image_url: msg.imageUrl || '',
        action_text: msg.actionButtonText || '',
        action_url: msg.actionButtonUrl || '',
        start_date: msg.startDate,
        end_date: msg.endDate,
        show_once: msg.showOnce,
        dismissible: msg.dismissible
      }))
    }

    console.log('Saving payload:', payload)
    const response = await axios.post(`${CONFIG_BASE_URL}/api/2dexpect/config`, payload)
    console.log('Save response:', response.data)
    
    showSuccessToast('Configuration saved successfully! ✅')
  } catch (error) {
    console.error('Failed to save config:', error)
    showSuccessToast('Failed to save configuration ❌')
  } finally {
    saving.value = false
  }
}

const addMessage = () => {
  config.value.messages.push({
    id: `msg_${Date.now()}`,
    type: 'info',
    title: '',
    message: '',
    imageUrl: '',
    actionButtonText: '',
    actionButtonUrl: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    showOnce: false,
    dismissible: true
  })
}

const confirmDeleteMessage = (index) => {
  messageToDelete.value = index
  showDeleteModal.value = true
}

const deleteMessage = () => {
  if (messageToDelete.value !== null) {
    config.value.messages.splice(messageToDelete.value, 1)
    showDeleteModal.value = false
    messageToDelete.value = null
  }
}

const handleMessageImageSelect = async (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const imageUrl = await apiStore.uploadImage(file)
    config.value.messages[index].imageUrl = getFullImageUrl(imageUrl)
    console.log('Image uploaded:', config.value.messages[index].imageUrl)
  } catch (error) {
    console.error('Image upload failed:', error)
  }
}

onMounted(() => {
  loadConfig()
})
</script>

<style scoped>
.appconfig-page {
  padding-bottom: 20px;
}

.config-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Mobile Section Selector */
.section-selector {
  margin-bottom: 16px;
}

.section-select {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #2196f3;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #2196f3;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232196f3' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
  padding-right: 45px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.section-select:hover {
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.25);
  transform: translateY(-2px);
}

.section-select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.15), 0 5px 15px rgba(33, 150, 243, 0.25);
}

/* Tab Content */
.tab-content {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.tab-content:hover {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
}

.tab-pane {
  padding: 18px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h3 {
  font-size: 17px;
  font-weight: 700;
  color: #1e3a5f;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.subsection-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e3a5f;
  margin: 16px 0 12px 0;
}

.section-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 24px 0;
}

.save-section {
  margin-top: 0;
  padding: 18px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 0 0 16px 16px;
  border-top: 1px solid #f0f0f0;
}

.btn-save {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  font-size: 15px;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
  transition: all 0.3s ease;
}

.btn-save:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4);
}

/* Form Elements */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 7px;
  color: #1e3a5f;
}

.form-input,
.form-textarea,
.form-select {
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
.form-textarea:hover,
.form-select:hover {
  border-color: #2196f3;
  background: white;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 480px) {
  .form-grid-2 {
    grid-template-columns: 1fr 1fr;
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 13px 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.checkbox-label:hover {
  border-color: #2196f3;
  background: white;
  box-shadow: 0 3px 8px rgba(33, 150, 243, 0.15);
  transform: translateY(-1px);
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #2196f3;
}

.checkbox-label span {
  font-size: 14px;
  font-weight: 600;
  color: #1e3a5f;
}

.form-hint {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  line-height: 1.4;
}

/* Message List */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.message-item {
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  padding: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.message-item:hover {
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  transform: translateY(-2px);
  border-color: #2196f3;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.badge {
  padding: 7px 16px;
  border-radius: 18px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
}

.badge-info {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
  border-color: #90caf9;
}

.badge-promo {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  color: #7b1fa2;
  border-color: #ce93d8;
}

.badge-warning {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #f57c00;
  border-color: #ffcc80;
}

.btn-icon-small {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border: 1px solid #ef9a9a;
  cursor: pointer;
  padding: 9px;
  color: #f44336;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(244, 67, 54, 0.2);
}

.btn-icon-small:hover {
  background: linear-gradient(135deg, #f44336 0%, #e53935 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(244, 67, 54, 0.4);
  border-color: #f44336;
}

.btn-icon-small .material-symbols-outlined {
  font-size: 20px;
}

/* Small Form Elements */
.form-label-sm {
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #1e3a5f;
}

.form-input-sm,
.form-select-sm,
.form-textarea-sm {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  transition: all 0.3s ease;
  background: #fafafa;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-input-sm:hover,
.form-select-sm:hover,
.form-textarea-sm:hover {
  border-color: #2196f3;
  background: white;
}

.form-input-sm:focus,
.form-select-sm:focus,
.form-textarea-sm:focus {
  outline: none;
  border-color: #2196f3;
  background: white;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.12), 0 2px 8px rgba(33, 150, 243, 0.15);
  transform: translateY(-1px);
}

.form-textarea-sm {
  resize: vertical;
  font-family: inherit;
  min-height: 90px;
  line-height: 1.6;
}

.form-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.checkbox-label-sm {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 9px 13px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.checkbox-label-sm:hover {
  border-color: #2196f3;
  background: white;
  box-shadow: 0 2px 6px rgba(33, 150, 243, 0.15);
  transform: translateY(-1px);
}

.checkbox-label-sm input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #2196f3;
}

.empty-state-small {
  text-align: center;
  padding: 50px 20px;
  color: #999;
  font-size: 14px;
}

.empty-state-small .material-symbols-outlined {
  font-size: 64px;
  opacity: 0.3;
  margin-bottom: 14px;
}

/* Image Upload */
.btn-upload-sm {
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

.btn-upload-sm:hover {
  background: linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%);
  border-color: #1976d2;
  border-style: solid;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
}

.btn-upload-sm .material-symbols-outlined {
  font-size: 22px;
}

.image-preview-sm {
  position: relative;
  margin-top: 12px;
  width: 100%;
  max-width: 220px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  box-shadow: 0 5px 15px rgba(0,0,0,0.12);
  transition: all 0.3s ease;
}

.image-preview-sm:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.16);
  transform: translateY(-2px);
}

.image-preview-sm img {
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.35);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-message {
  margin: 0 0 26px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e3a5f;
  text-align: center;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-actions button {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-cancel {
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  color: #555;
  border: 1px solid #d0d0d0;
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #e0e0e0 0%, #d5d5d5 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
}

.btn-delete {
  background: linear-gradient(135deg, #f44336 0%, #e53935 100%);
  color: white;
  border: 1px solid #d32f2f;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #e53935 0%, #d32f2f 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 67, 54, 0.4);
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
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
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
    transform: translate(-50%, -20px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translate(-50%, -20px);
  opacity: 0;
}

.toast-leave-to {
  transform: translate(-50%, -20px);
  opacity: 0;
}

/* Rotating Icon Animation */
.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Adjustments */
@media (min-width: 768px) {
  .tab-pane {
    padding: 26px;
  }
  
  .section-header h3 {
    font-size: 19px;
  }
  
  .save-section {
    padding: 22px 26px;
  }
  
  .btn-save {
    max-width: 450px;
    margin: 0 auto;
  }
  
  .message-item {
    padding: 20px;
  }
  
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }
}

@media (min-width: 1024px) {
  .config-container {
    max-width: 1000px;
  }
  
  .tab-pane {
    padding: 30px;
  }
}

.hidden {
  display: none;
}
</style>
