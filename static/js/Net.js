class Net {

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
        if (data.status == 'TOO MANY LOGGED IN') {
            ui.displayTop('Already 2 players')
            return
        }
        if (data.status == 'NAME TAKEN') {
            ui.displayTop('Name already taken')
            return
        }
        if (data.status == 'OK')
            ui.endLogin(login, data.player)
    }

    async reset() {
        const response = await fetch('/reset', { method: 'POST' })
        const data = await response.json()
        if (data.status == 'OK') {
            ui.displayTop('Reset')
        }
    }

    fetchPlayerCount(playerName, playerNumber) {
        const interval = setInterval(async () => {
            const response = await fetch('/getplayercount', { method: 'POST' })
            const data = await response.json()
            if (data.count == 2) {
                clearInterval(interval)
                if (playerNumber == 2) {
                    game.createChekers(playerNumber)
                    ui.startGame(playerName)
                    ui.opponentMove()
                    this.getMove(playerNumber)
                }
                else {
                    game.createChekers(playerNumber)
                    ui.startGame(playerName)
                }
            }
        }, 500);
    }

    getMove(playerNumber) {
        const interval = setInterval(async () => {
            const body = JSON.stringify({ player: playerNumber })
            const response = await fetch('/getmove', {
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            if (data.status == 'you') {
                clearInterval(interval)
                ui.yourMove()
                console.log(await data)
                game.animateMove({ from: data.from, to: data.to, name: data.name })
            }
        }, 500);
    }

    async sendMove(oldPos, newPos, name) {
        const body = JSON.stringify({ oldPos, newPos, name })
        const response = await fetch('/sendmove', {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
    }
}