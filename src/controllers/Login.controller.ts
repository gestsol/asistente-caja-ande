import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_RETURN, MENU_HOME } from '~ENTITIES/consts'

export class LoginController extends Controller {
  async startDecisionTree() {
    let response = ''

    switch (FLOW_STATE_STEP) {
      case 'STEP_1':
        // const data = await this.andeService.getAffiliateByCI(this.message)

        if (this.message === '3809540') {
          FLOW_STATE_STEP = 'STEP_2'

          response = 'Poné tu nro de Afiliado'
        } else {
          response = `
          Nro de CI invalido ❌

          ${MENU_HOME}
          `
        }
        break

      case 'STEP_2':
        // const affiliate = await this.andeService.getAffiliateByNro(this.message)

        if (this.message === '53054') {
          new HomeController({
            ...this.data,
            message: 'home'
          })
        } else {
          response = `
          Nro. de afiliado invalido ❌

          ${MENU_RETURN}
          `
        }
        break
    }

    this.sendMessage(response)
  }
}
