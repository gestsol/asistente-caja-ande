type TConfig = {
  port: number
  debug: boolean
  wassi: {
    apiUrl: string
    token: string
    device: string
  }
  ande: {
    apiUrl: string
  }
}

type TConfigHttpClient = {
  baseURL: string
  defaultPath: string
  token?: string
}

type TDataController = {
  phone: string
  username: string
  message: string
}

type TEnv = 'development' | 'production'

// DECLARATIONS ________________________________________________________________________________________________________

declare var config: TConfig
declare var FLOW_STATE: string
