<template>
  <div class="app">
    <!-- Map -->
    <div id="map" ref="mapEl" />

    <!-- Brand bar -->
    <div class="brandbar">
      <div class="brand">
        <div class="brand-eyebrow">Itinerary</div>
        <div class="brand-name">JEJU<span class="zh">济州岛</span></div>
        <div class="brand-meta">6.9 – 6.13 · 5天4晚 · {{ totalSpots }} 项安排</div>
      </div>
      <ModeToggle />
    </div>

    <!-- Recenter button -->
    <button
      class="recenter"
      :class="{ hide: recenterHidden }"
      :style="{ bottom: recenterBottom }"
      aria-label="重置视角"
      @click="mapApi.recenter(mapFitViewport())"
    >
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3.2"/>
        <path d="M12 2.5v3.2M12 18.3v3.2M2.5 12h3.2M18.3 12h3.2"/>
      </svg>
    </button>

    <!-- Bottom sheet -->
    <div class="sheet" :class="`sheet-${sheet.snapPoint.value}`" ref="sheetEl">
      <div class="grip" @mousedown="sheet.onDown" @touchstart.prevent="sheet.onDown" @click="onGripClick">
        <i />
      </div>

      <SheetHead :active-day-id="activeDayId" />
      <DayTabs :active-day-id="activeDayId" @change="onDayChange" />
      <StopList
        ref="stopListRef"
        :active-day-id="activeDayId"
        :active-key="activeKey"
        @select-stop="onSelectStop"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ModeToggle from './components/ModeToggle.vue'
import SheetHead from './components/SheetHead.vue'
import DayTabs from './components/DayTabs.vue'
import StopList from './components/StopList.vue'
import { useSheet } from './composables/useSheet'
import { useMap } from './composables/useMap'
import { DAYS } from './data/itinerary'
import type { DayId } from './types/itinerary'

const mapEl = ref<HTMLElement | null>(null)
const sheetEl = ref<HTMLElement | null>(null)
const stopListRef = ref<InstanceType<typeof StopList> | null>(null)

const activeDayId = ref<DayId>('all')
const activeKey = ref<string | null>(null)

const totalSpots = computed(() => DAYS.reduce((a, d) => a + d.spots.length, 0))

const sheet = useSheet(() => sheetEl.value)
const mapApi = useMap(() => mapEl.value)

const recenterHidden = computed(() => sheet.curY.value < sheet.MID() * 0.5)
// The sheet is translated down from the top, so the visible sheet height is appHeight - curY.
const recenterBottom = computed(() => {
  const appHeight = sheetEl.value?.parentElement?.clientHeight || sheetEl.value?.clientHeight || 0
  const visibleSheetHeight = Math.max(0, appHeight - sheet.curY.value)
  return `${visibleSheetHeight + 12}px`
})

function onDayChange(id: DayId) {
  activeDayId.value = id
  activeKey.value = null
  mapApi.setActiveMarker(null)
  mapApi.buildMap(id, true, onMarkerClick, mapFitViewport())
}

function onMarkerClick(dayId: number, idx: number) {
  const k = `${dayId}-${idx}`
  activeKey.value = k
  mapApi.setActiveMarker(k)
  sheet.ensureOpen()
  stopListRef.value?.scrollToKey(k)
}

function onSelectStop(dayId: number, idx: number) {
  const k = `${dayId}-${idx}`
  activeKey.value = k
  mapApi.setActiveMarker(k)
  const day = DAYS.find(d => d.id === dayId)
  if (day) {
    const focusY = Math.max(0, sheet.curY.value / 2)
    mapApi.panTo(day.spots[idx].lat, day.spots[idx].lng, focusY)
  }
}

function mapFitViewport() {
  const appHeight = sheetEl.value?.parentElement?.clientHeight || sheetEl.value?.clientHeight || 0
  const sheetTop = Math.max(0, Math.min(appHeight, sheet.curY.value))
  return {
    topInset: 116,
    bottomInset: Math.max(0, appHeight - sheetTop),
  }
}

let gripMoved = false
function onGripClick() {
  if (gripMoved) { gripMoved = false; return }
  sheet.cycleSnap()
}

onMounted(() => {
  mapApi.init()
  mapApi.buildMap(activeDayId.value, true, onMarkerClick)
  setTimeout(() => mapApi.invalidateSize(mapFitViewport()), 350)
})
</script>
