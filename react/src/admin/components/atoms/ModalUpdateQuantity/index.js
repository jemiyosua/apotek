import React, { useState } from 'react';
import './modal_update_qty.css';
import { Col, Form, Modal, Row, CloseButton, Alert } from 'react-bootstrap';
import Gap from '../Gap';
import Dropdown from '../Dropdown';
import Input from '../Input';
import {icQuestionMark} from '../../../assets';

function ModalSimpanTransaksi({ onClickShowModal, onClickCancel, qty, setQty, errorMessage, cancelSimpanTransaksi, submitSimpanTransaksi }) {

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
                <div style={{ display:'flex', justifyContent:'space-between'}}>
                    <div style={{ fontSize:20, fontWeight:800, color:'black' }}>Update Jumlah Obat</div>
                    <div>
                        <CloseButton aria-label = "close" onClick={onClickCancel}/>
                    </div>
                </div>

                <Gap height={10} />

                <div>
                    <span style={{ color:'black', fontWeight:100 }}>Jumlah Obat</span>
                    <Gap height={10}/>
                    <div style={{display:'flex', alignItems:'center', border:'1px solid grey', borderRadius:10, width:'100%'}}>
                        <div style={{flex:'0 0 90%'}}>
                            <Input
                                placeholder={"Jumlah Obat"}
                                value={qty}
                                onChange={setQty}
                                style={{
                                    paddingLeft:'10px',
                                    color:'grey',
                                    border:'1px solid white',
                                    borderRadius:50,
                                    backgroundColor:'transparent',
                                    display: 'flex',
                            }}/>
                        </div>
                    </div>
                    {errorMessage != "" && <div style={{ fontSize:13, color:'red' }}>{errorMessage}</div>}
                </div>

                <Gap height={30} />

                <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center' }}>
                    <div style={{ cursor: 'pointer', fontSize:15 }} onClick={cancelSimpanTransaksi}>Cancel</div>
                    <Gap width={10} />
                    <div style={{ backgroundColor:'#111111', height:30, borderRadius:25, color:'#FFFFFF', fontSize:13, cursor:'pointer', textAlign:'center', paddingLeft:10, paddingRight:10 }}>
                        <div style={{ marginTop:4 }} onClick={submitSimpanTransaksi}>Update Jumlah</div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ModalSimpanTransaksi;