/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Fenêtre de tchat:
*/

import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateUserData, setIsConnected, setSocketId, setGameId, setGameName } from '../../redux/reducers/userReducer'
import { socket } from '../../socket'
import TextArea from '../TextArea/TextArea.jsx'
import Bouton from '../Bouton/Bouton.jsx'

const Tchat = ({user, game}) => {
	// const user = useSelector(state => state.user)
	// const game = useSelector(state => state.game)
	// console.log("user:", user);
	// console.log("game", game);

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
		socket.on('connectedUsersList', (userList, socketId) => {
			setUserListConnect(userList)
		})
		
		socket.on('socketId', (socketId) => {
			dispatch(setSocketId(socketId))
		})

		// Reception des messages
		socket.on('message', (dataMessage) => {
			setDataMessages(previous => [dataMessage, ...previous])
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
				disabled={user.gameName !== ''}
			/>

			<div id='users-conv'>
				<div id="users">
					<Bouton 
						onClick={handlePlay} 
						text={"Jouer"} 
						disabled={game.isPlay || !user.isConnected || game.nbPlayers >= 4 || user.gameName !== ''} 
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