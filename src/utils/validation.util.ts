export const isNumber = (message: string): number | null => (!isNaN(Number(message)) ? Number(message) : null)

export const isEmail = (message: string): boolean => new RegExp(/^[a-z0-9_.]+\@[a-z.]+$/).test(message)

export const isPhoneParaguay = (phone: string): boolean => {
  /*
    Formato insternacional de celular en Paraguay
    (codigo_país)-(9)-(nro_operador)-(6_digitos)
    +595-9-XX-XXXXXX
  */
  return new RegExp(/\+(5959)[0-9]{8}$/).test(phone)
}
