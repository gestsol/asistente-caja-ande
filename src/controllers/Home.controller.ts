import { Controller } from '~ENTITIES/class'

export class HomeController extends Controller {
  async startDecisionTree() {
    await this.sendMessage('')
  }
}
