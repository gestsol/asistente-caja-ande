import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { convertMessageInFullname, convertPhoneInLocal } from '~UTILS/message.util'
import { MENU_HOME } from '~ENTITIES/consts'

export class EntryTable extends Controller {
  async startDecisionTree(session: TSession) {
    let response = ''

    switch (this.message) {
      case 'menu':
        session.treeLevel = 'ENTRY_TABLE'
        session.treeStep = 'STEP_1'

        this.initStore(session)

        response = `
        En mesa de entrada podras guardar los archivos que desee

        Ingrese una descripción para el archivo
        `
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
            session.treeStep = 'STEP_2'
            session.store.entryTable.description = this.message
            response = 'Ingrese una observación'
            break

          case 'STEP_2':
            session.treeStep = 'STEP_3'
            session.store.entryTable.observation = this.message
            response = 'Ingrese el archivo que desea guardar'
            break

          case 'STEP_3':
            const { description, observation } = session.store.entryTable

            if (this.data.file?.id) {
              const fileWassi = await this.downloadFile(this.data.file?.id)

              if (fileWassi) {
                const { nombre, nroCedula, email } = session.ande!.affiliate
                const [name, lastname] = convertMessageInFullname(nombre).split(' ')

                const file = await this.andeService.uploadFile({
                  nombre: name,
                  apellido: lastname,
                  celular: convertPhoneInLocal(this.phone),
                  nroCedula: nroCedula.toString(),
                  email: email || '',
                  descripcion: description,
                  observacion: observation,
                  archivo: fileWassi
                })

                if (typeof file === 'object' && file.uploaded) {
                  response = `
                  ✅ Su archivo ha sido guardado correctamente

                  ${MENU_HOME}
                  `
                } else {
                  response = `
                  ${file}

                  ${MENU_HOME}
                  `
                }
              } else {
                response = `
                ⚠️ Error al obtener el documento, intente de nuevo

                ${MENU_HOME}
                `
              }

              break
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
