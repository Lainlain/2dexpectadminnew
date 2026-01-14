<template>
  <div style="padding: 20px; background: white;">
    <h1 style="color: red; font-size: 32px;">TEST PAGE - If you see this, Vue is working!</h1>
    <p>Current route: {{ $route.path }}</p>
    <p>Time: {{ new Date().toLocaleString() }}</p>
  </div>
</template>

<script setup>
</script>
