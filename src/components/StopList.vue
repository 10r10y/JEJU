<template>
  <div class="list" ref="listEl">
    <template v-for="d in shownDays" :key="d.id">
      <div v-if="activeDayId === 'all'" class="group-label" :style="{ color: DAY_COLORS[d.id] }">
        <span class="gl-dot" :style="{ background: DAY_COLORS[d.id] }" />
        DAY {{ d.id }} · {{ d.date }} {{ d.title }}
        <span class="gl-line" />
      </div>
      <StopCard
        v-for="(spot, i) in d.spots"
        :key="`${d.id}-${i}`"
        :spot="spot"
        :index="i"
        :day-id="d.id"
        :is-last="i === d.spots.length - 1"
        :is-selected="activeKey === `${d.id}-${i}`"
        :color="DAY_COLORS[d.id]"
        :anim-delay="animDelay(d.id, i)"
        @select="emit('selectStop', d.id, i)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DayId } from '../types/itinerary'
import { DAYS, DAY_COLORS } from '../data/itinerary'
import StopCard from './StopCard.vue'

const props = defineProps<{
  activeDayId: DayId
  activeKey: string | null
}>()

const emit = defineEmits<{ selectStop: [dayId: number, idx: number] }>()

const listEl = ref<HTMLElement | null>(null)

const shownDays = computed(() =>
  props.activeDayId === 'all' ? DAYS : DAYS.filter(d => d.id === props.activeDayId)
)

function animDelay(dayId: number, spotIdx: number): number {
  if (props.activeDayId !== 'all') return spotIdx * 42
  let n = 0
  for (const d of DAYS) {
    if (d.id === dayId) { n += spotIdx; break }
    n += d.spots.length
  }
  return Math.min(n, 14) * 42
}

function scrollToKey(key: string) {
  if (!listEl.value) return
  const stopEl = listEl.value.querySelector<HTMLElement>(`[data-k="${key}"]`)
  if (stopEl) {
    setTimeout(() => {
      listEl.value?.scrollTo({ top: stopEl.offsetTop - 18, behavior: 'smooth' })
    }, 80)
  }
}

defineExpose({ scrollToKey, listEl })
</script>
