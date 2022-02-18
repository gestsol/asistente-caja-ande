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
  timerSessionMin: number
  messageSession: boolean
}

type TConfigHttpClient = {
  baseURL: string
  defaultPath: string
  timeoutSecond?: number
  headers?: import('axios').AxiosRequestHeaders
}

type TDataController = {
  phone: string
  message: string
  res: import('express').Response
  menuHome: string
}

type TEnv = 'development' | 'production'

type TSession = {
  phone: string
  treeLevel: TLevel
  treeStep: TStep
  ande: TAnde
  store: TStore
}

type TAnde = {
  affiliate: TAffiliate
  token: string
} | null

type TStore = { [key: string]: any }

type TLevel =
  | 'MAIN'
  | 'MESA'
  | 'LOGIN'
  | 'HOME'
  | 'CREDIT_CARD'
  | 'LENDING_QUERY'
  | 'NEWS'
  | 'PERSONAL_DATA'
  | 'DOWNLOAD'
  | 'LINKS'
  | 'ENTRY_TABLE'
  | 'LENDINGS'

type TStep = '' | 'STEP_1' | 'STEP_2' | 'STEP_3' | 'STEP_4'

type TWassiData = TWassiBody['data']

type TTypeLendingSpecial = 'paralelo' | 'cancelacion'

// DECLARATIONS ________________________________________________________________________________________________________

// Base de datos temporal
declare var SESSIONS: TSession[]
declare var ANDE: TAnde
declare var STORE: TStore

declare var TREE_LEVEL: TLevel
declare var TREE_STEP: TStep
