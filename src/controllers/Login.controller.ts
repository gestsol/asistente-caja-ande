import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'

export class LoginController extends Controller {
  async startDecisionTree() {
    let response = ''

    // TODO: crear casos de usos incorrectos (ci invalido, afiliacion no encontrada, etc)
    switch (FLOW_STATE) {
      case 'login':
        const data = await this.andeService.getAffiliateByCI(this.message)

        if (data) {
          response = 'Poné tu nro de Afiliado'
          FLOW_STATE = 'afiliado'
        } else response = 'CI invalido'
        break

      case 'afiliado':
        const affiliate = await this.andeService.getAffiliateByNro(this.message)

        if (affiliate) {
          FLOW_STATE = 'home'
          this.data = {
            ...this.data,
            message: 'home',
            username: affiliate.nombre
          }
          new HomeController(this.data)
        } else response = 'Nro. de afiliado invalido'
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
