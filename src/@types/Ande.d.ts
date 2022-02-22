type TAndeError = {
  mensaje: string
  codigo: number
}

type TAndeBody = {
  autenticar: {
    nroCedula: string
    nroAfiliado: string
    nroCelular: string
  }
  solicitudcredito: {
    plazo: number
    montoSolicitado: number
    formaCobro: number
    idCuentaBancaria: number
    nroCuentaBancaria: null | number
    idBanco: null | number
    cumpleRequisitos: number
  }
  solicitudtc: {
    esAdicional: number
    tipoFamilia: null | any
    lineaCredito: number
    nroCedula: number
    nombreApellido: null | any
    direccion: null | any
    celular: null | any
    telefono: null | any
    correo: null | any
  }
}

type TAndeResponse = {
  autenticar: {
    afiliado: TAffiliate
    token: string
  }
  lineacredito: Array<TDeadline>
  formacobro: Array<{
    codigo: number
    descripcion: string
  }>
  calculo: {
    montoCuota: number
    montoSeguro: number
    montoIVA: number
    tasaInteres: number
    saldoPrestamosCancelar: number
    cuotaOtrosPrestamos: number
    seguroOtrosPrestamos: number
    ivaOtrosPrestamos: null | any
    totalNuevaCuota: number
    totalNetoRetirar: number
    saldoTarjetaCredito: number
    saldoPendiente: number
    saldoDiferido: number
    nivelEndeudamiento: number
    nivelEndeudamientoMaximo: number
    capacidadPago: null | any
    capacidadPagoNuevo: number
    cumpleNivelEndeudamiento: boolean
    cumpleMontoParalelo: boolean
    cumpleMontoCancelacion: boolean
    cumpleCuota: boolean
    cumple12cuotas: boolean
    numerosPtmosNoCumple12Cuotas: null | any
    montoMaximoParalelo: number
    montoMaximoCancelacion: number
    cuotaMaxima: number
    enProcesoCobro: boolean
    cuotaPeriodoGracia: null | any
  }
  cuentas: Array<{
    id: {
      codBanco: number
      nroCuentaBanco: string
    }
    nroCedula: number
    idRegistro: number
    codPersonalAnde: number
    fechaInsert: number
    usuarioInsert: string
    nroCuentaConfirmacion: null | any
    banco: {
      codigo: number
      nombre: string
      disponibleTransferencia: boolean
    }
  }>
  datosstc: Array<{
    estadoTarjeta: string // 'Operativa                     '
    fechaVto: number
    nroCuenta: null | any
    nroTarjeta: string
    saldo: number
    saldoActual: number
    disponible: number
    pagoMinimo: number
    disponiblePlan: number
    pagoMinimoPendiente: number
    amortizacionPendiente: number
    limiteNormal: number
  }>
  solicitudtc: {}
  montocuota: {
    totalCuota: number
  }
  situacioncredito: {
    situacion: string
  }
  fechacierre: {
    periodo: string // '202202'
    fecha: string // '16/02/2022'
  }
}

type TAffiliate = {
  nic: number
  nroCedula: number
  nombre: string
  codInstitucion: number
  institucion: string
  codPersonalAnde: number
  antiguedad: string | null
  edad: number | null
  aporte: string | null
  tipoContrato: string
  email: string
  emailLaboral: string
  celulares: string | null
}

type TMenuOption = {
  id: number
  orden: number
  titulo: string
  tituloCorto: string
  descripcion: string
  permitido: number
  moduloAfil: number
  moduloAdmin: number
  moduloBot: number
  activos: number
  pasivos: number
  caja: number
}

type TDeadline = {
  plazo: number
  tasaInteres: number
  monto: number
}
