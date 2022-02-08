import { HttpClient } from 'class/HttpClient'

export class AndeService extends HttpClient {
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
    } catch (error) {
      return null
    }
  }

  public async getAffiliateByCI(ci: string): Promise<any> {
    try {
      const { data } = await this.http.get(`/afiliado/cedula/${ci}`)
      return data
    } catch (error) {
      return null
    }
  }

  public async getAffiliateByNro(affiliate: string): Promise<TAffiliate | null> {
    try {
      const { data } = await this.http.get<TAffiliate>(`/opcionesmenu/${affiliate}`)
      return data
    } catch (error) {
      return null
    }
  }
}
