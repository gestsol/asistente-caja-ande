import { HttpClientService } from '~SERVICES/HttpClient.service'

export class WassiService extends HttpClientService {
  constructor() {
    const { apiUrl } = global.config.wassi
    super(apiUrl, '/v1/messages')
  }

  public async sendMessage(phone: string, message: string): Promise<TWassiResponse | null> {
    const body = { phone, message, device: this.device }

    try {
      const { data } = await this.http.post('/', body)
      return data
    } catch (_) {
      return null
    }
  }
}
