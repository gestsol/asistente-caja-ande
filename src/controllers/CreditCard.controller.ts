import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { convertArrayInOptions, messageOptionInvalid } from '~UTILS/message.util'
import { MENU_HOME } from '~ENTITIES/consts'

export class CreditCardController extends Controller {
  async startDecisionTree() {
    let response = ''

    const options = `
    (121) Tarjeta de crédito 💳
    (122) Deuda total y disponibilidad de tarjeta de crédito
    (123) Monto y vencimiento de tu tarjeta
    (124) Situación actual de tu tarjeta de crédito`

    const amountMax = 'xxx'

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'CREDIT_CARD'
        TREE_STEP = ''

        this.initStore()

        response = `
        Elige una de las siguiente opciones:
        ${options}
        ${MENU_HOME}
        `
        break

      case '121':
        const creditCards = await this.andeService.getCreditCards()

        if (typeof creditCards === 'object') {
          if (creditCards.length) {
            // TREE_STEP = ''

            // response = `
            // Ya dispones de tarjeta de crédito con la CAJA 🤓
            // ¿Para quién es la tarjeta nueva?

            // (H) Hijo
            // (Y) Cónyuge

            // ${MENU_HOME}
            // `

            response = `
            EN DESARROLLO

            ${MENU_HOME}
            `
          } else {
            TREE_STEP = 'STEP_1'

            response = `
            Tenes disponible ${amountMax} guaraníes para tu tarjeta de crédito.
            ¿Deseas solicitarla con el monto máximo?

            (M) Quiero el monto máximo
            (  ) Escriba el monto que desea
            `
          }
        } else {
          response = `
          ${creditCards}

          ${MENU_HOME}
          `
        }
        break

      case '122':
        response = `
        EN DESARROLLO

        ${MENU_HOME}
        `
        // const creditCards = await this.andeService.getCreditCards()

        // if (typeof creditCards === 'object') {
        //   convertArrayInOptions(creditCards, (item, i) => {
        //     return `
        //     *Tarjeta ${item.nroTarjeta}*

        //     Saldo disponible: ${item.disponible}
        //     Deuda total: ${item.pagoMinimoPendiente}

        //     `
        //   })

        //   response = `
        //   Nunca fue tan sencillo tener esta información en la comodidad de tu celular 😎

        //   ${creditCards}

        //   ${MENU_HOME}
        //   `
        // } else {
        //   response = `
        //   ${creditCards}

        //   ${MENU_HOME}
        //   `
        // }
        break

      case '123':
        response = `
        EN DESARROLLO

        ${MENU_HOME}
        `
        // response = `
        // Revisa aquí la fecha de vencimiento de tu tarjeta de crédito

        // - Pago Mínimo: ( INFORMACIÓN )
        // - Fecha Vencimiento: ( INFORMACIÓN )
        // - Fecha Cierre: ( INFORMACIÓN )

        // ${MENU_HOME}
        // `
        break

      case '124':
        response = `
        EN DESARROLLO

        ${MENU_HOME}
        `
        // TREE_STEP = 'STEP_3'

        // response = `
        // Solicita una tarjeta adicional aquí 🤓
        // ¿Para quién es la tarjeta?

        // (H) Hijo
        // (Y) Cónyuge
        // `
        break

      case '0':
        TREE_LEVEL = 'HOME'

        this.initStore()

        new HomeController({
          ...this.data,
          message: 'menu'
        })
        break

      default:
        switch (TREE_STEP) {
          case 'STEP_1':
            if (this.message === 'M' || !isNaN(Number(this.message))) {
              const amount = this.message === 'M' ? Number(amountMax) : Number(this.message)

              TREE_STEP = 'STEP_2'
              STORE.creditCard.amount = amount

              response = `
              Se ha ingresado una solicitud para tarjeta de crédito con un monto máximo de ${amount} guaraníes.

              (C) Confirmo
              (R) Rechazo
              `
              break
            }

            response = messageOptionInvalid()
            break

          case 'STEP_2':
            if (this.message === 'C') {
              const creditCardResponse = await this.andeService.createCreditCard({
                esAdicional: 0,
                tipoFamilia: null,
                lineaCredito: STORE.creditCard.amount, // 8000000
                nroCedula: ANDE!.affiliate.nroCedula, // 3809540
                nombreApellido: null,
                direccion: null,
                celular: null,
                telefono: null,
                correo: null
              })

              if (creditCardResponse) {
                response = `
                ✅ Solicitud enviada

                ${MENU_HOME}
                `
              }
              break
            }

            if (this.message === 'R') {
              response = `
              ❌ Solicitud cancelada

              ${MENU_HOME}
              `
              break
            }

            response = messageOptionInvalid()
            break

          case 'STEP_3':
            TREE_STEP = 'STEP_4'
            response = '¿Cuál es el nombre y apellido?'
            break

          case 'STEP_4':
            TREE_STEP = 'STEP_1'

            response = `
            Tu nueva tarjeta puede tener hasta ${amountMax} guaraníes.
            ¿Deseas solicitarla con el monto máximo?

            (M) Si
            ( ) Ingrese monto (debe ser menor a su monto disponible)
            `
            break

          default:
            response = messageOptionInvalid(options)
            break
        }
        break
    }

    return this.sendMessage(response)
  }

  private initStore(): void {
    STORE = { creditCard: {} } as any
  }
}
