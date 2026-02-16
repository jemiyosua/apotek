import React, { useState } from 'react';
import './modal_topup.css'; // Import your CSS file for the switch
import { Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import Gap from '../Gap';
import Dropdown from '../Dropdown';
import Input from '../Input';
import InputPrefix from '../InputPrefix';
import InputNomorVA from '../InputNomorVA';

function ModalTopUp({ onClickShowModal, onClickCancel, onClickSubmit, nominalTopUp, handleChange }) {
    return (
        <Modal
            show={onClickShowModal}
            onHide={onClickCancel}
            size="xs"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="custom-modal"
        >
            <Modal.Body>
                <div style={{ display:'flex', justifyContent:'flex-start' }}>
                    <div style={{ fontSize:16, fontWeight:700 }}>Top Up</div>
                </div>

                <Gap height={10} />

                <div style={{ fontSize:16, fontWeight:'bold' }}>Isi Nominal</div>
                <Gap height={5} />
                <InputPrefix
                    prefix={"Rp"}
                    placeholder={"Masukkan nominal top up"}
                    nominalTopUp={nominalTopUp}
                    handleChange={handleChange}
                />

                <Gap height={10} />
                
                <div style={{ fontSize:16, fontWeight:'bold' }}>Nomor Virtual Account</div>
                <Gap height={5} />
                <InputNomorVA
                    nomorVA={"12345678901234567890"}
                />

                <Gap height={10} />

                <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center' }}>
                    <div style={{ cursor:'pointer' }} onClick={onClickCancel}>Cancel</div>
                    <Gap width={10} />
                    <div style={{ backgroundColor:'#5C2A96', width:80, height:30, borderRadius:25, color:'#FFFFFF', fontSize:13, cursor:'pointer', textAlign:'center' }}>
                        <div style={{ marginTop:4, fontWeight:400 }} onClick={onClickSubmit}>Apply</div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ModalTopUp;