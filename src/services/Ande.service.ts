import { HttpClient } from 'class/HttpClient'
import { getConfig } from '~UTILS/config.util'
import { stringify as qsStringify } from 'qs'
import FormData from 'form-data'

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

    this.nroAffiliate = ANDE?.affiliate?.codPersonalAnde || 0
    this.typeLending = STORE.lending?.type || 'paralelo'
  }

  private errorMessageHandler(error: unknown | TAndeError | Error, message?: string) {
    const err = error as TAndeError & Error

    switch (err.codigo) {
      case 404:
        return `😔 ${message}`

      case 401:
        TREE_LEVEL = 'LOGIN'
        TREE_STEP = 'STEP_1'
        return '🕒 Sesión finalizada, vuelva a ingresar sus datos para iniciar sesión'

      case 500:
        return `⚠️ ${err.mensaje}`

      default:
        console.error('ERROR-SERVICE-ANDE:', err)
        return '❌ Error al ejecutar la acción requerida, intente nuevamente'
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
    const urlEncoded = qsStringify(body) // convertir datos en formato x-www-form-urlencoded

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
  ): Promise<R | string> {
    STORE.lending.type = type

    let endpoint = ''

    switch (type) {
      case 'paralelo':
        endpoint = `/lineacredito/${this.nroAffiliate}/plazo/${deadline}`
        break

      case 'cancelacion':
        endpoint = `/lineacredito/cancelacion/${this.nroAffiliate}/plazo/${deadline}`
        break

      case 'estudiantil':
        endpoint = `/lineacreditoestudiantil/${this.nroAffiliate}`
        break

      case 'extraordinario':
        endpoint = `/lineacreditoextra/${this.nroAffiliate}`
        break
    }

    try {
      const { data } = await this.http.get<R | TAndeResponse['lineacreditoextra']>(endpoint)

      let dataWrapper: TAndeResponse['lineacredito']

      if (Array.isArray(data)) dataWrapper = data
      else {
        const { plazoPrestamo, interesIPC, montoMaximo } = data as TAndeResponse['lineacreditoextra']

        dataWrapper = [
          {
            plazo: plazoPrestamo,
            tasaInteres: interesIPC,
            monto: montoMaximo
          }
        ]
      }

      return (dataWrapper as unknown) as R
    } catch (error) {
      const deadlineType = type === 'paralelo' || type === 'cancelacion' ? 'especial' : type
      return this.errorMessageHandler(error, `No hay plazos disponibles para préstamo ${deadlineType}`)
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

  public async getBankAccountList<R = TAndeResponse['cuentas']>(): Promise<R | null> {
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

      default:
        endpoint += `/${this.typeLending}/${this.nroAffiliate}`
        break
    }

    try {
      const { data } = await this.http.post<R>(endpoint, body)

      return data
    } catch (error) {
      return this.errorMessageHandler(error)
    }
  }

  public async createCreditExtra<R = any>(body: TAndeBody['solicitudcreditoExtraordinario']): Promise<R | string> {
    try {
      const { data } = await this.http.post<R>(`/solicitudcredito/extraordinario/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return this.errorMessageHandler(error)
    }
  }

  // CREDIT-CARD _______________________________________________________________________________________________________

  public async getCreditCardList<R = TAndeResponse['datosstc']>(): Promise<R | [] | string> {
    try {
      const { data } = await this.http.get<R>(`/datostc/${this.nroAffiliate}`)

      return data
    } catch (error) {
      const errorAnde = error as TAndeError

      return errorAnde?.codigo === 404
        ? []
        : this.errorMessageHandler(error, 'No se pudo obtener las tarjetas de crédito disponible')
    }
  }

  public async getCreditLine<R = TAndeResponse['lineacreditotc']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(`/lineacreditotc/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return this.errorMessageHandler(error, 'No se pudo obtener información sobre linea de credito')
    }
  }

  public async getFamilyTypeList<R = TAndeResponse['tipofamiliatc']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>('/tipofamiliatc')

      return data
    } catch (error) {
      return this.errorMessageHandler(error, 'No se pudo obtener los tipos de familia disponible')
    }
  }

  public async createCreditCard<R = TAndeResponse['solicitudtc']>(body: TAndeBody['solicitudtc']): Promise<R | string> {
    try {
      const { data } = await this.http.post<R>(`/solicitudtc/${this.nroAffiliate}`, body)

      return data
    } catch (error) {
      return this.errorMessageHandler(error, 'No se pudo solicitud la tarjeta de credito')
    }
  }

  // LENDING-QUERY _____________________________________________________________________________________________________

  public async getTotalFee<R = TAndeResponse['montocuota']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(`/montocuota/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return this.errorMessageHandler(error, 'No se pudo obtener el total de cuotas')
    }
  }

  public async getSituationLending<R = TAndeResponse['situacioncredito']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(`/situacioncredito/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return this.errorMessageHandler(error, 'No se pudo obtener su situación de crédito actual')
    }
  }

  public async getClosingDate<R = TAndeResponse['fechacierre']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>('/fechacierre')

      return data
    } catch (error) {
      return this.errorMessageHandler(error, 'No se encontro ninguna fecha de cierre')
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
      return this.errorMessageHandler(error, 'No se pudo obtener la fecha de pago')
    }
  }

  public async getLinks<R = TAndeResponse['enlaces']>(): Promise<R | string> {
    try {
      const { data } = await this.http.get<R>(`/enlaces`)

      return data
    } catch (error) {
      return this.errorMessageHandler(error, 'No se lograron obtener las noticias destacadas')
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

  public async getDocList<R = TDocList>(docType: TDocType): Promise<R | string> {
    STORE.download.type = docType

    try {
      const { data } = await this.http.get<R>(`/${docType}/cabecera/${this.nroAffiliate}`)

      return data
    } catch (error) {
      return this.errorMessageHandler(error, 'No hay documentos para descargar')
    }
  }

  public async getDoc<R = TAndeResponse['pdf']>(
    docType: TDocType,
    { periodo, nroFactura }: TAndeBody['facturaPdf']
  ): Promise<{ filename: string; pdf: R } | string> {
    try {
      const { headers, data } = await this.http.get<R>(
        `/${docType}/pdf/${this.nroAffiliate}/${periodo}${docType === 'factura' ? `/${nroFactura}` : ''}`,
        {
          // Muy importante colocar esta propiedad debido a que este endpoint lo que hace
          // es compartir la ruta donde se encuentra el documento
          responseType: 'stream'
        }
      )

      return {
        // Se obtiene el nombre del documento por medio del header,
        // el cual tiene el siguiente formato "attachment; filename=<FILE_NAME>.pdf"
        filename: headers['content-disposition'].split('=')[1].split('.')[0],
        pdf: data
      }
    } catch (error) {
      return this.errorMessageHandler(error, `No se pudo obtener el documento: ${docType}_${periodo}`)
    }
  }

  // PERSONAL DATA _____________________________________________________________________________________________________

  public async uploadPhoto<R = { uploaded: boolean }>(file: TDataStream): Promise<R | string> {
    try {
      const formData = new FormData()
      formData.append('foto', file)

      const { data } = await this.http.post<string>(`/foto/${this.nroAffiliate}`, formData, {
        headers: formData.getHeaders()
      })

      return ({
        uploaded: typeof data === 'string' && data === ''
      } as unknown) as R
    } catch (error) {
      return this.errorMessageHandler(error, 'No se pudo subir la foto')
    }
  }

  public async saveLocation<R = { saved: boolean }>(location: TAndeBody['ubicacion']): Promise<R | string> {
    try {
      const { data } = await this.http.put<string>(`/ubicacion/${this.nroAffiliate}`, location)

      return ({
        saved: typeof data === 'string' && data === ''
      } as unknown) as R
    } catch (error) {
      return this.errorMessageHandler(error, 'No se pudo guardar la ubicación')
    }
  }
}
