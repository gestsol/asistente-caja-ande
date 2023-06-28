import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios'
import { botDebug } from '~UTILS/debug.util'
import * as https from "https";

export class HttpClient {
  protected http: AxiosInstance
  private defaultPath: string

  constructor({ baseURL, defaultPath, timeoutSecond, headers }: TConfigHttpClient) {

    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    this.http = axios.create({
      maxRedirects: 10,
      httpsAgent: agent,
      timeout: 1000 * (timeoutSecond || 60),
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      baseURL
    })
    this.defaultPath = defaultPath

    this.startInterceptors()
  }

  private startInterceptors(): void {
    // REQUEST
    this.http.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        config.url = this.defaultPath + config.url
        botDebug('HTTP-OUT', `${config.method?.toUpperCase() || '<METHOD UNDEFINED>'} ${config.baseURL + config.url}`)
        return config
      },
      (error: AxiosError) => {
        console.error('ERROR-REQUEST:', error.message)
        throw new Error(error.response?.statusText)
      }
    )

    // RESPONSE
    this.http.interceptors.response.use(
      async (response: AxiosResponse) => {
        const { status } = response
        if (status !== 200 && status !== 201) throw new Error(`Request failed with status code ${status}`)
        else return response
      },
      (error: AxiosError<TAndeError, any>) => {
        console.error('ERROR-RESPONSE:', error.message)

        if (error.response) {
          // De no existir "data", se crear un error usando el "status" y el "statusText" de la respuesta
          throw <TAndeError>(error.response.data || {
            codigo: error.response.status === 500 ? 505 : error.response.status,
            mensaje: error.response.statusText
          })
        } else {
          // Se coloca el código "505" para indicar que el error proviene de este servidor
          throw <TAndeError>{
            codigo: 505,
            mensaje: error.message
          }
        }
      }
    )
  }
}
