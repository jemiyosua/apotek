import React, { useState } from 'react';
import './input_nomor_va.css';
import { IcCopy } from '../../../assets';
import Gap from '../Gap';

function InputNomorVA({ nomorVA }) {
    return (
        <div className="currency-input-container">
            <input
                type="text"
                readOnly
                className="currency-input-field"
                value={nomorVA}
            />
            <div className="currency-separator" />
            <span className="currency-prefix-copy">
                <div style={{ display:'flex', alignItems:'center' }}>
                    <div style={{ fontSize:16, fontWeight:400, color:'#61308C' }}>Salin</div>
                    <Gap width={10} />
                    <img src={IcCopy} />
                </div>
            </span>
        </div>
    );
}

export default InputNomorVA;