import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MainController } from '~CONTROLLERS/Main.controller'
import { convertMessageInArray } from '~UTILS/message.util'
import { isNumber } from '~UTILS/validation.util'
import { MENU_HOME } from '~ENTITIES/consts'

export class LoginController extends Controller {
  async startDecisionTree() {
    let response = ''

    switch (TREE_STEP) {
      case '':
        TREE_LEVEL = 'LOGIN'
        TREE_STEP = 'STEP_1'

        ANDE = {} as any

        response = `
        Hola! soy el asistente virtual de los afiliados de la CAJA 🤓
        Nuestra caja, tu futuro!

        Por favor envíanos tu número de CI, número de afiliado y número de celular separados por los espacios que desee

        *Ejemplo*: 1234567 12345 0123456789

        ${MENU_HOME}
        `
        break

      case 'STEP_1':
        if (this.message === '0') {
          TREE_STEP = 'STEP_3'
          this.startDecisionTree()
          break
        }

        if (this.message === '00') {
          TREE_STEP = ''
          this.startDecisionTree()
          break
        }

        // Convertimos en array el mensaje y verificamos que cada dato sea un número
        const [nroCedula, nroAfiliado, nroCelular] = convertMessageInArray(this.message).filter(item => isNumber(item))

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
          }
          break
        }

        response = `
        ⚠️ Datos invalidos, verifique que los datos sean correctos y envíelos de nuevo

        ${MENU_HOME}
        `
        break

      case 'STEP_3':
        TREE_LEVEL = 'MAIN'
        TREE_STEP = ''
        new MainController(this.data)
        break
    }

    return this.sendMessage(response)
  }
}
