import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { messageOptionInvalid } from '~UTILS/message.util'

export class PersonalDataController extends Controller {
  async startDecisionTree(session: TSession) {
    let response = ''

    const options = `
    (151) Cargar una foto (Subir documento/imagen)
    (152) Cargar domicilio (Envío de ubicación)`

    switch (this.message) {
      case 'menu':
        session.treeLevel = 'PERSONAL_DATA'
        session.treeStep = ''

        response = `
        Elige una de las siguiente opciones:
        ${options}
        ${MENU_HOME}
        `
        break

      case '151':
        session.treeStep = 'STEP_1'
        response = `
        Para comenzar con el reconocimiento facial tienes que cargar una foto.
        Debe ser una foto de color claro y no utilizar lentes de sol ni mascarillas 😬
        `
        break

      case '152':
        session.treeStep = 'STEP_2'
        response = `
        Necesitamos saber tu domicilio, por favor envia tu dirección usando la función de *enviar ubicación de WhatsApp* 🗺️
        No olvides ubicar correctamente tu casa 🏡
        `
        break

      case '0':
        session.treeLevel = 'HOME'
        new HomeController({
          ...this.data,
          message: 'menu'
        })
        break

      default:
        switch (session.treeStep) {
          case 'STEP_1':
            const { dataType, file } = this.data

            // Validación basica de la imagen que se quiere subir
            if (dataType === 'image' && file) {
              const stream = await this.downloadFile(file.id)

              if (stream) {
                const photo = await this.andeService.uploadPhoto(stream, file.extension)

                if (typeof photo === 'object' && photo.uploaded) {
                  response = `
                  ✅ Tu fotografía ha sido guardada correctamente

                  ${MENU_HOME}
                  `
                } else {
                  response = `
                  ${photo}

                  ${MENU_HOME}
                  `
                }
              } else {
                response = `
                ⚠️ Error al obtener la imagen, intente de nuevo

                ${MENU_HOME}
                `
              }
            } else response = 'El archivo enviado es invalido, por favor revisa que sea una imagen correcta'
            break

          case 'STEP_2':
            const isLocation = this.data.dataType === 'location'

            if (isLocation && this.data.location) {
              const { address, latitude, longitude } = this.data.location

              const location = await this.andeService.saveLocation({
                domicilio: address,
                ubicacionLatitud: latitude.toString(),
                ubicacionLongitud: longitude.toString()
              })

              if (typeof location === 'object' && location.saved) {
                response = `
                ✅ Tu ubicación ha sido guardada correctamente

                ${MENU_HOME}
                `
              } else {
                response = `
                ${location}

                ${MENU_HOME}
                `
              }
            } else
              response =
                'La ubicación es incorrecta, por favor envianos tu dirección usando la función de *enviar ubicación de WhatsApp* 🗺️'
            break

          default:
            response = messageOptionInvalid(options)
            break
        }
        break
    }

    return this.sendMessage(response)
  }
}
