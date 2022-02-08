import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_RETURN } from '~ENTITIES/consts'

export class LoginController extends Controller {
  async startDecisionTree() {
    let response = ''

    switch (FLOW_STATE) {
      case 'LOGIN_STEP_1':
        // const data = await this.andeService.getAffiliateByCI(this.message)

        if (this.message === '3809540') {
          FLOW_STATE = 'LOGIN_STEP_2'

          response = 'Poné tu nro de Afiliado'
        } else response = 'CI invalido'
        break

      case 'LOGIN_STEP_2':
        // const affiliate = await this.andeService.getAffiliateByNro(this.message)

        if (this.message === '53054') {
          new HomeController({
            ...this.data,
            message: 'home'
          })
        } else response = 'Nro. de afiliado invalido'
        break
    }

    this.sendMessage(response)
  }
}
