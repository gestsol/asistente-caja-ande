import { AndeService } from '~SERVICES/Ande.service'
import { WassiService } from '~SERVICES/Wassi.service'
import { botDebug } from '~UTILS/debug.util'
import { messageFormatter, messageOptionInvalid } from '~UTILS/message.util'

export class Controller {
  protected andeService: AndeService
  private wassiService: WassiService
  protected data: TDataController
  protected message: string

  protected response: string = ''
  protected options: string = ''
  protected menuHome: string = ''

  constructor(data: TDataController) {
    this.andeService = new AndeService()
    this.wassiService = new WassiService()
    this.data = data
    this.message = data.message
    this.menuHome = data.menuHome
    this.startDecisionTree()
  }

  protected async startDecisionTree(): Promise<void> {}

  protected async executeOptions(func: Function): Promise<void> {
    await func()
    // TODO: Manejar los menu de retorno aqui mismo
    // if (this.message === '00') {
    //   this.message = 'menu'
    //   await this.startDecisionTree()
    // }
    await this.sendMessage(this.response || messageOptionInvalid(this.options))
  }

  protected async sendMessage(response: string): Promise<void> {
    if (response) {
      const _response = messageFormatter(response)

      switch (global.config.modeAPP) {
        case 'BOT':
          const wassiResponse = await this.wassiService.sendMessage(this.data.phone, _response)

          if (wassiResponse) {
            let { message, status } = wassiResponse
            message = message.length < 40 ? message : message.substring(0, 40) + '...'

            botDebug(`WASSI: Message in ${status} | MESSAGE: ${message}`)
          }

          this.data.res.end()
          break

        case 'API':
          if (!this.data.res.headersSent) {
            this.data.res.status(200).json({
              status: 'OK',
              message: _response
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
