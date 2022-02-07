import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios'
import { botDebug } from '~UTILS/debug.util'

export class HttpClientService {
  protected http: AxiosInstance
  private defaultPath: string

  constructor({ baseURL, defaultPath, token }: TConfigHttpClient) {
    this.http = axios.create({
      maxRedirects: 10,
      timeout: 1000 * 30,
      headers: {
        'content-type': 'application/json',
        token: token || ''
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
        botDebug(`HTTP-OUT: ${config.method?.toUpperCase() || '<METHOD UNDEFINED>'} ${config.baseURL + config.url}`)
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
        if (response.status !== 200) throw new Error('Error in status response')
        return response
      },
      (error: AxiosError) => {
        console.error('ERROR-RESPONSE:', error.message)
        throw error.message
      }
    )
  }
}
