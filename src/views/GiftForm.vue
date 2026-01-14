<template>
  <div class="gift-form-page">
    <h2 class="mb-2">{{ isEdit ? 'Edit Gift' : 'Create Gift' }}</h2>

    <form @submit.prevent="handleSubmit" class="card">
      <div class="card-body">
        <div class="form-group">
          <label class="form-label">Title</label>
          <input 
            v-model="form.title" 
            type="text" 
            class="form-input" 
            placeholder="Gift title"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea 
            v-model="form.description" 
            class="form-textarea" 
            placeholder="Gift description"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Category</label>
          <select v-model="form.category" class="form-select" required>
            <option value="">Select category</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Points</label>
          <input 
            v-model.number="form.points" 
            type="number" 
            class="form-input" 
            placeholder="Points required"
            min="0"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Stock</label>
          <input 
            v-model.number="form.stock" 
            type="number" 
            class="form-input" 
            placeholder="Available stock"
            min="0"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Image</label>
          <div v-if="imagePreview || form.image_url" class="image-preview mb-1">
            <img :src="imagePreview || getImageUrl(form.image_url)" alt="Preview" />
            <div class="image-label">{{ isEdit && !imagePreview ? 'Current Image' : 'Preview' }}</div>
          </div>
          <div class="image-upload">
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*"
              @change="handleImageSelect"
              style="display: none"
            />
            <button 
              type="button" 
              class="btn btn-outline w-100"
              @click="$refs.fileInput.click()"
            >
              <span class="material-symbols-outlined">upload</span>
              {{ imageFile ? imageFile.name : (isEdit ? 'Change Image' : 'Choose Image') }}
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.back()" class="btn btn-outline">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>{{ isEdit ? 'Update' : 'Create' }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApiStore } from '@/stores/api'
import { getImageUrl } from '@/config/api'

const route = useRoute()
const router = useRouter()
const apiStore = useApiStore()

const isEdit = ref(false)
const loading = ref(false)
const imageFile = ref(null)
const imagePreview = ref(null)

const form = reactive({
  title: '',
  description: '',
  category: '',
  image_url: '',
  points: 0,
  stock: 0,
  is_active: true,
})

async function loadGift() {
  const id = route.params.id
  if (!id) return
  
  isEdit.value = true
  try {
    const gift = await apiStore.getGiftById(id)
    // Map API fields to form fields
    form.title = gift.name
    form.description = gift.description
    form.category = gift.type
    form.image_url = gift.image_link
    form.points = gift.points || 0
    form.stock = gift.stock || 0
    form.is_active = gift.is_active !== undefined ? gift.is_active : true
  } catch (err) {
    alert('Failed to load gift: ' + err.message)
    router.back()
  }
}

function handleImageSelect(event) {
  const file = event.target.files[0]
  if (!file) return
  
  imageFile.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

async function handleSubmit() {
  loading.value = true
  
  try {
    // Upload image if selected
    if (imageFile.value) {
      const uploadResult = await apiStore.uploadImage(imageFile.value)
      form.image_url = uploadResult.imageUrl || uploadResult.image_url
    }
    
    // Map form fields to backend API structure
    const giftData = {
      name: form.title,
      description: form.description,
      type: form.category,
      image_link: form.image_url,
      points: form.points || 0,
      stock: form.stock || 0,
      is_active: form.is_active !== undefined ? form.is_active : true
    }
    
    // Create or update gift
    if (isEdit.value) {
      giftData.id = parseInt(route.params.id)
      await apiStore.updateGift(route.params.id, giftData)
    } else {
      await apiStore.createGift(giftData)
    }
    
    router.push('/gifts')
  } catch (err) {
    alert('Failed to save gift: ' + err.message)
  } finally {
    loading.value = false
  }
}

onMounted(loadGift)
</script>

<style scoped>
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.form-actions button {
  flex: 1;
}

.image-preview {
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
  border: 2px solid #e0e0e0;
  padding: 8px;
  background: #f9f9f9;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 6px;
}

.image-label {
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 6px;
  font-weight: 500;
}
</style>
