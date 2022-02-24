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

  private errorMessageHandler(error: unknown | TAndeError, message: string): string {
    const err = error as TAndeError

    switch (err.codigo) {
      case 404:
        return `😔 ${message}`

      case 500:
        return `⚠️ ${err.mensaje}`

      default:
        return '❌ Error al obtener los datos requeridos, intentelo nuevamente'
    }
  }

  // NOTA: TEMPLATE
  // public async nameFunction<R = any>(body: any): Promise<R | string> {
  //   try {
  //     const { data } = await this.http.METHOD<R>(
  //       ``
  //     )
  //
  //     return data
  //   } catch (error) {
  //      return this.errorMessageHandler(error, 'message...')
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
      return (error as TAndeError)?.mensaje || '❌ Error al crear linea de credito, intente nuevamente'
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
      const { data } = await this.http.post<R>(`/solicitudtc/${this.nroAffiliate}`, body)

      return data
    } catch (error) {
      return null
    }
  }

  // LENDING-QUERY _____________________________________________________________________________________________________

  public async getTotalFee<R = TAndeResponse['montocuota']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(`/montocuota/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return (error as TAndeError)?.mensaje || '❌ No se pudo obtener el total de cuotas'
    }
  }

  public async getSituationLending<R = TAndeResponse['situacioncredito']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(`/situacioncredito/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return (error as TAndeError)?.mensaje || '❌ No se pudo obtener su situación de crédito actual'
    }
  }

  public async getClosingDate<R = TAndeResponse['fechacierre']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>('/fechacierre')

      return data
    } catch (error) {
      return (error as TAndeError)?.mensaje || 'Sin datos 😔'
    }
  }

  public async getClainList<R = TAndeResponse['reclamoCabecera']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(`/reclamo/cabecera/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return this.errorMessageHandler(error, 'No hay lista de reclamos disponibles')
    }
  }

  public async getClain<R = TAndeResponse['reclamo']>(periodo: string): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(`/reclamo/${this.nroAffiliate}/${periodo}`)

      return data
    } catch (error) {
      return this.errorMessageHandler(error, 'No hay información de descuento para el mes actual')
    }
  }

  public async getRestFee<R = TAndeResponse['reposo']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(`/reposo/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return this.errorMessageHandler(error, 'No hay información de cuotas por reposo')
    }
  }
  public async getLastTreasuryPayment<R = TAndeResponse['pagocaja']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(`/pagocaja/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return this.errorMessageHandler(error, 'No hay información de último pago de tesorería')
    }
  }

  // NEWS ______________________________________________________________________________________________________________

  public async getPaymentDate<R = TAndeResponse['fechacobro']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(`/fechacobro/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return (error as TAndeError)?.mensaje || '❌ Error al obtener la fecha de pago'
    }
  }

  public async getLinks<R = TAndeResponse['enlaces']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(`/enlaces`)

      return data
    } catch (error) {
      return (error as TAndeError)?.mensaje || '❌ No se pudieron obtener las noticias destacadas'
    }
  }

  // INFO ______________________________________________________________________________________________________________

  public async getInfoList<R = TAndeResponse['info']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>('/info')

      return data
    } catch (error) {
      return (error as TAndeError)?.mensaje || '❌ No se pudo obtener la información'
    }
  }

  // DOWNLOAD __________________________________________________________________________________________________________

  public async getDocsList<R = TDocList>(docType: TDocType): Promise<R | string> {
    try {
      const { data } = await this.http.get<TDocList>(`/${docType}/cabecera/${this.nroAffiliate}`)

      const dataWrapper = data.map(item => ({
        ...item,
        nroDocumento: item.nroFactura
      }))

      return (dataWrapper as unknown) as R
    } catch (error) {
      return this.errorMessageHandler(error, 'No hay documentos para descargar')
    }
  }

  public async downloadDoc<R = TAndeResponse['pdf']>(
    docType: TDocType,
    { periodo, nroDocumento }: TAndeBody['facturaPdf']
  ): Promise<{ pdf: R } | string> {
    try {
      const { data } = await this.http.get<string>(`/${docType}/pdf/${this.nroAffiliate}/${periodo}/${nroDocumento}`)

      return {
        pdf: (data.substring(0, 40) as unknown) as R
      }
    } catch (error) {
      return this.errorMessageHandler(error, 'No se pudo obtener el documento solicitado')
    }
  }
}
