const express = require('express')
const app = express()
const PORT = 3000

app.use(express.static('static'))
app.use(express.json())

let loggedIn = []
let lastMove = {}
let playerMove = 1
let winner
let checkerIds

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
    checkerIds = null
    res.send({ status: 'OK' })
})

app.post('/getplayercount', (req, res) => {
    res.send(JSON.stringify({ count: loggedIn.length }))
})

app.post('/sendmove', (req, res) => {
    lastMove = { checkerId: req.body.checkerId, steps: req.body.steps }
    playerMove = playerMove === 1 ? 2 : 1
    checkerIds = req.body.checkerIds
    if (!checkerIds.some(row => {
        return row.some(a => a !== 1)
    }))
        winner = 2
    else if (!checkerIds.some(row => {
        return row.some(a => a !== 2)
    }))
        winner = 1
    res.send(JSON.stringify({ status: 'OK' }))
})

app.post('/getmove', (req, res) => {
    if (req.body.player == winner) {
        winner = null
        res.send(JSON.stringify({ status: 'win' }))
        return
    }
    if (winner) {
        res.send(JSON.stringify({ status: 'lose' }))
        return
    }
    if (req.body.player != playerMove) {
        res.send(JSON.stringify({ status: 'opponent' }))
        return
    }
    res.send(JSON.stringify({ status: 'you', checkerId: lastMove.checkerId, steps: lastMove.steps, checkerIds }))
})

app.post('/sendlose', (req, res) => {
    winner = loggedIn.indexOf(loggedIn.find(a => a != req.body.player)) + 1
    res.send(JSON.stringify({ status: 'OK' }))
})

app.listen(PORT, () => {
    console.log(`server start on port ${PORT}`)
})