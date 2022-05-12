class Net {

    playerName

    async login() {
        const login = document.getElementById('txt').value
        const body = JSON.stringify({ login })
        const response = await fetch('/addlogin', {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (data.status === 'TOO MANY LOGGED IN')
            ui.updateStatus('Already 2 players')
        else if (data.status === 'NAME TAKEN')
            ui.updateStatus('Name already taken')
        else if (data.status === 'OK') {
            ui.awaitGame()
            this.playerName = login
            this.getPlayerCount(login, data.player)
        }
    }

    async reset() {
        const response = await fetch('/reset', { method: 'POST' })
        const data = await response.json()
        if (data.status === 'OK')
            ui.updateStatus('Reset')
    }

    getPlayerCount(playerName, playerNumber) {
        const interval = setInterval(async () => {
            const response = await fetch('/getplayercount', { method: 'POST' })
            const data = await response.json()
            if (data.count === 2) {
                clearInterval(interval)
                if (playerNumber === 2) {
                    await this.startGame()
                    game.start(playerNumber)
                    ui.startGame(playerName)
                    ui.opponentMove()
                    this.getStatus(playerNumber)
                }
                else {
                    await this.startGame()
                    game.start(playerNumber)
                    ui.startGame(playerName)
                    this.getStatus(playerNumber)
                }
            }
        }, 500);
    }

    getStatus(playerNumber) {
        const interval = setInterval(async () => {
            const body = JSON.stringify({ player: playerNumber })
            const response = await fetch('/getstatus', {
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            if (data.status === 'yourturn') {
                game.handleOpponentMove(data.checkerId, data.steps, data.checkerIds)
                ui.yourMove()
            }
            else if (data.status === 'you')
                ui.updateTimer(`${data.time}`)
            else if (data.status === 'opponent')
                ui.updateCoverTimer(`${data.time}`)
            else if (data.status === 'win') {
                clearInterval(interval)
                ui.displayWin()
            }
            else if (data.status === 'game cancelled') {
                clearInterval(interval)
            }
            else if (data.status === 'lose') {
                game.handleOpponentMove(data.checkerId, data.steps, data.checkerIds)
                clearInterval(interval)
                ui.displayLose()
            }
        }, 500);
    }

    async sendMove(checkerId, steps, checkerIds, checkerColors) {
        console.table(checkerColors)
        const body = JSON.stringify({ checkerId, steps, checkerIds, checkerColors })
        const response = await fetch('/sendmove', {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (data.status === "win")
            ui.displayWin()
    }

    async startGame() {
        return new Promise(async (resolve, reject) => {
            resolve(await fetch('/startgame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }))
        })
    }
}