import { AndeService } from '~SERVICES/Ande.service'
import { WassiService } from '~SERVICES/Wassi.service'
import { SessionService } from '~SERVICES/Session.service'
import { botDebug } from '~UTILS/debug.util'
import { messageFormatter } from '~UTILS/message.util'
import { getConfig } from '~UTILS/config.util'

export class Controller {
  protected andeService: AndeService
  private wassiService: WassiService
  protected data: TDataController
  protected message: string

  protected options: string = ''
  protected menuHome: string = ''

  constructor(data: TDataController) {
    this.andeService = new AndeService()
    this.wassiService = new WassiService()
    this.data = data
    this.message = data.message
    this.menuHome = data.menuHome
    this.start()
  }

  private async start(): Promise<void> {
    const response = await this.startDecisionTree()

    if (response && !this.data.res.headersSent) {
      this.data.res.end()
    }

    if (response) {
      // Update session
      SessionService.update(this.data.phone)
    }
  }

  // Este metodo solo sirve como interface para overwrite en los controllers
  protected async startDecisionTree(): Promise<any> {
    return true
  }

  protected async sendMessage(response: string): Promise<boolean> {
    if (response && response !== 'OK') {
      const _response = messageFormatter(response)

      switch (getConfig().modeAPP) {
        case 'BOT':
          const wassiResponse = await this.wassiService.sendMessage({
            phone: this.data.phone,
            message: _response
          })

          if (wassiResponse) {
            let { message, status } = wassiResponse
            message = message.length < 60 ? message : message.substring(0, 60) + '...'

            botDebug('WASSI-OUT', `${getConfig().nroBot} -> (Message in ${status}) ${message}`)
          }
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
    }

    return response ? true : false
  }

  protected async sendFile(filename: string, file: TDataStream): Promise<void> {
    switch (getConfig().modeAPP) {
      case 'BOT':
        const [fileData] = await this.wassiService.uploadFile({ filename }, file)

        if (fileData) {
          const wassiResponse = await this.wassiService.sendFile({
            phone: this.data.phone,
            media: { file: fileData.id }
          })

          if (wassiResponse) {
            const {
              media: { file },
              status
            } = wassiResponse

            botDebug('WASSI-OUT', `${getConfig().nroBot} -> (File in ${status}) ${file}`)
          }
        }
        break

      case 'API':
        if (!this.data.res.headersSent) {
          this.data.res.json({
            status: 'OK',
            file: file.setEncoding('utf-8').read()
          })
        }
        break
    }
  }
}
