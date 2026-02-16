import React, { useState } from 'react';
import './switch.css'; // Import your CSS file for the switch

function Switch({ id, initialChecked, onToggle }) {

    const [isChecked, setIsChecked] = useState(initialChecked);

    const handleToggle = () => {
        const newState = !isChecked;
        setIsChecked(newState);
        if (onToggle) {
            onToggle(newState); // Call the parent's callback with the new state
        }
    };

    return (
        <div className="switch-container">
            {/* Hidden checkbox input */}
            <input
                type="checkbox"
                id={id} // Unique ID for the input
                className="switch-checkbox"
                checked={isChecked}
                onChange={handleToggle} // Handle changes to update state
            />
            {/* Label that will be styled as the switch */}
            <label htmlFor="custom-switch" className="switch-label">
                <span className="switch-slider"></span>
            </label>
        </div>
    );
}

export default Switch;