import React, { useState } from "react";
import "./card_ringkasan_pembayaran.css";
import Gap from "../Gap";

function RingkasanPembayaran({ subTotal, diskon, ppn, totalBayarCart, nominalBayar, setNominalBayar, namaPembeli, setNamaPembeli, onClickNamaPembeli, cart, listPembeli, showDropdownListPembeli, kembalian, clearCart, showModalProsesPembayaran }) {

    const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka || 0);

    return (
        <div className="payment-card">
            <div className="payment-header">
                <span className="header-icon">💳</span>
                <span>Ringkasan Pembayaran</span>
            </div>

            <div className="payment-body">
                <div className="row">
                    <span>Subtotal</span>
                    <span>{subTotal}</span>
                </div>

                <div className="row">
                    <span>Diskon</span>
                    <span className="minus">- {diskon}</span>
                </div>

                <div className="row">
                    <span>PPN (11%)</span>
                    <span>{ppn}</span>
                </div>

                <hr />

                <div className="total-row">
                    <span>Total Bayar</span>
                    <span className="total">{formatRupiah(totalBayarCart)}</span>
                </div>

                {cart.length > 0 &&
                <>
                    <label className="label">Jumlah Bayar</label>
                    <input
                        className="input"
                        placeholder="Masukkan jumlah bayar"
                        value={nominalBayar}
                        onChange={setNominalBayar}
                    />

                    <div className={kembalian < 0 ? "kembalian-box-red" : "kembalian-box-green"}>
                        <span>Kembalian</span>
                        <span>{formatRupiah(kembalian)}</span>
                    </div>

                    <button className="btn-danger" onClick={clearCart}>🗑 Bersihkan Keranjang</button>

                    <Gap height={50} />

                    <hr/>

                    <label className="label">Nama Pembeli</label>
                    <input
                        className="input"
                        placeholder="Masukkan Nama Pembeli"
                        value={namaPembeli}
                        onChange={setNamaPembeli}
                    />
                    <ul>
                        {listPembeli?.map((item) => (
                        <li key={item.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0', cursor:'pointer' }} onClick={() => onClickNamaPembeli(item.Nama, item.NoHP, item.NoRekening, item.Email, item.JenisUser)}>
                            <strong>{item.Nama} ({item.NoHP})</strong> <br />
                        </li>
                        ))}
                    </ul>
                    <hr/>
                    <button className="btn-primary" disabled={nominalBayar < totalBayarCart || namaPembeli == ""} onClick={showModalProsesPembayaran}>✔ Proses Pembayaran</button>
                </>
                }    
            </div>
        </div>
    )
}

export default RingkasanPembayaran;
