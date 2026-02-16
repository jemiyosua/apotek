import React, { useState } from 'react';
import './Dropdown.css'; // Mengimpor file CSS eksternal

function DropdownMenu({ selectedValue, handleChange, list }) {
    return (
        <div className="dropdown-container">
            <select className="dropdown-select" value={selectedValue} onChange={handleChange}>
                {list.map((item,_) => {
                    return <option value={item.Name}>{item.Name}</option>
                })}
            </select>
        </div>
    );
}

export default DropdownMenu;