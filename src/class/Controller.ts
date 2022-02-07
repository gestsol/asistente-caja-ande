import { AndeService } from '~SERVICES/Ande.service'
import { WassiService } from '~SERVICES/Wassi.service'

export class Controller {
  protected andeService: AndeService
  private wassiService: WassiService

  protected data: any

  protected username: string
  protected message: string

  constructor(data) {
    this.andeService = new AndeService()
    this.wassiService = new WassiService()

    this.data = data

    this.username = data.username
    this.message = data.message

    this.startDecisionTree()
  }

  protected async startDecisionTree(): Promise<void> {}

  protected async sendMessage(response: string): Promise<void> {
    await this.wassiService.sendMessage(this.data.phone, response.trim())
  }
}
