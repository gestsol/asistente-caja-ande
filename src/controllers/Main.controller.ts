import { Controller } from 'entities/class'
import { LoginController } from '~CONTROLLERS/Login.controller'

export class MainController extends Controller {
  constructor(private data: any) {
    super()
  }

  public async startDecisionTree(): Promise<string> {
    const {
      chat: {
        contact: { displayName }
      },
      body
    } = this.data
    const message = body
    let response = ''

    switch (message) {
      case '1':
        response = `
        Hola! soy el asistente virtual de los afiliados de la CAJA 🤓
        Nuestra caja, tu futuro!

        Por favor enviános tu número de CI para ayudarte
        `
        FLOW_STATE = 'cedula'
        break

      case '2':
        response = `
        Mesa de Entrada
        ( Opciones no disponible )
        `
        break

      default:
        if (FLOW_STATE) {
          const loginController = new LoginController(message)
          response = await loginController.startDecisionTree()
        } else
          response = `
        Hola 🤗 ${displayName}, soy el Asistente Virtual de Caja Ande.
        Selecciona una opción para poder ayudarte:

        (1) Acceso para afiliados de la CAJA
        (2) No afiliados
        `
        break
    }

    return response
  }
}
