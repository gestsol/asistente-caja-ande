import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { convertArrayInMessage, messageOptionInvalid } from '~UTILS/message.util'
import { MENU_HOME } from '~ENTITIES/consts'

export class LendingsController extends Controller {
  async startDecisionTree() {
    let response = ''

    const options = `
    (111) Préstamo especial ✨
    (113) Préstamo estudiantil 📚
    (114) Préstamo extraordinario 💰`

    const subOptions = `
    (L) La totalidad
    (  ) Escriba un monto menor`

    if (TREE_STEP === '') {
      TREE_LEVEL = 'LENDINGS'

      // TODO: analizar CI y verificar si posee credito asociado
      const creditAproved = ANDE?.affiliate.nroCedula === 4627572

      if (creditAproved) {
        switch (this.message) {
          case '0':
            TREE_LEVEL = 'HOME'
            new HomeController({
              ...this.data,
              message: 'menu'
            })
            break

          case '3':
            response = `
            ( INFORMACIÓN )

            ${MENU_HOME}
            `
            break

          default:
            response = `
            ${ANDE!.affiliate.nombre} felicidades 🎉
            Tenés un crédito Pre-Aprobado.

            (3) Más información del crédito pre aprobado
            ${MENU_HOME}
            `
            break
        }
      } else {
        TREE_STEP = 'STEP_1'

        this.initStore()

        response = `
        Elige una de las siguientes opciones:
        ${options}
        ${MENU_HOME}
        `
      }
    } else {
      switch (this.message) {
        case '111':
          response = `
          Préstamo especial ✨

          (A) Préstamos en paralelo
          (B) Prétamos con cancelación
          ${MENU_HOME}
          `
          break

        case '113':
          const deadlineStundentList = await this.andeService.getLendings('estudiantil')

          if (typeof deadlineStundentList === 'object') {
            TREE_STEP = 'STEP_2'
            STORE.lending.deadlineList = deadlineStundentList

            const lendingOptions = convertArrayInMessage(deadlineStundentList, (item, i) => {
              return `
              (${i + 1})
              *Plazo*: ${item.plazo}
              *Monto*: ${item.monto}
              `
            })

            response = `
            Opciones de plazo para préstamo estudiantil:
            ${lendingOptions}
            ${MENU_HOME}
            `
          } else {
            response = `
            ${deadlineStundentList}

            ${MENU_HOME}
            `
          }
          break

        case '114':
          const deadlineExtraList = await this.andeService.getLendings('extraordinario')

          if (typeof deadlineExtraList === 'object') {
            TREE_STEP = 'STEP_2'
            STORE.lending.deadlineList = deadlineExtraList

            const lendingOptions = convertArrayInMessage(deadlineExtraList, (item, i) => {
              return `
              (${i + 1})
              *Plazo*: ${item.plazo}
              *Monto*: ${item.monto}
              `
            })

            response = `
            Opciones de plazo para préstamo extraordinario:
            ${lendingOptions}
            ${MENU_HOME}
            `
          } else {
            response = `
            ${deadlineExtraList}

            ${MENU_HOME}
            `
          }
          break

        case 'A':
          const deadlineList = await this.andeService.getLendings('paralelo')

          if (typeof deadlineList === 'object') {
            TREE_STEP = 'STEP_2'
            STORE.lending.deadlineList = deadlineList

            const lendingOptions = convertArrayInMessage(deadlineList, (item, i) => {
              return `
              (${i + 1})
              *Plazo*: ${item.plazo}
              *Monto*: ${item.monto}
              `
            })

            response = `
            Opciones de plazo para préstamo en paralelo:
            ${lendingOptions}
            ${MENU_HOME}
            `
          } else {
            response = `
            ${deadlineList}

            ${MENU_HOME}
            `
          }
          break

        case 'B':
          const deadlineCancelList = await this.andeService.getLendings('cancelacion')

          if (typeof deadlineCancelList === 'object') {
            TREE_STEP = 'STEP_2'
            STORE.lending.deadlineList = deadlineCancelList

            const lendingOptions = convertArrayInMessage(deadlineCancelList, (item, i) => {
              return `
              *(${i + 1})*
              Plazo: ${item.plazo}
              Monto: ${item.monto}
              `
            })

            response = `
            Opciones de plazo para préstamo con cancelación:
            ${lendingOptions}
            ${MENU_HOME}
            `
          } else {
            response = `
            ${deadlineCancelList}

            ${MENU_HOME}
            `
          }
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
            case 'STEP_2':
              const deadlineSelected = Number(this.message)

              if (!isNaN(deadlineSelected)) {
                const deadline = STORE.lending.deadlineList.find((_, index) => index === deadlineSelected - 1)!

                if (deadline) {
                  TREE_STEP = 'STEP_3'
                  STORE.lending.deadline = deadline
                  response = subOptions
                  break
                }
              }

              response = messageOptionInvalid()
              break

            case 'STEP_3':
              if (this.message === 'L' || !isNaN(Number(this.message))) {
                let { monto, plazo } = STORE.lending.deadline
                monto = this.message === 'L' ? monto : Number(this.message)

                const calculeResponse = await this.andeService.calculateLending(monto, plazo)

                if (typeof calculeResponse === 'object') {
                  const paymentMethods = await this.andeService.getPaymentMethods()

                  if (paymentMethods) {
                    TREE_STEP = 'STEP_4'
                    STORE.lending.amount = monto
                    STORE.lending.payMethodList = paymentMethods

                    const paymentOptions = convertArrayInMessage(
                      paymentMethods!,
                      (item, i) => `
                      (${i + 1}) ${item.descripcion}`
                    )

                    response = `
                    ¿Cómo querés realizar el pago de tu préstamo?
                    ${paymentOptions}
                    ${MENU_HOME}
                    `
                  } else {
                    response = `
                    No hay métodos de pago disponibles 😔
                    ${MENU_HOME}
                    `
                  }
                } else {
                  response = `
                  ${calculeResponse}

                  ${MENU_HOME}
                  `
                }
                break
              }

              response = messageOptionInvalid()
              break

            case 'STEP_4':
              const payMethodSelected = Number(this.message)

              const payMethod = STORE.lending.payMethodList.find((_, index) => index === payMethodSelected - 1)

              if (payMethod) {
                TREE_STEP = 'STEP_5'
                STORE.lending.payMethod = payMethod

                response = 'Por favor indica tu número de cuenta del banco'
              } else response = messageOptionInvalid()
              break

            case 'STEP_5':
              if (!isNaN(Number(this.message))) {
                const bankAccountList = await this.andeService.getBankAccountList()

                if (bankAccountList) {
                  const bankAccount = bankAccountList.find(account => account.id.nroCuentaBanco === this.message)

                  if (bankAccount) {
                    const { type, deadline, amount, payMethod } = STORE.lending
                    let creditResponse = ''

                    if (type === 'extraordinario' || payMethod.descripcion === 'CHEQUE') {
                      creditResponse = await this.andeService.createCreditExtra({
                        monto: amount,
                        origen: 3,
                        tipoDesembolso: payMethod.codigo,
                        codBanco: bankAccount.id.codBanco,
                        nroCtaBancaria: Number(bankAccount.id.nroCuentaBanco)
                      })
                    } else {
                      creditResponse = await this.andeService.createCredit({
                        plazo: deadline.plazo,
                        montoSolicitado: amount,
                        formaCobro: payMethod.codigo,
                        idCuentaBancaria: bankAccount.idRegistro,
                        nroCuentaBancaria: Number(bankAccount.id.nroCuentaBanco),
                        idBanco: bankAccount.id.codBanco,
                        cumpleRequisitos: 1
                      })
                    }

                    if (typeof creditResponse === 'object') {
                      // TODO: Determinar respuesta en la peticion y despues eliminar este log
                      console.log('LINEA DE CREDITO:', creditResponse)

                      response = `
                      ✅ Prestamo generado exitosamente

                      ${MENU_HOME}
                      `
                    } else {
                      response = `
                      ${creditResponse}

                      ${MENU_HOME}
                      `
                    }
                  } else {
                    response = `
                    No tiene ninguna cuenta bancaria asociada a este número ${this.message}, verifique los datos e intente nuevamente

                    ${MENU_HOME}
                    `
                  }
                } else response = 'Error al buscar las cuentas asociadas, por favor intentelo nuevamente'

                break
              }

              response = messageOptionInvalid()
              break

            default:
              response = TREE_STEP === 'STEP_1' ? messageOptionInvalid(options) : messageOptionInvalid()
              break
          }
          break
      }
    }

    return this.sendMessage(response)
  }

  private initStore(): void {
    STORE = { lending: {} } as any
  }
}
