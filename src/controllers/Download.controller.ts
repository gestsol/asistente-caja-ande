import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { messageOptionInvalid } from '~UTILS/message.util'

export class DownloadController extends Controller {
  async startDecisionTree() {
    let response = ''
    const options = `
    (161) Facturas
    (162) Exatractos de préstamos
    (163) Liquidación mensual de haberes`

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'DOWNLOAD'
        TREE_STEP = ''

        response = `
        Elige una de las siguientes opciones:
        ${options}
        ${MENU_HOME}
        `
        break

      case '161':
        response = `
        Revisa tus facturas de los últimos 12 meses 📊

        ¿Qué querés revisar?

        () Los últimos 12 meses
        () Otra fecha
        `
        break

      case '162':
        response = `
        ¿Qué querés revisar?

        () Los últimos 12 meses
        () Otra fecha
        `
        break

      case '163':
        response = `
        ¿Qué querés revisar?

        () Los últimos 12 meses
        () Otra fecha
        `
        break

      case '0':
        TREE_LEVEL = 'HOME'
        new HomeController({
          ...this.data,
          message: 'menu'
        })
        break

      default:
        response = messageOptionInvalid(options)
        break
    }

    this.sendMessage(response)
  }
}
