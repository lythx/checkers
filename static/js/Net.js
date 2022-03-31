class Net {

    async login() {
        const login = document.getElementById('txt').value
        const body = JSON.stringify({ login })
        console.log(body)
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
        console.log(data.status)
    }

    async reset() {
        const response = await fetch('/reset', { method: 'POST' })
        const data = await response.json()
        if (data.status == 'OK') {
            ui.displayTop('Reset')
        }
    }

    fetchPlayerCount(playerName) {
        const interval = setInterval(async () => {
            const response = await fetch('/getplayercount', { method: 'POST' })
            const data = await response.json()
            if (data.count == 2) {
                clearInterval(interval)
                ui.startGame(playerName, 1)
            }
        }, 500);
    }
}