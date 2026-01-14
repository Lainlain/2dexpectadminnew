<template>
  <div class="gifts-page">
    <div class="page-header">
      <h2>Gifts/Rewards</h2>
      <RouterLink to="/gifts/create" class="btn btn-primary">
        <span class="material-symbols-outlined">add</span>
        Add Gift
      </RouterLink>
    </div>

    <div v-if="loading" class="text-center p-3">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="card">
      <div class="card-body">
        <p class="text-error">{{ error }}</p>
      </div>
    </div>

    <div v-else-if="gifts.length === 0" class="empty-state">
      <span class="material-symbols-outlined empty-state-icon">redeem</span>
      <p class="empty-state-title">No gifts yet</p>
      <p class="empty-state-subtitle">Create your first gift</p>
    </div>

    <div v-else class="gift-list">
      <div v-for="gift in gifts" :key="gift.id" class="card">
        <div class="gift-card">
          <img 
            v-if="gift.image_link" 
            :src="getImageUrl(gift.image_link)" 
            :alt="gift.name"
            class="gift-image"
          />
          <div class="gift-content">
            <h3 class="gift-title">{{ gift.name }}</h3>
            <p class="gift-description">{{ gift.description }}</p>
            <div class="gift-meta">
              <span class="badge badge-primary">{{ gift.type }}</span>
              <span v-if="gift.points" class="badge badge-secondary">{{ gift.points }} pts</span>
            </div>
          </div>
          <div class="gift-actions">
            <RouterLink :to="`/gifts/edit/${gift.id}`" class="btn btn-icon">
              <span class="material-symbols-outlined">edit</span>
            </RouterLink>
            <button @click="deleteGiftConfirm(gift)" class="btn btn-icon btn-error">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <p class="modal-message" v-if="deleteConfirmData">
          Delete gift <strong>"{{ deleteConfirmData.name }}"</strong>?
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
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useApiStore } from '@/stores/api'
import { getImageUrl } from '@/config/api'

const apiStore = useApiStore()
const gifts = ref([])
const loading = ref(true)
const error = ref(null)
const showDeleteConfirm = ref(false)
const deleteConfirmData = ref(null)

async function loadGifts() {
  try {
    loading.value = true
    error.value = null
    gifts.value = await apiStore.getGifts()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function deleteGiftConfirm(gift) {
  deleteConfirmData.value = gift
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  showDeleteConfirm.value = false
  const gift = deleteConfirmData.value
  deleteConfirmData.value = null
  
  try {
    await apiStore.deleteGift(gift.id)
    gifts.value = gifts.value.filter(g => g.id !== gift.id)
  } catch (err) {
    alert('Failed to delete gift: ' + err.message)
  }
}

function cancelDelete() {
  showDeleteConfirm.value = false
  deleteConfirmData.value = null
}

onMounted(loadGifts)
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.gift-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gift-card {
  display: flex;
  gap: 12px;
  padding: 12px;
}

.gift-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.gift-content {
  flex: 1;
  min-width: 0;
}

.gift-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.gift-description {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gift-meta {
  display: flex;
  gap: 6px;
}

.gift-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
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
</style>
