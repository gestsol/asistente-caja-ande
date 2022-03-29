import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
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
              return `*${item.nombre}:* ${item.descripcion}`
            })

            response = `
            Información

            ${infoOptions}`
          }
        } else response = infoList
        break

      case '0':
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
