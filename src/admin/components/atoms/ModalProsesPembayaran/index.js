import React, { useState } from 'react';
import './modal_proses_pembayaran.css';
import './table_content.css';
import { Col, Form, Modal, Row, CloseButton, Alert } from 'react-bootstrap';
import Gap from '../Gap';
import Dropdown from '../Dropdown';
import Input from '../Input';
import {icQuestionMark} from '../../../assets';

function ModalProsesPembayaran({ onClickShowModal, onClickCancel, listCart, nama, noHP, noRekening, email, jenisUser, subTotal, diskon, ppn, totalBayarCart, nominalBayar, onClickCancelKonfirmasiPembayaran, onClickKonfirmasiPembayaran }) {

    const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka || 0);

    return (
        <Modal
            show={onClickShowModal}
            onHide={onClickCancel}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="custom-modal"
        >
            <Modal.Body>
                <div style={{ display:'flex', justifyContent:'space-between'}}>
                    <div style={{ fontSize:20, fontWeight:800, color:'black' }}>Detail Pembayaran</div>
                    <div>
                        <CloseButton aria-label = "close" onClick={onClickCancel}/>
                    </div>
                </div>

                <hr/>

                <div style={{ backgroundColor:'#FFFFFF' }}>

                    <div style={{ fontWeight:'bold', fontSize:20 }}>Informasi Pembeli</div>
                    
                    <Gap height={10} />

                    <div style={{ backgroundColor:'#e5e7eb', padding:20, borderTopLeftRadius:15, borderTopRightRadius:15, borderBottomLeftRadius:15, borderBottomRightRadius:15 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <div>
                                <div style={{ fontSize:12, color:'grey' }}>NAMA LENGKAP</div>
                                <div style={{ fontSize:20 }}>{nama}</div>
                            </div>
                            <div>
                                <div style={{ fontSize:12, color:'grey' }}>NOMOR HP</div>
                                <div style={{ fontSize:20 }}>{noHP}</div>
                            </div>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <div>
                                <div style={{ fontSize:12, color:'grey' }}>EMAIL</div>
                                <div style={{ fontSize:20 }}>{email}</div>
                            </div>
                            <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center' }}>
                                <div>
                                    <div style={{ fontSize:12, color:'grey' }}>NOMOR REKENING</div>
                                    <div style={{ fontSize:20 }}>{noRekening == '' ? '-' : noRekening}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr/>

                    <div style={{ fontWeight:'bold', fontSize:20 }}>Informasi Pembeli</div>
                    
                    <Gap height={10} />

                    <div className="table-container">
                        <table className="medicine-table">
                            <thead>
                                <tr>
                                    <th>NAMA OBAT</th>
                                    <th>SUPPLIER</th>
                                    <th>HARGA</th>
                                    <th>QTY</th>
                                    <th>SUBTOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                            {listCart.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <span style={{ fontWeight:'bold' }}>{item.NamaObat}</span>
                                    </td>
                                    <td>{item.Supplier}</td>
                                    <td>{formatRupiah(item.HargaSatuan)}</td>
                                    <td style={{ textAlign:'center' }}>{item.Jumlah}</td>
                                    <td className="subtotal">
                                        {formatRupiah(item.SubTotal)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="summary">
                            <div className="summary-row">
                                <span>Total Item</span>
                                <span>{listCart.length} item</span>
                            </div>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{formatRupiah(subTotal)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Diskon</span>
                                <span>{formatRupiah(diskon)}</span>
                            </div>
                            <div className="summary-row">
                                <span>PPN (11%)</span>
                                <span>{formatRupiah(ppn)}</span>
                            </div>

                            <div className="divider" />

                            <div className="summary-total">
                                <span>Total Pembayaran</span>
                                <span className="total-amount">{formatRupiah(totalBayarCart)}</span>
                            </div>
                        </div>
                    </div>

                    <Gap height={10} />

                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <div style={{ width:'50%', cursor:'pointer' }}>
                            <div style={{ backgroundColor:'#FFFFFF', borderTopLeftRadius:20, borderTopRightRadius:20, borderBottomLeftRadius:20, borderBottomRightRadius:20, padding:10, border:'1px solid #111111' }} onClick={onClickCancelKonfirmasiPembayaran}>
                                <div style={{ textAlign:'center', fontWeight:'bold' }}>Batal</div>
                            </div>
                        </div>
                        <Gap width={10} />
                        <div style={{ width:'50%' }}>
                            <div style={{ backgroundColor:'#111111', borderTopLeftRadius:20, borderTopRightRadius:20, borderBottomLeftRadius:20, borderBottomRightRadius:20, padding:10, cursor:'pointer' }} onClick={onClickKonfirmasiPembayaran}>
                                <div style={{ textAlign:'center', fontWeight:'bold', color:'#FFFFFF' }}>Konfirmasi Pembayaran</div>
                            </div>
                        </div>
                    </div>

                </div>
                
            </Modal.Body>
        </Modal>
    );
}

export default ModalProsesPembayaran;