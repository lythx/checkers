class Ui {

    displayTop(str) {
        document.getElementById('top').innerHTML = str
    }

    endLogin(str, player) {
        document.getElementById('cover').remove()
        document.getElementById('top').innerHTML = str
        game.createChekers(player)
    }
}