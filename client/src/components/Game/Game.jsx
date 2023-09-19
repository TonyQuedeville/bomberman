/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Page Game : Espace de jeux
    Route http://localhost:3000/Game
*/

import React, { useState, useEffect }  from 'react'
import Galaxy01 from '../../assets/img/Galaxy01.png'
import ScoreBoard from './ScoreBoard/ScoreBoard.jsx'
import Grille from './Grille/Grille.jsx'
import Tchat from '../Tchat/Tchat.jsx'

const Game = () => {
  return (
    <div id="gamepage">
      <img id="galaxy01" src={Galaxy01} alt="Esthétique. Galaxy Zone01 tournant dans le grand vide spacial." />

      <div id="gamespace">
        <ScoreBoard />
        <Grille />
      </div>

      <Tchat />
    </div>
  )
}

export default Game