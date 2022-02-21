import { MENU_HOME } from '~ENTITIES/consts'

export const messageOptionInvalid = (options?: string): string => {
  if (options) {
    return `
    ❌ Opción invalida, las opciones disponibles son:
    ${options}
    ${MENU_HOME}
    `
  } else {
    return `
    ❌ Opción invalida, intente de nuevo.
    ${MENU_HOME}
    `
  }
}

export const messageFormatter = (message: string): string => {
  // Eliminar los espacios que hay en cada salto de linea debido a la identación del código.
  const messageFormated = message
    .split('\n')
    .map(m => m.trim())
    .join('\n')

  return messageFormated.trim()
}

export const messageSanitize = (message: string): string => {
  // TODO: Analizar la estructura del mensaje y detertar si es numero o texto
  // para depurar el mensaje adecuadamente
  const letters = message.split('')
  const firshLetterUpper = letters.shift()!.toUpperCase()
  const messageSanitized = firshLetterUpper + letters.join('')

  return messageSanitized.trim()
}

export const convertArrayInOptions = <T>(array: Array<T>, template: (item: T, i: number) => string): string => {
  const options = array.map((item, i) => template(item, i)).join('')

  return options
}
