import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MainController } from '~CONTROLLERS/Main.controller'
import { convertMessageInArray } from '~UTILS/message.util'
import { isNumber } from '~UTILS/validation.util'
import { MENU_HOME } from '~ENTITIES/consts'

export class LoginController extends Controller {
  async startDecisionTree() {
    let response = ''

    /*
      Formato insternacional de celular en Paraguay
      (codigo_país)-(9)-(nro_operador)-(6_digitos)
      +595-9-XX-XXXXXX
    */
    const regex = new RegExp(/\+(5959)[0-9]{8}$/)
    const isParaguay = regex.test(this.data.phone)

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'LOGIN'
        TREE_STEP = 'STEP_1'

        ANDE = {} as any

        response = `
        Hola! soy el asistente virtual de los afiliados de la CAJA 🤓
        Nuestra caja, tu futuro!`

        if (isParaguay) {
          response += `
          Por favor envíanos tu número de CI y número de afiliado separados por los espacios que desee

          *Ejemplo*: 1234567 12345`
        } else {
          response += `
          Por favor envíanos tu número de CI, número de afiliado y número de celular separados por los espacios que desee

          *Ejemplo*: 1234567 12345 0123456789`
        }

        response += `
        ${MENU_HOME}
        `
        break

      case '0':
        TREE_LEVEL = 'MAIN'
        TREE_STEP = ''
        new MainController(this.data)
        break

      default:
        if (TREE_STEP === 'STEP_1') {
          // Convertimos en array el mensaje y verificamos que cada dato sea un número
          let [nroCedula, nroAfiliado, nroCelular] = convertMessageInArray(this.message).filter(item => isNumber(item))

          if (isParaguay) {
            //  Para realizar el inicio de sesión, el prefijo internacional +595 debe ses reemplazado por un cero
            nroCelular = this.data.phone.replace('+595', '0')
          }

          if (nroCedula || nroAfiliado || nroCelular) {
            const data = await this.andeService.login({
              nroCedula,
              nroAfiliado,
              nroCelular
            })

            if (data) {
              // Guardar los datos del afiliado
              ANDE = {
                affiliate: data.afiliado,
                token: data.token
              }

              new HomeController({
                ...this.data,
                message: 'menu'
              })

              break
            }
          }

          response = `
          ⚠️ Usuario invalido, verifique que los datos sean correctos e intente de nuevo

          ${MENU_HOME}
          `
          break
        }

        break
    }

    return this.sendMessage(response)
  }
}
