<template>
  <div v-if="transport" class="tp" :style="{ '--c': color }">
    <div
      class="tp-row"
      :class="{ tappable: hasDetail, open: isOpen }"
      @click.stop="toggle"
    >
      <div class="t-ico">
        <svg viewBox="0 0 24 24" v-html="ICONS[transport.m] || ICONS.car" />
      </div>
      <div class="t-label">{{ transport.label }}</div>
      <svg v-if="hasDetail" class="t-chev" viewBox="0 0 24 24">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </div>
    <div v-if="hasDetail" class="t-detail" :style="{ maxHeight: isOpen ? detailHeight + 'px' : '0' }">
      <div class="t-detail-inner" ref="detailInnerEl">
        <div v-for="([k, v], idx) in transport.detail!.rows" :key="idx" class="t-line">
          <span class="k">{{ k }}</span>
          <span class="v">{{ v }}</span>
        </div>
        <div v-if="transport.detail!.tip" class="t-tip">{{ transport.detail!.tip }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Transport } from '../types/itinerary'

const props = defineProps<{ transport?: Transport; color: string }>()

const ICONS: Record<string, string> = {
  bus: '<path d="M4 5h16v9H4zM4 14v3M20 14v3M7 17v1M17 17v1M4 9h16"/>',
  car: '<path d="M3 11l2-5h14l2 5M3 11h18v5H3zM6 16v2M18 16v2M6 13h.01M18 13h.01"/>',
  boat: '<path d="M3 14h18l-2 5H5zM12 3v11M6 9l6-3 6 3"/>',
  scooter: '<path d="M5 17a2 2 0 100-4 2 2 0 000 4zM18 17a2 2 0 100-4 2 2 0 000 4zM7 15h8l3-6h-3M11 9l-1 6"/>',
  plane: '<path d="M21 16l-8-4V5a1 1 0 00-2 0v7l-8 4v2l8-2 0 3-2 1v1l3-1 3 1v-1l-2-1 0-3z"/>',
  walk: '<path d="M13 5a2 2 0 100-4 2 2 0 000 4zM10 22l2-7M16 22l-3-7-3-3 1-5M7 12l3-4 4 2 3 4"/>',
}

const isOpen = ref(false)
const detailInnerEl = ref<HTMLElement | null>(null)
const detailHeight = ref(0)

const hasDetail = computed(() =>
  !!(props.transport?.detail?.rows?.length)
)

function toggle() {
  if (!hasDetail.value) return
  isOpen.value = !isOpen.value
  if (isOpen.value && detailInnerEl.value) {
    detailHeight.value = detailInnerEl.value.scrollHeight + 6
  }
}
</script>
