/*
	Projet Zone01 : Bomberman
	Tony Quedeville
	15/09/2023

	clsGame (Back-end): Class du jeu
*/

const Player = require('./clsPlayer')

class Game {
    /**
     * 
     * @param {Number} gameId 
     * @param {Object} levels 
     */
    constructor(gameId, levels) {
        // Jeu
        this.gameId = gameId
        this.levels = levels
        this.isPlay = false

        // Grille
        this.nbRow = 13
        this.nbCol = 15
        this.blocks = levels.blocks[gameId-1]
        this.elements = levels.elements[gameId-1]
        this.bigBangs = {}
        this.numBb = 0
        this.galaxies = []
        this.bonuss = {
            'vie': "Bn_vie",
            'bigbang': "Bn_bigbang",
            'portee': "Bn_portee",
            'vitesse': "Bn_vitesse",
        }
        this.nbBnVie = 0
        this.nbBnBigBang = 0
        this.nbBnPortee = 0
        this.nbBnVitesse = 0

        // Joueurs
        /**@type {Array<Player>} */
        this.players = []
        this.nbPlayers = 0
    }

    static get isPlay() {
        return this._isPlay
    }
    static set isPlay(val) {
        this._isPlay = val
    }

    static get nbPlayers() {
        return this._nbPlayers
    }
    static set nbPlayers(val) {
        this._nbPlayers = val
    }

    // Initialisation de la partie de jeu
    initializeGame() {
        this.isPlay = false;

        // Joueurs
        this.players = [
            new Player(1, "", "", [1, 1], 3, 1, 1, 200, true),
            new Player(2, "", "", [1, this.nbCol - 2], 3, 1, 1, 200, true),
            new Player(3, "", "", [this.nbRow - 2, 1], 3, 1, 1, 200, true),
            new Player(4, "", "", [this.nbRow - 2, this.nbCol - 2], 3, 1, 1, 200, true)
        ];
        this.nbPlayers = 0
        this.bigBangs = {}
        this.numBb = 0

        // Bonus
        this.bonuss = {
            'vie': "Bn_vie",
            'bigbang': "Bn_bigbang",
            'portee': "Bn_portee",
            'vitesse': "Bn_vitesse",
        }
        this.nbBnVie = 0
        this.nbBnBigBang = 0
        this.nbBnPortee = 0
        this.nbBnVitesse = 0

        // Matrice
        this.galaxies = []
        this.blocks = this.levels.blocks[this.gameId - 1];
        this.elements = this.levels.elements[this.gameId - 1];
        this.randomGalaxies();

        return false
    }

    // Retourne le nombre de joueur
    getNumberOfPlayers() {
        /** @type {Number} */
        let nbPlayers = 0;
        for (const player of this.players) {
            if (player.pseudo !== "") {
                nbPlayers++;
            }
        }
        return nbPlayers;
    }

    // Ajoute un joueur
    addPlayer(socketId, pseudo) {
        for (const player of this.players) {
            if (!player.pseudo) {
                player.pseudo = pseudo;
                player.socketId = socketId;
                this.nbPlayers++;
                break;
            }
        }

        switch (this.nbPlayers) {
            case 1:
                this.elements[1][1] = "Pl_1";
                this.elements[2][1] = "";
                this.elements[1][2] = "";
                break;
            case 2:
                this.elements[1][this.nbCol - 2] = "Pl_2";
                this.elements[2][this.nbCol - 2] = "";
                this.elements[1][this.nbCol - 3] = "";
                break;
            case 3:
                this.elements[this.nbRow - 2][1] = "Pl_3";
                this.elements[this.nbRow - 3][1] = "";
                this.elements[this.nbRow - 2][2] = "";
                break;
            case 4:
                this.elements[this.nbRow - 2][this.nbCol - 2] = "Pl_4";
                this.elements[this.nbRow - 2][this.nbCol - 3] = "";
                this.elements[this.nbRow - 3][this.nbCol - 2] = "";
                break;
        }
    }


    // Retourne la liste des joueurs
    getPlayers() {
        return Array.from(this.players);
    }
    
