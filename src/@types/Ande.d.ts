type TAndeBody = {
  autenticar: {
    nroCedula: string
    nroAfiliado: string
    nroCelular: string
  }
}

type TAndeResponse = {
  autenticar: {
    nic: number
    token: string
  }
  lineacredito: Array<TDeadline>
  formacobro: Array<{
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

// TODO: crear este tipo de dato dentro de TAndeResponse
// type TCalculo = {
//   montoCuota: 461449
//   montoSeguro: 8333
//   montoIVA: 0
//   tasaInteres: 10.0
//   saldoPrestamosCancelar: 0
//   cuotaOtrosPrestamos: 1786187
//   seguroOtrosPrestamos: 69786
//   ivaOtrosPrestamos: null
//   totalNuevaCuota: 2325755
//   totalNetoRetirar: 10000000
//   saldoTarjetaCredito: 0
//   saldoPendiente: 0
//   saldoDiferido: 0
//   nivelEndeudamiento: 44.43
//   nivelEndeudamientoMaximo: 65.0
//   capacidadPago: null
//   capacidadPagoNuevo: 1440813
//   cumpleNivelEndeudamiento: true
//   cumpleMontoParalelo: true
//   cumpleMontoCancelacion: true
//   cumpleCuota: true
//   cumple12cuotas: true
//   numerosPtmosNoCumple12Cuotas: null
//   montoMaximoParalelo: 40669769
//   montoMaximoCancelacion: 40669769
//   cuotaMaxima: 1889175
//   enProcesoCobro: false
//   cuotaPeriodoGracia: null
// }
