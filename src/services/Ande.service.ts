import { HttpClientService } from '~SERVICES/HttpClient.service'

export class AndeService extends HttpClientService {
  constructor() {
    const { apiUrl } = global.config.ande
    super({
      baseURL: apiUrl,
      defaultPath: '/cjppa/rest/chatbot'
    })
  }

  public async getAffiliateByPhone(phone: string): Promise<any> {
    try {
      const { data } = await this.http.get(`/afiliado/celular/${phone}`)
      return data
    } catch (error) {}
  }

  public async getAffiliateByCI(ci: string): Promise<any> {
    try {
      const { data } = await this.http.get(`afiliado/cedula/${ci}`)
      return data
    } catch (error) {}
  }

  public async getAffiliateByNro(affiliate: string): Promise<any> {
    try {
      const { data } = await this.http.get(`/opcionesmenu/${affiliate}`)
      return data
    } catch (error) {}
  }
}
