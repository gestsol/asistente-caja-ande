const axios = require('axios')
const fs = require('fs')
const { resolve } = require('path')

const endpoint = 'http://172.16.203.9:8080/cjppa/rest/chatbot/afiliado/celular/0991712781'

axios
  .get(endpoint, {
    timeout: 1000 * 60 * 5 // tiempo de espera de 5 minutos
  })
  .then((result) => {
    console.log('RESULTADO', result)
  })
  .catch((err) => {
    console.error('ERROR', err.message)
    const path = resolve('response.json')

    fs.writeFile(
      path,
      JSON.stringify(err),
      {
        encoding: 'utf-8'
      },
      (err) => {
        if (err) console.log('ERROR-RESPONSE-JSON', err)
      }
    )

    console.log(`REPONSE-JSON: File generated in ${path}`)
  })

console.log('REQUEST-TEST...', endpoint)
