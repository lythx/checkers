class Ui {

    countdownInterval
    opponentCountdownInterval

    updateStatus(str) {
        document.getElementById('lefttop').innerHTML = str
    }

    updateTimer(str) {
        document.getElementById('righttop').innerHTML = str
    }

    updateCoverTimer(str) {
        document.getElementById('covercountdown').innerHTML = str
    }

    awaitGame() {
        let cover = document.getElementById('cover')
        cover.innerHTML = ''
        let p = document.createElement('p')
        p.innerHTML = 'Oczekiwanie na drugiego gracza...'
        cover.appendChild(p)
        let loading = document.createElement('div')
        loading.classList.add('lds-default')
        loading.innerHTML = `<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>`
        cover.appendChild(loading)
    }

    opponentMove() {
        let cover = document.createElement('div')
        cover.id = 'cover'
        document.body.appendChild(cover)
        let p = document.createElement('p')
        p.innerHTML = 'Ruch drugiego gracza'
        cover.appendChild(p)
        let loading = document.createElement('div')
        loading.classList.add('lds-default')
        loading.innerHTML = `<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>`
        cover.appendChild(loading)
        let countdown = document.createElement('p')
        countdown.id = "covercountdown"
        countdown.innerHTML = '30'
        cover.appendChild(countdown)
    }

    startGame(playerName) {
        document.getElementById('cover').remove()
        this.updateStatus(playerName)
    }

    yourMove() {
        console.log('asdd')
        document.getElementById('cover').remove()
    }

    displayLose() {
        document.getElementById('cover').remove()
        let cover = document.createElement('div')
        cover.id = 'cover'
        document.body.appendChild(cover)
        let p = document.createElement('p')
        p.innerHTML = 'You Lost'
        cover.appendChild(p)
    }

    displayWin() {
        document.getElementById('cover').remove()
        let cover = document.createElement('div')
        cover.id = 'cover'
        document.body.appendChild(cover)
        let p = document.createElement('p')
        p.innerHTML = 'You Won'
        cover.appendChild(p)
    }
}