/*
	Projet Zone01 : Bomberman
	Tony Quedeville 
	15/09/2023

	Composant TextArea : 
*/

import React from 'react'
import PropTypes from 'prop-types'
import '../../styles.css'

const TextArea = (props) => {
    const { id, name, label, placeholder, title, value, disabled, required, rows, cols, onChange, onKeyDown } = props

    const handleChange = (event) => {
        const { value } = event.target
        const validatedValue = validateInput(value)
        onChange({ target: { id, name, value: validatedValue } })
    }
    
    // Empèche l'injection de code
    const validateInput = (input) => {
        const regex = /[<>{}()*+=#&%!,;:]/
        if (regex.test(input)) {
            return input.replace(regex, '')
        }
        return input
    }

    return (
        <div id='message-tchat-contenair'>
            <label htmlFor={id}>{label}</label>
            <textarea
                id={id}
                name={!name ? id : name}
                placeholder={placeholder}
                title={title}
                value={value}
                onChange={handleChange}
                onKeyDown={onKeyDown}
                disabled={disabled}
                required={required}
                rows={rows}
                cols={cols}
            />
        </div>
    )
}

TextArea.defaultProps = {
    rows: 2,
    cols: 30,
};

TextArea.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    handleKeyDown: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    rows: PropTypes.number,
    cols: PropTypes.number,
};

export default TextArea