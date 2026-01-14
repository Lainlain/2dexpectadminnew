import { defineStore } from 'pinia'
import axios from 'axios'
import { API_CONFIG, API_ENDPOINTS, getApiUrl } from '@/config/api'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
})

export const useApiStore = defineStore('api', {
  state: () => ({
    loading: false,
    error: null,
  }),

  actions: {
    async fetchVersion() {
      try {
        const response = await api.get(API_ENDPOINTS.VERSION)
        return response.data
      } catch (error) {
        console.error('Failed to fetch version:', error)
        return null
      }
    },

    // Gifts/Rewards
    async getGifts() {
      this.loading = true
      try {
        const response = await api.get(API_ENDPOINTS.ADMIN.GIFTS)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getGiftById(id) {
      try {
        const response = await api.get(API_ENDPOINTS.ADMIN.GIFT_BY_ID(id))
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async createGift(gift) {
      this.loading = true
      try {
        const response = await api.post(API_ENDPOINTS.ADMIN.GIFTS, gift)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateGift(id, gift) {
      this.loading = true
      try {
        const response = await api.put(API_ENDPOINTS.ADMIN.GIFT_BY_ID(id), gift)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteGift(id) {
      this.loading = true
      try {
        const response = await api.delete(API_ENDPOINTS.ADMIN.GIFT_BY_ID(id))
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Sliders/Banners
    async getSliders() {
      this.loading = true
      try {
        const response = await api.get(API_ENDPOINTS.ADMIN.SLIDERS)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getSliderById(id) {
      try {
        const response = await api.get(API_ENDPOINTS.ADMIN.SLIDER_BY_ID(id))
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async createSlider(slider) {
      this.loading = true
      try {
        const response = await api.post(API_ENDPOINTS.ADMIN.SLIDERS, slider)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSlider(id, slider) {
      this.loading = true
      try {
        const response = await api.put(API_ENDPOINTS.ADMIN.SLIDER_BY_ID(id), slider)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteSlider(id) {
      this.loading = true
      try {
        const response = await api.delete(API_ENDPOINTS.ADMIN.SLIDER_BY_ID(id))
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // 3D Lottery
    async getThreeD() {
      this.loading = true
      try {
        const response = await api.get(API_ENDPOINTS.GAME.THREED)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createThreeD(data) {
      this.loading = true
      try {
        const response = await api.post(API_ENDPOINTS.GAME.THREED, data)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateThreeD(data) {
      this.loading = true
      try {
        const response = await api.put(API_ENDPOINTS.GAME.THREED, data)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteThreeD(date) {
      this.loading = true
      try {
        const response = await api.delete(API_ENDPOINTS.GAME.THREED, { data: { date } })
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Paper/Guides
    async getPaperTypes() {
      this.loading = true
      try {
        const response = await api.get(API_ENDPOINTS.ADMIN.PAPER_TYPES)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createPaperType(type) {
      this.loading = true
      try {
        const response = await api.post(API_ENDPOINTS.ADMIN.PAPER_TYPES, type)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePaperType(id, type) {
      this.loading = true
      try {
        const response = await api.put(API_ENDPOINTS.ADMIN.PAPER_TYPE_BY_ID(id), type)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePaperType(id) {
      this.loading = true
      try {
        const response = await api.delete(API_ENDPOINTS.ADMIN.PAPER_TYPE_BY_ID(id))
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createPaperImage(image) {
      this.loading = true
      try {
        const response = await api.post(API_ENDPOINTS.ADMIN.PAPER_IMAGES, image)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async batchCreatePaperImages(data) {
      this.loading = true
      try {
        const response = await api.post(API_ENDPOINTS.ADMIN.PAPER_IMAGES_BATCH, data)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePaperImage(id, image) {
      this.loading = true
      try {
        const response = await api.put(API_ENDPOINTS.ADMIN.PAPER_IMAGE_BY_ID(id), image)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePaperImage(id) {
      this.loading = true
      try {
        const response = await api.delete(API_ENDPOINTS.ADMIN.PAPER_IMAGE_BY_ID(id))
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Image Upload
    async uploadImage(file) {
      this.loading = true
      try {
        const formData = new FormData()
        formData.append('image', file)
        const response = await api.post(API_ENDPOINTS.ADMIN.UPLOAD_IMAGE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteImage(filename) {
      this.loading = true
      try {
        const response = await api.delete(API_ENDPOINTS.ADMIN.DELETE_IMAGE(filename))
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
