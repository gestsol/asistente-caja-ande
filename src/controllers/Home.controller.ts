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
  async startDecisionTree(session: TSession) {
    let response = ''

    const options = `
    (11) Préstamos 💰
    (12) Tarjetas de crédito 💳
    (13) Consultas sobre préstamos 🧐
    (14) Noticias e informaciones del mes 📱
    (15) Datos personales 😊
    (16) Descargas 🤗
    (17) Información varias 😄
    (18) Mesa de entrada`

    switch (this.message) {
      case 'menu':
        session.treeLevel = 'HOME'
        session.treeStep = ''

        const fullName = convertMessageInFullname(session.ande!.affiliate.nombre)

        response = `
        Bienvenido *${fullName}* en Caja Ande trabajamos para vos 🤓
        Revisa las opciones que tenemos desponible:
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
        session.treeLevel = 'MAIN'
        new MainController(this.data)
        break

      case '00':
        session.treeLevel = 'MAIN'
        session.treeStep = ''
        response = 'Gracias por usar el Asistente Virtual de Caja Ande 👋'
        break

      default:
        response = messageOptionInvalid(options)
        break
    }

    return this.sendMessage(response)
  }
}
