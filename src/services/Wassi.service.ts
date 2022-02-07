import { HttpClientService } from '~SERVICES/HttpClient.service'

export class WassiService extends HttpClientService {
  private device

  constructor() {
    const { apiUrl, token, device } = global.config.wassi

    super({
      baseURL: apiUrl,
      defaultPath: '/v1/messages',
      token
    })
    this.device = device
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
