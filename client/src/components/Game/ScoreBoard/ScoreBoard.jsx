/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Tableau d'affichage du jeu et des scores.
    */

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateGameData, setPlayers, setIsPlay, setNbPlayer } from '../../../redux/reducers/gameReducer'
import { socket } from '../../../socket'
import Bouton from '../../Bouton/Bouton.jsx'

const ScoreBoard = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
	const game = useSelector(state => state.game)
    console.log("ScoreBoard players:", game.players);
	console.log("ScoreBoard nbPlayer:", game.nbPlayer);

    useEffect(() => {
        // Initialisation des joueurs
        socket.on('players', (data) => {
            const players = []
			for (const key in data.players.game_1) {
				if (data.players.game_1.hasOwnProperty(key)) { // Vérifi si la propriété appartient à l'objet lui-même (et non à ses prototypes)
					const value = data.players.game_1[key];
					players.push(value)
				}
			}
            dispatch(setPlayers(players))
			dispatch(setNbPlayer(players.length))
        })
    }, [dispatch])

    const handleGo = () => {
		dispatch(setIsPlay(true))
		// socket.emit('goGame', {game: "game" + game.gameId});
        console.log("game.isPlay:", game.isPlay);
	}

    return (
        <div id="scoreboard">
            <p>
                ScoreBoard
            </p>

            <Bouton 
                onClick={handleGo} 
                text={"Go"} 
                disabled={game.isPlay || !user.isConnected} 
                id={"go-button"} 
                name={"play"}
            />

            <p>{game.nbPlayer} joueurs. </p>
            {game.players.map((player, index) => (
                <p className='pbleu' key={index}>
                    { player }
                </p>
            ))}
        </div>
    )
}

export default ScoreBoard