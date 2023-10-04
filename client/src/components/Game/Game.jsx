/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Page Game : Espace de jeux
    Route http://localhost:3000/Game
*/

import React, { useState, useEffect }  from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserData, setIsConnected, setGameId, setGameName } from '../../redux/reducers/userReducer'
import { updateGameData, setPlayers, setNbPlayers, setIsPlay, setBigBangIds } from '../../redux/reducers/gameReducer'
import { socket } from '../../socket'
import Galaxy01 from '../../assets/img/Galaxy01.png'
import ScoreBoard from './ScoreBoard/ScoreBoard.jsx'
import Grille from './Grille/Grille.jsx'
import Tchat from '../Tchat/Tchat.jsx'

const Game = () => {
  const dispatch = useDispatch()
  const [chronoGame, setChronoGame] = useState(0)
  const [winner, setWinner] = useState('')
  const user = useSelector(state => state.user)
	const game = useSelector(state => state.game)
  // console.log("user:", user);
  console.log("game:", game);

  useEffect(() => {  
    // Confirmation d'acceptation dans la partie
    socket.on('userInGameConfirm', (gameName) => {
      dispatch(setGameName(gameName))
    })

    // Initialisation des joueurs
    socket.on('players', (data) => {
      dispatch(setPlayers(data.players))
    })
    
    socket.on('nbPlayers', (data) => {
      dispatch(setNbPlayers(data.nbPlayers))
    })

    // Initialisation du jeu
    socket.on('resetGame', () => {
      dispatch(updateGameData({}))
      dispatch(setGameName(""))
      setWinner('')
    })

    // Mise à jour du jeu
    socket.on('updateGame', (data) => {
      dispatch(updateGameData(data))
    })

    // Force d'attraction blackhole
    socket.on('attraction', (bigBangId) => {
      dispatch(setBigBangIds(bigBangId))
    })

    // Echapé du blackhole
    socket.on('escapeBlackHole', (player) => {
      document.getElementById('pl' + player.id).classList.remove('attracGauche', 'attracDroite', 'attracHaut', 'attracBas');
    })

    // Mise à jour du Chrono toutes les secondes
    socket.on('chronoUpdate', (chrono) => {
      setChronoGame(chrono)
    })
    
    // Démarrage de la partie
    socket.on('startGame', () => {
      dispatch(setIsPlay(true))
    })
    
    // Gagnant de la partie
    socket.on('winnerGame', (winner) => {
      if(winner) {
        setWinner(winner.pseudo)
      } else {
        setWinner('')
      }
    })

    // En cas d'égalité: pas de gagnant
    socket.on('equalGame', () => {
      setWinner('equal')
    })

  }, [dispatch, user])


  return (
    <div id="appspace">
      {/* <img id="galaxy01" src={Galaxy01} alt="Esthétique. Galaxy Zone01 tournant dans le grand vide spacial." /> */}
      <div id="gamepage">
          <ScoreBoard 
            user = {user} 
            game = {game}
            chronoGame = {chronoGame}
          />

          <Grille  
            user = {user} 
            game = {game}
            chronoStart = {chronoGame}
            winner = {winner}
          />
      </div>

      <Tchat  
        user = {user} 
        game = {game}
      />
    </div>
  )
}

export default Game


