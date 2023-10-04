/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Barre de navigation :
*/

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserData, setIsConnected } from '../../redux/reducers/userReducer'
import { socket } from '../../socket'
import InputText from '../InputText/InputText.jsx'
import Bouton from '../Bouton/Bouton.jsx'
import IcnSTS from '../../assets/icn/icn-STS-blanc.png'

const Header = () => {
	const user = useSelector(state => state.user)
    const dispatch = useDispatch();
	const [pseudo, setPseudo] = useState('')

	const navigate = useNavigate()

	function connect() {
		socket.connect();
		socket.emit('userConnect', {pseudo: pseudo})
		dispatch(updateUserData({pseudo: pseudo}))
		dispatch(setIsConnected(true))
		navigate(`/game`)
	}
	
	function disconnect() {
		socket.disconnect();
		dispatch(setIsConnected(false))
		dispatch(updateUserData({pseudo: ''}))
		setPseudo('')
		navigate(`/`)
	}

	const handleChange = (e) => {
		setPseudo(e.target.value)
	}

	return (
		<nav>			
			<div className='horizontal'>
				<InputText
						id="pseudo"
						name="pseudo"
						// label="Pseudo"
						title=""
						placeholder="Pseudo"
						value={pseudo}
						onChange={handleChange}
						required
						disabled={user.isConnected}
						size={8} // Nombre de caractère
				/>
				<Bouton 
					type="" 
					text="Entrer" 
					id="enterButton" 
					disabled={!pseudo || user.isConnected} 
					onClick={ connect } 
				/>
				<Bouton 
					type="" 
					text="Quitter" 
					id="quitButton" 
					disabled={!user.isConnected} 
					onClick={ disconnect } 
				/>
			</div>

			<h2 id="title"> Black Hole </h2>

			<div className='horizontal'>
				<img id="icnSTS" src={IcnSTS} alt="Icone STS" />
				<h6>by Tony Steel </h6>
			</div>
		</nav>
	)
}

export default Header