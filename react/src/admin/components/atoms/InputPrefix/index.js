import React, { useState } from 'react';
import './input_prefix.css';

function InputPrefix({ prefix, placeholder, nominalTopUp, handleChange }) {
    return (
        <div className="currency-input-container">
            <span className="currency-prefix">{prefix}</span>
            <div className="currency-separator" />
            <input
                type="text"
                className="currency-input-field"
                placeholder={placeholder}
                value={nominalTopUp}
                onChange={handleChange}
            />
        </div>
    );
}

export default InputPrefix;