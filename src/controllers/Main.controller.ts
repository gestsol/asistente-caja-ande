import { Controller } from '~CLASS/Controller'
import { LoginController } from '~CONTROLLERS/Login.controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { CreditCardController } from '~CONTROLLERS/CreditCard.controller'
import { LendingQuery } from '~CONTROLLERS/LendingQuery.controller'
import { NewsController } from '~CONTROLLERS/News.controller'
import { PersonalDataController } from '~CONTROLLERS/PersonalData.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { messageOptionInvalid } from '~UTILS/message.util'

export class MainController extends Controller {
  async startDecisionTree() {
    let response = ''
    const options = `
    (1) Acceso para afiliados de la CAJA
    (2) No afiliados
    `

    switch (TREE_LEVEL) {
      case 'MAIN':
        if (TREE_STEP === 'STEP_1') {
          switch (this.message) {
            case '1':
              TREE_STEP = ''
              new LoginController(this.data)
              break

            case '2':
              TREE_LEVEL = 'MESA'

              response = `
              Mesa de Entrada
              ( Opciones no disponible )

              ${MENU_HOME}
              `
              break

            default:
              response = messageOptionInvalid(options)
              break
          }
          break
        }

        if (TREE_STEP === '') {
          TREE_STEP = 'STEP_1'

          response = `
          Hola 🤗 soy el Asistente Virtual de Caja Ande.
          Selecciona una opción para poder ayudarte:
          ${options}
          `
        }
        break

      case 'LOGIN':
        new LoginController(this.data)
        break

      case 'HOME':
        new HomeController(this.data)
        break

      case 'CREDIT_CARD':
        new CreditCardController(this.data)
        break

      case 'LENDING_QUERY':
        new LendingQuery(this.data)
        break

      case 'NEWS':
        new NewsController(this.data)
        break

      case 'PERSONAL_DATA':
        new PersonalDataController(this.data)
        break
    }

    return this.sendMessage(response)
  }
}
