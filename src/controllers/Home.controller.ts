import { Controller } from '~CLASS/Controller'
import { CreditCardController } from '~CONTROLLERS/CreditCard.controller'
import { MainController } from '~CONTROLLERS/Main.controller'

export class HomeController extends Controller {
  async startDecisionTree() {
    let response = ''

    switch (this.message) {
      case 'home':
        response = `
        Bienvenido ${this.username}. En Caja Ande trabajamo para vos 🤓, revisá las opciones que tenemos desponible:

        (11) Préstamos 💰
        (12) Tarjetas de crédito 💳
        (13) Consultar crédito 🧐
        (14) Noticias e informaciones del mes 📱
        (15) Datos personales 😊
        (16) Descargas 🤗
        (17) Link de interés 😄
        (18) Mesa de entrada
        (0)  Menu principal 🏠
        (00) Regresar ↩️
        `
        break

      case '12':
        this.data = {
          ...this.data,
          message: 'CreditCard'
        }
        new CreditCardController(this.data)
        FLOW_STATE = 'CreditCard'
        break

      case '0':
        response = 'Opción no disponible'
        break

      case '00':
        FLOW_STATE = 'afiliado'
        this.data = {
          ...this.data,
          message: '1'
        }
        new MainController(this.data)
        break

      default:
        response = 'Opción invalida'
        break
    }

    await this.sendMessage(response)
  }
}
