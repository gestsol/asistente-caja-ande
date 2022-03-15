import { AxiosResponseHeaders } from 'axios'
import { MENU_HOME } from '~ENTITIES/consts'
import { isNumber } from '~UTILS/validation.util'

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

export const convertMessageInUppercase = (message: string): string => {
  const processedMessage = message.trim().toLowerCase()

  if (isNumber(processedMessage)) return processedMessage
  else {
    let words = processedMessage.split(' ')

    words = words.map(word => {
      let letters = word.split('')
      letters = letters.map((l, i) => (i === 0 ? l.toUpperCase() : l))

      return letters.join('')
    })

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
  return phone.replace('+595', '0')
}

export const convertInGuarani = (message: string | number): string => {
  const amount = Number(message)

  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG'
  }).format(amount)
}

export const getNameFromHeaders = (headers: AxiosResponseHeaders): string => {
  // Se obtiene el nombre del archivo por medio del header: "content-disposition",
  // que tiene el siguiente formato: "attachment; filename=<FILE_NAME>.<EXTENSION>"
  return headers['content-disposition'].split('=')[1].split('.')[0]
}
