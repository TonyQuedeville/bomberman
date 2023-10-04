/*
    Tony Quedeville (tquedevi)
    21/09/2023
    Zone01
    Projet Bomberman
    Timer ascendant hms
*/

/*------------------------------------------------------------------------------------------*/
let second = 0
let minute = 0
let heure = 0
let chrono

function start() {
    clrTimer()
    chrono = setInterval(() => { timer(); }, 1000);
    
}

function clrTimer(init = false) {
    if(init){
        second = 0
        minute = 0
        heure = 0
    }
    clearInterval(chrono);
}

function timer() {
    if ((second += 1)== 60) {
        second = 0
        minute++
    }
    if (minute == 60) {
        minute = 0
        heure++
    }
    return returnData(heure) + ":" + returnData(minute) + ":" + returnData(second)
}

function returnData(input) {
    return input > 9 ? input : `0${input}`
}

module.exports = { start, clrTimer, timer};