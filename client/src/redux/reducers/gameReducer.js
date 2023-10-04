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
    nbPlayers: 0,
    nbRow: 13,
    nbCol: 15,
    blocks: [],
    elements: [],
    gameGrid:[],
    bonuss:{}
}

const gameSlice = createSlice({
    name: 'game',
    initialState: initialValues,
    reducers: {
        updateGameData: (state, action) => {
            const { blocks, elements } = action.payload;
            let gameGrid = [];
            
            if (blocks && elements) {
                gameGrid = transposeArray(mergeArrays(blocks, elements));
            }
        
            return {
                ...state,
                ...action.payload,
                blocks,
                elements,
                gameGrid,
            };
        },

        setPlayers: (state, action) => {
            state.players = action.payload
        },
        
        setNbPlayers: (state, action) => {
            state.nbPlayers = action.payload
        },

        setIsPlay: (state, action) => {
            state.isPlay = action.payload
        },

        setBigBangIds: (state, action) => {
            state.bigBangIds.push(action.payload)
        },
        removeBigBangIds: (state, action) => {
            state.bigBangIds = state.bigBangIds.filter((id) => id !== action.payload);
        },

    },
})

export const { 
    updateGameData, 
    setIsPlay,
    setNbPlayers,
    setPlayers,
    setBigBangIds,
} = gameSlice.actions

export default gameSlice.reducer



/* --- Fonctions --- */

function transposeArray(array) {
    const transposedArray = [];
    const numRows = array.length;
    const numCols = array[0].length;

    for (let col = 0; col < numCols; col++) {
        const newRow = [];
        for (let row = 0; row < numRows; row++) {
        newRow.push(array[row][col]);
        }
        transposedArray.push(newRow);
    }

    return transposedArray;
}

const mergeArrays = (array1, array2) => {
    // Vérifiez si les deux tableaux ont les mêmes dimensions
    if (array1.length !== array2.length || array1[0].length !== array2[0].length) {
        throw new Error("Les tableaux n'ont pas les mêmes dimensions.");
    }

    const mergedArray = [];

    // Parcourez les lignes du tableau
    for (let i = 0; i < array1.length; i++) {
        const mergedRow = [];

        // Parcourez les colonnes du tableau
        for (let j = 0; j < array1[0].length; j++) {
            // Ajoutez les éléments correspondants des deux tableaux
            mergedRow.push(array1[i][j] + array2[i][j]); // Vous pouvez ajuster la logique ici
        }

        // Ajoutez la ligne fusionnée au tableau résultant
        mergedArray.push(mergedRow);
    }

    return mergedArray;
};