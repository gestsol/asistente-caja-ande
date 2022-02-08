import { Controller } from '~CLASS/Controller'
import { MENU_RETURN } from '~ENTITIES/consts'

export class CreditCardController extends Controller {
  protected async startDecisionTree(): Promise<void> {
    let response = ''

    switch (this.message) {
      case 'CreditCard':
        FLOW_STATE = 'CREDIT_CARD'

        response = `
        Elige una de las siguiente opciones:

        (121) Nueva tarjeta de crédito 💳
        (122) Deduda total y disponibilidad de tarjeta de crédito
        (123) Monto y vencimiento de tu tarjeta
        (124) Tarjeta adicional
        (125) Situación actual de tu tarjeta de crédito
        ${MENU_RETURN}
        `
        break

      default:
        break
    }

    this.sendMessage(response)
  }
}
