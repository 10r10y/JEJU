import { ref, watch } from 'vue'

export type ThemeMode = 'day' | 'night'

const STORAGE_KEY = 'jeju-mode'

function readStored(): ThemeMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'night' ? 'night' : 'day'
  } catch {
    return 'day'
  }
}

const mode = ref<ThemeMode>(readStored())

function applyMode(m: ThemeMode) {
  if (m === 'night') {
    document.documentElement.setAttribute('data-mode', 'night')
  } else {
    document.documentElement.removeAttribute('data-mode')
  }
}

watch(mode, (m) => {
  document.documentElement.classList.add('mode-anim')
  applyMode(m)
  try { localStorage.setItem(STORAGE_KEY, m) } catch {}
  clearTimeout((window as any).__modeT)
  ;(window as any).__modeT = setTimeout(() => {
    document.documentElement.classList.remove('mode-anim')
  }, 460)
}, { immediate: true })

export function useTheme() {
  function toggle() {
    mode.value = mode.value === 'night' ? 'day' : 'night'
  }
  return { mode, toggle }
}
