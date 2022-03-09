import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { convertArrayInMessage, convertInGuarani, messageOptionInvalid } from '~UTILS/message.util'
import { isNumber } from '~UTILS/validation.util'
import { MENU_HOME } from '~ENTITIES/consts'

export class LendingsController extends Controller {
  async startDecisionTree(session: TSession) {
    let response = ''

    const options = `
    (111) Préstamo especial ✨
    (113) Préstamo estudiantil 📚
    (114) Préstamo extraordinario 💰`

    const subOptions = `
    (L) La totalidad
    (  ) Escriba un monto menor`

    if (session.treeStep === '') {
      session.treeLevel = 'LENDINGS'

      // TODO: analizar CI y verificar si posee credito asociado
      const creditAproved = session.ande?.affiliate.nroCedula === 4627572

      if (creditAproved) {
        switch (this.message) {
          case '0':
            session.treeLevel = 'HOME'
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
            ${session.ande!.affiliate.nombre} felicidades 🎉
            Tenés un crédito Pre-Aprobado.

            (3) Más información del crédito pre aprobado
            ${MENU_HOME}
            `
            break
        }
      } else {
        session.treeStep = 'STEP_1'

        this.initStore(session)

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
            session.treeStep = 'STEP_2'
            session.store.lending.deadlineList = deadlineStundentList

            const lendingOptions = convertArrayInMessage(deadlineStundentList, (item, i) => {
              return `
              (${i + 1})
              *Plazo*: ${item.plazo}
              *Monto*: ${convertInGuarani(item.monto)}
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
            session.treeStep = 'STEP_2'
            session.store.lending.deadlineList = deadlineExtraList

            const lendingOptions = convertArrayInMessage(deadlineExtraList, (item, i) => {
              return `
              (${i + 1})
              *Plazo*: ${item.plazo}
              *Monto*: ${convertInGuarani(item.monto)}
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
            session.treeStep = 'STEP_2'
            session.store.lending.deadlineList = deadlineList

            const lendingOptions = convertArrayInMessage(deadlineList, (item, i) => {
              return `
              (${i + 1})
              *Plazo*: ${item.plazo}
              *Monto*: ${convertInGuarani(item.monto)}
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
            session.treeStep = 'STEP_2'
            session.store.lending.deadlineList = deadlineCancelList

            const lendingOptions = convertArrayInMessage(deadlineCancelList, (item, i) => {
              return `
              *(${i + 1})*
              Plazo: ${item.plazo}
              Monto: ${convertInGuarani(item.monto)}
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
          session.treeLevel = 'HOME'
          this.initStore(session)

          new HomeController({
            ...this.data,
            message: 'menu'
          })
          break

        default:
          switch (session.treeStep) {
            case 'STEP_2':
              const deadlineSelected = isNumber(this.message)

              if (deadlineSelected) {
                const deadline = session.store.lending.deadlineList.find((_, index) => index === deadlineSelected - 1)!

                if (deadline) {
                  session.treeStep = 'STEP_3'
                  session.store.lending.deadline = deadline
                  response = subOptions
                  break
                }
              }

              response = messageOptionInvalid()
              break

            case 'STEP_3':
              const amountMinor = isNumber(this.message)

              if (this.message === 'L' || amountMinor) {
                let { monto, plazo } = session.store.lending.deadline
                monto = this.message === 'L' ? monto : amountMinor!

                const calculeResponse = await this.andeService.calculateLending(monto, plazo)

                if (typeof calculeResponse === 'object') {
                  const paymentMethods = await this.andeService.getPaymentMethods()

                  if (paymentMethods) {
                    session.treeStep = 'STEP_4'
                    session.store.lending.amount = monto
                    session.store.lending.payMethodList = paymentMethods

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

              const payMethod = session.store.lending.payMethodList.find((_, index) => index === payMethodSelected - 1)

              if (payMethod) {
                if (payMethod.descripcion === 'CHEQUE') {
                  const { amount } = session.store.lending

                  const creditResponse = await this.andeService.createCreditExtra({
                    monto: amount,
                    origen: 3,
                    tipoDesembolso: payMethod.codigo,
                    codBanco: null,
                    nroCtaBancaria: null
                  })

                  if (typeof creditResponse === 'object') {
                    response = `
                    ✅ Solicitud de préstamo generada exitosamente

                    ${MENU_HOME}
                    `
                  } else {
                    response = `
                    ${creditResponse}

                    ${MENU_HOME}
                    `
                  }
                } else {
                  session.treeStep = 'STEP_5'
                  session.store.lending.payMethod = payMethod
                  response = 'Por favor indica tu número de cuenta del banco'
                }
              } else response = messageOptionInvalid()
              break

            case 'STEP_5':
              if (isNumber(this.message)) {
                const bankAccountList = await this.andeService.getBankAccountList()

                if (bankAccountList) {
                  const bankAccount = bankAccountList.find(account => account.id.nroCuentaBanco === this.message)

                  if (bankAccount) {
                    const { type, deadline, amount, payMethod } = session.store.lending
                    let creditResponse = ''

                    if (type === 'extraordinario') {
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
                      session.treeStep = 'STEP_1'
                      response = `
                      ✅ Solicitud de préstamo generada exitosamente

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
              } else response = 'Número incorrecto, debe ingresar un número de cuenta valido'
              break

            default:
              response = session.treeStep === 'STEP_1' ? messageOptionInvalid(subOptions) : messageOptionInvalid()
              break
          }
          break
      }
    }

    return this.sendMessage(response)
  }

  private initStore(session: TSession): void {
    session.store = { lending: {} } as any
  }
}
