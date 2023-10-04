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
        <p>Bomberman ne fait pas exeption. Le personnage pose des bombes pour detruire son environement.</p>
        <p>Voici Bomberman revue et corrigé.</p>
        <br />
        <br />
        <p> Votre vaisseau évolu dans l'Univers 01 et pose des trous noirs atomiques qui engloutissent les galaxies</p>
        <p> à proximité et provoquent un big bang. Mais il faut s'en éloigner pour rester en vie.</p> 
        <p>De ce big bang, des planètes naissent et certaines apportent la vie. D'autres apportent des puissances</p>
        <p>inconnues que vous pourrez exploiter.</p>
        <br />
        <br />
        <p>Utilisez les flèches du clavier pour déplacer votre vaisseau. (gauche, droite, haut, bas)</p>
        <p>La barre espace permet de poser vos atomes.</p>
        <p>Une partie peu se jouer jusqu'à 4.</p>
        <p>Vous pouvez tchater avec les autres spectateurs en attendant votre tour.</p>
      </div>

    </div>
  );
}

export default Home