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
    idCuentaBancaria: number | null
    nroCuentaBancaria: number | null
    idBanco: number | null
    cumpleRequisitos: number
  }
  solicitudcreditoExtraordinario: {
    monto: number
    origen: number
    tipoDesembolso: number
    codBanco: number | null
    nroCtaBancaria: number | null
  }
  solicitudtc: {
    esAdicional: number
    tipoFamilia: TAndeResponse['tipofamiliatc'][0]['codigo'] | null
    lineaCredito: number
    nroCedula: number
    nombreApellido: string | null
    direccion: string | null
    celular: string | null
    telefono: string | null
    correo: string | null
  }
  facturaPdf: {
    periodo: string
    nroFactura?: string
  }
  ubicacion: {
    domicilio: string
    ubicacionLatitud: string
    ubicacionLongitud: string
  }
  mesaentrada: {
    descripcion: string
    nroCedula: string
    nombre: string
    apellido: string
    celular: string
    email: string
    observacion: string
    archivo: TDataStream
    extension: string
    filename: string
  }
}

type TAndeResponse = {
  autenticar: {
    afiliado: TAffiliate
    token: string
  }
  lineacredito: Array<TDeadline>
  lineacreditoextra: {
    pendienteTarjetas: number
    pendienteExtraordinarios: number
    montoMaximo: number
    saldoExtraordinarioVigente: number
    interesIPC: number
    plazoPrestamo: number
    tipoDesembolso: number
    soloCheque: boolean
    codBanco: number
    banco: string
    numeroCuentaBancaria: string
    codInstitucion: number
    saldoTotalCancelar: number
    netoRetirar: number
    totalSaldos: number
  }
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
    estadoTarjeta: string
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
  solicitudcredito: {
    nroExpediente: number
    fechaSolicitud: null
    montoSolicitado: null
    ubicacion: null
    origen: null
    tipoPrestamo: null
    cumpleRequisito: null
    plazo: null
    importeCuota: null
    tasaInteres: null
    tasaSeguro: null
    cantidadDestino: null
    motivo: null
    sistemaCalculo: null
    observaciones: null
    frecuenciaPago: null
    tipoGarantia: null
    tipoDesembolso: null
    periodoDescuento: null
    parteDeDiferido: null
    fueraDelPlan: null
    saleDelPlan: null
    modalidad: null
    fechaSituacion: null
    listaDestinoCredito: null
    nroTelefono: null
    correoElectronico: null
    formaCobro: null
    afiliadoDatosBasicos: null
  }
  montocuota: {
    totalCuota: number
  }
  situacioncredito: {
    situacion: string
  }
  fechacierre: {
    periodo: string
    fecha: string
  }
  fechacobro: {
    mensaje: string
    codigo: number
  }
  enlaces: Array<{
    codigo: number
    nombre: string
    descripcion: string
    estado: boolean
  }>
  info: Array<{
    codigo: number
    nombre: string
    descripcion: string
    estado: boolean
  }>
  facturaCabecera: Array<{
    nic?: null | any
    codPersonal?: number
    periodo: string
    periodoLetra: string
    codPeriodoDcto?: null | any
    nroFactura?: string
    importeTotal?: null | any
    codInstitucion?: null | any
  }>
  extractoCabecera: Array<{
    nroAfiliado: number
    periodo: string
    periodoLetra: string
  }>
  liquidacionhaberCabecera: Array<{
    nic?: number
    codPersonal?: number
    periodo: string
    periodoLetra: string
  }>
  pdf: TDataStream
  reclamoCabecera: Array<{
    nroAfiliado: number
    periodo: string
    periodoLetra: string
  }>
  reclamo: {
    totalReclamoPrestamo: number
    totalReclamoSeguro: number
    totalPagoPrestamo: number
    totalPagoSeguro: number
  }
  reposo: {
    id: number
    nroResolucion: string
    nroActa: number
    fechaResolucion: string
    periodoDesde: string
    periodoHasta: string
    nroExpediente: string
    fechaAutorizacion: string
  }
  pagocaja: {
    importe: number
    fecha: string
  }
  lineacreditotc: {
    lineaCreditoMinimo: number
    lineaCreditoMaximoCRE: number
    pagoMinimo: number
    tieneRepactacion: number
  }
  tipofamiliatc: Array<{
    codigo: number
    descripcion: string
  }>
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
  email: string | null
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
  tasaInteres?: number
  monto: number
  cuota?: number
  saldoCancelar: number
  montoNetoRetirar?: number
}
