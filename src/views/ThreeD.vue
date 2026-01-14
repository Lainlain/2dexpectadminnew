<template>
  <div class="threed-page">
    <h2 class="mb-2">3D Lottery Results</h2>

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
          <h3 class="card-title">Add New Result</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="createResult" class="d-flex flex-column gap-1">
            <input 
              v-model="newResult.date" 
              type="date" 
              class="form-input" 
              required
            />
            <input 
              v-model="newResult.result" 
              type="text" 
              class="form-input" 
              placeholder="Result (e.g., 123)"
              pattern="[0-9]{3}"
              maxlength="3"
              required
            />
            <button type="submit" class="btn btn-primary" :disabled="creating">
              <span v-if="creating" class="spinner"></span>
              <span v-else>Add Result</span>
            </button>
          </form>
        </div>
      </div>

      <div v-if="results.length === 0" class="empty-state">
        <span class="material-symbols-outlined empty-state-icon">casino</span>
        <p class="empty-state-title">No 3D results yet</p>
        <p class="empty-state-subtitle">Add your first result above</p>
      </div>

      <div v-else class="result-list">
        <div v-for="result in results" :key="result.date" class="card">
          <div class="result-card">
            <div class="result-content">
              <h3 class="result-number">{{ result.result }}</h3>
              <p class="result-date">{{ formatDate(result.date) }}</p>
            </div>
            <button @click="deleteResultConfirm(result)" class="btn btn-icon btn-error">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useApiStore } from '@/stores/api'

const apiStore = useApiStore()
const results = ref([])
const loading = ref(true)
const creating = ref(false)
const error = ref(null)

const newResult = reactive({
  date: new Date().toISOString().split('T')[0],
  result: '',
})

async function loadResults() {
  try {
    loading.value = true
    error.value = null
    results.value = await apiStore.getThreeD()
    results.value.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function createResult() {
  creating.value = true
  try {
    await apiStore.createThreeD(newResult)
    newResult.result = ''
    await loadResults()
  } catch (err) {
    alert('Failed to create result: ' + err.message)
  } finally {
    creating.value = false
  }
}

async function deleteResultConfirm(result) {
  if (!confirm(`Delete result for ${formatDate(result.date)}?`)) return
  
  try {
    await apiStore.deleteThreeD(result.date)
    results.value = results.value.filter(r => r.date !== result.date)
  } catch (err) {
    alert('Failed to delete result: ' + err.message)
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(loadResults)
</script>

<style scoped>
.result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

.result-content {
  flex: 1;
}

.result-number {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 4px;
  font-family: 'Inter', monospace;
}

.result-date {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}
</style>
