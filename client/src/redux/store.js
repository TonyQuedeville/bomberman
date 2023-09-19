/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Store redux:
*/

import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(
	rootReducer,
);

export default store;
