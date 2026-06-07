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
  let resizeObserver: ResizeObserver | null = null

  function measure() {
    const el = sheetEl()
    if (!el) return
    H = el.parentElement?.clientHeight || el.clientHeight
    FULL = 0
    MID = Math.round(H * 0.46)
    PEEK = H - 176
    updateListViewport()
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
    updateListViewport()
  }

  function updateListViewport() {
    const el = sheetEl()
    if (!el || !H) return

    const list = el.querySelector<HTMLElement>('.list')
    if (!list) return

    const fixedHeight = Array.from(el.children).reduce((total, child) => {
      return child === list ? total : total + (child as HTMLElement).offsetHeight
    }, 0)

    const visibleHeight = Math.max(0, H - curY.value)
    const listHeight = Math.max(0, visibleHeight - fixedHeight)
    el.style.setProperty('--sheet-list-height', `${listHeight}px`)
  }

  function updateSnapPoint() {
    if (curY.value <= FULL + 10) snapPoint.value = 'full'
    else if (curY.value >= PEEK - 10) snapPoint.value = 'peek'
    else snapPoint.value = 'mid'
  }

  function snapTo(y: number) {
    const el = sheetEl()
    if (!el) return
    el.style.transition = 'transform .44s cubic-bezier(.32,.72,0,1), border-radius .24s ease'
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

  function onMove(e: MouseEvent | TouchEvent) {
    if (!dragging) return
    if (e.cancelable) e.preventDefault()
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY
    if (Math.abs(y - startY) > 3) moved = true
    setY(startT + (y - startY))
  }

  function onDown(e: MouseEvent | TouchEvent) {
    dragging = true
    moved = false
    startY = 'touches' in e ? e.touches[0].clientY : e.clientY
    startT = curY.value
    const el = sheetEl()
    if (el) el.style.transition = 'none'
    e.preventDefault()
    // Attach move listeners only while dragging so list scrolling stays responsive.
    if ('touches' in e) {
      window.addEventListener('touchmove', onMove, { passive: false })
    } else {
      window.addEventListener('mousemove', onMove)
    }
  }

  function onUp() {
    if (!dragging) return
    dragging = false
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('mousemove', onMove)
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
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    window.addEventListener('resize', onResize)

    const el = sheetEl()
    if (el && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(updateListViewport)
      Array.from(el.children).forEach(child => resizeObserver?.observe(child))
    }

    setTimeout(init, 300)
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
    window.removeEventListener('touchend', onUp)
    window.removeEventListener('resize', onResize)
  })

  return { curY, snapPoint, onDown, onUp, onMove, cycleSnap, ensureOpen, snapTo, measureAndInit: init, FULL: () => FULL, MID: () => MID, PEEK: () => PEEK }
}
