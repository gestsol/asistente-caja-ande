import { AndeService } from '~SERVICES/Ande.service'
import { WassiService } from '~SERVICES/Wassi.service'
import { SessionService } from '~SERVICES/Session.service'
import { messageFormatter, messageMenuHome } from '~UTILS/message.util'
import { getConfig } from '~UTILS/config.util'

export class Controller {
  private wassiService: WassiService
  protected andeService: AndeService
  protected data: TDataController
  protected message: string

  constructor(data: TDataController) {
    this.andeService = new AndeService(data.session)
    this.wassiService = new WassiService()
    this.data = data
    this.message = data.message
    this.start()
  }

  public get phone(): string {
    return this.data.session.phone
  }

  private async start(): Promise<void> {
    const response = await this.startDecisionTree(this.data.session)

    if (response) {
      // Update session
      SessionService.update(this.data.session)
    }
  }

  // Este metodo solo sirve como interface para overwrite en los controllers
  protected async startDecisionTree(session: TSession): Promise<boolean> {
    return true
  }

  protected async sendMessage(response: string): Promise<boolean> {
    if (response && response !== 'OK') {
      let _response = messageMenuHome(response)
      _response = messageFormatter(_response)

      switch (getConfig().modeAPP) {
        case 'BOT':
          await this.wassiService.sendMessage({
            phone: this.phone,
            message: _response
          })
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

  protected async sendFiles(files: TFile[]): Promise<void> {
    switch (getConfig().modeAPP) {
      case 'BOT':
        for await (const file of files) {
          if (typeof file === 'object') {
            const [fileData] = await this.wassiService.uploadFile({ filename: file.filename }, file.stream)

            if (fileData) {
              await this.wassiService.sendFile({
                phone: this.phone,
                media: { file: fileData.id }
              })
            } else await this.sendMessage(`⚠️ Error al obtener el archivo: ${file.filename}`)
          } else await this.sendMessage(file)
        }
        break

      case 'API':
        if (!this.data.res.headersSent) {
          this.data.res.json({
            status: 'OK',
            files: files.map(file => {
              return typeof file === 'object' ? file.filename : file
            })
          })
        }
        break
    }
  }

  protected async downloadFile(id: string) {
    return await this.wassiService.downloadFile(id)
  }
}
