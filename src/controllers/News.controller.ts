import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { convertArrayInMessage, messageOptionInvalid } from '~UTILS/message.util'

export class NewsController extends Controller {
  async startDecisionTree() {
    let response = ''

    const options = `
    (141) Fecha de pago de haberes
    (142) Enlaces de interés y noticias`

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
          const { codigo, mensaje } = paymentDate

          if (codigo === 200 && mensaje) {
            response = `
            ${mensaje}

            ${MENU_HOME}
            `
          } else {
            // TODO: Verificar que tipo de dato llega cuando hay una fecha de cobro
            console.log(paymentDate)

            response = `
            No te olvides de tus fechas de cobro! 😇

            ${JSON.stringify(paymentDate)}

            ${MENU_HOME}
            `
          }
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

          const linkList = convertArrayInMessage(enabledLinks, item => {
            return `
            *${item.nombre}*
            ${item.descripcion}`
          })

          response = `
          Las mejores promociones en un solo lugar 🌎
          ${linkList}

          ${MENU_HOME}
          `
        } else {
          response = `
          ${links}

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
