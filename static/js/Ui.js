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

    endLogin(playerName, playerNumber) {
        let cover = document.getElementById('cover')
        cover.innerHTML = ''
        let p = document.createElement('p')
        p.innerHTML = 'Oczekiwanie na drugiego gracza...'
        cover.appendChild(p)
        let loading = document.createElement('div')
        loading.classList.add('lds-default')
        loading.innerHTML = `<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>`
        cover.appendChild(loading)
        net.fetchPlayerCount(playerName, playerNumber)
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
        this.opponentMoveCountdown()
    }

    startGame(playerName) {
        document.getElementById('cover').remove()
        this.updateStatus(playerName)
        this.moveCountdown()
    }

    yourMove() {
        document.getElementById('cover').remove()
        this.moveCountdown()
    }

    moveCountdown() {
        this.updateTimer('30')
        clearInterval(this.opponentCountdownInterval)
        let i = 29
        this.countdownInterval = setInterval(() => {
            if (i < 0) {
                net.sendLose()
                clearInterval(this.moveCountdownInterval);
                this.displayLose()
                return
            }
            this.updateTimer(i)
            i--
        }, 1000);
    }

    opponentMoveCountdown() {
        this.updateTimer('')
        clearInterval(this.countdownInterval)
        let i = 29
        this.opponentCountdownInterval = setInterval(() => {
            if (i < 0) {
                clearInterval(this.opponentCountdownInterval)
                return
            }
            this.updateCoverTimer(i)
            i--
        }, 1000);
    }

    displayLose() {
        this.updateStatus('you lost')
    }

    displayWin() {
        this.updateStatus('you won')
    }
}