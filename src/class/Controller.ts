import { AndeService } from '~SERVICES/Ande.service'
import { WassiService } from '~SERVICES/Wassi.service'
import { SessionService } from '~SERVICES/Session.service'
import { botDebug } from '~UTILS/debug.util'
import { messageFormatter, messageOptionInvalid } from '~UTILS/message.util'
import { getConfig } from '~UTILS/config.util'

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

      switch (getConfig().modeAPP) {
        case 'BOT':
          const wassiResponse = await this.wassiService.sendMessage({
            phone: this.data.phone,
            message: _response
          })

          if (wassiResponse) {
            let { message, status } = wassiResponse
            message = message.length < 40 ? message : message.substring(0, 40) + '...'

            botDebug('WASSI', `Message in ${status}, ${message}`)
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
      SessionService.update(this.data.phone)
    }
  }

  protected async sendFile(filename: string, file: string): Promise<void> {
    // TODO: remover los mensajes de log, cuando se consiga verificar el buen funcionamiento
    console.log(file)
    const [fileData] = await this.wassiService.uploadFile({ filename }, file)

    if (fileData) {
      console.log(fileData)

      const wassiResponse = await this.wassiService.sendFile({
        phone: this.data.phone,
        media: { file: fileData.id }
      })

      console.log(wassiResponse)

      if (wassiResponse) {
        const {
          media: { file },
          status
        } = wassiResponse

        botDebug('WASSI', `Archivo in ${status}, id: ${file}`)
      }
    }

    this.data.res.end()
  }
}
