import { Controller } from '~CLASS/Controller'
import { LoginController } from '~CONTROLLERS/Login.controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { CreditCardController } from '~CONTROLLERS/CreditCard.controller'
import { LendingQuery } from '~CONTROLLERS/LendingQuery.controller'
import { NewsController } from '~CONTROLLERS/News.controller'
import { PersonalDataController } from '~CONTROLLERS/PersonalData.controller'
import { DownloadController } from '~CONTROLLERS/Download.controller'
import { InfoController } from '~CONTROLLERS/Info.controller'
import { EntryTableController } from '~CONTROLLERS/EntryTable.controller'
import { LendingsController } from '~CONTROLLERS/Lendings.controller'

import { messageOptionInvalid } from '~UTILS/message.util'

export class MainController extends Controller {
  async startDecisionTree(session: TSession) {
    let response = ''

    const options = `
    (1) Acceso para afiliados de la CAJA
    (2) No afiliados`

    switch (session.treeLevel) {
      case 'MAIN':
        if (session.treeStep === '') {
          session.treeStep = 'STEP_1'

          response = `
          Hola 🤗 soy el Asistente Virtual de Caja Ande.
          Selecciona una opción para poder ayudarte:
          ${options}_`
        } else if (session.treeStep === 'STEP_1') {
          switch (this.message) {
            case '1':
              session.treeStep = ''

              new LoginController({
                ...this.data,
                message: 'menu'
              })
              break

            case '2':
              session.treeStep = ''

              new EntryTableController({
                ...this.data,
                message: 'menu'
              })
              break

            default:
              response = messageOptionInvalid(options) + '_'
              break
          }
        }
        break

      case 'LOGIN':
        new LoginController(this.data)
        break

      case 'HOME':
        new HomeController(this.data)
        break

      case 'LENDINGS':
        new LendingsController(this.data)
        break

      case 'CREDIT_CARD':
        new CreditCardController(this.data)
        break

      case 'LENDING_QUERY':
        new LendingQuery(this.data)
        break

      case 'NEWS':
        new NewsController(this.data)
        break

      case 'PERSONAL_DATA':
        new PersonalDataController(this.data)
        break

      case 'DOWNLOAD':
        new DownloadController(this.data)
        break

      case 'LINKS':
        new InfoController(this.data)
        break

      case 'ENTRY_TABLE':
        new EntryTableController(this.data)
        break
    }

    return this.sendMessage(response)
  }
}