    // Retourne le gagnant
    getWinner() {
        for (let i = this.players.length - 1; i >= 0; i--) {
            if (this.players[i].pseudo !== "") {
                return this.players[i];
            }
        }
        return null; // Aucun joueur avec un pseudo non vide trouvé
    }

    // Vérifie si un joueur est présent dans le jeu, retourne son index si vrai sinon retourne faux
    hasPlayer(pseudo) {
        const foundPlayer = this.players.find(player => player.pseudo === pseudo);
        return foundPlayer ? this.players.indexOf(foundPlayer) : false;
    }

    // retourne l'index du joueur si vrai sinon retourne faux
    getPlayerIndexBySocketId(socketId) {
        const foundPlayer = this.players.find(player => player.socketId === socketId);
        return foundPlayer ? this.players.indexOf(foundPlayer) : false;
    }

    // Retourne le joueur si vrai sinon retourne faux
    getPlayerBySocketId(socketId) {
        const player = this.players.find(player => player.socketId === socketId);
        return player ? player : false;
    }

    // Supprime un joueur
    removePlayer(socketId) {
        const player = this.players.find(player => player.socketId === socketId);
        if (player) {
            const [lig, col] = player.coord;
            this.elements[lig][col] = "";
            player.socketId = ""; 
            player.pseudo = ""; 
            player.coord = []; 
            player.nbBb = 0; 
            player.portee = 0; 
            player.vitesse = 0; 
            player.orientation = ""; 
            this.nbPlayers--;
        }
    }

    // Initialisation des Galaxies
    randomGalaxies(){
        let id = 0
        for(const j in this.blocks) {
            const lig = this.blocks[j]
            for(const i in lig) {
                if(i > 0 & i < this.nbCol-1 && j > 0 && j < this.nbRow-1 && this.blocks[j][i] === "" && Math.random() < 0.5) {
                    id++
                    this.galaxies.push({
                        'id': id,
                        'coord': [j,i]
                    })
                    this.elements[j][i] = "Gl_" + id
                }
            }
        }
    }

    // Recherche si le joueur est à proximité d'un trou noir
    proxiBingBang(player) {
        Object.values(this.bigBangs).map((bigBang) => {
            let attract = false
            const playerIndex = bigBang.elementsAdjacent.findIndex(elem => elem.id === "Pl_" + player.id) 
            if (playerIndex >= 0) {
                bigBang.elementsAdjacent.splice(playerIndex, 1);
            }

            // Zone d'attraction gauche
            if(player.coord[0] === bigBang.coord[0] && player.coord[1] >= bigBang.coord[1] - bigBang.portee && player.coord[1] <= bigBang.coord[1]) {
                if(this.blocks[bigBang.coord[0]][[bigBang.coord[1]-1]] !== "Bl") {
                    attract = "attracGauche"
                }
            }
            // Zone d'attraction droite
            if(player.coord[0] === bigBang.coord[0] && player.coord[1] <= bigBang.coord[1] + bigBang.portee && player.coord[1] >= bigBang.coord[1]) {
                if(this.blocks[bigBang.coord[0]][[bigBang.coord[1]+1]] !== "Bl") {
                    attract = "attracDroite"
                }
            }
            // Zone d'attraction haut
            if(player.coord[1] === bigBang.coord[1] && player.coord[0] >= bigBang.coord[0] - bigBang.portee && player.coord[0] <= bigBang.coord[0]) {
                if(this.blocks[bigBang.coord[0]-1][[bigBang.coord[1]]] !== "Bl") {    
                    attract = "attracHaut"
                }
            }
            // Zone d'attraction bas
            if(player.coord[1] === bigBang.coord[1] && player.coord[0] <= bigBang.coord[0] + bigBang.portee && player.coord[0] >= bigBang.coord[0]) {
                if(this.blocks[bigBang.coord[0]+1][[bigBang.coord[1]]] !== "Bl") {
                    attract = "attracBas"
                }
            }

            if (attract) { // si le joueur est dans la zone d'attraction du trou noir
                // ajout du joueur dans les éléments adjaçants du bigBang
                bigBang.elementsAdjacent.push(
                    {
                        'id': "Pl_" + player.id,
                        'direction': attract ,
                        'coord': player.coord
                    }
                )
                return attract
            } else { // si le joueur n'est plus dans la zone d'attraction du trou noir
                if (playerIndex >= 0) {
                    return "escapeBlackHole"
                } else {
                    return false
                }
            }
        })
    }

