// src/content.ts
// Global state persisted across SPA navigations
;(function () {
  // Expose on window so re-injections reuse the same state
  const w = window as typeof window & { __ytFocusOn?: boolean }
  if (typeof w.__ytFocusOn === 'undefined') w.__ytFocusOn = true

  const SELECTORS: string[] = [
    '#related', // sidebar (up next)
    '#comments',
    '#below', // comments section
    'ytd-merch-shelf-renderer', // merch
    'ytd-reel-shelf-renderer', // shorts shelf
    'ytd-watch-next-secondary-results-renderer', // next up list
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-mini-guide-renderer' // home/shorts shelves
  ]
  // Intentionally NOT including channel elements:
  // - '#owner', 'ytd-video-owner-renderer', 'ytd-channel-name'

  function applyFocus() {
    SELECTORS.forEach((sel) => {
      document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
        el.style.display = w.__ytFocusOn ? 'none' : ''
      })
    })
  }

  function ensureToggle() {
    let btn = document.getElementById('focus-btn') as HTMLButtonElement | null
    if (!btn) {
      btn = document.createElement('button')
      btn.id = 'focus-btn'
      btn.style.position = 'fixed'
      btn.style.top = '80px'
      btn.style.right = '20px'
      btn.style.zIndex = '10000'
      btn.style.padding = '8px 12px'
      btn.style.background = '#ff0000'
      btn.style.color = 'white'
      btn.style.border = 'none'
      btn.style.borderRadius = '8px'
      btn.style.cursor = 'pointer'
      document.body.appendChild(btn)

      btn.addEventListener('click', () => {
        w.__ytFocusOn = !w.__ytFocusOn
        renderBtn()
        applyFocus()
      })
    }
    renderBtn()
  }

  function renderBtn() {
    const btn = document.getElementById('focus-btn') as HTMLButtonElement | null
    if (btn) btn.textContent = w.__ytFocusOn ? '🎯 Focus ON' : '🚫 Focus OFF'
  }

  // Debounced observer to avoid fighting the toggle
  let rafId: number | null = null
  const observer = new MutationObserver(() => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      ensureToggle()
      applyFocus()
    })
  })

  function start() {
    ensureToggle()
    applyFocus()

    // Observe SPA updates
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true })
    }

    // Listen to YT's navigation events if available
    window.addEventListener('yt-navigate-finish', () => {
      applyFocus()
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }
})()
