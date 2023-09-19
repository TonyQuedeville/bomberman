/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Fenêtre de tchat:
*/

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateGameData, setPlayers, setIsPlay, setNbPlayer } from '../../redux/reducers/gameReducer'
import { socket } from '../../socket'
import TextArea from '../TextArea/TextArea.jsx'
import Bouton from '../Bouton/Bouton.jsx'

const Tchat = () => {
	const user = useSelector(state => state.user)
	const game = useSelector(state => state.game)
	// console.log("tchat players:", game.players);
	// console.log("tchat nbPlayer:", game.nbPlayer);
	const dispatch = useDispatch()
	const [message, setMessage] = useState('')
	const [dataMessages, setDataMessages] = useState([])
	const [userListConnect, setUserListConnect] = useState([])

	const handleChange = (e) => {
		setMessage(e.target.value)
	}

	const handleKeyDown = (e) => {
		// Vérifie si la touche appuyée est "Enter" (code 13)
		if (e.keyCode === 13) { 
			e.preventDefault();
			socket.emit('message', message);
			setMessage('');
		}
	}

	// Messages server
	useEffect(() => {
		// Réception de la liste des utilisateurs connectés du serveur
		socket.on('connectedUsersList', (userList) => {
			setUserListConnect(userList)
		})

		// Reception des messages
		socket.on('message', (dataMessage) => {
			setDataMessages(previous => [dataMessage, ...previous])
		})
		socket.on('notif', (dataMessage) => {
			setDataMessages(previous => [dataMessage, ...previous])
		})

		

		/* --- Instructions de jeu retournées par le server --- */
	
		// mise à jour des participants à une partie aprés handlePlay
		socket.on('setPlayers', (data) => {
			const players = []
			for (const key in data.players.game_1) {
				if (data.players.game_1.hasOwnProperty(key)) { // Vérifiez si la propriété appartient à l'objet lui-même (et non à ses prototypes)
					const value = data.players.game_1[key];
					players.push(value)
				}
			}
			dispatch(setPlayers(players))
			dispatch(setNbPlayer(players.length))
		})

	}, [dispatch])


	const handlePlay = () => {
		socket.emit('joinRoom', {roomName: "game_" + game.gameId, user: user.pseudo});
	}


    return (
        <div id="tchatspace">
			<p>Tchat</p>

			<TextArea
				id={"message-tchat"}
				name="message"
				title=""
				placeholder="Entrez votre message"
				value={message}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				disabled={false}
			/>

			<div id='users-conv'>
				<div id="users">
					<Bouton 
						onClick={handlePlay} 
						text={"Jouer"} 
						disabled={game.isPlay || !user.isConnected || game.nbPlayer >= 4} 
						id={"play-button"} 
						name={"play"}
					/>

					{userListConnect.map((dataUser, index) => (
						<p className='pbleu' key={index}>
							{ dataUser.pseudo }
						</p>
					))}
				</div>

				<div id="conversation">
					{dataMessages.map((dataMessage, index) => (
						<div className='message' key={index}>
							<h6 className='info-message'> {dataMessage.user_pseudo} </h6>
							<p>
								{ dataMessage.message }
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
    )
}

export default Tchat