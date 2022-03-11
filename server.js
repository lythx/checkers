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
        res.send('TOO MANY LOGGED IN')
        return
    }
    if (loggedIn[0] == req.body.login) {
        res.send('NAME TAKEN')
        return
    }
    loggedIn.push(req.body.login)
    res.send('OK')
})

app.listen(PORT, () => {
    console.log(`server start on port ${PORT}`)
})