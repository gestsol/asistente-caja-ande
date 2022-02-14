export function botDebug(title: string, message: string | object): void {
  if (global.config.debug) {
    const time = new Date().toISOString().split('T')[1] as string
    const hour = time.split('.')[0]
    const isPayload = typeof message === 'object'

    console.log(`[${hour}] | ${prepareTitle(title)} | ${isPayload ? '' : message}`)
    if (isPayload) console.log(message)
  }
}

function prepareTitle(title: string): string {
  const sizeTitle = 8

  if (title.length > sizeTitle) {
    throw new Error('The size of the title of the debug message must be less than 9')
  } else {
    const count = sizeTitle - title.length

    for (let i = 0; i < count; i++) {
      title += ' '
    }
  }

  return title
}
