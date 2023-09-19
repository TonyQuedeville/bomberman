/*
	Projet Zone01 : Bomberman
	Tony Quedeville
	15/09/2023

	Server (Back-end):
	
*/

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // L'URL del'application cliente
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const port = 3001 // L'URL del'application server

const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions))

const connectedUsers = {} // Liste des users connectés
const activeUsersByGame = {game_1: []} // liste des users par partie de jeu. 4 joueurs maxi

// Etabli la connexion
io.on('connection', (socket) => {
  /* ------------- Utilisateur -------------- */

  // Ajouter les informations de l'utilisateur au tableau des utilisateurs connectés
  socket.on('userConnect', (userPseudo) => {
    connectedUsers[socket.id] = userPseudo
    const userList = Object.values(connectedUsers)
    io.emit('connectedUsersList', userList)

    const players = Object.values(activeUsersByGame)
    console.log("players:", players);
    socket.emit('players',{players: players} )
  })

  // Écoute de la demande de la liste des utilisateurs connectés
  socket.on('getConnectedUsers', () => {
    // Récupérez les informations des utilisateurs connectés depuis l'objet connectedUsers
    const userList = Object.values(connectedUsers)
    socket.emit('connectedUsersList', userList)
  })

  // Déconnection
  socket.on('disconnect', () => {
    const userPseudo = connectedUsers[socket.id]
    
    // Retirer l'utilisateur actif du jeu
    for (const room in activeUsersByGame) {
      console.log("room:", room);
      const pseudoList = activeUsersByGame[room];
      console.log("pseudoList:", pseudoList);
      const i = pseudoList.indexOf(userPseudo.pseudo)
      console.log("i:",i);
      if (i !== -1) {
        activeUsersByGame[room].splice(i, 1)
      }
      io.to(room).emit('players', { players: activeUsersByGame });
    }
    console.log("activeUsersByGame:", activeUsersByGame);
    
    // Retirer l'utilisateur actif de la liste des users connectés
    if (userPseudo) {
      delete connectedUsers[socket.id]
      const userList = Object.values(connectedUsers)
      socket.broadcast.emit('connectedUsersList', userList)
    }

    //console.log(`${userPseudo} s'est déconnecté`)
  });


  /* ------------- Tchat -------------- */

  // Message
  socket.on('message', (message) => {
    const user = connectedUsers[socket.id]
    // Traitement du message (par exemple, enregistrez en base de données)

    // Envoyez le message à tous les clients connectés y compris l'emeteur du message    
    io.emit('message', {message: message, user_pseudo: user.pseudo})
  });


  /* ------------- Game -------------- */

  // Initialisation de la partie
  // Room utilisée pour les parties du jeu
  socket.on('joinRoom', ({ roomName, user }) => {
    // Quitter toutes les autres rooms
    const roomKeys = Array.from(socket.rooms)
    roomKeys.forEach((room) => {
      if (room !== socket.id && room !== socket.id.toString()) {
        socket.leave(room)
        if (activeUsersByGame[room]) {
          delete activeUsersByGame[room][socket.id]
        }
      }
    });

    // Rejoindre la room 
    socket.join(roomName)
    if (!activeUsersByGame[roomName]) {
      activeUsersByGame[roomName] = {}
    }
    const member = Object.keys(activeUsersByGame[roomName]).length;
    activeUsersByGame[roomName][member] = user
    io.emit('message', {message: `${user} participe à la partie: ${roomName}`, user_pseudo: 'Server'})
    io.to(roomName).emit('setPlayers', {players: activeUsersByGame})
    // console.log("players:", activeUsersByGame);
  });

  // Retirer l'utilisateur actif de la room
  socket.on('quitRoom', ({user}) => {
    const roomKeys = Array.from(socket.rooms)
    
    roomKeys.forEach((room) => {
      if (room !== socket.id && room !== socket.id.toString()) {
        socket.leave(room)
        io.to(room).emit('setGamers', {user})
        if (activeUsersByGame[room]) {
          delete activeUsersByGame[room][socket.id]
        }
      }
    });
    // console.log("activeUsersByGame:", activeUsersByGame);
  })

  // Écoute de la demande de la liste des players
  socket.on('getPlayers', () => {
    const players = Object.values(activeUsersByGame)
    console.log("players:", players);
    socket.emit('players',{players: players} )
  })

});


/* --------- Ecoute du port --------- */
server.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`)
});


/* --- Fonctions --- */
