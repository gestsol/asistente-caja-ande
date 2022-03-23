import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MainController } from '~CONTROLLERS/Main.controller'
import { convertMessageInFullname, convertPhoneInLocal } from '~UTILS/message.util'
import { isEmail, isNumber } from '~UTILS/validation.util'
import { MENU_HOME } from '~ENTITIES/consts'

export class EntryTableController extends Controller {
  async startDecisionTree(session: TSession) {
    let response = ''

    switch (this.message) {
      case 'menu':
        session.treeLevel = 'ENTRY_TABLE'
        this.initStore(session)

        response = 'En mesa de entrada podras guardar los archivos que desee\n\n'

        if (session.ande) {
          session.treeStep = 'STEP_5'
          response += 'Ingrese una descripción para el archivo'
        } else {
          session.treeStep = 'STEP_1'
          response += 'Ingrese CI'
        }
        break

      case '0':
        this.initStore(session)

        if (session.ande) {
          new HomeController({
            ...this.data,
            message: 'menu'
          })
        } else {
          session.treeLevel = 'MAIN'
          session.treeStep = ''

          new MainController(this.data)
        }
        break

      default:
        switch (session.treeStep) {
          case 'STEP_1':
            if (isNumber(this.message)) {
              session.treeStep = 'STEP_2'
              session.store.entryTable.ci = this.message
              response = 'Ingrese nombre'
            } else response = '⚠️ Número Invalido, por favor envie un número de CI correcto'
            break

          case 'STEP_2':
            session.treeStep = 'STEP_3'
            session.store.entryTable.name = this.message
            response = 'Ingrese apellido'
            break

          case 'STEP_3':
            session.treeStep = 'STEP_4'
            session.store.entryTable.lastname = this.message
            response = 'Ingrese correo'
            break

          case 'STEP_4':
            const email = this.message.toLowerCase()

            if (isEmail(email)) {
              session.treeStep = 'STEP_5'
              session.store.entryTable.email = email
              response = 'Ingrese una descripción para el archivo'
            } else response = '⚠️ Correo invalido, debe tener el siguiente formato: *example@email.com*'
            break

          case 'STEP_5':
            session.treeStep = 'STEP_6'
            session.store.entryTable.description = this.message
            response = 'Ingrese una observación'
            break

          case 'STEP_6':
            session.treeStep = 'STEP_7'
            session.store.entryTable.observation = this.message
            response = 'Ingrese nombre del archivo'
            break

          case 'STEP_7':
            session.treeStep = 'STEP_8'
            session.store.entryTable.filename = this.message
            response = 'Ingrese el archivo que desea guardar'
            break

          case 'STEP_8':
            const { file } = this.data

            if (file) {
              const stream = await this.downloadFile(file.id)

              if (stream) {
                const { description, observation, filename } = session.store.entryTable
                const phone: string = convertPhoneInLocal(this.phone)

                let fileAnde: {
                  nombre: string
                  apellido: string
                  nroCedula: string
                  email: string
                }

                if (session.ande) {
                  const { nombre, nroCedula, email } = session.ande.affiliate
                  const [name, lastname] = convertMessageInFullname(nombre).split(' ')

                  fileAnde = {
                    nombre: name,
                    apellido: lastname,
                    nroCedula: nroCedula.toString(),
                    email: email || ''
                  }
                } else {
                  const { ci, name, lastname, email } = session.store.entryTable

                  fileAnde = {
                    nombre: name,
                    apellido: lastname,
                    nroCedula: ci,
                    email
                  }
                }

                const fileResponse = await this.andeService.uploadFile(
                  {
                    ...fileAnde,
                    celular: phone,
                    descripcion: description,
                    observacion: observation,
                    archivo: stream,
                    extension: file.extension,
                    filename
                  },
                  session.ande === null
                )

                if (typeof fileResponse === 'object' && fileResponse.uploaded) {
                  if (session.ande) {
                    session.treeLevel = 'HOME'
                  } else {
                    session.treeLevel = 'MAIN'
                    session.treeStep = ''
                  }

                  response = '✅ Su archivo ha sido guardado correctamente.'
                } else {
                  response = `
                  ${fileResponse}

                  ${MENU_HOME}
                  `
                }
              } else {
                response = `
                ⚠️ Error al obtener el documento, intente de nuevo

                ${MENU_HOME}
                `
              }
            } else response = 'El archivo enviado es incorrecto, por favor revisa que el documento sea correcto'
            break
        }
        break
    }

    return this.sendMessage(response)
  }

  private initStore(session: TSession): void {
    session.store = { entryTable: {} } as any
  }
}
