import { Controller } from '~CLASS/Controller'
import { CreditCardController } from '~CONTROLLERS/CreditCard.controller'
import { LendingQuery } from '~CONTROLLERS/LendingQuery.controller'
import { MainController } from '~CONTROLLERS/Main.controller'
import { NewsController } from '~CONTROLLERS/News.controller'
import { PersonalDataController } from '~CONTROLLERS/PersonalData.controller'
import { DownloadController } from '~CONTROLLERS/Download.controller'
import { LendingsController } from '~CONTROLLERS/Lendings.controller'
import { InfoController } from '~CONTROLLERS/Info.controller'
import { EntryTable } from '~CONTROLLERS/EntryTable.controller'

import { convertMessageInFullname, messageOptionInvalid } from '~UTILS/message.util'

export class HomeController extends Controller {
  async startDecisionTree() {
    let response = ''

    const options = this.menuHome

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'HOME'
        TREE_STEP = ''

        const fullName = convertMessageInFullname(ANDE!.affiliate.nombre)

        response = `
        Bienvenido ${fullName}. En Caja Ande trabajamo para vos 🤓, revisa las opciones que tenemos desponible:
        ${options}

        (00) Cerrar Sesión ↩️
        `
        break

      case '11':
        new LendingsController({
          ...this.data,
          message: 'menu'
        })
        break

      case '12':
        new CreditCardController({
          ...this.data,
          message: 'menu'
        })
        break

      case '13':
        new LendingQuery({
          ...this.data,
          message: 'menu'
        })
        break

      case '14':
        new NewsController({
          ...this.data,
          message: 'menu'
        })
        break

      case '15':
        new PersonalDataController({
          ...this.data,
          message: 'menu'
        })
        break

      case '16':
        new DownloadController({
          ...this.data,
          message: 'menu'
        })
        break

      case '17':
        new InfoController({
          ...this.data,
          message: 'menu'
        })
        break

      case '18':
        new EntryTable({
          ...this.data,
          message: 'menu'
        })
        break

      case '0':
        TREE_LEVEL = 'MAIN'
        new MainController(this.data)
        break

      case '00':
        TREE_LEVEL = 'MAIN'
        TREE_STEP = 'STEP_1'

        new MainController({
          ...this.data,
          message: '1'
        })
        break

      default:
        response = messageOptionInvalid(options)
        break
    }

    return this.sendMessage(response)
  }
}
