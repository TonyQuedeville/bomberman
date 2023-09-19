/*
	Projet Zone01 : Social network
	Tony Quedeville 
	15/09/2023

	Composant Bouton : Affiche un bouton
*/

import React from 'react'
import PropTypes from 'prop-types'


function Bouton(props) {
    const { type, onClick, text, format, disabled, id, name } = props

    return (
        <button 
            type={type} 
            onClick={onClick} 
            format={format}
            disabled={disabled}
            id={id}
            name={name}
        >
            {text}
        </button>
    )
}

Bouton.defaultProps = {
    type: "button",
    text: '',
    format: '',
    disabled: false,
}

Bouton.propTypes = {
    type: PropTypes.string,
    text: PropTypes.string.isRequired,
    format: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    id: PropTypes.string,
    name: PropTypes.string,
}

export default Bouton