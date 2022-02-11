import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { messageOptionInvalid } from '~UTILS/message.util'

export class LendingsController extends Controller {
  async startDecisionTree() {
    let response = ''
    const options = `
    (111) Préstamo especial ✨
    (112) Préstamo estudiantil 📚
    (113) Préstamo extraordinario 💰`

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'LENDINGS'
        TREE_STEP = ''

        response = `
        Elige una de las siguientes opciones:
        ${options}
        ${MENU_HOME}
        `
        break

      case '111':
        break

      case '112':
        break

      case '113':
        break

      case '0':
        TREE_LEVEL = 'HOME'
        new HomeController({
          ...this.data,
          message: 'menu'
        })
        break

      default:
        response = messageOptionInvalid(options)
        break
    }

    this.sendMessage(response)
  }
}
