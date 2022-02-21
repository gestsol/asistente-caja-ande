import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { convertArrayInOptions, messageOptionInvalid } from '~UTILS/message.util'

export class LendingsController extends Controller {
  async startDecisionTree() {
    let response = ''
    const options = `
    (111) Préstamo especial ✨
    (113) Préstamo estudiantil 📚
    (114) Préstamo extraordinario 💰`

    const subOptions = `
    (L) La totalidad
    (M) Escriba un monto menor`

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
            ${ANDE?.affiliate.nombre || 'NAME'} felicidades 🎉
            Tenés un crédito Pre-Aprobado.

            (3) Más información del crédito pre aprobado
            ${MENU_HOME}
            `
            break
        }
      } else {
        TREE_STEP = 'STEP_1'

        response = `
        Elige una de las siguientes opciones:
        ${options}
        ${MENU_HOME}
        `
      }
    } else {
      switch (this.message) {
        case '111':
          this.initStore()

          response = `
          Préstamo especial ✨

          (A) Préstamos en paralelo
          (B) Prétamos con cancelación
          ${MENU_HOME}
          `
          break

        case '113':
          response = `
          Préstamo estudiantil 📚
          ${subOptions}
          `
          break

        case '114':
          response = `
          Préstamo extraordinario 💰
          ${subOptions}
          `
          break

        case 'A':
          STORE.lendingSpecial.payload.type = 'paralelo'

          const deadlineList = await this.andeService.getLendingsSpecial()

          if (deadlineList?.length) {
            TREE_STEP = 'STEP_2'
            STORE.lendingSpecial.payload.deadlineList = deadlineList

            const lendingOptions = convertArrayInOptions(deadlineList, (item, i) => {
              return `
              (${i + 1})
              *Plazo*: ${item.plazo}
              *Monto*: ${item.monto}
              `
            })

            response = `
            Opciones de plazo para préstamo en paralelo
            ${lendingOptions}
            ${MENU_HOME}
            `
          } else {
            response = `
            No hay opciones disponibles para préstamos en paralelo 😔
            ${MENU_HOME}
            `
          }
          break

        case 'B':
          STORE.lendingSpecial.payload.type = 'cancelacion'

          const deadlineCancellationList = await this.andeService.getLendingsSpecial()

          if (deadlineCancellationList?.length) {
            TREE_STEP = 'STEP_2'
            STORE.lendingSpecial.payload.deadlineList = deadlineCancellationList

            const lendingOptions = convertArrayInOptions(deadlineCancellationList, (item, i) => {
              return `
              *Opción (${i + 1})*
              Plazo: ${item.plazo}
              Monto: ${item.monto}
              `
            })

            response = `
            Opciones de plazo para préstamo con cancelación

            ${lendingOptions}
            ${MENU_HOME}
            `
          } else {
            response = `
            No hay opciones disponibles para prétamo con cancelación 😔
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
                TREE_STEP = 'STEP_3'

                const deadline = STORE.lendingSpecial.payload.deadlineList.find(
                  (_, index) => index === deadlineSelected - 1
                )!

                STORE.lendingSpecial.body.plazo = deadline.plazo
                STORE.lendingSpecial.payload.deadline = deadline

                response = subOptions
                break
              }

              response = messageOptionInvalid()
              break

            case 'STEP_3':
              if (this.message === 'L' || !isNaN(Number(this.message))) {
                let { monto, plazo } = STORE.lendingSpecial.payload.deadline
                monto = this.message === 'L' ? monto : Number(this.message)

                const calculation = await this.andeService.calculateLending(monto, plazo)
                // TODO: que se debe hacer con esta información ?, por ahora se muestra el resultado en consola
                // para comprobar que la peticion se realiza adecuadamente
                // console.log(calculation)

                if (calculation) {
                  STORE.lendingSpecial.body.montoSolicitado = monto

                  const paymentMethods = await this.andeService.getPaymentMethods()

                  if (paymentMethods) {
                    TREE_STEP = 'STEP_4'
                    STORE.lendingSpecial.payload.payMethodList = paymentMethods

                    const paymentOptions = convertArrayInOptions(
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
                  Monto invalido, intentelo nuevamente
                  ${MENU_HOME}
                  `
                }

                break
              }

              response = messageOptionInvalid()
              break

            case 'STEP_4':
              const payMethodSelected = Number(this.message)

              const paymentMethod = STORE.lendingSpecial.payload.payMethodList.find(
                (_, index) => index === payMethodSelected - 1
              )

              if (paymentMethod) {
                const { descripcion, codigo } = paymentMethod

                if (descripcion === 'CHEQUE') {
                  response = `
                  Opción no disponible

                  ${MENU_HOME}
                  `
                  break
                }

                if (descripcion === 'TRANSFERENCIA EN CUENTA') {
                  TREE_STEP = 'STEP_6'

                  STORE.lendingSpecial.body.formaCobro = codigo

                  response = 'Por favor indica tu número de cuenta del banco'
                  break
                }
              }

              response = messageOptionInvalid()
              break

            case 'STEP_6':
              // TODO: Preguntar si los numeros de cuenta solo continen numeros
              if (!isNaN(Number(this.message))) {
                const accountList = await this.andeService.getAccountsBank()

                if (accountList) {
                  const account = accountList.find(account => account.id.nroCuentaBanco === this.message)

                  if (account) {
                    STORE.lendingSpecial.body.idCuentaBancaria = account.idRegistro

                    const result = await this.andeService.createCredit({
                      ...STORE.lendingSpecial.body,
                      nroCuentaBancaria: null,
                      idBanco: null,
                      cumpleRequisitos: 1
                    })

                    if (typeof result === 'object') {
                      // TODO: Determinar respuesta en la peticion y eliminar este log
                      console.log('LINEA DE CREDITO:', result)

                      response = `
                      ✅ Prestamo generado exitosamente

                      ${MENU_HOME}
                      `
                    } else {
                      response = `
                      ⚠️ ${result}

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

    this.sendMessage(response)
  }

  private initStore(): void {
    STORE = { lendingSpecial: { payload: {}, body: {} } as any }
  }
}
