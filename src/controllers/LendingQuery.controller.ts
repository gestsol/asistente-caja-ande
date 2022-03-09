import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { convertInGuarani, messageOptionInvalid } from '~UTILS/message.util'
import { MENU_HOME } from '~ENTITIES/consts'

export class LendingQuery extends Controller {
  async startDecisionTree(session: TSession) {
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
        session.treeLevel = 'LENDING_QUERY'
        session.treeStep = ''

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

          ${convertInGuarani(fee.totalCuota)}

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
        const clainList = await this.andeService.getClainList()

        if (typeof clainList === 'object') {
          const monthDiscount = await this.andeService.getClain(clainList[0].periodo)

          if (typeof monthDiscount === 'object') {
            response = `
            Descuento del mes:

            *Préstamo*
            Total reclamo: ${convertInGuarani(monthDiscount.totalReclamoPrestamo)}
            Total pago: ${convertInGuarani(monthDiscount.totalPagoPrestamo)}

            *Seguro*
            Total reclamo: ${convertInGuarani(monthDiscount.totalReclamoSeguro)}
            Total pago: ${convertInGuarani(monthDiscount.totalPagoSeguro)}

            ${MENU_HOME}
            `
          } else {
            response = `
            ${monthDiscount}

            ${MENU_HOME}
            `
          }
        } else {
          response = `
          ${clainList}

          ${MENU_HOME}
          `
        }
        break

      case '135':
        const restFee = await this.andeService.getRestFee()

        if (typeof restFee === 'object') {
          response = `
          Diferimiento de cuotas por reposo:

          Resolución: ${restFee.nroResolucion}
          Acta: ${restFee.nroActa}

          Fecha Resolución: ${restFee.fechaResolucion}
          Periodo Desde: ${restFee.periodoDesde}
          Periodo Hasta: ${restFee.periodoHasta}
          Fecha de autorización: ${restFee.fechaAutorizacion}

          ${MENU_HOME}
          `
        } else {
          response = `
          ${restFee}

          ${MENU_HOME}
          `
        }

        break

      case '136':
        const treasuryPayment = await this.andeService.getLastTreasuryPayment()

        if (typeof treasuryPayment === 'object') {
          response = `
          Último pago de tesorería:

          Fecha: ${treasuryPayment.fecha}
          Importe: ${convertInGuarani(treasuryPayment.importe)}

          ${MENU_HOME}
          `
        } else {
          response = `
          ${treasuryPayment}

          ${MENU_HOME}
          `
        }
        break

      case '0':
        session.treeLevel = 'HOME'
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
