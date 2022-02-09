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
  modeAPP: 'API' | 'BOT'
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
  res: import('express').Response
}

type TEnv = 'development' | 'production'

// DECLARATIONS ________________________________________________________________________________________________________

declare var config: TConfig
declare var FLOW_STATE: 'MAIN_1' | 'MAIN_2' | 'LOGIN' | 'HOME' | 'CREDIT_CARD'
declare var FLOW_STATE_STEP: '' | 'STEP_1' | 'STEP_2' | 'STEP_3'
