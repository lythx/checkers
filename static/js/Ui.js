class Ui {

    displayTop(str) {
        document.getElementById('top').innerHTML = str
    }

    endLogin(playerName, playerNumber) {
        console.log(playerNumber)
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
    }

    startGame(playerName) {
        document.getElementById('cover').remove()
        document.getElementById('top').innerHTML = playerName
    }

    yourMove() {
        document.getElementById('cover').remove()
    }
}