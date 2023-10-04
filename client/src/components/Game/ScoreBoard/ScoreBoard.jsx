/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Tableau d'affichage du jeu et des scores.
*/

import React, { } from 'react'
import { useDispatch } from 'react-redux'
import { updateGameData, setPlayers, setIsPlay } from '../../../redux/reducers/gameReducer'
import { socket } from '../../../socket'
import Bouton from '../../Bouton/Bouton.jsx'
import Chrono from '../../Chrono/Chrono.jsx'

const ScoreBoard = ({ user, game, chronoGame }) => {
    const dispatch = useDispatch()
    const handleGo = () => {
		dispatch(setIsPlay(true))
		socket.emit('goGame', {roomName: "game" + game.gameId});
	}

    const handleQuit = () => {
		socket.emit('quitRoom');
	}

    return (
        <div id="scoreboard">
            <p>
                Players
            </p>

            {/* <Chrono chrono = {chronoGame}/> */}

            <div className='horizontal'>
                <Bouton 
                    onClick={handleGo} 
                    text={"Start"} 
                    disabled={ 
                        game.isPlay || 
                        !user.isConnected || 
                        game.nbPlayers >= 4 || 
                        game.nbPlayers < 2 || 
                        user.gameName !== "game_" + game.gameId
                    } 
                    id={"go-game"} 
                    name={"go"}
                />
                <Bouton 
                    onClick={handleQuit} 
                    text={"Abandonner"} 
                    disabled={
                        !user.isConnected || 
                        game.nbPlayers > 4 || 
                        game.nbPlayers < 2 || 
                        user.gameName !== "game_" + game.gameId
                    } 
                    id={"Quit-game"} 
                    name={"play"}
                />
            </div>

            <p>{game.nbPlayers} joueurs.</p>

            {game.players.map((player, index) => (
                player.pseudo !== "" && 
                <div className='scoreboard-player' key={index}>
                    <p className='scoreboard-pseudo' key={index}>
                        { player.id }             
                    </p>
                    
                    <p className='scoreboard-pseudo' key={index+1}>
                        { player.pseudo }                  
                    </p>

                    {index < 4 && (
                        <div className={`avatar pl${index + 1}`}>
                            {game.players[index].nbVie}
                            {/* {(() => {
                                switch (game.players[index].vitesse) {
                                case 250:
                                    return <p className='speed'>vit. 2</p>;
                                case 125:
                                    return <p className='speed'>vit. 3</p>;
                                default:
                                    return <p className='speed'>vit. 1</p>;
                                }
                            })()} */}
                            {<p className='speed'>vit. {game.players[index].vitesse}</p>}
                        </div>
                    )}

                    <div className={`blackhole`}></div>
                    {index < 4 && (
                        <p>
                            {game.players[index].nbBb}
                        </p>
                    )}

                    {index < 4 && (
                        <div className={`portee`}>
                            {game.players[index].portee}
                        </div>
                    )}
                </div>
            ))}

            <p>Bonus</p>
            {Object.entries(game.bonuss).map((bonus, index) => (
                <div className='scoreboard-bonus'>
                    {bonus[0]}
                    <div className={`size-bonus ${bonus[1]}`}>
                        
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ScoreBoard