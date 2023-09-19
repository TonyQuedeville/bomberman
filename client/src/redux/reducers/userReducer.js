/*
	Projet Zone01 : Bomberman
	Tony Steel
	15/09/2023

    Utilisateur: 
*/

import { createSlice } from '@reduxjs/toolkit';
import { socket } from '../../socket';

const initialValues = {
    pseudo: '',
    isConnected: false,
    gameId: 1,
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

        handleLogout:() => {
            socket.disconnect() // déconnection du tchat
            return initialValues; // ré-initilisation des données authUser
        }
    },
})

export const { 
    updateUserData, 
    setIsConnected,
    handleLogout 
} = userSlice.actions

export default userSlice.reducer