/*
    Tony Quedeville (tquedevi)
    25/09/2023
    Zone01
    Projet Bomberman

    Test unitaire: Ajout d'un joueur dans une partie
*/

/*------------------------------------------------------------------------------------------*/

const Game = require('./clsGame'); // Assurez-vous que le chemin d'importation est correct
const Levels = require('./levels');

// Décrivez votre suite de tests
describe('Test de la fonction addPlayer', () => {
    // Test unitaire pour l'ajout d'un joueur
    it('Ajoute un joueur avec succès', () => {
        const game = new Game(1, Levels);
        game.initializeGame();
        const socketId = "0000"
        const user = 'NouveauJoueur';

        // Appelez la fonction d'ajout de joueur
        game.addPlayer(socketId, user);

        console.log('Nombre de joueurs après ajout :', game.getNumberOfPlayers());
        console.log('Liste des joueurs après ajout :', game.getPlayers());

        // Effectuez des assertions pour vérifier que le joueur a bien été ajouté
        expect(game.getNumberOfPlayers()).toBe(1); // Vérifiez le nombre de joueurs
        const playerIndex = game.hasPlayer(user); // Obtenez l'index du joueur
        expect(playerIndex).not.toBe(false); // Vérifiez que l'index n'est pas faux (c'est-à-dire que le joueur existe)
    });

    // Vous pouvez ajouter d'autres tests ici pour gérer différents cas
});