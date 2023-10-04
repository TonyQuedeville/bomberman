/*
	Projet Zone01 : Bomberman
	Tony Quedeville
	15/09/2023

	Server (Back-end):
  lien utile: https://socket.io/fr/docs/v4/server-socket-instance/
*/

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://192.168.110.151:3000'], // L'URL del'application cliente
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const port = 3001 // L'URL del'application server

const cors = require('cors')
const corsOptions = {
  origin: ['http://localhost:3000', 'http://192.168.110.151:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions))

const Chrono = require('./chrono');
const Levels = require('./levels');
const Game = require('./clsGame');
const { setTimeout } = require('timers/promises');

const connectedUsers = {} // Liste des users connectés

const game_1 = new Game(1, Levels);
game_1.initializeGame();

const games = {
  game_1: game_1
};

Chrono.init(io, games);

// Etabli la connexion
io.on('connection', (socket) => {
  /* ------------- Utilisateur -------------- */

  // Ajouter les informations de l'utilisateur au tableau des utilisateurs connectés
  socket.on('userConnect', (userPseudo) => {
    connectedUsers[socket.id] = userPseudo
    const userList = Object.values(connectedUsers)
    io.emit('connectedUsersList', userList)
    socket.emit('socketId',socket.id)

    const roomName = "game_1"
    const room = io.sockets.adapter.rooms.get(roomName)
    if (room) {      
      const players = games[roomName].getPlayers();
      io.emit('players', { players });
      const nbPlayers = games.game_1.nbPlayers
      io.emit('nbPlayers', { nbPlayers })
      if(games.game_1.isPlay){
      }
      io.emit('updateGame', games.game_1)
    }
  })

  // Écoute de la demande de la liste des utilisateurs connectés
  socket.on('getConnectedUsers', () => {
    // Récupérez les informations des utilisateurs connectés depuis l'objet connectedUsers
    const userList = Object.values(connectedUsers)
    socket.emit('connectedUsersList', userList)
  })

  // Juste avant la déconnection
  socket.on("disconnecting", (reason) => {
    const user = connectedUsers[socket.id]
    
    for (const room in games) {
      if (games[room].hasPlayer(user?.pseudo)) {
        games[room].removePlayer(socket.id)        
        const players = games[room].getPlayers()
        io.emit('players', { players })
        const nbPlayers = games.game_1.nbPlayers
        io.emit('nbPlayers', { nbPlayers })
        io.emit('message', { message: `${user.pseudo} a quitté la partie`, user_pseudo: 'Server' })
        socket.emit('userInGameConfirm', '')
        io.emit('updateGame', games.game_1)
        if(nbPlayers === 1) {
          const winner = games[room].getWinner()
          io.emit('winnerGame', winner)

          setTimeout(5000).then(() => {
            games[room].initializeGame()
            io.emit('winnerGame', {})
            io.emit('resetGame')
            io.emit('updateGame', games[room])
          })
        }
      }
    }

    delete connectedUsers[socket.id]
  });

  // Déconnection
  socket.on('disconnect', () => {
    const userList = Object.values(connectedUsers)
    socket.broadcast.emit('connectedUsersList', userList)
  });


  /* ------------- Tchat -------------- */

  // Message
  socket.on('message', (message) => {
    const user = connectedUsers[socket.id]
    // Traitement du message (par exemple, enregistrez en base de données)

    // Envoyez le message à tous les clients connectés y compris l'emeteur du message    
    io.emit('message', {message: message, user_pseudo: user?.pseudo})
  });


  /* ------------- Game -------------- */

  // Rejoindre de la partie
  socket.on('joinRoom', ({ roomName, user }) => {
    // Quitter toutes les autres rooms
    const roomKeys = Array.from(socket.rooms)
    roomKeys.forEach((room) => {
      if (room !== socket.id && room !== socket.id.toString()) {
        socket.leave(room) // quitter la partie
      }
    });

    // Pour ajouter un joueur à un jeu
    const nbPlayers = games[roomName].getNumberOfPlayers()
    if (nbPlayers < 4) {
      socket.join(roomName)
      games[roomName].addPlayer(socket.id, user)
      const players = games[roomName].getPlayers()
      io.emit('players', { players })
      const nbPlayers = games.game_1.nbPlayers
      io.emit('nbPlayers', { nbPlayers })
      io.emit('message', { message: `${user} participe à la ${roomName}`, user_pseudo: 'Server' })
      socket.emit('userInGameConfirm', roomName)
      io.emit('updateGame', games.game_1)
      
      // Chrono
      // Lancement du chrono 20s à 2 joueurs
      const endFunc = (isPlaying, emit) => {
        game_1.isPlay = isPlaying
        io.emit(emit)
      }

      if (games[roomName].nbPlayers === 2) {
        Chrono.start(20)
        io.emit('chronoUpdate', Chrono.timer())
      }

      // Arret du chrono 4 joueurs
      if (games[roomName].nbPlayers === 4) {
        Chrono.start(5)
        io.emit('chronoUpdate', 5 );
        io.emit('updateGame', games.game_1)
      }
    }
  });

  // Quitter la partie
  socket.on('quitRoom', () => {
    const user = connectedUsers[socket.id]

    for (const room in games) {
      if (games[room].hasPlayer(user?.pseudo)) {
        games[room].removePlayer(socket.id)        
        const players = games[room].getPlayers()
        io.emit('players', { players })
        const nbPlayers = games.game_1.nbPlayers
        io.emit('nbPlayers', { nbPlayers })
        io.emit('message', { message: `${user.pseudo} a quitté la partie`, user_pseudo: 'Server' })
        socket.emit('userInGameConfirm', '')
        io.emit('updateGame', games.game_1)
        socket.leave(room) 
        if(nbPlayers === 1) {
          const winner = games[room].getWinner()
          io.emit('winnerGame', winner)

          setTimeout(5000).then(() => {
            games[room].initializeGame()
            io.emit('winnerGame', {})
            io.emit('resetGame')
            io.emit('updateGame', games[room])
          })
        }
      }
    }
  })

  // Initialisation de la partie
  socket.on('goGame', (roomName) => {
    Chrono.start(0)
    io.emit('chronoUpdate', 0);
    io.emit('updateGame', games.game_1)
  })

  // Evènements clavier
  // Gauche
  socket.on('gauche', (room) => {
    const player = game_1.getPlayerBySocketId(socket.id) // Recherche du joueur correspondant à ce socketId

    if (!player) {
      console.log("Gauche: Le joueur correspondant au socketId n'a pas été trouvé")
      return;
    } else {
      if(player.deplacement){
        const attract = games[room].moveLeft(player)
        if (attract) {
          if(attract === "escapeBlackHole") {
            io.emit('escapeBlackHole', player)
          }
        }
        io.emit('updateGame', games[room])
        player.deplacement = false

        setTimeout(player.vitesse).then(() => {
          player.deplacement = true
        })
      }
    }
  })
  // Orientation Gauche
  socket.on('orientgauche', (room) => {
    const player = game_1.getPlayerBySocketId(socket.id) // Recherche du joueur correspondant à ce socketId

    if (!player) {
      console.log("Gauche: Le joueur correspondant au socketId n'a pas été trouvé")
      return;
    } else {
      player.orientation = 'gauche'
      io.emit('updateGame', games[room])
    }
  })

  // Droite
  socket.on('droite', (room) => {
    const player = game_1.getPlayerBySocketId(socket.id) // Recherche du joueur correspondant à ce socketId

    if (!player) {
      console.log("Droite: Le joueur correspondant au socketId n'a pas été trouvé")
      return;
    } else {
      if(player.deplacement){
        const attract = games[room].moveRight(player)
        if (attract) {
          if(attract === "escapeBlackHole") {
            io.emit('escapeBlackHole', player)
          }
        }
        io.emit('updateGame', games[room])
        player.deplacement = false

        setTimeout(player.vitesse).then(() => {
          player.deplacement = true
        })
      }
    }
  })
  // Orientation Droite
  socket.on('orientdroite', (room) => {
    const player = game_1.getPlayerBySocketId(socket.id) // Recherche du joueur correspondant à ce socketId

    if (!player) {
      console.log("Droite: Le joueur correspondant au socketId n'a pas été trouvé")
      return;
    } else {
      player.orientation = 'droite'
      io.emit('updateGame', games[room])
    }
  })

  // Haut
  socket.on('haut', (room) => {
    const player = game_1.getPlayerBySocketId(socket.id) // Recherche du joueur correspondant à ce socketId

    if (!player) {
      console.log("Haut: Le joueur correspondant au socketId n'a pas été trouvé")
      return;
    } else {
      if(player.deplacement){
        const attract = games[room].moveUp(player)
        if (attract) {
          if(attract === "escapeBlackHole") {
            io.emit('escapeBlackHole', player)
          }
        }
        io.emit('updateGame', games[room])
        player.deplacement = false

        setTimeout(player.vitesse).then(() => {
          player.deplacement = true
        })
      }
    }
  })
  // Orientation Haut
  socket.on('orienthaut', (room) => {
    const player = game_1.getPlayerBySocketId(socket.id) // Recherche du joueur correspondant à ce socketId

    if (!player) {
      console.log("Haut: Le joueur correspondant au socketId n'a pas été trouvé")
      return;
    } else {
      player.orientation = 'haut'
      io.emit('updateGame', games[room])
    }
  })

  // Bas
  socket.on('bas', (room) => {
    const player = game_1.getPlayerBySocketId(socket.id) // Recherche du joueur correspondant à ce socketId

    if (!player) {
      console.log("Bas: Le joueur correspondant au socketId n'a pas été trouvé")
      return;
    } else {
      if(player.deplacement){
        const attract = games[room].moveDown(player)
        if (attract) {
          if(attract === "escapeBlackHole") {
            io.emit('escapeBlackHole', player)
          }
        }
        io.emit('updateGame', games[room])
        player.deplacement = false

        setTimeout(player.vitesse).then(() => {
          player.deplacement = true
        })
      }
    }
  })
  // Orientation Bas
  socket.on('orientbas', (room) => {
    const player = game_1.getPlayerBySocketId(socket.id) // Recherche du joueur correspondant à ce socketId

    if (!player) {
      console.log("Bas: Le joueur correspondant au socketId n'a pas été trouvé")
      return;
    } else {
      player.orientation = 'bas'
      io.emit('updateGame', games[room])
    }
  })

  // Espace (poser un BigBang Bb)
  socket.on('espace', (room) => {    
    const bigBangId = games[room].placeBigBang(socket.id, 3)
    if(!bigBangId) return

    io.emit('updateGame', games[room])

    const nbGal = games[room].bigBangs[bigBangId].elementsAdjacent.reduce((acc,el) => {
      if(el.id.split('_')[0] === "Gl") 
      {return acc+1}
      else {return acc}
    }, 0)
    const coordBb = game_1.bigBangs[bigBangId].coord
    const porteeBb = game_1.bigBangs[bigBangId].portee
    
    setTimeout(game_1.bigBangs[bigBangId].timer * 1000).then(() => {
      // Suppression du trou noir
      const player = game_1.removeBigBang(game_1.bigBangs[bigBangId], socket.id, bigBangId) 
      
      // BigBang: explosion du trou noir. génére les planetes bonus.
      games[room].setBonus(coordBb, porteeBb, nbGal)

      io.emit('updateGame', games[room])

      // Joueurs
      if(player) { // Le joueur s'echape de la zone d'attraction du trou noir
        io.emit('escapeBlackHole', player)
      }        
        if(games[room].nbPlayers <= 1) { // test si partie la est terminée
          if(games[room].nbPlayers === 0) { // en cas d'égalité
            io.emit('equalGame', 'equal')
          } else {
            const winner = games[room].getWinner()
            io.emit('winnerGame', winner)
          }

          setTimeout(5000).then(() => {
            io.emit('winnerGame', {})
            io.emit('resetGame')
            games[room].initializeGame()
            io.emit('updateGame', games[room])
            console.log("games[room] init:", games[room].elements);
          })
        }

      
    })
  })
});


/* --------- Ecoute du port --------- */
server.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`)
});


/* --- Fonctions --- */
