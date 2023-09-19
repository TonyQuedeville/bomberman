/*
	Projet Zone01 : Bomberman
	Tony Steel
	15/09/2023

  src/redux/reducers/index.js permet de combiner l'ensemble des reducers du projet
*/


import { combineReducers } from 'redux';
import userReducer from './userReducer'; 
import gameReducer from './gameReducer'; 

const rootReducer = combineReducers({
  user: userReducer,
  game: gameReducer, 
});

export default rootReducer;