    setPlayerBonus(playerId, bonus){
        switch (bonus) {
            case "vie":
                this.nbBnVie--
                this.players[playerId].nbVie++
            break;
            case "bigbang":
                this.nbBnBigBang--
                this.players[playerId].nbBb++
            break;
            case "portee":
                this.nbBnPortee--
                this.players[playerId].portee++
            break;
            case "vitesse":
                this.nbBnVitesse--
                if(this.players[playerId].vitesse >= 1) this.players[playerId].vitesse = Math.floor(this.players[playerId].vitesse / 2)
            break;
        
            default:
                break;
        }
    }

    // Evènements clavier
    // Gauche
    moveLeft(player){
        const [lig, col] = player.coord;
        const playerId = this.getPlayerIndexBySocketId(player.socketId)
        
        if (col > 1 && (this.elements[lig][col - 1] === "" || this.elements[lig][col - 1].split('_')[0] === "Bn") && this.blocks[lig][col - 1] === "") {
             // Bonus
            if(this.elements[lig][col - 1].split('_')[0] === "Bn"){
                this.setPlayerBonus(playerId, this.elements[lig][col - 1].split('_')[1])
            }

            this.players[playerId].orientation = 'gauche'
            player.coord = [lig, col - 1];
            this.elements[lig][col] = "" // Efface l'ancienne position
            this.elements[lig][col - 1] = `Pl_${player.id}` // Met à jour la nouvelle position
            this.proxiBingBang(player) // Recherche si proximité d'un blackhole

            return true;
        } else {
            return false; // Déplacement impossible
        }
    }

    // Droite
    moveRight(player){
        const [lig, col] = player.coord;
        const playerId = this.getPlayerIndexBySocketId(player.socketId)
        
        if (col < this.nbCol - 2 && (this.elements[lig][col + 1] === "" || this.elements[lig][col + 1].split('_')[0] === "Bn") && this.blocks[lig][col + 1] === "") {
            // Bonus
            if(this.elements[lig][col + 1].split('_')[0] === "Bn"){
                this.setPlayerBonus(playerId, this.elements[lig][col + 1].split('_')[1])
            }

            this.players[playerId].orientation = 'droite'
            player.coord = [lig, col + 1];
            this.elements[lig][col] = ""; // Efface l'ancienne position
            this.elements[lig][col + 1] = `Pl_${player.id}`; // Met à jour la nouvelle position
            this.proxiBingBang(player) // Recherche si proximité d'un blackhole  

            return true; 
        } else {
            return false; // Déplacement impossible
        }
    }

    // Haut
    moveUp(player){
        const [lig, col] = player.coord;
        const playerId = this.getPlayerIndexBySocketId(player.socketId)
        
        if (lig > 1 && (this.elements[lig - 1][col] === "" || this.elements[lig - 1][col].split('_')[0] === "Bn") && this.blocks[lig - 1][col] === "") {
             // Bonus
            if(this.elements[lig - 1][col].split('_')[0] === "Bn"){
                this.setPlayerBonus(playerId, this.elements[lig - 1][col].split('_')[1])
            }

            this.players[playerId].orientation = 'haut'
            player.coord = [lig - 1, col];
            this.elements[lig][col] = ""; // Efface l'ancienne position
            this.elements[lig - 1][col] = `Pl_${player.id}`; // Met à jour la nouvelle position
            this.proxiBingBang(player) // Recherche si proximité d'un blackhole  

            return true; 
        } else {
            return false; // Déplacement impossible
        }
    }
    
    // Bas
    moveDown(player){
        const [lig, col] = player.coord;
        const playerId = this.getPlayerIndexBySocketId(player.socketId)
        
        if (lig < this.nbRow - 2 && (this.elements[lig + 1][col] === "" || this.elements[lig + 1][col].split('_')[0] === "Bn") && this.blocks[lig + 1][col] === "") {
            // Bonus
            if(this.elements[lig + 1][col].split('_')[0] === "Bn"){
                this.setPlayerBonus(playerId, this.elements[lig + 1][col].split('_')[1])
            }
            
            this.players[playerId].orientation = 'bas'
            player.coord = [lig + 1, col];
            this.elements[lig][col] = ""; // Efface l'ancienne position
            this.elements[lig + 1][col] = `Pl_${player.id}`; // Met à jour la nouvelle position
            this.proxiBingBang(player) // Recherche si proximité d'un blackhole   

            return true; 
        } else {
            return false; // Déplacement impossible
        }
    }

