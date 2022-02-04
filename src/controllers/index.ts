import { Controller } from 'entities/class'

export class HomeController extends Controller {
  constructor() {
    super()
  }

  public async startDecisionTree(data: any): Promise<void> {
    const {
      fromNumber,
      chat: {
        contact: { displayName }
      }
    } = data

    const message = `
Hola 🤗 ${displayName}, soy el Asistente Virtual de Caja Ande.
Selecciona una opción para poder ayudarte:

(1) Acceso para afiliados de la CAJA
(2) No afiliados
`

    // const response1 = await this.wassi.sendMessage(fromNumber, message)
    const response2 = await this.ande.getUser('0991712781')

    // console.log('RESPUESTA WASSI:', response1)
    console.log('RESPUESTA ANDE', response2)
  }
}
