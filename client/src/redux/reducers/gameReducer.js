/*
	Projet Zone01 : Bomberman
	Tony Steel
	15/09/2023

    Game: La partie de jeu
*/

import { createSlice } from '@reduxjs/toolkit';
// import { socket } from '../../socket';

const initialValues = {
    gameId: 1,
    isPlay: false,
    players: [],
    nbPlayer: 0
}

const gameSlice = createSlice({
    name: 'game',
    initialState: initialValues,
    reducers: {
        updateGameData: (state, action) => {
            return {
            ...state,
            ...action.payload,
            }
        },

        setPlayers: (state, action) => {
            state.players = action.payload
        },

        setIsPlay: (state, action) => {
            state.isPlay = action.payload
        },

        setNbPlayer: (state, action) => {
            state.nbPlayer = action.payload
        },

    },
})

export const { 
    updateGameData, 
    setIsPlay,
    setPlayers,
    setNbPlayer, 
} = gameSlice.actions

export default gameSlice.reducer