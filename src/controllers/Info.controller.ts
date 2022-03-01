import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { convertArrayInMessage, messageOptionInvalid } from '~UTILS/message.util'

export class InfoController extends Controller {
  async startDecisionTree() {
    let response = ''

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'LINKS'
        TREE_STEP = ''

        const infoList = await this.andeService.getInfoList()

        if (typeof infoList === 'object') {
          if (infoList.length) {
            const enabledInfoList = infoList.filter(info => info.estado)

            const infoOptions = convertArrayInMessage(enabledInfoList, (item, i) => {
              return `*${item.nombre}:* ${item.descripcion}
              `
            })

            response = `
            Información

            ${infoOptions}
            ${MENU_HOME}
            `
          }
        } else {
          response = `
          ${infoList}

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
        response = messageOptionInvalid()
        break
    }

    return this.sendMessage(response)
  }
}
