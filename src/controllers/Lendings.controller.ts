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
    (M) Elija monto menor`

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
          TREE_STEP = 'STEP_2'

          const deadlineList = await this.andeService.getLendingsSpecial('paralelo')

          if (deadlineList?.length) {
            STORE.deadlineList = deadlineList

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
            // TODO: pensar mejor esta respuesta
            response = `
            No hay opciones disponibles 😔
            ${MENU_HOME}
            `
          }
          break

        case 'B':
          TREE_STEP = 'STEP_2'

          const deadlineCancellationList = await this.andeService.getLendingsSpecial('cancelacion')

          if (deadlineCancellationList?.length) {
            STORE.deadlineCancellationList = deadlineCancellationList

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
            // TODO: pensar mejor esta respuesta
            response = `
            No hay opciones disponibles 😔
            ${MENU_HOME}
            `
          }

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
            case 'STEP_2':
              const optionSelected = Number(this.message)

              if (!isNaN(optionSelected)) {
                TREE_STEP = 'STEP_3'
                const deadline = (STORE.deadlineList as TDeadline[]).find((_, index) => index === optionSelected - 1)

                delete STORE.deadlineList
                STORE.deadline = deadline

                response = subOptions
                break
              }

            case 'STEP_3':
              if (this.message === 'L' || this.message === 'M') {
                TREE_STEP = 'STEP_4'

                const { monto, plazo } = STORE.deadline as TDeadline

                const calculation = await this.andeService.calculateLending('paralelo', monto, plazo)
                // TODO: que se debe hacer con esta información ?, por ahora se muestra el resultado en consola
                // para comprobar que la peticion se realiza adecuadamente
                delete STORE.dealine
                STORE.calculation = calculation
                console.log(calculation)

                const paymentMethods = await this.andeService.getPaymentMethods()

                const paymentOptions = convertArrayInOptions(paymentMethods!, (item, i) => {
                  return `
                  (${i + 1}) ${item.descripcion}
                  `
                })

                response = `
                ¿Cómo querés realizar el pago de tu préstamo?

                ${paymentOptions}
                ${MENU_HOME}
                `
                break
              }

            case 'STEP_4':
              if (this.message === 'C' || this.message === 'T') {
                response =
                  this.message === 'C' ? '( OPCION NO DISPONIBLE )' : 'Por favor indica tu número de cuenta del banco'

                response += `
                  ${MENU_HOME}
                  `
                break
              }

            default:
              response = messageOptionInvalid(options)
              break
          }
          break
      }
    }

    this.sendMessage(response)
  }
}
