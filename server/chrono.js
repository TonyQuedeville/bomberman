/*
    Tony Quedeville (tquedevi)
    21/09/2023
    Zone01
    Projet Bomberman
    Chrono : timer descendant en secondes uniquement
*/

/*------------------------------------------------------------------------------------------*/

let second = 0
let chrono
let io
let game

function init(socketIo, games) {
    io = socketIo;
    game = games.game_1
}

function start(valInit) {
    clrTimer()
    second = valInit

    chrono = setInterval(() => { 
        timer(); 
        if (second <= 0) {
            game.isPlay = true
            io.emit('startGame')            
            clrTimer()
        }     
        io.emit('chronoUpdate', second );        
    }, 1000);
}

function clrTimer() {
    if (second < 0) second = 0
    clearInterval(chrono);
}

function timer() {
    second -= 1
    if (second === 0) {
        clrTimer()
    }
    return returnData(second)
}

function returnData(input) {
    return input > 9 ? input : `0${input}`
}

module.exports = { init, start, clrTimer, timer};