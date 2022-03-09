import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { convertArrayInMessage, convertInGuarani, messageOptionInvalid } from '~UTILS/message.util'
import { isNumber } from '~UTILS/validation.util'
import { MENU_HOME } from '~ENTITIES/consts'

export class CreditCardController extends Controller {
  async startDecisionTree(session: TSession) {
    let response = ''

    const options = `
    (121) Tarjeta de crédito 💳
    (122) Deuda total y disponibilidad de tarjeta de crédito
    (123) Monto y vencimiento de tu tarjeta
    (124) Situación actual de tu tarjeta de crédito`

    const defaultError = 'Usted no posee una tarjeta de credito, para crear una seleccione la opción *121*'

    switch (this.message) {
      case 'menu':
        session.treeLevel = 'CREDIT_CARD'
        session.treeStep = ''

        this.initStore(session)

        const creditCards = session.store.creditCard?.tcList || (await this.andeService.getCreditCardList())

        if (typeof creditCards === 'object') {
          session.store.creditCard.tcList = creditCards

          response = `
          Elige una de las siguiente opciones:
          ${options}
          ${MENU_HOME}
          `
        } else {
          response = `
          ${creditCards}

          ${MENU_HOME}
          `
        }
        break

      case '121':
        const creditLine = session.store.creditCard?.creditLine || (await this.andeService.getCreditLine())

        if (typeof creditLine === 'object') {
          session.store.creditCard.creditLine = creditLine

          if (session.store.creditCard.tcList.length) {
            const familyTypeList = await this.andeService.getFamilyTypeList()

            if (typeof familyTypeList === 'object') {
              session.treeStep = 'STEP_3'
              session.store.creditCard.familyTypeList = familyTypeList

              const familyTypes = convertArrayInMessage(familyTypeList, (item, i) => {
                return `
                (${i + 1}) ${item.descripcion}`
              })

              response = `
              Ya dispones de tarjeta de crédito con la CAJA 🤓
              ¿Para quién es la tarjeta nueva?

              ${familyTypes}

              ${MENU_HOME}
              `
            } else {
              response = `
              ${familyTypeList}

              ${MENU_HOME}
              `
            }
          } else {
            session.treeStep = 'STEP_1'
            session.store.creditCard.ci = session.ande!.affiliate.nroCedula
            session.store.creditCard.fullName = session.ande!.affiliate.nombre
            session.store.creditCard.address = '' // TODO: obtener direccion del usuario afiliado
            session.store.creditCard.phone = session.ande!.affiliate.celulares || ''

            response = this.getMessageAmount(session)
          }
        } else {
          response = `
          ${creditLine}

          ${MENU_HOME}
          `
        }
        break

      case '122':
        if (session.store.creditCard.tcList.length) {
          const creditCardList = convertArrayInMessage(session.store.creditCard.tcList, item => {
            return `
            *Tarjeta:* ${item.nroTarjeta}
            *Saldo disponible:* ${convertInGuarani(item.disponible)}
            *Deuda total:* ${convertInGuarani(item.pagoMinimoPendiente)}`
          })

          response = `
          Nunca fue tan sencillo tener esta información en la comodidad de tu celular 😎
          ${creditCardList}

          ${MENU_HOME}
          `
        } else {
          response = `
          ${defaultError}

          ${MENU_HOME}
          `
        }
        break

      case '123':
        if (session.store.creditCard.tcList.length) {
          const creditCardList = convertArrayInMessage(session.store.creditCard.tcList, item => {
            const fullDateVto = new Date(item.fechaVto).toLocaleString('es', {
              // Agregar la zona horaria de Paraguay
              timeZone: 'America/Asuncion'
            })
            const dateVto = fullDateVto.split(' ')[0]

            return `
            *Tarjeta:* ${item.nroTarjeta}
            *Pago Mínimo:* ${convertInGuarani(item.pagoMinimo)}
            *Fecha Vto:* ${dateVto}`
            // TODO: Falta Fecha cierre: ${ ?? }
          })

          response = `
          Revisa aquí la fecha de vencimiento de tu tarjeta de crédito
          ${creditCardList}
          ${MENU_HOME}
          `
        } else {
          response = `
          ${defaultError}

          ${MENU_HOME}
          `
        }
        break

      case '124':
        if (session.store.creditCard.tcList.length) {
          const creditCardList = convertArrayInMessage(session.store.creditCard.tcList, item => {
            return `
            *Tarjeta:* ${item.nroTarjeta}
            *Estado:* ${item.estadoTarjeta.trim()}`
          })

          response = `
          ${creditCardList}

          ${MENU_HOME}
          `
        } else {
          response = `
          ${defaultError}

          ${MENU_HOME}
          `
        }
        break

      case '0':
        session.treeLevel = 'HOME'

        this.initStore(session)

        new HomeController({
          ...this.data,
          message: 'menu'
        })
        break

      default:
        switch (session.treeStep) {
          case 'STEP_1':
            if (this.message === 'M' || isNumber(this.message)) {
              const amount =
                this.message === 'M' ? session.store.creditCard.creditLine.lineaCreditoMaximoCRE : Number(this.message)

              session.treeStep = 'STEP_2'
              session.store.creditCard.amount = amount
              const amountTotal = convertInGuarani(amount)

              response = `
              Se ha ingresado una solicitud para tarjeta de crédito con un monto máximo de ${amountTotal} guaraníes.

              (C) Confirmo
              (R) Rechazo
              `
              break
            }

            response = messageOptionInvalid()
            break

          case 'STEP_2':
            if (this.message === 'C') {
              const { tcList, familyType, amount, ci, fullName, address, phone } = session.store.creditCard

              const creditCardResponse = await this.andeService.createCreditCard({
                esAdicional: tcList.length ? 1 : 0,
                tipoFamilia: familyType?.codigo || null,
                lineaCredito: amount,
                nroCedula: ci,
                nombreApellido: fullName,
                direccion: address || null,
                celular: phone || null,
                telefono: null,
                correo: null
              })

              if (typeof creditCardResponse === 'object') {
                response = `
                ✅ Solicitud enviada

                ${MENU_HOME}
                `
                break
              } else {
                response = `
                ${creditCardResponse}

                ${MENU_HOME}
                `
                break
              }
            }

            if (this.message === 'R') {
              session.treeStep = ''
              response = `
              ❌ Solicitud cancelada

              ${MENU_HOME}
              `
              break
            }

            response = messageOptionInvalid()
            break

          case 'STEP_3':
            const familyTypeSelected = isNumber(this.message)

            if (familyTypeSelected) {
              const familyType = session.store.creditCard.familyTypeList!.find(
                (_, index) => index === familyTypeSelected - 1
              )

              if (familyType) {
                session.treeStep = 'STEP_4'
                session.store.creditCard.familyType = familyType
                response = '¿Cuál es el nombre y apellido?'
                break
              }
            }

            response = messageOptionInvalid()
            break

          case 'STEP_4':
            const [name, lastname] = this.message.split(' ')

            if (name && lastname) {
              session.treeStep = 'STEP_5'
              session.store.creditCard.fullName = `${name} ${lastname}`
              response = 'Indica el CI y número celular del adicional, colocalo separado por espacios'
            } else {
              response = `
              Ingrese correctamente el nombre y apellido de la persona

              ${MENU_HOME}
              `
            }
            break

          case 'STEP_5':
            const [ci, phone] = this.message.split(' ')

            if (ci && isNumber(ci) && phone) {
              session.treeStep = 'STEP_6'
              session.store.creditCard.ci = Number(ci)
              session.store.creditCard.phone = phone
              response = 'Indica su dirección'
            } else {
              response = `
              Ingrese correctamente el CI y celular de la persona

              ${MENU_HOME}
              `
            }
            break

          case 'STEP_6':
            // TODO: evaluar esto
            if (this.message) {
              session.treeStep = 'STEP_1'
              session.store.creditCard.address = this.message
              response = this.getMessageAmount(session)
            } else {
              response = `
              Ingrese correctamente la dirección de la persona

              ${MENU_HOME}
              `
            }
            break

          default:
            response = messageOptionInvalid(options)
            break
        }
        break
    }

    return this.sendMessage(response)
  }

  private getMessageAmount(session: TSession): string {
    const amountTotal = convertInGuarani(session.store.creditCard.creditLine.lineaCreditoMaximoCRE)

    return `
    Tenes disponible ${amountTotal} guaraníes para tu tarjeta de crédito.
    ¿Deseas solicitarla con el monto máximo?

    (M) Quiero el monto máximo
    (    ) Escriba el monto que desea (debe ser menor a su monto disponible y no debe tener puntos o decimales)`
  }

  private initStore(session: TSession): void {
    session.store = { creditCard: {} } as any
  }
}
