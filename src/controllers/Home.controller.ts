import { Controller } from 'entities/class'

export class HomeController extends Controller {
  constructor(private message: string) {
    super()
  }

  public async startDecisionTree(): Promise<string> {
    let response = ''

    return response
  }
}
