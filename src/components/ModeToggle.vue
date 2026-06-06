<template>
  <button class="mode-toggle" :aria-label="mode === 'night' ? '切换为日间模式' : '切换为夜间模式'" @click="toggle">
    <!-- sun -->
    <svg class="ico-sun" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4.2"/>
      <path d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7L5.3 5.3"/>
    </svg>
    <!-- moon -->
    <svg class="ico-moon" viewBox="0 0 24 24">
      <path d="M21 12.8A8.5 8.5 0 1111.2 3a6.6 6.6 0 009.8 9.8z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
const { mode, toggle } = useTheme()
</script>
