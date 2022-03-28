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

    // NOTA: Logica para verificar los "creditos aprovados" descartada, se deja comentada
    // por si se necesita agregar mas adelante
    // const creditAproved = session.ande?.affiliate.nroCedula === 4627572
    //   if (creditAproved) {
    //     switch (this.message) {
    //       case '0':
    //         session.treeLevel = 'HOME'
    //         new HomeController({
    //           ...this.data,
    //           message: 'menu'
    //         })
    //         break
    //       case '3':
    //         response = `
    //         ( INFORMACIÓN )
    //         ${MENU_HOME}
    //         `
    //         break
    //       default:
    //         response = `
    //         ${session.ande!.affiliate.nombre} felicidades 🎉
    //         Tenés un crédito Pre-Aprobado.
    //         (3) Más información del crédito pre aprobado
    //         ${MENU_HOME}
    //         `
    //         break
    //     }
    //   } else {
    //     session.treeStep = 'STEP_1'
    //     this.initStore(session)
    //     response = `
    //     Elige una de las siguientes opciones:
    //     ${options}
    //     ${MENU_HOME}
    //     `
    //   }
    //   return
    // }

    switch (this.message) {
      case 'menu':
        session.treeLevel = 'LENDINGS'
        session.treeStep = ''

        this.initStore(session)

        response = `
        Elige una de las siguientes opciones:
        ${options}
        ${MENU_HOME}
        `
        break

      case '111':
        session.treeStep = 'STEP_1'

        response = `
        Préstamo especial ✨

        (A) En paralelo
        (B) Cancelando todos los préstamos vigentes
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

      case '0':
        this.initStore(session)

        new HomeController({
          ...this.data,
          message: 'menu'
        })
        break

      default:
        switch (session.treeStep) {
          case 'STEP_1':
            if (this.message === 'A') {
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
            } else if (this.message === 'B') {
              const deadlineCancelList = await this.andeService.getLendings('cancelacion')

              if (typeof deadlineCancelList === 'object') {
                session.treeStep = 'STEP_2'
                session.store.lending.deadlineList = deadlineCancelList

                const lendingOptions = convertArrayInMessage(deadlineCancelList, (item, i) => {
                  return `
                  (${i + 1})
                  *Plazo*: ${item.plazo}
                  *Monto*: ${convertInGuarani(item.monto)}
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
            } else response = messageOptionInvalid()
            break

          case 'STEP_2':
            const deadlineSelected = isNumber(this.message)
            const deadline = deadlineSelected
              ? session.store.lending.deadlineList.find((_, index) => index === deadlineSelected - 1)!
              : null

            if (deadline) {
              session.treeStep = 'STEP_3'
              session.store.lending.deadline = deadline

              response = `
              (L) La totalidad
              (  ) Escriba un monto menor a solicitar
              `
            } else response = messageOptionInvalid()
            break

          case 'STEP_3':
            const {
              deadline: { monto, plazo },
              type
            } = session.store.lending
            const amountMinor = isNumber(this.message)

            if (this.message !== 'L' && !amountMinor) {
              response = messageOptionInvalid()
              break
            }

            if (amountMinor && amountMinor > monto) {
              response = `
              ⚠️ Monto incorrecto, debe ser menor al monto del plazo seleccionado: ${convertInGuarani(monto)}
              `
              break
            }

            const amountSelected = this.message === 'L' ? monto : amountMinor!
            const calculeResponse =
              type === 'extraordinario'
                ? ({ montoCuota: 0 } as TAndeResponse['calculo'])
                : await this.andeService.calculateLending(amountSelected, plazo)

            if (typeof calculeResponse === 'object') {
              const paymentMethods = await this.andeService.getPaymentMethods()
              const fee = calculeResponse.montoCuota

              if (typeof paymentMethods === 'object') {
                session.treeStep = 'STEP_4'
                session.store.lending.amount = amountSelected
                session.store.lending.fee = fee
                session.store.lending.payMethodList = paymentMethods

                // TODO: Cambiar en la API la descripcion para transferencia
                const paymentOptions = convertArrayInMessage(
                  paymentMethods,
                  (item, i) => `\n(${i + 1}) ${item.descripcion}`
                )

                response = fee > 0 ? `La cuota del prestamo seleccionado es de ${convertInGuarani(fee)}` : ''

                response += `

                ¿Cómo quieres cobrar tu préstamo?
                ${paymentOptions}
                ${MENU_HOME}
                `
              } else {
                response = `
                ${paymentMethods}

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

          case 'STEP_4':
            const payMethodSelected = isNumber(this.message)
            const payMethod = payMethodSelected
              ? session.store.lending.payMethodList.find((_, index) => index === payMethodSelected - 1)
              : null

            if (payMethod) {
              if (payMethod.descripcion === 'CHEQUE') {
                const { type, deadline, amount } = session.store.lending
                let creditResponse: TAndeResponse['solicitudcredito'] | string = ''

                if (type === 'extraordinario') {
                  creditResponse = await this.andeService.createCreditExtra({
                    monto: amount,
                    origen: 3,
                    tipoDesembolso: 0,
                    codBanco: null,
                    nroCtaBancaria: null
                  })
                } else {
                  creditResponse = await this.andeService.createCredit({
                    plazo: deadline.plazo,
                    montoSolicitado: amount,
                    formaCobro: 0,
                    idCuentaBancaria: null,
                    nroCuentaBancaria: null,
                    idBanco: null,
                    cumpleRequisitos: 1 // Valor estático
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
                const bankAccountList = await this.andeService.getBankAccountList()

                if (typeof bankAccountList === 'object') {
                  if (bankAccountList.length) {
                    session.treeStep = 'STEP_5'
                    session.store.lending.bankAccountList = bankAccountList

                    response = 'Por favor indica tu número de cuenta del banco Itaú'
                  } else {
                    response = `
                    No puede usar este metodo de pago porque no posee una cuenta bancaria 😔
                    Seleccione otro metodo por favor

                    ${MENU_HOME}
                    `
                  }
                } else {
                  response = `
                  ${bankAccountList}

                  ${MENU_HOME}
                  `
                }
              }
            } else response = messageOptionInvalid()
            break

          case 'STEP_5':
            if (isNumber(this.message)) {
              const { bankAccountList, type, deadline, amount } = session.store.lending
              const bankAccount = bankAccountList.find(account => account.id.nroCuentaBanco === this.message)

              if (bankAccount) {
                let creditResponse = ''

                if (type === 'extraordinario') {
                  creditResponse = await this.andeService.createCreditExtra({
                    monto: amount,
                    origen: 3, // Valor estático
                    tipoDesembolso: 1,
                    codBanco: bankAccount.id.codBanco,
                    nroCtaBancaria: Number(bankAccount.id.nroCuentaBanco)
                  })
                } else {
                  creditResponse = await this.andeService.createCredit({
                    plazo: deadline.plazo,
                    montoSolicitado: amount,
                    formaCobro: 1,
                    idCuentaBancaria: bankAccount.idRegistro,
                    nroCuentaBancaria: Number(bankAccount.id.nroCuentaBanco),
                    idBanco: bankAccount.id.codBanco,
                    cumpleRequisitos: 1 // Valor estático
                  })
                }

                if (typeof creditResponse === 'object') {
                  session.treeStep = 'STEP_1'
                  response = `
                  ✅ Solicitud de préstamo generada exitosamente
                  Estará sujeto de aprobación

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
            } else response = 'Número incorrecto, debe ingresar un número de cuenta valido'
            break

          default:
            response = messageOptionInvalid(options)
            break
        }
        break
    }

    return this.sendMessage(response)
  }

  private initStore(session: TSession): void {
    session.store = { lending: {} } as any
  }
}
