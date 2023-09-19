/*
	Projet Zone01 : Social network
	Tony Quedeville 
	15/09/2023

	Composant InputText : 
*/

import React from 'react'
import PropTypes from 'prop-types'
import '../../styles.css'


const InputText = (props) => {
    const { onChange, id, name, label, placeholder, title, value, type, disabled, required, size, minDate, maxDate } = props

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
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                id={id}
                name={!name ? id : name}
                placeholder={placeholder}
                title={title}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                required={required}
                size={size}
                min={type === 'date' ? minDate : undefined}
                max={type === 'date' ? maxDate : undefined}
            />
        </div>
    )
}

InputText.defaultProps = {
    type:'text',
    size: 'auto',
}

InputText.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
}

export default InputText