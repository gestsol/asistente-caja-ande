import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { messageOptionInvalid } from '~UTILS/message.util'

export class EntryTable extends Controller {
  async startDecisionTree() {
    let response = ''

    const options = ``

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'ENTRY_TABLE'
        TREE_STEP = ''

        response = `
        Mesa de Entrada

        ${MENU_HOME}
        `
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

    return this.sendMessage(response)
  }
}
