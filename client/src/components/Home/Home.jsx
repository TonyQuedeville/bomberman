/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Page d'accueil : Formulaire d'authentification par pseudo
    Route http://localhost:3000/Home
*/

import React from 'react'
import Galaxy01 from '../../assets/img/Galaxy01.png'

const Home = () => {
  
  return (
    <div id="home">
      <img id="galaxy01" src={Galaxy01} alt="Esthétique. Galaxy Zone01 tournant dans le grand vide spacial." />

      <div className="narration">
        <p>La plupart des jeux vidéos sont sujet à violence et destruction. Il succitent l'agressivité et</p>
        <p>favorisent l'ego par la dopamine que procurre la victoire.</p>
        <br />
        <p>Bomberman ne fait pas exeption. Le personnage pose des bombes pour detruire son environement.</p>
        <p>Voici Bomberman revue et corrigé. Le personnage évolu dans l'Univers 01 et pose des planetes bleues</p>
        <p>pour apporter la vie plutôt que de la détruire.</p>
        <p>Mais il faut savoir accepter de ne pas réussir à tous les coups. Si vous ne vous éloigner pas, la vie</p>
        <p>ne pourra pas se développer et le temps de vos efforts fournis serat perdues progréssivement.</p>
        <br />
        <br />
        <br />
        <p>Utilisez les flèches du clavier pour déplacer votre avatar. (gauche, droite, haut, bas)</p>
        <p>Une partie peu se jouer jusqu'à 4.</p>
        <p>Vous pouvez tchater avec les autres spectateurs en attendant votre tour.</p>
      </div>

    </div>
  );
}

export default Home