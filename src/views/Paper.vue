<template>
  <div class="paper-page">
    <h2 class="mb-2">Paper/Guides</h2>

    <!-- Success Toast -->
    <transition name="toast">
      <div v-if="showToast" class="toast-notification">
        <span class="material-symbols-outlined">check_circle</span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

    <div v-if="loading" class="text-center p-3">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="card">
      <div class="card-body">
        <p class="text-error">{{ error }}</p>
      </div>
    </div>

    <div v-else>
      <div class="card mb-2">
        <div class="card-header">
          <h3 class="card-title">Add New Type</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="createType" class="d-flex gap-1">
            <input 
              v-model="newType.name" 
              type="text" 
              class="form-input" 
              placeholder="Type name (e.g., Morning, Evening)"
              required
              style="flex: 1"
            />
            <button type="submit" class="btn btn-primary" :disabled="creating">
              <span v-if="!creating" class="material-symbols-outlined">add</span>
              <span v-else class="material-symbols-outlined rotating">sync</span>
              {{ creating ? 'Adding...' : 'Add' }}
            </button>
          </form>
        </div>
      </div>

      <div v-if="types.length === 0" class="empty-state">
        <span class="material-symbols-outlined empty-state-icon">image</span>
        <p class="empty-state-title">No paper types yet</p>
        <p class="empty-state-subtitle">Add your first type above</p>
      </div>

      <div v-else class="type-list">
        <div v-for="item in types" :key="item.type.id" class="card">
          <div class="type-header">
            <h3>{{ item.type.name }}</h3>
            <div class="type-actions">
              <button @click="showTypeImages(item.type)" class="btn btn-outline btn-images">
                <span class="material-symbols-outlined">image</span>
                <span class="badge-count">{{ item.images?.length || 0 }}</span>
              </button>
              <button 
                v-if="item.images?.length > 0"
                @click="clearAllImagesConfirm(item.type, item.images)" 
                class="btn btn-icon btn-warning"
                title="Clear all images"
              >
                <span class="material-symbols-outlined">delete_sweep</span>
              </button>
              <button @click="deleteTypeConfirm(item.type)" class="btn btn-icon btn-error" title="Delete type">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>

          <div v-if="expandedType === item.type.id" class="type-content">
            <div class="image-upload-section">
              <input 
                :ref="el => fileInputRefs[item.type.id] = el"
                type="file" 
                accept="image/*"
                multiple
                @change="(e) => handleImagesSelect(e, item.type)"
                style="display: none"
              />
              <button 
                type="button" 
                class="btn btn-primary w-100 upload-btn"
                @click="fileInputRefs[item.type.id]?.click()"
                :disabled="uploadingTypes.has(item.type.id)"
              >
                <span class="material-symbols-outlined">upload</span>
                {{ uploadingTypes.has(item.type.id) ? 'Uploading...' : 'Upload Images' }}
              </button>

              <!-- Upload Progress -->
              <div v-if="uploadProgress[item.type.id]" class="upload-progress-container">
                <div class="upload-header">
                  <span class="upload-title">
                    <span class="material-symbols-outlined">cloud_upload</span>
                    Uploading {{ uploadProgress[item.type.id].total }} images
                  </span>
                  <span class="upload-status">
                    {{ uploadProgress[item.type.id].completed }} / {{ uploadProgress[item.type.id].total }}
                  </span>
                </div>

                <div class="progress-bar-container">
                  <div 
                    class="progress-bar" 
                    :style="{ width: getProgressPercentage(item.type.id) + '%' }"
                  ></div>
                </div>

                <div class="upload-items">
                  <div 
                    v-for="file in uploadProgress[item.type.id].files" 
                    :key="file.name"
                    class="upload-item"
                    :class="file.status"
                  >
                    <img 
                      v-if="file.preview" 
                      :src="file.preview" 
                      alt="Preview"
                      class="upload-preview"
                    />
                    <div class="upload-info">
                      <span class="upload-filename">{{ file.name }}</span>
                      <span class="upload-size">{{ formatFileSize(file.size) }}</span>
                    </div>
                    <span class="material-symbols-outlined upload-icon" :class="file.status">
                      {{ file.status === 'uploading' ? 'sync' : file.status === 'success' ? 'check_circle' : 'error' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="item.images?.length" class="image-grid">
              <div v-for="image in item.images" :key="image.id" class="image-item">
                <img :src="getImageUrl(image.image_url)" :alt="'Image'" />
                <button @click="deleteImageConfirm(image)" class="delete-image-btn">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>

            <div v-else-if="!uploadProgress[item.type.id]" class="empty-state">
              <p class="empty-state-subtitle">No images yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <p class="modal-message" v-if="deleteConfirmData">
          Delete <strong>{{ deleteConfirmData.images.length }}</strong> images from "{{ deleteConfirmData.type.name }}"?
        </p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn-cancel">Cancel</button>
          <button @click="confirmDelete" class="btn-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useApiStore } from '@/stores/api'
import { getImageUrl } from '@/config/api'

const apiStore = useApiStore()
const types = ref([])
const loading = ref(true)
const creating = ref(false)
const error = ref(null)
const expandedType = ref(null)
const fileInputRefs = ref({})
const uploadProgress = ref({})
const uploadingTypes = ref(new Set())
const showDeleteConfirm = ref(false)
const deleteConfirmData = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const showSuccessToast = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const newType = reactive({
  name: '',
})

async function loadTypes() {
  try {
    loading.value = true
    error.value = null
    types.value = await apiStore.getPaperTypes()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function createType() {
  creating.value = true
  try {
    await apiStore.createPaperType(newType)
    newType.name = ''
    await loadTypes()
    showSuccessToast('Type created successfully! ✅')
  } catch (err) {
    showSuccessToast('Failed to create type ❌')
  } finally {
    creating.value = false
  }
}

async function deleteTypeConfirm(type) {
  if (!confirm(`Delete type "${type.name}" and all its images?`)) return
  
  try {
    await apiStore.deletePaperType(type.id)
    types.value = types.value.filter(t => t.id !== type.id)
    showSuccessToast('Type deleted successfully! ✅')
  } catch (err) {
    showSuccessToast('Failed to delete type ❌')
  }
}

function showTypeImages(type) {
  expandedType.value = expandedType.value === type.id ? null : type.id
}

async function handleImagesSelect(event, type) {
  const files = Array.from(event.target.files)
  if (files.length === 0) return
  
  // Mark this type as uploading
  uploadingTypes.value.add(type.id)
  
  // Initialize progress tracking
  uploadProgress.value[type.id] = {
    total: files.length,
    completed: 0,
    files: files.map(file => ({
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }))
  }
  
  try {
    const imageUrls = []
    
    // Upload files one by one with progress tracking
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileProgress = uploadProgress.value[type.id].files[i]
      
      try {
        // Update status to uploading
        fileProgress.status = 'uploading'
        
        // Upload the file
        const uploadResult = await apiStore.uploadImage(file)
        const imageUrl = uploadResult.imageUrl || uploadResult.image_url
        imageUrls.push(imageUrl)
        
        // Update status to success
        fileProgress.status = 'success'
        uploadProgress.value[type.id].completed++
        
        // Clean up blob URL
        URL.revokeObjectURL(fileProgress.preview)
      } catch (err) {
        // Update status to error
        fileProgress.status = 'error'
        fileProgress.error = err.message
        console.error(`Failed to upload ${file.name}:`, err)
      }
    }
    
    // If we have successfully uploaded images, create them in the database
    if (imageUrls.length > 0) {
      const batchData = {
        type_id: type.id,
        image_urls: imageUrls
      }
      
      console.log('Sending batch create with data:', batchData)
      
      try {
        const result = await apiStore.batchCreatePaperImages(batchData)
        console.log('Batch create result:', result)
        
        // Reload types to show new images
        await loadTypes()
        
        // Success message
        showSuccessToast(`Successfully uploaded ${imageUrls.length} images! 🎉`)
        console.log(`Successfully uploaded ${imageUrls.length} images`)
      } catch (batchError) {
        console.error('Batch create error:', batchError)
        console.error('Error response:', batchError.response?.data)
        throw new Error(batchError.response?.data?.error || batchError.message)
      }
    } else {
      showSuccessToast('No images were uploaded successfully ❌')
    }
    
    // Clear progress after a delay to show completion
    setTimeout(() => {
      delete uploadProgress.value[type.id]
    }, 2000)
    
  } catch (err) {
    console.error('Failed to save images:', err)
    showSuccessToast('Failed to save images ❌')
  } finally {
    uploadingTypes.value.delete(type.id)
    event.target.value = ''
  }
}

async function deleteImageConfirm(image) {
  if (!confirm('Delete this image?')) return
  
  try {
    await apiStore.deletePaperImage(image.id)
    await loadTypes()
    showSuccessToast('Image deleted successfully! ✅')
  } catch (err) {
    showSuccessToast('Failed to delete image ❌')
  }
}

async function clearAllImagesConfirm(type, images) {
  console.log('🗑️ Clear all images clicked:', type, images)
  
  // Show custom confirmation modal
  deleteConfirmData.value = { type, images }
  showDeleteConfirm.value = true
  console.log('📱 Showing custom delete confirmation modal')
}

async function confirmDelete() {
  console.log('✅ User confirmed deletion')
  showDeleteConfirm.value = false
  
  const { type, images } = deleteConfirmData.value
  deleteConfirmData.value = null
  
  loading.value = true
  console.log(`Starting deletion of ${images.length} images...`)
  
  try {
    // Delete images one by one to track progress
    let deleted = 0
    for (const image of images) {
      try {
        await apiStore.deletePaperImage(image.id)
        deleted++
        console.log(`✅ Deleted ${deleted}/${images.length}`)
      } catch (err) {
        console.error(`❌ Failed to delete image ${image.id}:`, err)
      }
    }
    
    console.log(`✅ Successfully deleted ${deleted} out of ${images.length} images`)
    await loadTypes()
    showSuccessToast(`Deleted ${deleted} images successfully! ✅`)
  } catch (err) {
    console.error('Clear all images error:', err)
    showSuccessToast('Failed to clear images ❌')
  } finally {
    loading.value = false
  }
}

function cancelDelete() {
  console.log('❌ User cancelled deletion')
  showDeleteConfirm.value = false
  deleteConfirmData.value = null
}

function getProgressPercentage(typeId) {
  const progress = uploadProgress.value[typeId]
  if (!progress) return 0
  return Math.round((progress.completed / progress.total) * 100)
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

loadTypes()
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal Content */
.modal-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 360px;
  width: 90%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-message {
  margin: 0 0 16px 0;
  font-size: 15px;
  color: #333;
  text-align: center;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.modal-actions button {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #d32f2f;
}

.type-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.type-actions {
  display: flex;
  gap: 8px;
}

.btn-images {
  position: relative;
}

.badge-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--primary);
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 4px;
}

.type-content {
  padding: 16px;
}

.image-upload-section {
  margin-bottom: 20px;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.upload-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 71, 161, 0.3);
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Upload Progress Styles */
.upload-progress-container {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.upload-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.upload-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.upload-title .material-symbols-outlined {
  font-size: 20px;
  color: var(--primary);
}

.upload-status {
  font-weight: 600;
  color: var(--primary);
  font-size: 14px;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-light));
  border-radius: 4px;
  transition: width 0.3s ease;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}

.upload-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.upload-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
}

.upload-item.uploading {
  border-color: var(--primary);
  background: #f0f7ff;
}

.upload-item.success {
  border-color: var(--success);
  background: #f0f9f4;
}

.upload-item.error {
  border-color: var(--error);
  background: #fef2f2;
}

.upload-preview {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.upload-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.upload-filename {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload-size {
  font-size: 11px;
  color: var(--text-secondary);
}

.upload-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.upload-icon.uploading {
  color: var(--primary);
  animation: rotate 1s linear infinite;
}

.upload-icon.success {
  color: var(--success);
}

.upload-icon.error {
  color: var(--error);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Image Grid */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
  background: #f5f5f5;
}

.image-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-image-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
}

.image-item:hover .delete-image-btn {
  opacity: 1;
}

.delete-image-btn:hover {
  background: var(--error);
  transform: scale(1.1);
}

.delete-image-btn .material-symbols-outlined {
  font-size: 20px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.empty-state-icon {
  font-size: 64px;
  opacity: 0.3;
  margin-bottom: 12px;
}

.empty-state-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.empty-state-subtitle {
  font-size: 14px;
  opacity: 0.7;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--background);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background-color: rgba(186, 26, 26, 0.9);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-item:hover .delete-image-btn {
  opacity: 1;
}

.delete-image-btn .material-symbols-outlined {
  font-size: 18px;
}

.btn-images {
  position: relative;
  min-width: 50px;
  padding: 8px 12px;
}

.badge-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: var(--primary);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
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
</style>
