/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Point d'entrée de l'application Client : localhost:3000
*/

import './styles.css'
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserData, setIsConnected } from './redux/reducers/userReducer'
import { socket } from './socket';

import Header from './components/Header/Header'
import Home from './components/Home/Home'
import Game from './components/Game/Game'
import Error from './components/Error/Error'
import { Events } from './components/Events/Events'

function App() {
  //const user = useSelector(state => state.user)

  // Verification connection Socket.io pour debugage
  const [ tchatEvents, setTchatEvents ] = useState([]);

  useEffect(() => {
    document.title = "Bomberman";
  }, []);

  useEffect(() => {
    function onConnect() {
      // console.log(user.pseudo, " vient de se connecter !");
    }
    function onDisconnect() {
      // console.log(user.pseudo, " vient de se déconnecter !");
    }
    function onError(error) {
      console.error('Erreur de connexion :', error);
    }

    function onEvent(value) {
      setTchatEvents(previous => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('error', onError);
    socket.on('tchatEvent', onEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('error', onError);
      socket.off('tchatEvent', onEvent);
    };
  }, [])

  // Application
  return (
    <Router>
          <Header />
          {/* <Events events={ tchatEvents } /> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="*" element={<Error />} />
          </Routes>
    </Router>
  );
}

export default App;
