class Ui {

    displayTop(str) {
        document.getElementById('top').innerHTML = str
    }

    endLogin(playerName, playerNumber) {
        let cover = document.getElementById('cover')
        if (playerNumber == 1) {
            cover.innerHTML = ''
            let p = document.createElement('p')
            p.innerHTML = 'Oczekiwanie na drugiego gracza...'
            cover.appendChild(p)
            let loading = document.createElement('div')
            loading.classList.add('lds-default')
            loading.innerHTML = `<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>`
            cover.appendChild(loading)
            net.fetchPlayerCount(playerName)
            return
        }
        this.startGame(playerName, playerNumber)
    }

    startGame(playerName, playerNumber) {
        document.getElementById('cover').remove()
        document.getElementById('top').innerHTML = playerName
        game.createChekers(playerNumber)
    }
}