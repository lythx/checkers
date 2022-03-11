class Net {

    async login() {
        const login = document.getElementById('txt').value
        const body = JSON.stringify({ login })
        console.log(body)
        const response = await fetch('/addlogin', { method: 'POST', body })
        if (response == 'TOO MANY LOGGED IN') {
            ui.displayError('Already 2 players')
            return
        }
        if (response == 'NAME TAKEN') {
            ui.displayError('Name already taken')
            return
        }
        if (response == 'OK')
            ui.endLogin(login)
        console.log(response)
    }
}