import React, { useEffect } from 'react';
import { Gap, Header, Footer } from '../../components';
import { Card, CardDeck, Row, Col, Container } from 'react-bootstrap';
import { LogoStarMall } from '../../assets';
import './KebijakanPrivasi.css'

const KebijakanPrivasi = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
	},[])

    return (
        <div>
            <Header></Header>

            <div style={{ paddingLeft:100, paddingTop:40, paddingBottom:40, paddingRight:100 }}>
                <div style={{ fontWeight:'bold' }}>KEBIJAKAN PRIVASI</div>
                <p>Mengumpulkan, mengolah, menggunakan, menyimpan, menampilkan. StarPoin menghormati hal-hal yang berkenaan dengan perlindungan privasi Anda. Oleh karena itu. Kami menyusun Kebijakan Privasi ini untuk menjelaskan kepada Anda bagaimana Kami memperoleh, menganalisis, mengumumkan, mengirimkan, menyebarluaskan. menghapus dan memusnahkan Data Pribadi Anda yang diberikan kepada Kami. Anda menyatakan bahwa Data Pribadi Anda merupakan data yang benar dan sah, serta Anda memberikan persetujuan kepada Kami untuk memperoleh, mengumpulkan, mengolah, menganalisis. menyimpan, menampilkan, mengumumkan, mengirimkan, menyebarluaskan, menghapus dan memusnahkan sesuai dengan Kebijakan Privasi ini dan peraturan perundang-undangan yang berlaku.</p>

                <p>Kami harap Anda membaca Kebijakan Privasi ini dengan seksama untuk memastikan bahwa Anda memahami bagaimana proses pengolahan data Kami. Dengan menggunakan StarPoin berarti Anda mengakui bahwa Anda telah membaca, memahami dan menyetujui seluruh ketentuan yang terdapat dalam Kebijakan Privasi ini.</p>
                    
                <div style={{ fontWeight:'bold' }}>DATA PRIBADI</div>
                <p>Data Pribadi merupakan data, informasi, atau keterangan dalam bentuk apapun yang dapat mengidentifikasikan diri Anda yang Anda sampaikan kepada Kami atau yang Anda cantumkan dalam data akun melalui Aplikasi beserta data yang menyangkut informasi mengenai kegiatan transaksi Anda pada Aplikasi StarPoin.</p>
                
                <p>Dalam pemrosesan data. kami membutuhkan Data Pribadi Anda. Oleh karena itu. Data Pribadi yang Anda berikan kepada Kami haruslah seakurat mungkin dan tidak menyesatkan. Anda harus memperbaharui dan memberitahukan kepada Kami apabila ada perubahan terhadap Data Pribadi Anda. Anda dengan ini membebaskan Kami dari setiap tuntutan, gugatan, ganti rugi, dan/atau klaim sehubungan dengan kegagalan pemrosesan transaksi pada StarPoin yang disebabkan oleh ketidakakuratan Data Pribadi yang Anda berikan kepada Kami.</p>

                <div style={{ fontWeight:'bold' }}>PENGUMPULAN & PENGGUNAAN DATA PRIBADI</div>
                <p>Penyediaan Data Pribadi Anda bersifat sukarela. Namun, jika Anda tidak memberikan Data Pribadi Anda kepada Kami. Kami tidak akan dapat memproses Data Pribadi Anda untuk tujuan pengelolaan data. Kami akan mengumpulkan Data Pribadi Anda setiap kali Anda mengakses Aplikasi StarMall atau melakukan transaksi menggunakan Aplikasi StarMall.</p>

                <p>Kami akan mengolah, menganalisis, serta menggunakan Data Pribadi Anda untuk tujuan sebagai berikut maupun tujuan lain yang diizinkan oleh peraturan perundang- undangan yang berlaku:
                    <ul>
                        <li>Identifikasi dan registrasi akun Anda sebagai pengguna Aplikasi StarPoin</li>
                        <li>Melakukan verifikasi, menonaktifkan atau mengelola akun Anda</li>
                        <li>Memproses dan mengelola Points StarPoin Anda</li>
                        <li>Mencegah, mendeteksi, menyelidiki dan mengatasi terjadinya tindakan yang merupakan kejahatan, dilarang. ilegal, tidak sah atau curang (termasuk namun tidak terbatas pada penipuan (fraud)). StarPoin berhak melakukan pemblokiran atau menentukan sanksi-sanksi sesuai dengan ketentuan yang berlaku apabila akun konsumen telah terbukti melakukan fraud</li>
                        <li>Pelaksanaan pengumpulan data mengenai data demografis pengguna Aplikasi StarPoin</li>
                        <li>Pengiriman informasi yang Kami anggap berguna untuk Anda termasuk informasi tentang layanan dari Kami</li>
                        <li>Berkomunikasi dengan Anda sehubungan dengan segala hal mengenai Aplikasi StarPoin dan layanan- layanan Kami</li>
                    </ul>
                </p>

                <div style={{ fontWeight:'bold' }}>PENGUNGKAPAN KEPADA PIHAK KETIGA</div>
                <p>Untuk tujuan pengembangan, peningkatan, perlindungan, maupun pemeliharaan Aplikasi StarPoin, Kami terkadang diharuskan untuk menampilkan, mengumumkan, mengirimkan, dan/atau menyebarluaskan Data Pribadi kepada pihak ketiga. Anda dengan ini menyatakan telah memberikan persetujuan, izin, dan wewenang kepada Kami untuk mengumumkan, mengirimkan, dan/atau menyebarluaskan serta memberikan akses atas Data Pribadi kepada pihak ketiga untuk tujuan-tujuan sebagaimana dimaksud, kami dengan ini menjamin bahwa Kami akan menjaga keamanan dan kerahasiaan dari Data Pribadi milik Anda yang Kami ungkapkan kepada pihak ketiga tersebut. Selain itu, Kami hanya akan mengungkapkan Data Pribadi yang relevan untuk diungkapkan kepada pihak ketiga tersebut sesuai dengan tujuan pengungkapannya dan Kami tidak akan mengungkapkan Data Pribadi milik Anda tanpa adanya suatu perjanjian kerahasiaan antara Kami dengan pihak ketiga yang menerima Data Pribadi tersebut.</p>
                    
                <div style={{ fontWeight:'bold' }}>PENYIMPANAN DAN KEAMANAN DATA</div>
                <p>Kami memastikan bahwa data Anda yang dikumpulkan dan/atau terkumpul oleh Kami akan disimpan dengan aman sesuai dengan peraturan perundang-undangan yang berlaku di Indonesia. Kami akan berhenti menyimpan, menghapus dan/atau memusnahkan Data Pribadi segera setelah dianggap bahwa tujuan pengumpulan Data Pribadi tidak lagi dibutuhkan dan diperbolehkan oleh peraturan perundang-undangan yang berlaku di Indonesia.</p>

                <div style={{ fontWeight:'bold' }}>AKSES TIDAK SAH</div>
                <p>Kami tidak bertanggung jawab atas penyalahgunaan Akun, password dan/atau PIN Anda yang Anda buat dan gunakan untuk mengakses Data Pribadi Anda dimanapun Anda menyimpan Data Pribadi Anda, termasuk Akun, password dan/atau PIN untuk mengakses atau login Aplikasi StarPoin Anda.</p>

                <div style={{ fontWeight:'bold' }}>HAK KEKAYAAN INTELEKTUAL</div>
                <p>Seluruh Aplikasi StarPoin dan sistem pendukungnya termasuk tetapi tidak terbatas pada seluruh adalah milik PT Star Poin Indonesia.</p>

                <div style={{ fontWeight:'bold' }}>HUKUM YANG BERLAKU</div>
                <p>Kebijakan Privasi ini diatur dan ditafsirkan sesuai dengan hukum Negara Republik Indonesia.</p>

                <div style={{ fontWeight:'bold' }}>PERUBAHAN TERHADAP KEBIJAKAN PRIVASI</div>
                <p>Kami dapat untuk setiap saat mengubah, memperbarui. dan/atau menambahkan sebagian ataupun seluruh ketentuan dalam Kebijakan Privasi ini, sesuai dengan bisnis kami ke depan, dan/atau perubahan peraturan perundang-undangan. Perubahan kebijakan privasi ini dapat berubah tanpa pemberitahuan sebelumnya.</p>

                <div style={{ fontWeight:'bold' }}>PERTANYAAN LAINNYA</div>
                <p>Jika Anda memiliki pertanyaan lebih lanjut tentang privasi Anda di StarPoin, Anda dapat menghubungi Kami :</p>
                <p style={{ fontWeight:'bold' }}>PT Star Poin Indonesia</p>
                <label>Menara Tekno Lantai 8,<br/>
                Jl. H. Fachrudin No.19, RT.1/Rw.7, Kebon Sirih, Tanah Abang,<br/>
                Central Jakarta City, Jakarta 10250</label><br/>
                <br/>
                <label>Telp : 021-3925660</label><br/>
                <label>WhatsApp : 08872965503</label><br/>
                <label>Email : support@starpoin.id</label><br/>
            </div>
            <Footer></Footer>
        </div>
        );
}

export default KebijakanPrivasi;