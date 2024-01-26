import { getConfig } from '~UTILS/config.util'

export function botDebug(title: string, message: string, payload?: object | Array<object>): void {
  if (getConfig().debug || 1==1) {
    const time = new Date().toISOString().split('T')[1] as string
    const hour = time.split('.')[0]

    console.log(`[${hour}] | ${prepareTitle(title)} | ${message}`)
    if (payload) console.table(payload)
  }
}

function prepareTitle(title: string): string {
  const sizeTitle = 9

  if (title.length > sizeTitle) {
    throw new Error(`The size of the title of the debug message must be less than ${sizeTitle + 1}`)
  } else {
    const count = sizeTitle - title.length

    for (let i = 0; i < count; i++) {
      title += ' '
    }
  }

  return title
}
