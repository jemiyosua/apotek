import React, { useState } from 'react';
import './modal_logout.css'; // Import your CSS file for the switch
import { Col, Form, Modal, Row } from 'react-bootstrap';
import Gap from '../Gap';
import Dropdown from '../Dropdown';
import Input from '../Input';

function ModalLogout({ onClickShowModal, onClickCancel, onClickLogout }) {
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
                    <div style={{ fontSize:16, fontWeight:700 }}>Are you sure you want to Log Out?</div>
                </div>

                <Gap height={10} />

                <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center' }}>
                    <div style={{ cursor:'pointer' }} onClick={onClickCancel}>Cancel</div>
                    <Gap width={10} />
                    <div style={{ backgroundColor:'#7E4CAD', width:80, height:30, borderRadius:25, color:'#FFFFFF', fontSize:13, cursor:'pointer', textAlign:'center' }}>
                        <div style={{ marginTop:4, fontWeight:400 }} onClick={onClickLogout}>Log Out</div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ModalLogout;