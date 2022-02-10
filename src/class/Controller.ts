import { AndeService } from '~SERVICES/Ande.service'
import { WassiService } from '~SERVICES/Wassi.service'
import { botDebug } from '~UTILS/debug.util'
import { messageFormatter } from '~UTILS/message.util'

export class Controller {
  protected andeService: AndeService
  private wassiService: WassiService
  protected data: TDataController
  protected message: string

  constructor(data: TDataController) {
    this.andeService = new AndeService()
    this.wassiService = new WassiService()
    this.data = data
    this.message = data.message

    this.startDecisionTree()
  }

  protected async startDecisionTree(): Promise<void> {}

  protected async sendMessage(_response: string): Promise<void> {
    if (_response) {
      const response = messageFormatter(_response)

      switch (global.config.modeAPP) {
        case 'BOT':
          const wassiResponse = await this.wassiService.sendMessage(this.data.phone, response)

          if (wassiResponse) {
            const message = wassiResponse.message.substring(0, 40) + '...'
            botDebug(`WASSI: Message sent successfully - STATUS: ${wassiResponse.status} MESSAGE: ${message}`)
          }

          this.data.res.end()
          break

        case 'API':
          if (!this.data.res.headersSent) {
            this.data.res.status(200).json({
              status: 'OK',
              message: response
            })
          }
          break
      }

      // Update session
      for (let i = 0; i < global.SESSIONS.length; i++) {
        const session = global.SESSIONS[i]

        if (session.phone === this.data.phone) {
          session.treeLevel = TREE_LEVEL
          session.treeStep = TREE_STEP
          session.affiliate = AFFILIATE

          botDebug('SESSION :', session)
          break
        }
      }
    }
  }
}
