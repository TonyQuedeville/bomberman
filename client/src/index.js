/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Application Client
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { Provider } from 'react-redux';
import store from './redux/store'; 
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
	<Provider store={store}>
		<App />
	</Provider>
);
