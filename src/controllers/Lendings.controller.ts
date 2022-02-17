import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { messageOptionInvalid } from '~UTILS/message.util'

export class LendingsController extends Controller {
  async startDecisionTree() {
    let response = ''
    const options = `
    (111) Préstamo especial ✨
    (112) Préstamo en promoción 💰
    (113) Préstamo estudiantil 📚
    (114) Préstamo extraordinario 💰
    (115) Préstamo hipotecario 🏡`

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

          ( INFORMACIÓN )

          (A) Nuevos prestamos
          (B) Prétamo con cancelación

          ${MENU_HOME}
          `
          break

        case '112':
          response = `
          Préstamo en promoción 💰

          ( INFORMACIÓN )

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

        case '115':
          response = `
          Préstamo hipotecario 🏡

          ( INFORMACIÓN )

          ${MENU_HOME}
          `
          break

        case 'A':
          TREE_STEP = 'STEP_2'

          response = `
          (1) Optión 1
          (2) Optión 2
          (3) Optión 3
          (4) Optión 4
          (5) Optión 5
          (6) Optión 6
          (7) Optión 7
          ${MENU_HOME}
          `
          break

        case 'B':
          response = subOptions
          break

        // TODO:
        // case '3':
        //   response = `
        //   ( INFORMACIÓN )

        //   ${MENU_HOME}
        //   `
        //   break

        case 'L':
          response = `
          ¿Cómo querés realizar el pago de tu préstamo?

          (C) Cheque
          (T) Transferencia
          `
          break

        case 'M':
          response = `
          ¿Cómo querés realizar el pago de tu préstamo?

          (C) Cheque
          (T) Transferencia
          `
          break

        case 'C':
          TREE_STEP = 'STEP_3'
          response = 'Por favor indica tu número de cuenta del banco'
          break

        case 'T':
          TREE_STEP = 'STEP_3'
          response = 'Por favor indica tu número de cuenta del banco'
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
              response = subOptions
              break

            case 'STEP_3':
              response = `
              ( INFORMACIÓN )

              ${MENU_HOME}
              `
              break

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
