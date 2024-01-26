import { AxiosResponseHeaders } from 'axios'
import { isNumber } from '~UTILS/validation.util'
import { MENU_HOME } from '~ENTITIES/consts'

export const messageOptionInvalid = (options?: string): string => {
  return options
    ? `❌ Opción invalida, las opciones disponibles son:\n${options}`
    : '❌ Opción invalida, intente de nuevo.'
}

export const messageMenuHome = (response: string): string => {
  // Si la respuesta tiene el símbolo "_" al final entonces no se agrega el menú
  if (response.at(-1) === '_') return response.substring(0, response.length - 1)

  // Si la respuesta contiene un salto de linea "\n" al final entonces se elimina
  if (response.at(-1) === '\n') response = response.substring(0, response.length - 1)

  // Agregar menu al final de la respuesta
  return `${response}\n\n${MENU_HOME}`
}

export const messageFormatter = (message: string): string => {
  // Eliminar los espacios que hay en cada salto de linea debido a la identación del código.
  const messageFormated = message
    .split('\n')
    .map(m => m.trim())
    .join('\n')

  return messageFormated.trim()
}

export const convertMessageInUppercase = (message: string): string => {
  const processedMessage = message.trim().toLowerCase()

  if (isNumber(processedMessage)) return processedMessage
  else {
    let words = processedMessage.split(' ')
    words = words.map(word => word[0].toUpperCase() + word.substring(1))

    return words.join(' ')
  }
}

export const convertArrayInMessage = <T>(array: Array<T>, template: (item: T, i: number) => string): string => {
  const options = array.map((item, i) => template(item, i)).join('')

  return options
}

export const convertMessageInArray = (message: string): Array<string> => message.split(' ').filter(m => m.length)

export const convertMessageInFullname = (message: string): string => {
  const [name, _, lastname] = message.split(' ')
  return convertMessageInUppercase(`${name} ${lastname}`)
}

export const convertPhoneInLocal = (phone: string): string => {
  phone = phone.replace('+', '')
  return phone.replace('+595', '0')
}

export const convertInGuarani = (message: string | number): string => {
  const amount = Number(message)

  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG'
  }).format(amount)
}

export const getNameFromHeaders = (headers: AxiosResponseHeaders): string | null => {
  // Se obtiene el nombre del archivo por medio del header: "content-disposition",
  // que tiene el siguiente formato: "attachment; filename=<FILE_NAME>.<EXTENSION>"
  const disposition = headers['content-disposition']
  return disposition ? disposition.split('=')[1].split('.')[0] : null
}
