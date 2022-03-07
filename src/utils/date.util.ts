export const getDatePrevious = (time: number): Date => {
  const currentTime = new Date().getTime()
  const newDate = currentTime - time
  const dateISO = new Date(newDate).toISOString()

  const decomposedDate = dateISO.split('-')

  const year = decomposedDate[0]
  const month = decomposedDate[1]

  const date = `${year}-${month}-01T00:00:00.000Z`

  return new Date(date)
}

// TODO: verificar si esto se va a usar despues
// export const getCurrentPeriod = (): string => {
//   const dateISO = new Date().toISOString()
//   const date = dateISO.split('T')[0]
//   const decomposedDate = date.split('-')
//   decomposedDate.pop()
//   const period = decomposedDate.join('')
//   return period
// }

export const getPeriodFromMessage = (message: string): string | null => {
  // Verificar que el parametro "message" tiene este formato: "09-2021"
  const regex = new RegExp(/[0-9]{2}-[0-9]{4}/)

  if (regex.test(message)) {
    const decomposedDate = message.split('-')
    return decomposedDate[1] + decomposedDate[0]
  } else return null
}

export const getDateFromPeriod = (period: string): Date => {
  // Separar por año y mes el parametro "period" el cual tiene este formato: "202109"
  const year = period.substring(0, 4)
  const month = period.substring(4)

  // Crear fecha en formato "ISO string"
  const date = `${year}-${month}-01T00:00:00.000Z`

  return new Date(date)
}
