import { AndeService } from '~SERVICES/Ande.service'
import { WassiService } from '~SERVICES/Wassi.service'
import { SessionService } from '~SERVICES/Session.service'
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
          await this.wassiService.sendMessage({
            phone: this.data.phone,
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
                phone: this.data.phone,
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

  protected async downloadFile(id: string): Promise<TDataStream | null> {
    return await this.wassiService.downloadFile(id)
  }
}
