import { Controller } from '~CLASS/Controller'
import { CreditCardController } from '~CONTROLLERS/CreditCard.controller'
import { MENU_RETURN } from '~ENTITIES/consts'

export class HomeController extends Controller {
  async startDecisionTree() {
    let response = ''

    switch (this.message) {
      case 'home':
        FLOW_STATE = 'HOME'

        response = `
        Bienvenido ${'NAME'}. En Caja Ande trabajamo para vos 🤓, revisá las opciones que tenemos desponible:

        (11) Préstamos 💰
        (12) Tarjetas de crédito 💳
        (13) Consultar crédito 🧐
        (14) Noticias e informaciones del mes 📱
        (15) Datos personales 😊
        (16) Descargas 🤗
        (17) Link de interés 😄
        (18) Mesa de entrada
        ${MENU_RETURN}
        `
        break

      case '12':
        new CreditCardController({
          ...this.data,
          message: 'CreditCard'
        })
        break

      case '0':
        response = 'Opción no disponible'
        break

      case '00':
        response = 'Opción no disponible'
        break

      default:
        response = 'Opción invalida'
        break
    }

    this.sendMessage(response)
  }
}
