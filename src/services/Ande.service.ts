import { HttpClient } from 'class/HttpClient'
import { getConfig } from '~UTILS/config.util'
import { stringify } from 'qs'

export class AndeService extends HttpClient {
  private nroAffiliate: number
  private typeLending: TTypeLending

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

  // LENDING ___________________________________________________________________________________________________________

  public async getLendings<R = TAndeResponse['lineacredito']>(
    type: TTypeLending,
    deadline: number = 0
  ): Promise<R | null> {
    STORE.lendingSpecial.payload.type = type

    let endpoint = ''

    switch (type) {
      case 'paralelo':
        endpoint = `/lineacredito/${this.nroAffiliate}/plazo/${deadline}`
        break

      case 'cancelacion':
        endpoint = `/lineacredito/cancelacion/${this.nroAffiliate}/plazo/${deadline}`
        break

      case 'student':
        endpoint = `/lineacreditoestudiantil/${this.nroAffiliate}`
        break

      case 'extraordinary':
        endpoint = `/lineacreditoextra/${this.nroAffiliate}`
        break
    }

    try {
      const { data } = await this.http.get<R>(endpoint)

      return data
    } catch (error) {
      return null
    }
  }

  public async calculateLending<R = TAndeResponse['calculo']>(amount: number, deadline: number): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(
        `/calculo/${this.nroAffiliate}/monto/${amount}/plazo/${deadline}/cancelacion/${
          this.typeLending === 'cancelacion' ? 1 : 0
        }`
      )

      return data
    } catch (error) {
      return (error as TAndeError)?.mensaje || 'Monto invalido, intentelo nuevamente'
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
    let endpoint = '/solicitudcredito'

    switch (this.typeLending) {
      case 'paralelo':
        endpoint += `/${this.nroAffiliate}/cancelacion/0`
        break

      case 'cancelacion':
        endpoint += `/${this.nroAffiliate}/cancelacion/1`
        break

      case 'student':
        endpoint += `/estudiantil/${this.nroAffiliate}`
        break

      case 'extraordinary':
        endpoint += `/extraordinario/${this.nroAffiliate}`
        break
    }

    try {
      const { data } = await this.http.post<R>(endpoint, body)

      return data
    } catch (error) {
      return (error as TAndeError)?.mensaje || 'Error al crear linea de credito, intente nuevamente'
    }
  }

  // CREDIT-CARD _______________________________________________________________________________________________________

  public async getCreditCards<R = TAndeResponse['datosstc']>(): Promise<R | null> {
    try {
      const { data } = await this.http.get<R>(`/datostc/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return null
    }
  }

  public async createCreditCard<R = TAndeResponse['solicitudtc']>(body: TAndeBody['solicitudtc']): Promise<R | null> {
    try {
      const { data } = await this.http.get<R>(`/solicitudtc/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return null
    }
  }
}
