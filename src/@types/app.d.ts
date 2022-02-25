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
  adminPhomeList: Array<string>
  affiliate: {
    nroCedula: string
    nroAfiliado: string
    nroCelular: string
  }
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

type TAnde = null | {
  affiliate: TAffiliate
  token: string
}

type TStore = {
  lending: {
    type: TTypeLending
    deadlineList: TDeadline[]
    deadline: TDeadline
    payMethodList: TAndeResponse['formacobro']
    payMethod: TAndeResponse['formacobro'][0]
    amount: number
  }
  creditCard: {
    body: {
      lineaCredito: number
    }
  }
  download: {
    type: TDocType
    docList: TDocList
  }
}

type TDocList = Array<TAndeResponse['facturaCabecera'][0] & { nroDocumento: string }>

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

type TStep = '' | 'STEP_1' | 'STEP_2' | 'STEP_3' | 'STEP_4' | 'STEP_5' | 'STEP_6'

type TWassiData = TWassiBody['data']

type TTypeLending = 'paralelo' | 'cancelacion' | 'estudiantil' | 'extraordinario'

type TDocType = 'factura' | 'prestamo' | 'liquidacionhaber'

// DECLARATIONS ________________________________________________________________________________________________________

// Base de datos temporal
declare var SESSIONS: TSession[]
declare var ANDE: TAnde
declare var STORE: TStore

declare var TREE_LEVEL: TLevel
declare var TREE_STEP: TStep
