const express = require('express')
const app = express()
const PORT = 3000

app.use(express.static('static'))
app.use(express.json())

let loggedIn = []

app.post('/addlogin', (req, res) => {
    console.log(loggedIn)
    console.log(req.body)
    if (loggedIn.length > 1) {
        res.send(JSON.stringify({ status: 'TOO MANY LOGGED IN' }))
        return
    }
    if (loggedIn[0] == req.body.login) {
        res.send(JSON.stringify({ status: 'NAME TAKEN' }))
        return
    }
    loggedIn.push(req.body.login)
    res.send(JSON.stringify({
        status: 'OK',
        player: loggedIn.length
    }))
})

app.post('/reset', (req, res) => {
    loggedIn = []
    res.send({ status: 'OK' })
})

app.post('/getplayercount', (req, res) => {
    res.send(JSON.stringify({ count: loggedIn.length }))
})

app.listen(PORT, () => {
    console.log(`server start on port ${PORT}`)
})