    // Espace placer un bigbang
    placeBigBang(socketId, timer) {
        const player = this.getPlayerBySocketId(socketId)
        if(!player || player.nbBb === 0 ) return false

        const [lig, col] = player.coord
        let coordBb = []

        switch (player.orientation) {
            case "gauche":
                if(this.elements[lig][col-1] === "" && this.blocks[lig][col-1] === "") {
                    coordBb = [lig, col-1]
                    this.numBb++
                    this.elements[lig][col-1] = "Bb_" + this.numBb
                } else {return false}
            break;
            case "droite":
                if(this.elements[lig][col+1] === "" && this.blocks[lig][col+1] === "") {
                    coordBb = [lig, col+1]
                    this.numBb++
                    this.elements[lig][col+1] = "Bb_" + this.numBb
                } else {return false}
            break;
            case "haut":
                if(this.elements[lig-1][col] === "" && this.blocks[lig-1][col] === "") {
                    coordBb = [lig-1, col]
                    this.numBb++
                    this.elements[lig-1][col] = "Bb_" + this.numBb
                } else {return false}
            break;
            case "bas":
                if(this.elements[lig+1][col] === "" && this.blocks[lig+1][col] === "") {
                    coordBb = [lig+1, col]
                    this.numBb++
                    this.elements[lig+1][col] = "Bb_" + this.numBb
                } else {return false}
            break;
        
            default:
                return false
        }

        const elementsAdjacent = []
        // Eléments à Gauche
        for(let i=1; i<=player.portee; i++){
            if(this.blocks[coordBb[0]][coordBb[1]-i] === "Bl" || this.elements[coordBb[0]][coordBb[1]-i].split('_')[0] === "Bb") break
            if(this.elements[coordBb[0]][coordBb[1]-i] !== "" ) { 
                elementsAdjacent.push(
                    {
                        'id': this.elements[coordBb[0]][coordBb[1]-i],
                        'direction': this.elements[coordBb[0]][coordBb[1]-i].split('_')[0] === "Pl" ? "attracGauche" : "elemGauche",
                        'coord': [coordBb[0], coordBb[1]-i]
                    }
                )
            }
        }

        // Eléments à Droite
        for(let i=1; i<=player.portee; i++){
            if(this.blocks[coordBb[0]][coordBb[1]+i] === "Bl" || this.elements[coordBb[0]][coordBb[1]+i].split('_')[0] === "Bb") break
            if(this.elements[coordBb[0]][coordBb[1]+i] !== "" ) { 
                elementsAdjacent.push(
                    {
                        'id': this.elements[coordBb[0]][coordBb[1]+i],
                        'direction': this.elements[coordBb[0]][coordBb[1]+i].split('_')[0] === "Pl" ? "attracDroite" : "elemDroite",
                        'coord': [coordBb[0], coordBb[1]+i]
                    }
                )
            }
        }

        // Eléments à Haut
        for(let i=1; i<=player.portee; i++){
            if(this.blocks[coordBb[0]-i][coordBb[1]] === "Bl" || this.elements[coordBb[0]-i][coordBb[1]].split('_')[0] === "Bb") break
            if(this.elements[coordBb[0]-i][coordBb[1]] !== "" ) { 
                elementsAdjacent.push(
                    {
                        'id': this.elements[coordBb[0]-i][coordBb[1]],
                        'direction': this.elements[coordBb[0]-i][coordBb[1]].split('_')[0] === "Pl" ? "attracHaut" : "elemHaut",
                        'coord': [coordBb[0]-i, coordBb[1]]
                    }
                )
            }
        }

        // Eléments à Bas
        for(let i=1; i<=player.portee; i++){
            if(this.blocks[coordBb[0]+i][coordBb[1]] === "Bl" || this.elements[coordBb[0]+i][coordBb[1]].split('_')[0] === "Bb") break
            if(this.elements[coordBb[0]+i][coordBb[1]] !== "" ) { 
                elementsAdjacent.push(
                    {
                        'id': this.elements[coordBb[0]+i][coordBb[1]],
                        'direction': this.elements[coordBb[0]+i][coordBb[1]].split('_')[0] === "Pl" ? "attracBas" : "elemBas",
                        'coord': [coordBb[0]+i, coordBb[1]]
                    }
                )
            }
        }

        const bigBangId = "bB_" + this.numBb;
        this.bigBangs[bigBangId] = {
            'id': bigBangId,
            'coord': coordBb,
            'timer': timer,
            'portee': player.portee,
            'elementsAdjacent': elementsAdjacent,
        };
        player.nbBb--

        return bigBangId
    }

