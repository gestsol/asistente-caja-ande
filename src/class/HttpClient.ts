import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios'
import { botDebug } from '~UTILS/debug.util'

export class HttpClient {
  protected http: AxiosInstance
  private defaultPath: string

  constructor({ baseURL, defaultPath, timeoutSecond, headers }: TConfigHttpClient) {
    this.http = axios.create({
      maxRedirects: 10,
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
      (error: AxiosError) => {
        console.error('ERROR-RESPONSE:', error.message)
        throw <TAndeError>error.response?.data
          ? error.response?.data
          : {
              codigo: error.response?.status === 500 ? 505 : error.response?.status,
              mensaje: error.response?.statusText
            }
      }
    )
  }
}
