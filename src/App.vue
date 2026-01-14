<template>
  <div id="app">
    <RouterView v-slot="{ Component, route }">
      <component :is="Component" v-if="Component" />
      <div v-else class="loading-fallback">
        <p>Loading...</p>
      </div>
    </RouterView>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 18px;
  color: #666;
}
</style>
