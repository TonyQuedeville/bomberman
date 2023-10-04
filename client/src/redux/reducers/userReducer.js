/*
	Projet Zone01 : Bomberman
	Tony Steel
	15/09/2023

    Utilisateur: 
*/

import { createSlice } from '@reduxjs/toolkit';
import { socket } from '../../socket';

const initialValues = {
    socketId: '',
    pseudo: '',
    isConnected: false,
    gameName: '',
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialValues,
    reducers: {
        updateUserData: (state, action) => {
            return {
            ...state,
            ...action.payload,
            }
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload
            socket.connect() // connection au tchat
        },
        
        setSocketId: (state, action) => {
            state.socketId = action.payload
        },
        
        setGameName: (state, action) => {
            state.gameName = action.payload
        },

        handleLogout:() => {
            socket.disconnect() // déconnection du tchat
            return initialValues; // ré-initilisation des données authUser
        }
    },
})

export const { 
    updateUserData, 
    setIsConnected,
    setSocketId,
    setGameName,
    handleLogout 
} = userSlice.actions

export default userSlice.reducer