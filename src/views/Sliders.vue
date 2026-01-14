<template>
  <div class="sliders-page">
    <div class="page-header">
      <h2>Banners/Sliders</h2>
      <RouterLink to="/sliders/create" class="btn btn-primary">
        <span class="material-symbols-outlined">add</span>
        Add Banner
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

    <div v-else-if="sliders.length === 0" class="empty-state">
      <span class="material-symbols-outlined empty-state-icon">view_carousel</span>
      <p class="empty-state-title">No banners yet</p>
      <p class="empty-state-subtitle">Create your first banner</p>
    </div>

    <div v-else class="slider-list">
      <div v-for="slider in sliders" :key="slider.id" class="card">
        <div class="slider-card">
          <img 
            v-if="slider.image_link" 
            :src="getImageUrl(slider.image_link)" 
            :alt="slider.title || 'Banner'"
            class="slider-image"
          />
          <div class="slider-content">
            <h3 class="slider-title">{{ slider.title || 'Banner' }}</h3>
            <p v-if="slider.description" class="slider-description">{{ slider.description }}</p>
            <div class="slider-meta">
              <span class="badge" :class="slider.active ? 'badge-success' : 'badge-error'">
                {{ slider.active ? 'Active' : 'Inactive' }}
              </span>
              <span class="badge badge-primary">Order: {{ slider.order || 0 }}</span>
            </div>
          </div>
          <div class="slider-actions">
            <RouterLink :to="`/sliders/edit/${slider.id}`" class="btn btn-icon">
              <span class="material-symbols-outlined">edit</span>
            </RouterLink>
            <button @click="deleteSliderConfirm(slider)" class="btn btn-icon btn-error">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
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
const sliders = ref([])
const loading = ref(true)
const error = ref(null)

async function loadSliders() {
  try {
    loading.value = true
    error.value = null
    sliders.value = await apiStore.getSliders()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function deleteSliderConfirm(slider) {
  if (!confirm(`Delete banner "${slider.title || 'this banner'}"?`)) return
  
  try {
    await apiStore.deleteSlider(slider.id)
    sliders.value = sliders.value.filter(s => s.id !== slider.id)
  } catch (err) {
    alert('Failed to delete banner: ' + err.message)
  }
}

onMounted(loadSliders)
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.slider-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slider-card {
  display: flex;
  gap: 12px;
  padding: 12px;
}

.slider-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.slider-content {
  flex: 1;
  min-width: 0;
}

.slider-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.slider-description {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slider-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.slider-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
