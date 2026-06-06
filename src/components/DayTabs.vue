<template>
  <div class="tabs-wrap">
    <div class="tabs" ref="tabsEl">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :data-on="activeDayId === tab.id ? '1' : '0'"
        :data-id="tab.id"
        @click="emit('change', tab.id)"
      >
        <span v-if="tab.color" class="tdot" :style="{ background: tab.color }" />
        {{ tab.label }}
      </button>
      <div class="tab-ink" ref="inkEl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import type { DayId } from '../types/itinerary'
import { DAYS, DAY_COLORS } from '../data/itinerary'

const props = defineProps<{ activeDayId: DayId }>()
const emit = defineEmits<{ change: [id: DayId] }>()

const tabsEl = ref<HTMLElement | null>(null)
const inkEl = ref<HTMLElement | null>(null)

const tabs = computed(() => [
  { id: 'all' as DayId, label: '全部', color: null },
  ...DAYS.map(d => ({ id: d.id as DayId, label: `D${d.id}`, color: DAY_COLORS[d.id] })),
])

function moveInk() {
  const ink = inkEl.value
  const tabs_ = tabsEl.value
  if (!ink || !tabs_) return
  const active = tabs_.querySelector<HTMLElement>('.tab[data-on="1"]')
  if (!active) return
  ink.style.width = active.offsetWidth + 'px'
  ink.style.transform = `translateX(${active.offsetLeft}px)`
}

watch(() => props.activeDayId, () => nextTick(moveInk))
onMounted(() => nextTick(moveInk))
</script>
