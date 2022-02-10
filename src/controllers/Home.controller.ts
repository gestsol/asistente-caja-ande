import { Controller } from '~CLASS/Controller'
import { CreditCardController } from '~CONTROLLERS/CreditCard.controller'
import { LendingQuery } from '~CONTROLLERS/LendingQuery.controller'
import { MainController } from '~CONTROLLERS/Main.controller'
import { NewsController } from '~CONTROLLERS/News.controller'
import { PersonalDataController } from '~CONTROLLERS/PersonalData.controller'
import { MENU_RETURN } from '~ENTITIES/consts'
import { messageOptionInvalid } from '~UTILS/message.util'

export class HomeController extends Controller {
  async startDecisionTree() {
    let response = ''
    const options = `
    (11) Préstamos 💰
    (12) Tarjetas de crédito 💳
    (13) Consultar crédito vigente 🧐
    (14) Noticias e informaciones del mes 📱
    (15) Datos personales 😊
    (16) Descargas 🤗
    (17) Link de interés 😄
    (18) Mesa de entrada
    `

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'HOME'
        TREE_STEP = ''

        response = `
        Bienvenido ${AFFILIATE?.nombre ||
          'NAME'}. En Caja Ande trabajamo para vos 🤓, revisa las opciones que tenemos desponible:
        ${options}
        ${MENU_RETURN}
        `
        break

      case '12':
        new CreditCardController({
          ...this.data,
          message: 'menu'
        })
        break

      case '13':
        new LendingQuery({
          ...this.data,
          message: 'menu'
        })
        break

      case '14':
        new NewsController({
          ...this.data,
          message: 'menu'
        })
        break

      case '15':
        new PersonalDataController({
          ...this.data,
          message: 'menu'
        })
        break

      case '0':
        TREE_LEVEL = 'MAIN'
        new MainController(this.data)
        break

      case '00':
        TREE_LEVEL = 'MAIN'
        TREE_STEP = 'STEP_1'

        new MainController({
          ...this.data,
          message: '1'
        })
        break

      default:
        response = messageOptionInvalid(options)
        break
    }

    this.sendMessage(response)
  }
}
