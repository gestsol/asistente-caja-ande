import { HttpClient } from '~CLASS/HttpClient'
import { getConfig } from '~UTILS/config.util'
import { botDebug } from '~UTILS/debug.util'

export class WassiService extends HttpClient {
  private device: string

  constructor() {
    const { apiUrl, token, device } = getConfig().wassi
    super({
      baseURL: apiUrl,
      defaultPath: '/v1',
      headers: { token }
    })
    this.device = device
  }

  public async sendMessage<R = TWassiResponse['messages']['message']>({
    phone,
    message,
    priority = 'normal'
  }: TWassiMessage): Promise<R | null> {
    const body: TWassiBody['messages'] = { phone, message, priority, device: this.device }

    try {
      const { data } = await this.http.post<R>('/messages', body)

      let { message, status } = (data as unknown) as TWassiResponse['messages']['message']
      message = message.search(/\n/) > -1 ? message.split('\n')[0] + '...' : message

      botDebug('WASSI-OUT', `(Message in ${status}) ${message}`)

      return data
    } catch (_) {
      // TODO: crear un mensaje para retornar en caso de error
      console.log(_)
      return null
    }
  }

  public async uploadFile<R = TWassiResponse['files']>(
    { filename, expiration = '10m', permission = 'public' }: TWassiBody['files'],
    stream: TDataStream
  ): Promise<R | []> {
    try {
      const { data } = await this.http.post('/files', stream, {
        headers: { 'Content-Type': 'application/pdf' },
        params: {
          filename,
          expiration,
          format: 'native',
          permission
        }
      })
      return data
    } catch (_) {
      console.log(_)
      return []
    }
  }

  public async sendFile<R = TWassiResponse['messages']['media']>({
    phone,
    message,
    priority = 'normal',
    media
  }: TWassiMessage) {
    const body: TWassiBody['messages'] = { phone, message, priority, media, device: this.device }

    try {
      const { data } = await this.http.post<R>('/messages', body)

      const {
        media: { file },
        status
      } = (data as unknown) as TWassiResponse['messages']['media']

      botDebug('WASSI-OUT', `(File in ${status}) ${file}`)

      return data
    } catch (_) {
      console.log(_)
      return null
    }
  }

  public async downloadFile<R = TDataStream>(fileId: string): Promise<R | null> {
    try {
      const { data } = await this.http.get<R>(`/io/${this.device}/files/${fileId}/download`, {
        responseType: 'stream'
      })

      return data
    } catch (_) {
      console.log(_)
      return null
    }
  }
}
