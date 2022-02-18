import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MainController } from '~CONTROLLERS/Main.controller'
import { MENU_HOME } from '~ENTITIES/consts'

export class LoginController extends Controller {
  async startDecisionTree() {
    let response = ''

    switch (TREE_STEP) {
      case '':
        TREE_LEVEL = 'LOGIN'
        TREE_STEP = 'STEP_1'

        // response = `
        // Hola! soy el asistente virtual de los afiliados de la CAJA 🤓
        // Nuestra caja, tu futuro!

        // Por favor envíanos tu número de CI para ayudarte

        // ${MENU_HOME}
        // `

        response = `
        Hola! soy el asistente virtual de los afiliados de la CAJA 🤓
        Nuestra caja, tu futuro!

        Por favor envíanos tu número de CI, número de afiliado y número de celular separados por comas

        *Ejemplo*: 1234567,12345,1234567890

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

        const [nroCedula, nroAfiliado, nroCelular] = this.message.split(',')

        const data = await this.andeService.login({
          nroCedula,
          nroAfiliado,
          nroCelular
        })

        if (data) {
          // TODO: Guardar los datos del afiliado
          ANDE = {
            affiliate: ({
              nic: data.nic,
              nroCedula,
              nroCelular,
              codPersonalAnde: nroAfiliado
            } as unknown) as TAffiliate,
            token: data.token
          } as TAnde

          new HomeController({
            ...this.data,
            message: 'menu'
          })
        } else {
          response = `
          ❌ Datos invalidos, verifique que los datos sean correctos y envíelos de nuevo

          ${MENU_HOME}
          `
        }
        break

      // case 'STEP_2':
      // if (this.message === '53054' || this.message === '10893') {
      //   new HomeController({
      //     ...this.data,
      //     message: 'menu'
      //   })
      // } else {
      //   response = `
      //   Nro. de afiliado invalido ❌

      //   ${MENU_RETURN}
      //   `
      // }
      // break

      case 'STEP_3':
        TREE_LEVEL = 'MAIN'
        TREE_STEP = ''
        new MainController(this.data)
        break
    }

    this.sendMessage(response)
  }
}
