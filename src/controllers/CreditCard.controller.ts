import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { messageOptionInvalid } from '~UTILS/message.util'

export class CreditCardController extends Controller {
  protected async startDecisionTree(): Promise<void> {
    let response = ''
    const options = `
    (121) Nueva tarjeta de crédito 💳
    (122) Deuda total y disponibilidad de tarjeta de crédito
    (123) Monto y vencimiento de tu tarjeta
    (124) Tarjeta adicional
    (125) Situación actual de tu tarjeta de crédito`

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'CREDIT_CARD'
        TREE_STEP = ''

        response = `
        Elige una de las siguiente opciones:
        ${options}
        ${MENU_HOME}
        `
        break

      case '121':
        response = `
        Tu nueva tarjeta puede tener hasta xxx guaraníes.
        ¿Deseas solicitarla con el monto máximo?

        (M) Quiero el monto máximo
        (O) Deseo otro monto
        `
        break

      case 'M':
        response = `
        Se ha ingresado una solicitud para tarjeta de crédito con un monto máximo de xx guaraníes.

        (C) Confirmo
        (R) Rechazo
        `
        break

      case 'O':
        TREE_STEP = 'STEP_3'
        response = 'Por favor, indicar el monto para la tarjeta.'
        break

      case '122':
        response = `
        Nunca fue tan sencillo tener esta información en la comodidad de tu celular 😎

        ( INFORMACIÓN )

        ${MENU_HOME}
        `
        break

      case '123':
        response = `
        Revisa aquí la fecha de vencimiento de tu tarjeta de crédito

        - Pago Mínimo:  ( INFORMACIÓN )
        - Fecha Vencimiento:    ( INFORMACIÓN )
        - Fecha Cierre: ( INFORMACIÓN )

        ${MENU_HOME}
        `
        break

      case '124':
        response = `
        Solicita una tarjeta adicional aquí 🤓
        ¿Para quién es la tarjeta?

        (H) Hijo
        (Y) Cónyuge
        `
        break

      case 'H':
        TREE_STEP = 'STEP_1'
        response = '¿Cuál es el apellido?'
        break

      case 'Y':
        TREE_STEP = 'STEP_1'
        response = '¿Cuál es el apellido?'
        break

      case 'S':
        response = `
        Se ha ingresado una solicitud para tarjeta de crédito adicional con un monto máximo de xxx guaraníes.

        (C) Confirmo
        (R) Rechazo
        `
        break

      case 'N':
        TREE_STEP = 'STEP_3'
        response = 'Ingrese monto (debe ser menor a su monto disponible)'
        break

      case '125':
        response = `
        ( INFORMACIÓN )

        ${MENU_HOME}
        `
        break

      case 'C':
        response = `
        Solicitud enviada ✅

        ${MENU_HOME}
        `
        break

      case 'R':
        response = `
        Solicitud cancelada ❌

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
        switch (TREE_STEP) {
          case 'STEP_1':
            TREE_STEP = 'STEP_2'
            response = '¿Cuál es el nombre?'
            break

          case 'STEP_2':
            response = `
              Actualmente la línea posee xxxx guaraníes disponible
              ¿Desea asignar ese monto a la nueva tarjeta?

              (S) SI
              (N) NO
              `
            break

          case 'STEP_3':
            this.message = 'S'
            this.startDecisionTree()
            break

          default:
            response = messageOptionInvalid(options)
            break
        }
        break
    }

    this.sendMessage(response)
  }
}
