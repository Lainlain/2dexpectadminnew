<template>
  <div class="slider-form-page">
    <h2 class="mb-2">{{ isEdit ? 'Edit Banner' : 'Create Banner' }}</h2>

    <form @submit.prevent="handleSubmit" class="card">
      <div class="card-body">
        <div class="form-group">
          <label class="form-label">Title (Optional)</label>
          <input 
            v-model="form.title" 
            type="text" 
            class="form-input" 
            placeholder="Banner title"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Description (Optional)</label>
          <textarea 
            v-model="form.description" 
            class="form-textarea" 
            placeholder="Banner description"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Order</label>
          <input 
            v-model.number="form.order" 
            type="number" 
            class="form-input" 
            placeholder="0"
            min="0"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Active</label>
          <select v-model="form.active" class="form-select">
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Image *</label>
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
              {{ imageFile ? imageFile.name : 'Choose Image' }}
            </button>
            <div v-if="imagePreview || form.image_url" class="image-preview mt-1">
              <img :src="imagePreview || getImageUrl(form.image_url)" alt="Preview" />
            </div>
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
  order: 0,
  active: true,
  image_url: '',
})

async function loadSlider() {
  const id = route.params.id
  if (!id) return
  
  isEdit.value = true
  try {
    const slider = await apiStore.getSliderById(id)
    Object.assign(form, slider)
  } catch (err) {
    alert('Failed to load banner: ' + err.message)
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
    
    // Require image_url
    if (!form.image_url) {
      alert('Please select an image')
      return
    }
    
    // Create or update slider
    if (isEdit.value) {
      await apiStore.updateSlider(route.params.id, form)
    } else {
      await apiStore.createSlider(form)
    }
    
    router.push('/sliders')
  } catch (err) {
    alert('Failed to save banner: ' + err.message)
  } finally {
    loading.value = false
  }
}

onMounted(loadSlider)
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
}

.image-preview img {
  width: 100%;
  height: auto;
}
</style>
