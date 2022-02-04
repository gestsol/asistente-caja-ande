export function debug(message: string): void {
  if (global.config.debug) {
    const time = new Date().toISOString().split('T')[1] as string
    const hour = time.split('.')[0]

    console.log(`[${hour}] - ${message}`)
  }
}
