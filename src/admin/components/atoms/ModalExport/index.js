import React, { useState } from 'react';
import './modal_export.css';
import { Col, Form, Modal, Row, CloseButton, Alert } from 'react-bootstrap';
import Gap from '../Gap';
import Dropdown from '../Dropdown';
import Input from '../Input';
import {icQuestionMark} from '../../../assets';

function ModalExport({ onClickShowModal, onClickCancel, startDate, setStartDate, endDate, setEndDate, resetFilter, submitExport, showDateFilter, emailForExport, setemailForExport, tempMail = false }) {
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
                    <div style={{ fontSize:20, fontWeight:800, color:'black' }}>Set up email</div>
                    <div>
                        <CloseButton aria-label = "close" onClick={onClickCancel}/>
                    </div>
                </div>

                <Gap height={10} />

                {showDateFilter && (
                <Row>
                    <Col xs={3} md={6} lg={6} style={{ paddingRight:6 }}>
                        <div style={{ fontWeight:'bold', fontSize:13 }}>Start Date</div>
                        <Gap height={10} />
                        <Form.Control 
                            type="date"
                            onChange={setStartDate}
                            value={startDate}
                        />
                    </Col>
                    <Col xs={3} md={6} lg={6} style={{ paddingLeft:6 }}>
                        <div style={{ fontWeight:'bold', fontSize:13 }}>End Date</div>
                        <Gap height={10} />
                        <Form.Control 
                            type="date"
                            onChange={setEndDate}
                            value={endDate}
                        />
                    </Col>
                </Row>
                )}
                <div>
                    <span style={{color:'black', fontWeight:100}}>Business Email</span>
                    <Gap height={10}/>
                    <div style={{display:'flex', alignItems:'center', border:'1px solid grey', borderRadius:10, width:'100%'}}>
                        <div style={{flex:'0 0 90%'}}>
                            <Input
                                placeholder={tempMail || "Your Business Email"}
                                value={emailForExport}
                                disabled={!!tempMail}
                                onChange={event => setemailForExport(event.target.value)}
                                style={{
                                    paddingLeft:'10px',
                                    color:'grey',
                                    border:'1px solid white',
                                    borderRadius:50,
                                    backgroundColor:'transparent',
                                    display: 'flex',
                            }}/>
                        </div>
                        <div style={{flex:'0 0 10%', display:'flex', justifyContent:'center'}}>
                            <img src={icQuestionMark} style={{cursor:'pointer'}} onClick={() => alert('Email yang Anda isikan akan ditetapkan sebagai email utama. \nUntuk melakukan pengaturan ulang email, Silahkan hubungi Layanan CS Starpoin.')}/>
                        </div>
                    </div>
                    <Gap height={10}/>
                    <span style={{color:'grey', fontSize:13}}>Data yang diekspor akan dikirimkan ke alamat email yang Anda daftarkan di sistem</span>
                </div>

                <Gap height={30} />

                <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center' }}>
                    <div style={{ cursor:'pointer' }} onClick={resetFilter}>Reset Email</div>
                    <Gap width={10} />
                    <div style={{ backgroundColor:'#7E4CAD', width:60, height:30, borderRadius:25, color:'#FFFFFF', fontSize:13, cursor:'pointer', textAlign:'center' }}>
                        <div style={{ marginTop:4 }} onClick={submitExport}>Export</div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ModalExport;