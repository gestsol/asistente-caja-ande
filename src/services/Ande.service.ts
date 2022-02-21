import { HttpClient } from 'class/HttpClient'
import { getConfig } from '~UTILS/config.util'
import { stringify } from 'qs'

export class AndeService extends HttpClient {
  private nroAffiliate: number
  private typeLending: TLendingSpecial

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
    this.typeLending = STORE.lendingSpecial?.payload?.type || 'paralelo'
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

  public async login<R = TAndeResponse['autenticar']>(body: TAndeBody['autenticar']): Promise<R | null> {
    const urlEncoded = stringify(body) // convertir datos en formato x-www-form-urlencoded

    try {
      const { data } = await this.http.post<R>('/autenticar', urlEncoded, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      return data
    } catch (error) {
      return null
    }
  }

  public async getLendingsSpecial<R = TAndeResponse['lineacredito']>(deadline: number = 0): Promise<R | null> {
    try {
      const { data } = await this.http.get<R>(
        `/lineacredito/${this.typeLending === 'paralelo' ? '' : 'cancelacion/'}${this.nroAffiliate}/plazo/${deadline}`
      )

      return data
    } catch (error) {
      return null
    }
  }

  public async calculateLending<R = TAndeResponse['calculo']>(amount: number, deadline: number): Promise<R | null> {
    try {
      const { data } = await this.http.get<R>(
        `/calculo/${this.nroAffiliate}/monto/${amount}/plazo/${deadline}/cancelacion/${
          this.typeLending === 'paralelo' ? 0 : 1
        }`
      )

      return data
    } catch (error) {
      return null
    }
  }

  public async getPaymentMethods<R = TAndeResponse['formacobro']>(): Promise<R | null> {
    try {
      const { data } = await this.http.get<R>(`/formacobroptmo`)

      return data
    } catch (error) {
      return null
    }
  }

  public async getAccountsBank<R = TAndeResponse['cuentas']>(): Promise<R | null> {
    try {
      const { data } = await this.http.get<R>(`/cuentas/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return null
    }
  }

  public async createCredit<R = object>(body: TAndeBody['solicitudcredito']): Promise<R | string> {
    try {
      const { data } = await this.http.post<R>(
        `/solicitudcredito/${this.nroAffiliate}/cancelacion/${this.typeLending === 'paralelo' ? 0 : 1}`,
        body
      )

      return data
    } catch (error) {
      return (error as TAndeError)?.mensaje || 'Error al crear linea de credito, intente nuevamente'
    }
  }

  // NOTA: TEMPLATE
  // public async nameFunction<R = any>(body: any): Promise<R | null> {
  //   try {
  //     const { data } = await this.http.get<R>(
  //       ``
  //     )
  //
  //     return data
  //   } catch (error) {
  //     return null
  //   }
  // }
}
