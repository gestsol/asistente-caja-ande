const axios = require('axios')
const fs = require('fs')
const { resolve } = require('path')
const qs = require('qs')

const endpoint = 'http://172.16.203.9:8080/cjppa/rest/chatbot/autenticar'
const affiliate = {
  nroCedula: '3809540',
  nroAfiliado: '53054',
  nroCelular: '0991712781'
}
const body = qs.stringify(affiliate)

function generateFile(data) {
  const path = resolve('response.json')

  fs.writeFile(
    path,
    JSON.stringify(data),
    {
      encoding: 'utf-8'
    },
    (err) => {
      if (err) console.log('ERROR-RESPONSE-JSON', err)
    }
  )

  console.log(`REPONSE-JSON: File generated in ${path}`)
}

axios.post(endpoint, body, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
})
  .then(result => generateFile(result.data))
  .catch(generateFile)

console.log('REQUEST-TEST...', endpoint)
