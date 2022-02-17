import { HttpClient } from 'class/HttpClient'
import { getConfig } from '~UTILS/config.util'
import { stringify } from 'qs'

export class AndeService extends HttpClient {
  constructor() {
    const { apiUrl } = getConfig().ande
    super({
      baseURL: apiUrl,
      defaultPath: '/cjppa/rest/chatbot',
      timeoutSecond: 60,
      headers: {
        'X-token': ANDE?.token || ''
      }
    })
  }

  // public async getAffiliateByPhone(phone: string): Promise<any | null> {
  //   try {
  //     const { data } = await this.http.get(`/afiliado/celular/${phone}`)
  //     return data
  //   } catch (_) {
  //     return null
  //   }
  // }

  // public async getAffiliateByCI(ci: string): Promise<TAffiliate | null> {
  //   try {
  //     const { data } = await this.http.get(`/afiliado/cedula/${ci}`)
  //     return data
  //   } catch (_) {
  //     return null
  //   }
  // }

  // public async getAffiliateByNro(affiliate: string): Promise<TAffiliate | null> {
  //   try {
  //     const { data } = await this.http.get<TAffiliate>(`/opcionesmenu/${affiliate}`)
  //     return data
  //   } catch (_) {
  //     return null
  //   }
  // }

  public async login(body: TAndeBody['autenticar']): Promise<TAndeResponse['autenticar'] | null> {
    const urlEncoded = stringify(body) // convertir datos en formato x-www-form-urlencoded

    try {
      const { data } = await this.http.post<TAndeResponse['autenticar']>('/autenticar', urlEncoded, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      return data
    } catch (error) {
      return null
    }
  }
}
