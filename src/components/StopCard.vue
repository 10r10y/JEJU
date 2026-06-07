<template>
  <div class="stop" :class="{ sel: isSelected }" :style="{ '--c': color, animationDelay: animDelay + 'ms' }" :data-k="`${dayId}-${index}`" @click="emit('select')">
    <div class="rail">
      <div class="num">{{ index + 1 }}</div>
      <div v-if="!isLast" class="conn" />
    </div>
    <div class="body">
      <div class="card">
        <div class="name">{{ spot.name }}</div>
        <div class="foreign">{{ spot.en }} · {{ spot.kr }}</div>
        <div v-if="spot.note" class="card-meta">{{ spot.note }}</div>
      </div>
      <TransportRow :transport="spot.to" :color="color" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Spot } from '../types/itinerary'
import TransportRow from './TransportRow.vue'

const props = defineProps<{
  spot: Spot
  index: number
  dayId: number
  isLast: boolean
  isSelected: boolean
  color: string
  animDelay: number
}>()

const emit = defineEmits<{ select: [] }>()
</script>
