import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { messageOptionInvalid } from '~UTILS/message.util'

export class LinksController extends Controller {
  async startDecisionTree() {
    let response = ''
    const options = `
    (171) Página de la CAJA
    (172) Facebook de la CAJA`

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'LINKS'
        TREE_STEP = ''

        response = `
        Elige una de las siguientes opciones:
        ${options}
        ${MENU_HOME}
        `
        break

      case '171':
        response = `
        Las últimas noticias y actualizaciones de la Caja tenés en la página web, animate y revisala 😎

        https://www.cajaande.gov.py

        ${MENU_HOME}
        `
        break

      case '172':
        response = `
        ¿Creías que no teníamos Facebook? 🥺
        Pues no! en la Caja nos encanta mantenernos en contacto contigo, revisa nuestras últimas publicaciones! 🤓

        https://www.facebook.com/CajaAnde

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

    this.sendMessage(response)
  }
}