    // Supprimer un bigbang
    removeBigBang(bigBang, socketId, bigBangId) {
        const player = this.getPlayerBySocketId(socketId)

        this.elements[bigBang.coord[0]][bigBang.coord[1]] = ""
        player.nbBb++

        // Suppression de l'élément adjacent dans la grille
        bigBang.elementsAdjacent.forEach((elemAdj) => {
            if(elemAdj.id.split('_')[0] === "Gl" || elemAdj.id.split('_')[0] === "Bn") {
                this.elements[elemAdj.coord[0]][elemAdj.coord[1]] = ""
            } 
        })

        let escapePlayers = []

        this.players.forEach((player) => {
            if(player.socketId) {
                // test si le player est dans la portée
                if(
                    ((player.coord[0] >= bigBang.coord[0] - bigBang.portee && player.coord[0] <= bigBang.coord[0] + bigBang.portee)
                    && player.coord[1] === bigBang.coord[1]) ||
                    ((player.coord[1] >= bigBang.coord[1] - bigBang.portee && player.coord[1] <= bigBang.coord[1] + bigBang.portee)
                    && player.coord[0] === bigBang.coord[0])
                ) {
                    player.nbVie--
                    if(player.nbVie === 0) {
                        this.removePlayer(player.socketId)   
                    } 
                }
                else {
                    escapePlayers.push(player)
                }
            } 
        })                  

        // Suppression du bigBang dans la liste bigBangs
        delete this.bigBangs[bigBangId];

        if(escapePlayers.length === 1) {
            return escapePlayers[0]
        }
        return false
    }

    // Génère des bonus aléatoires dans la portée et à l'explosion du bigBang
    setBonus(coordBb, portee, nbGal) {
        for(let i=0; i<nbGal; i++){
            const minPortee = -portee
            const maxPortee = portee
            const randPortee = Math.floor(Math.random() * (maxPortee - minPortee + 1)) + minPortee

            let porteeLig = 0
            let porteeCol = 0
            const randomLigCol = Math.random() >= 0.5
            if(randomLigCol){
                porteeLig = randPortee
            } else {
                porteeCol = randPortee
            }

            const min = 1
            const max = 4
            const keys = Object.keys(this.bonuss)
            const randomIndex = Math.floor(Math.random() * (max - min + 1))
            let randomBonus = this.bonuss[keys[randomIndex]]
            
            if(this.blocks[coordBb[0] + porteeLig] && this.blocks[coordBb[0] + porteeLig][coordBb[1] + porteeCol] === "") {
                switch (randomBonus.split('_')[1]) {
                    case 'vie': 
                        this.nbBnVie++
                        randomBonus = randomBonus + '_' + this.nbBnVie
                        break;
                    case 'bigbang': 
                        this.nbBnBigBang++
                        randomBonus = randomBonus + '_' + this.nbBnBigBang
                        break;
                    case 'portee': 
                        if(this.nbBnPortee > 11) this.nbBnPortee++
                        randomBonus = randomBonus + '_' + this.nbBnPortee
                        break;
                    case 'vitesse': 
                        this.nbBnVitesse++
                        randomBonus = randomBonus + '_' + this.nbBnVitesse
                        break;
                    default:
                        break;
                }

                this.elements[coordBb[0] + porteeLig][coordBb[1] + porteeCol] = randomBonus
            }
        }
    }
}

module.exports = Game;