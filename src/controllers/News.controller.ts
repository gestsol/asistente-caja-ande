import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_BACK, MENU_RETURN } from '~ENTITIES/consts'
import { messageOptionInvalid } from '~UTILS/message.util'

export class NewsController extends Controller {
  async startDecisionTree() {
    let response = ''
    const options = `
      (141) Fecha de pago de haberes
      (142) Noticias destacadas de la CAJA
      (143) Horario de atención al público
      (144) Contactos telefónicos
      `

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'NEWS'
        TREE_STEP = ''

        response = `
          Elige una de las siguientes opciones:
          ${options}

          ${MENU_BACK}
          `
        break

      case '141':
        response = `
        No te olvides de tus fechas de cobro! 😇

        ( INFORMACIÓN )

        ${MENU_RETURN}
        `
        break

      case '142':
        response = `
        Las mejores promociones en un solo lugar 😔

        ( INFORMACIÓN )

        ${MENU_RETURN}
        `
        break

      case '143':
        response = `
        Horario de atención al público:

        ( INFORMACIÓN )

        ${MENU_RETURN}
        `
        break

      case '144':
        response = `
        Contactos telefónicos:

        ( INFORMACIÓN )

        ${MENU_RETURN}
        `
        break

      case '0':
        TREE_LEVEL = 'HOME'
        new HomeController({
          ...this.data,
          message: 'menu'
        })
        break

      case '00':
        this.message = 'menu'
        this.startDecisionTree()
        break

      default:
        response = messageOptionInvalid(options)
        break
    }

    this.sendMessage(response)
  }
}
