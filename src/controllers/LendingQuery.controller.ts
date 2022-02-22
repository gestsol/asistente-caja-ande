import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
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
    (136) Último pago de tesorería`

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'LENDING_QUERY'
        TREE_STEP = ''

        response = `
        Elige una de las siguientes opciones:
        ${options}
        ${MENU_HOME}
        `
        break

      case '131':
        const fee = await this.andeService.getTotalFee()

        if (typeof fee === 'object') {
          response = `
          Total de cuotas de créditos vigentes:

          ${fee.totalCuota}

          ${MENU_HOME}
          `
        } else {
          response = `
          ${fee}

          ${MENU_HOME}
          `
        }
        break

      case '132':
        const situationLending = await this.andeService.getSituationLending()

        if (typeof situationLending === 'object') {
          response = `
          Situación de crédito solicitado:

          ${situationLending.situacion}

          ${MENU_HOME}
          `
        } else {
          response = `
          ${situationLending}

          ${MENU_HOME}
          `
        }
        break

      case '133':
        const closingDate = await this.andeService.getClosingDate()

        if (typeof closingDate === 'object') {
          response = `
          Fecha de cierre mensual de préstamos:

          *Periodo*: ${closingDate.periodo}
          *Fecha*: ${closingDate.fecha}

          ${MENU_HOME}
          `
        } else {
          response = `
          ${closingDate}

          ${MENU_HOME}
          `
        }
        break

      case '134':
        response = `
        Descuento del mes:

        ( INFORMACIÓN )

        ${MENU_HOME}
        `
        break

      case '135':
        response = `
        Diferimiento de cuotas por reposo:

        ( INFORMACIÓN )

        ${MENU_HOME}
        `
        break

      case '136':
        response = `
        Último pago de tesorería:

        ( INFORMACIÓN )

        ${MENU_HOME}
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
