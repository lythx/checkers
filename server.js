const express = require('express')
const app = express()
const PORT = 3000

app.use(express.static('static'))
app.use(express.json({ limit: '50mb' }))

let loggedIn = []
let lastMove = {}
let playerMove = 1
let winner
let checkers

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
    winner = null
    checkers = null
    res.send({ status: 'OK' })
})

app.post('/getplayercount', (req, res) => {
    res.send(JSON.stringify({ count: loggedIn.length }))
})

app.post('/sendmove', (req, res) => {
    lastMove = { checkerId: req.body.checkerId, tileId: req.body.tileId }
    playerMove = playerMove === 1 ? 2 : 1
    checkers = req.body.checkers
    res.send(JSON.stringify({ status: 'OK' }))
})

app.post('/getmove', (req, res) => {
    if (req.body.player == winner) {
        res.send(JSON.stringify({ status: 'win' }))
        return
    }
    if (req.body.player != playerMove) {
        res.send(JSON.stringify({ status: 'opponent' }))
        return
    }
    res.send(JSON.stringify({ status: 'you', checkerId: lastMove.checkerId, tileId: lastMove.tileId, checkers }))
})

app.post('/sendlose', (req, res) => {
    winner = loggedIn.indexOf(loggedIn.find(a => a != req.body.player)) + 1
    res.send(JSON.stringify({ status: 'OK' }))
})

app.listen(PORT, () => {
    console.log(`server start on port ${PORT}`)
})