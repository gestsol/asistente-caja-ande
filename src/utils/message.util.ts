import { MENU_RETURN } from '~ENTITIES/consts'

export const messageOptionInvalid = (opciones: string): string => `
Opción invalida, las opciones disponibles son:
${opciones}
${MENU_RETURN}
`

export const messageFormatter = (message: string): string => {
  const messageFormated = message
    .split('\n')
    .map((m) => m.trim())
    .join('\n')

  return messageFormated.trim()
}
