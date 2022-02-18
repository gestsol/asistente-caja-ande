import { HttpClient } from 'class/HttpClient'
import { getConfig } from '~UTILS/config.util'
import { stringify } from 'qs'

export class AndeService extends HttpClient {
  private nroAffiliate: number

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
    this.nroAffiliate = ANDE!.affiliate.codPersonalAnde
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

  public async getDeadline(deadline: number = 0): Promise<TAndeResponse['lineacredito'] | null> {
    try {
      const { data } = await this.http.get<TAndeResponse['lineacredito']>(
        `/lineacredito/${this.nroAffiliate}/plazo/${deadline}`
      )

      return data
    } catch (error) {
      return null
    }
  }

  public async getDeadlineCancellation(deadline: number = 0): Promise<TAndeResponse['lineacredito'] | null> {
    try {
      const { data } = await this.http.get<TAndeResponse['lineacredito']>(
        `lineacredito/cancelacion/${this.nroAffiliate}/plazo/${deadline}`
      )

      return data
    } catch (error) {
      return null
    }
  }
}
