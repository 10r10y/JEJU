<template>
  <div class="sheet-head" id="head" :style="headStyle">
    <!-- All days -->
    <template v-if="activeDayId === 'all'">
      <div class="sh-num">
        <small>ALL</small>{{ totalDays }}<span style="font-size:18px;color:var(--muted)">天</span>
      </div>
      <div class="sh-text">
        <div class="sh-title">完整行程</div>
        <div class="sh-meta">6.9 – 6.13 · {{ totalDays }} 天行程 · 共 {{ totalSpots }} 项安排</div>
      </div>
    </template>
    <!-- Single day -->
    <template v-else>
      <div class="sh-num">
        <small>DAY</small>{{ activeDay!.id }}
      </div>
      <div class="sh-text">
        <div class="sh-title">
          <span class="sh-dot" :style="{ background: dayColor }" />
          {{ activeDay!.title }}
        </div>
        <div class="sh-meta">{{ activeDay!.date }} · {{ activeDay!.note }}</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DayId } from '../types/itinerary'
import { DAYS, DAY_COLORS } from '../data/itinerary'

const props = defineProps<{ activeDayId: DayId }>()

const activeDay = computed(() =>
  props.activeDayId !== 'all' ? DAYS.find(d => d.id === props.activeDayId) : null
)
const dayColor = computed(() =>
  props.activeDayId !== 'all' ? DAY_COLORS[props.activeDayId as number] : 'var(--ink)'
)
const totalDays = computed(() => DAYS.length)
const totalSpots = computed(() => DAYS.reduce((a, d) => a + d.spots.length, 0))

const headStyle = computed(() => ({
  '--accent': dayColor.value,
}))
</script>
