class Ui {

    displayError(str) {
        document.getElementById('top').innerHTML = str
    }

    endLogin(str) {
        document.getElementById('loginwrap').remove()
        document.getElementById('top').innerHTML = str
        console.log(net.loggedIn)
    }
}