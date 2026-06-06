import { ref, onMounted, onUnmounted } from 'vue'

export type SnapPoint = 'full' | 'mid' | 'peek'

export function useSheet(sheetEl: () => HTMLElement | null) {
  const curY = ref(0)
  const snapPoint = ref<SnapPoint>('mid')

  let H = 0, FULL = 0, MID = 0, PEEK = 0
  let dragging = false
  let moved = false
  let startY = 0
  let startT = 0

  function measure() {
    const el = sheetEl()
    if (!el) return
    H = el.clientHeight
    FULL = 0
    MID = Math.round(H * 0.46)
    PEEK = H - 176
  }

  function snaps() { return [FULL, MID, PEEK] }

  function nearest(y: number) {
    return snaps().reduce((a, b) => Math.abs(b - y) < Math.abs(a - y) ? b : a)
  }

  function setY(y: number) {
    const el = sheetEl()
    if (!el) return
    curY.value = Math.max(FULL, Math.min(PEEK, y))
    el.style.transform = `translateY(${curY.value}px)`
    updateSnapPoint()
  }

  function updateSnapPoint() {
    if (curY.value <= FULL + 10) snapPoint.value = 'full'
    else if (curY.value >= PEEK - 10) snapPoint.value = 'peek'
    else snapPoint.value = 'mid'
  }

  function snapTo(y: number) {
    const el = sheetEl()
    if (!el) return
    el.style.transition = 'transform .44s cubic-bezier(.32,.72,0,1)'
    setY(y)
  }

  function ensureOpen() {
    if (curY.value > MID) snapTo(MID)
  }

  function cycleSnap() {
    const s = snaps()
    const nearest_ = nearest(curY.value)
    const idx = s.indexOf(nearest_)
    snapTo(s[(idx - 1 + s.length) % s.length])
  }

  function onDown(e: MouseEvent | TouchEvent) {
    dragging = true
    moved = false
    startY = 'touches' in e ? e.touches[0].clientY : e.clientY
    startT = curY.value
    const el = sheetEl()
    if (el) el.style.transition = 'none'
    e.preventDefault()
  }

  function onMove(e: MouseEvent | TouchEvent) {
    if (!dragging) return
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY
    if (Math.abs(y - startY) > 3) moved = true
    setY(startT + (y - startY))
  }

  function onUp() {
    if (!dragging) return
    dragging = false
    if (moved) snapTo(nearest(curY.value))
  }

  function init() {
    measure()
    setY(MID)
  }

  function onResize() {
    const was = nearest(curY.value)
    measure()
    setY(nearest(was))
  }

  onMounted(() => {
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    window.addEventListener('resize', onResize)
    setTimeout(init, 300)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('mouseup', onUp)
    window.removeEventListener('touchend', onUp)
    window.removeEventListener('resize', onResize)
  })

  return { curY, snapPoint, onDown, onUp, onMove, cycleSnap, ensureOpen, snapTo, measureAndInit: init, FULL: () => FULL, MID: () => MID, PEEK: () => PEEK }
}
