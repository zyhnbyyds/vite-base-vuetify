export function useTimeZone() {
  return {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
}
