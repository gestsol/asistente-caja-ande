import { HttpClientService } from '~SERVICES/HttpClient.service'

export class AndeService extends HttpClientService {
  constructor() {
    const { apiUrl } = global.config.ande
    super(apiUrl, '/cjppa/rest/chatbot')
  }

  public async getUser(phone: string): Promise<any> {
    try {
      const { status, data } = await this.http.get(`/afiliado/celular/${phone}`)

      console.log(status)

      return data
    } catch (error) {}
  }
}
