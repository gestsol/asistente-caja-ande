import { AndeService } from '~SERVICES/Ande.service'

export class Controller {
  protected ande: AndeService

  constructor() {
    this.ande = new AndeService()
  }
}
