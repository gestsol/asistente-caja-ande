import { AndeService } from '~SERVICES/Ande.service'
import { WassiService } from '~SERVICES/Wassi.service'

export class Controller {
  protected wassi: WassiService
  protected ande: AndeService

  constructor() {
    this.wassi = new WassiService()
    this.ande = new AndeService()
  }
}
