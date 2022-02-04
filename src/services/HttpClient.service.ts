import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios'

export class HttpClientService {
  protected http: AxiosInstance
  protected device: string
  private defaultPath: string

  constructor(baseURL: string, defaultPath: string) {
    const { token, device } = global.config.wassi

    this.http = axios.create({
      maxRedirects: 10,
      timeout: 1000 * 30,
      headers: {
        'content-type': 'application/json',
        token
      },
      baseURL
    })

    this.device = device
    this.defaultPath = defaultPath

    this.startInterceptors()
  }

  private startInterceptors(): void {
    // REQUEST
    this.http.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        config.url = this.defaultPath + config.url
        console.log('>> ' + config.method?.toUpperCase() + ': ' + config.baseURL + config.url)
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
        return response
      },
      (error: AxiosError) => {
        console.error('ERROR-RESPONSE:', error.message)
        throw error.message
      }
    )
  }
}
