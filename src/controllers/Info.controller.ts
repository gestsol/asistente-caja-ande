import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { convertArrayInMessage, messageOptionInvalid } from '~UTILS/message.util'

export class InfoController extends Controller {
  async startDecisionTree(session: TSession) {
    let response = ''

    switch (this.message) {
      case 'menu':
        session.treeLevel = 'LINKS'
        session.treeStep = ''

        const infoList = await this.andeService.getInfoList()

        if (typeof infoList === 'object') {
          if (infoList.length) {
            const enabledInfoList = infoList.filter(info => info.estado)

            const infoOptions = convertArrayInMessage(enabledInfoList, item => {
              return `*${item.nombre}:* ${item.descripcion}\n`
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
        session.treeLevel = 'HOME'
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
