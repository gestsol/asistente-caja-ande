import { Controller } from '~CLASS/Controller'
import { MENU_RETURN } from '~ENTITIES/consts'
import { messageOptionInvalid } from '~UTILS/message.util'

export class LendingQuery extends Controller {
  async startDecisionTree() {
    let response = ''
    const options = `
    (131) Total de cuotas de créditos vigentes
    (132) Situación de crédito solicitado
    (133) Fecha de cierre mensual de préstamos
    (134) Descuento del mes
    (135) Diferimiento de cuotas por reposo
    (136) Último pago de tesorería
    `

    switch (this.message) {
      case 'menu':
        response = `
        Elige una de las siguientes opciones:
        ${options}

        ${MENU_RETURN}
        `
        break

      case '131':
        response = `
        Total de cuotas de créditos vigentes:

        ( INFORMACIÓN )

        ${MENU_RETURN}
        `
        break

      case '132':
        response = `
        Situación de crédito solicitado:

        ( INFORMACIÓN )

        ${MENU_RETURN}
        `
        break

      case '133':
        response = `
        Fecha de cierre mensual de préstamos:

        ( INFORMACIÓN )

        ${MENU_RETURN}
        `
        break

      case '134':
        response = `
        Descuento del mes:

        ( INFORMACIÓN )

        ${MENU_RETURN}
        `
        break

      case '135':
        response = `
        Diferimiento de cuotas por reposo:

        ( INFORMACIÓN )

        ${MENU_RETURN}
        `
        break

      case '136':
        response = `
        Último pago de tesorería:

        ( INFORMACIÓN )

        ${MENU_RETURN}
        `
        break

      default:
        response = messageOptionInvalid(options)
        break
    }

    this.sendMessage(response)
  }
}
