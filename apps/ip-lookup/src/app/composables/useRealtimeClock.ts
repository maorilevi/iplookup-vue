import { ref, onMounted, onUnmounted, watch } from 'vue'

/**
 * useRealtimeClock
 * Tracks and updates the local time for a given timezone in real-time.
 *
 * @param timezone - IANA timezone string (e.g. "Europe/London" or "America/New_York")
 * @returns A reactive string containing the formatted time (HH:mm:ss)
 */
export function useRealtimeClock(timezone: string) {
  const time = ref<string>('')       // current time as HH:mm:ss
  let interval: number | undefined   // timer reference

  // helper function: get time for timezone
  const updateTime = () => {
    try {
      const now = new Date()
      const formatted = now.toLocaleTimeString('en-GB', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      time.value = formatted
    } catch {
      time.value = '--:--:--'
    }
  }

  onMounted(() => {
    updateTime()
    interval = window.setInterval(updateTime, 1000) // update every second
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  // If timezone changes, restart the timer
  watch(
    () => timezone,
    () => {
      updateTime()
    },
    { immediate: true }
  )

  return { time }
}
