import { Controller } from '~ENTITIES/class'
import { HomeController } from '~CONTROLLERS/Home.controller'

export class LoginController extends Controller {
  async startDecisionTree() {
    let response = ''

    // TODO: crear casos de usos incorrectos (ci invalido, afiliacion no encontrada, etc)
    switch (FLOW_STATE) {
      case 'cedula':
        await this.andeService.getAffiliateByCI(this.message)
        response = 'Poné tu nro de Afiliado'
        FLOW_STATE = 'afiliado'
        break

      case 'afiliado':
        await this.andeService.getAffiliateByNro(this.message)
        response = `
        Bienvenido ${this.username}. En Caja Ande trabajamo para vos 🤓, revisá las opciones que tenemos desponible:

        (11) Préstamos
        (12) Tarjetas de crédito
        (13) Consultar crédito
        (14) Noticias e informaciones del mes
        (15) Datos personales
        (16) Descargas
        (17) Link de interés
        (18) Mesa de entrada
        `

        FLOW_STATE = 'home'
        break

      case 'home':
        new HomeController(this.data)
        break

      default:
        response = `
      Hola 🤗 ${this.username}, soy el Asistente Virtual de Caja Ande.
      Selecciona una opción para poder ayudarte:

      (1) Acceso para afiliados de la CAJA
      (2) No afiliados
      `
        break
    }

    await this.sendMessage(response)
  }
}
