import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { convertArrayInOptions, messageOptionInvalid } from '~UTILS/message.util'

export class NewsController extends Controller {
  async startDecisionTree() {
    let response = ''

    const options = `
    (141) Fecha de pago de haberes
    (142) Noticias destacadas de la CAJA`

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'NEWS'
        TREE_STEP = ''

        response = `
          Elige una de las siguientes opciones:
          ${options}
          ${MENU_HOME}
          `
        break

      case '141':
        const paymentDate = await this.andeService.getPaymentDate()

        if (typeof paymentDate === 'object') {
          console.log(paymentDate)

          response = `
          No te olvides de tus fechas de cobro! 😇

          ( INFORMACIÓN )

          ${MENU_HOME}
          `
        } else {
          response = `
          ${paymentDate}

          ${MENU_HOME}
          `
        }
        break

      case '142':
        const links = await this.andeService.getLinks()

        if (typeof links === 'object') {
          const enabledLinks = links.filter(link => link.estado)

          const linkList = convertArrayInOptions(enabledLinks, item => {
            return `
            *${item.nombre}*
            ${item.descripcion}
            `
          })

          response = `
          Las mejores promociones en un solo lugar 🌎
          ${linkList}
          ${MENU_HOME}
          `
        }
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

    return this.sendMessage(response)
  }
}
