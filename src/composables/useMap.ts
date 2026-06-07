import { ref, shallowRef, onUnmounted } from 'vue'
import L from 'leaflet'
import type { Day } from '../types/itinerary'
import type { DayId } from '../types/itinerary'
import { DAYS, DAY_COLORS } from '../data/itinerary'

interface FitViewport {
  topInset?: number
  bottomInset?: number
}

export function useMap(mapEl: () => HTMLElement | null) {
  const map = shallowRef<L.Map | null>(null)
  const lastPts = ref<[number, number][]>([])
  const markers = shallowRef<Record<string, L.Marker>>({})
  const lines = shallowRef<L.Polyline[]>([])

  function init() {
    const el = mapEl()
    if (!el || map.value) return
    map.value = L.map(el, { zoomControl: false, attributionControl: true }).setView([33.38, 126.55], 10)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      crossOrigin: true,
      attribution: '© OpenStreetMap',
      errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAOXl5QAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
    }).addTo(map.value)
  }

  function clearLayers() {
    const m = map.value
    if (!m) return
    Object.values(markers.value).forEach(mk => m.removeLayer(mk))
    lines.value.forEach(l => m.removeLayer(l))
    markers.value = {}
    lines.value = []
  }

  function drawLine(line: L.Polyline) {
    const p = (line as any)._path as SVGPathElement | undefined
    if (!p) return
    const len = p.getTotalLength()
    p.style.transition = 'none'
    p.style.strokeDasharray = `${len} ${len}`
    p.style.strokeDashoffset = String(len)
    p.getBoundingClientRect()
    p.style.transition = 'stroke-dashoffset 1s ease'
    p.style.strokeDashoffset = '0'
    setTimeout(() => { if (p) p.style.strokeDasharray = 'none' }, 1050)
  }

  function fitPoints(pts: [number, number][], viewport?: FitViewport) {
    const m = map.value
    if (!m || !pts.length) return

    const side = 60
    const top = Math.max(side, viewport?.topInset ?? side)
    const bottom = Math.max(side, (viewport?.bottomInset ?? 0) + side)
    m.fitBounds(pts, {
      paddingTopLeft: [side, top],
      paddingBottomRight: [side, bottom],
      maxZoom: 12,
    })
  }

  function buildMap(dayId: DayId, animate: boolean, onMarkerClick: (dayId: number, idx: number) => void, viewport?: FitViewport) {
    clearLayers()
    const m = map.value
    if (!m) return

    const shown: Day[] = dayId === 'all' ? DAYS : DAYS.filter(d => d.id === dayId)
    const pts: [number, number][] = []
    const newMarkers: Record<string, L.Marker> = {}
    const newLines: L.Polyline[] = []

    shown.forEach(d => {
      const c = DAY_COLORS[d.id]
      const line = L.polyline(d.spots.map(s => [s.lat, s.lng] as [number, number]), {
        color: c, weight: 3.5, opacity: 0.9, className: 'route',
      }).addTo(m)
      newLines.push(line)
      if (animate) drawLine(line)

      d.spots.forEach((s, i) => {
        pts.push([s.lat, s.lng])
        const delay = i * 55
        const icon = L.divIcon({
          className: '',
          html: `<div class="mk" style="--c:${c};animation-delay:${delay}ms"><span>${i + 1}</span><i class="ring"></i></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        })
        const mk = L.marker([s.lat, s.lng], { icon }).addTo(m)
        const k = `${d.id}-${i}`
        ;(mk as any)._k = k
        mk.on('click', () => onMarkerClick(d.id, i))
        newMarkers[k] = mk
      })
    })

    if (animate) {
      const mapEl_ = mapEl()
      if (mapEl_) {
        mapEl_.classList.remove('anim')
        void mapEl_.offsetWidth
        mapEl_.classList.add('anim')
      }
    }

    markers.value = newMarkers
    lines.value = newLines

    if (pts.length) {
      lastPts.value = pts
      fitPoints(pts, viewport)
    }
  }

  function setActiveMarker(activeKey: string | null) {
    Object.entries(markers.value).forEach(([k, mk]) => {
      const el = mk.getElement()
      if (!el) return
      const pin = el.querySelector('.mk')
      if (!pin) return
      if (activeKey === null) {
        pin.classList.remove('active', 'dim')
      } else {
        pin.classList.toggle('active', k === activeKey)
        pin.classList.toggle('dim', k !== activeKey)
      }
    })
  }

  function panTo(lat: number, lng: number, focusY?: number) {
    const m = map.value
    if (!m) return

    if (typeof focusY !== 'number') {
      m.panTo([lat, lng], { animate: true, duration: 0.5 })
      return
    }

    const size = m.getSize()
    const desiredY = Math.max(0, Math.min(size.y, focusY))
    const targetPoint = m.project([lat, lng], m.getZoom())
    const centerPoint = targetPoint.add([0, size.y / 2 - desiredY])
    m.panTo(m.unproject(centerPoint, m.getZoom()), { animate: true, duration: 0.5 })
  }

  function recenter(viewport?: FitViewport) {
    fitPoints(lastPts.value, viewport)
  }

  function invalidateSize(viewport?: FitViewport) {
    map.value?.invalidateSize()
    fitPoints(lastPts.value, viewport)
  }

  onUnmounted(() => {
    map.value?.remove()
    map.value = null
  })

  return { init, buildMap, setActiveMarker, panTo, recenter, invalidateSize }
}
