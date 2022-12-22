const express = require('express')
const app = express()

const PORT = 8080

app.get('/',(req, res) => {
    const persona = req.query.nombre ? req.query.nombre : "persona sin nombre"
    res.send(`Hola ${persona}, te saludo con node desde azure!`)
})

app.listen(PORT)

console.log(`Running on https://localhost:${PORT}`)