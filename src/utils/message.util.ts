import { MENU_RETURN } from '~ENTITIES/consts'

export const messageOptionInvalid = (opciones: string): string => `
Opción invalida, las opciones disponibles son:
${opciones}
${MENU_RETURN}
`

export const messageFormatter = (message: string): string => {
  // Eliminar los espacios que hay en cada salto de linea debido a la identación del código.
  const messageFormated = message
    .split('\n')
    .map((m) => m.trim())
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
