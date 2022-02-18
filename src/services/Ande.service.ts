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
    this.nroAffiliate = ANDE?.affiliate.codPersonalAnde || 0
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

  public async getLendingsSpecial(
    type: TTypeLendingSpecial,
    deadline: number = 0
  ): Promise<TAndeResponse['lineacredito'] | null> {
    try {
      const { data } = await this.http.get<TAndeResponse['lineacredito']>(
        `/lineacredito/${type === 'paralelo' ? '' : 'cancelacion/'}${this.nroAffiliate}/plazo/${deadline}`
      )

      return data
    } catch (error) {
      return null
    }
  }

  public async getPaymentMethods(): Promise<TAndeResponse['formacobro'] | null> {
    try {
      const { data } = await this.http.get<TAndeResponse['formacobro']>(`/formacobroptmo`)

      return data
    } catch (error) {
      return null
    }
  }

  public async calculateLending(type: TTypeLendingSpecial, amount: number, deadline: number): Promise<any | null> {
    try {
      const { data } = await this.http.get<any>(
        `calculo/${this.nroAffiliate}/monto/${amount}/plazo/${deadline}/cancelacion/${type === 'paralelo' ? 0 : 1}`
      )

      return data
    } catch (error) {
      return null
    }
  }

  // public async nameFunction(deadline: number = 0): Promise<any | null> {
  //   try {
  //     const { data } = await this.http.get<any>(
  //       ``
  //     )

  //     return data
  //   } catch (error) {
  //     return null
  //   }
  // }
}
