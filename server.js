const express = require('express')
const app = express()
const PORT = 3000

app.use(express.static('static'))
app.use(express.json())

let loggedIn = []
let lastMove = {}
let playerMove = 1

app.post('/addlogin', (req, res) => {
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
    lastMove = {}
    playerMove = 1
    res.send({ status: 'OK' })
})

app.post('/getplayercount', (req, res) => {
    res.send(JSON.stringify({ count: loggedIn.length }))
})

app.post('/sendmove', (req, res) => {
    lastMove = { from: req.body.oldPos, to: req.body.newPos, name: req.body.name }
    console.log(lastMove)
    playerMove = playerMove == 1 ? 2 : 1
    res.send(JSON.stringify({ status: 'OK' }))
})

app.post('/getmove', (req, res) => {
    if (req.body.player != playerMove) {
        res.send(JSON.stringify({ status: 'opponent' }))
        return
    }
    res.send(JSON.stringify({ status: 'you', from: lastMove.from, to: lastMove.to, name: lastMove.name }))
})

app.listen(PORT, () => {
    console.log(`server start on port ${PORT}`)
})