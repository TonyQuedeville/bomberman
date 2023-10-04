/*
	Projet Zone01 : Bomberman
	Tony Quedeville
	15/09/2023

	clsPlayer (Back-end): Class d'un joueur
*/
/*------------------------------------------------------------------------------------------*/

class Player {
    /**
     * 
     * @param {Number} id 
     * @param {String} pseudo 
     * @param {*String} socketId 
     * @param {Array<Number>} coord 
     * @param {Number} nbVie 
     * @param {Number} nbBb 
     * @param {Number} portee 
     * @param {Number} vitesse 
     * @param {Boolean} deplacement 
     */
    constructor(id, pseudo, socketId, coord, nbVie, nbBb, portee, vitesse){
        this.id = id,
        this.pseudo = pseudo,
        this.socketId = socketId,
        this.coord = coord, 
        this.orientation = '',
        this.nbVie = nbVie,
        this.nbBb = nbBb,
        this.portee = portee,
        this.vitesse = vitesse
        this.deplacement = true
    }
}

module.exports = Player;