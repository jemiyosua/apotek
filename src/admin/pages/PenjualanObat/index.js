import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { CardRingkasanPembayaran, Gap, HeaderPage, ModalAddNewObat, ModalExport, ModalFilter, ModalProsesPembayaran, ModalSimpanTransaksi, ModalUpdateQuantity, Pagination, SkeletonListData } from '../../components'
import { useDispatch } from 'react-redux';
import { setForm } from '../../redux';
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import './penjualan_obat.css';
import './cart.css';
import { BtnExportData, BtnFilter, IcActive, IcAddNew, IcDelete, IcExport, IcFilter, IcInactive, icQuestionMark } from '../../assets';
import { generateSignature, fetchStatus, FormatNumberComma, validEmail } from '../../utils/functions';
import { AlertMessage, paths } from '../../utils';
import xlsx from 'xlsx'
import { supabase } from "../../utils/supabaseClient"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

const PenjualanObat = () => {
    const history = useHistory();
    const [OrderBy, setOrderBy] = useState("")
    const [Order, setOrder] = useState("DESC")
    const [Loading, setLoading] = useState(false)

    const location = useLocation();
    // location.state.postContent
    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const [PageActive, setPageActive] = useState(1)
    const [ShowAlert, setShowAlert] = useState(true)
    const [SessionMessage, setSessionMessage] = useState("")
    const [SuccessMessage, setSuccessMessage] = useState("")
    const [SuccessMessageTime, setSuccessMessageTime] = useState("")
    const [ErrorMessageAlert, setErrorMessageAlert] = useState("")
    const [ErrorMessageAlertLogout, setErrorMessageAlertLogout] = useState("")
    const [DeleteMessageAlert, setDeleteMessageAlert] = useState("")

    const [UserID, setUserID] = useState("")
    const [Nama, setNama] = useState("")
    const [CurrentTime, setCurrentTime] = useState(new Date());
    const [Search, setSearch] = useState("")

    const [NamaPembeli, setNamaPembeli] = useState("")
    const [NoHPPembeli, setNoHPPembeli] = useState("")
    const [EmailPembeli, setEmailPembeli] = useState("")
    const [NoRekPembeli, setNoRekPembeli] = useState("")
    const [JenisUserPembeli, setJenisUserPembeli] = useState("")

    const [NamaPembeliSimpanTransaksi, setNamaPembeliSimpanTransaksi] = useState("")
    const [NamaPembeliTransaksi, setNamaPembeliTransaksi] = useState("")

    const totalItems = 1000;
    const itemsPerPage = 10;

    const [ShowModalFilter, setShowModalFilter] = useState(false)
    const [ShowModalExport, setShowModalExport] = useState(false)
    const [ShowModalAddnew, setShowModalAddnew] = useState(false)
    const [ShowModalSimpanTransaksi, setShowModalSimpanTransaksi] = useState(false)
    const [ShowModalUpdateQty, setShowModalUpdateQty] = useState(false)
    const [ShowModalProsesPembayaran, setShowModalProsesPembayaran] = useState(false)

    const [FilterBy, setFilterBy] = useState("")
    const [SearchFilter, setSearchFilter] = useState("")
    const [StartDate, setStartDate] = useState("")
    const [EndDate, setEndDate] = useState("")
    const [StatusFilter, setStatusFilter] = useState("")

    const [ListObat, setListObat] = useState([])
    const [ListPembeli, setListPembeli] = useState([])
    const [ListSatuan, setListSatuan] = useState([])
    const [ListKategori, setListKategori] = useState([])

    const [CurrentPage, setCurrentPage] = useState(1)
    const [TotalPage, setTotalPage] = useState(0)
    const [TotalRecords, setTotalRecords] = useState(0)
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const timerRef = useRef(null);
    const [EmailForExport, setEmailForExport] = useState("")
    const [EmailFilled, setEmailFilled] = useState("")

    const [KodeObat, setKodeObat] = useState("")
    const [NamaObat, setNamaObat] = useState("")
    const [Supplier, setSupplier] = useState("")
    const [Satuan, setSatuan] = useState("")
    const [Kategori, setKategori] = useState("")
    const [HargaSatuan, setHargaSatuan] = useState(0)
    const [Jumlah, setJumlah] = useState(1);

    const [IdDeleteData, setIdDeleteData] = useState("")
    
    const [Cart, setCart] = useState([]);
    const [ShowDropdown, setShowDropdown] = useState(false);
    const [ShowDropdownListPembeli, setShowDropdownListPembeli] = useState(false);

    const [SubTotalCheckout, setSubTotalCheckout] = useState(0);
    const [PPN, setPPN] = useState(0);
    const [TotalBayarCart, setTotalBayarCart] = useState(0);
    const [QtyUpdate, setQtyUpdate] = useState(0);
    const [IndexQtyUpdate, setIndexQtyUpdate] = useState(0);
    const [ErrorMessageQtyUpdate, setErrorMessageQtyUpdate] = useState(0);

    const SubTotal = Cart.reduce((a, b) => a + b.total, 0);
    const tax = Math.round(SubTotal * 0.11);
    const total = SubTotal + tax;

    const subtotalPembayaran = 0;
    const diskon = 0;
    const ppn = Math.round(SubTotal * 0.11);
    const totalPembayaran = SubTotal - diskon + ppn;

    const [NominalBayar, setNominalBayar] = useState(0);
    const [Kembalian, setKembalian] = useState(0);

    const quickPay = (nominal) => setNominalBayar(nominal);

    const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka || 0);

    useEffect(() => {
        var CookieNama = getCookie("nama")
        var CookiePartnerCode = getCookie("partnercode")
        var CookieParamKey = getCookie("paramkey")
        var CookieUserID = getCookie("userid")

        if (CookieParamKey == null || CookieParamKey === ""
            || CookieUserID == null || CookieUserID === "") {
            logout()
            window.location.href = "/login";
            return false
        }

        let switchedCode = ""
        let switchedName = ""

        if (location.state && location.state.selectedPartner) {
            switchedCode = location.state.selectedPartner
            switchedName = location.state.selectedNama
        }
        else {
            switchedCode = CookiePartnerCode || "";
            switchedName = CookieNama || ""
        }

        if (Nama !== switchedName) {
            setNama(switchedName)
        }

        dispatch(setForm("ParamKey", CookieParamKey))
        dispatch(setForm("UserID", CookieUserID))
        dispatch(setForm("Nama", switchedName))
        dispatch(setForm("PageActive", "ACTIVE_USERS"))

        let cookieCart = cookies.varCookieCart
        if (cookieCart) {
            setCart(cookieCart)
        }

        // getListPenjualanObat(1)

        // generateAndUploadPDF()

    }, [location.state]);

    const addToCart = () => {
        if (!NamaObat || HargaSatuan <= 0 || !Jumlah || Jumlah <= 0) {
            alert("Mohon isi Nama Obat, Harga, dan Jumlah dengan benar");
            return;
        }

        const isExist = Cart.find((item) => item.NamaObat === NamaObat && item.Supplier === Supplier);

        if (isExist) {
            // SCENARIO UPDATE: Jika barang sudah ada, update jumlahnya saja
            const updatedCart = Cart.map((item) => {
                if (item.NamaObat === NamaObat && item.Supplier === Supplier) {
                    // Kamu bisa memilih: timpa jumlahnya (Jumlah) atau tambahkan (item.Jumlah + Jumlah)
                    const jumlahBaru = parseInt(Jumlah); 
                    return {
                        ...item,
                        Jumlah: jumlahBaru + item.Jumlah,
                        SubTotal: jumlahBaru * parseInt(item.HargaSatuan)
                    };
                }
                return item;
            });
            setCart(updatedCart);
        } else {
            const newItem = {
                KodeObat,
                NamaObat,
                Jumlah: parseInt(Jumlah),
                HargaSatuan,
                SubTotal: parseInt(Jumlah) * HargaSatuan,
                Supplier
            };
            setCart([...Cart, newItem]);
        }
    
        // 3. Reset Form
        setNamaObat("");
        setHargaSatuan(0);
        setSupplier("");
        setJumlah("");
        // setSubTotal(0);
    };

    useEffect(() => {
        setCookie('varCookieCart', Cart, { path: '/' })
        let subTotal = 0
        Cart.map((item,index) => {
            let harga = item.HargaSatuan
            let jumlah = item.Jumlah
            subTotal += harga*jumlah
        })
        let ppn = (subTotal*11)/100
        let totalBayarCart = subTotal+ppn
        setSubTotalCheckout(subTotal)
        setPPN(ppn)
        setTotalBayarCart(totalBayarCart)
    }, [Cart])

    useEffect(() => {
        let kembalian = NominalBayar - TotalBayarCart
        setKembalian(kembalian)
    }, [NominalBayar])

    const getCookie = (tipe) => {
        var SecretCookie = cookies.varCookie;
        if (SecretCookie != "" && SecretCookie != null && typeof SecretCookie == "string") {
            var LongSecretCookie = SecretCookie.split("|");
            var UserID = LongSecretCookie[0];
            var ParamKeyArray = LongSecretCookie[1];
            var Nama = LongSecretCookie[2];
            var PartnerCode = LongSecretCookie[3];
            var ParamKey = ParamKeyArray.substring(0, ParamKeyArray.length)

            if (tipe == "userid") {
                return UserID;
            } else if (tipe == "paramkey") {
                return ParamKey;
            } else if (tipe == "nama") {
                return Nama;
            } else if (tipe == "partnercode") {
                return PartnerCode;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    const getFormattedDateTime = (date) => {
        // Get Time Components
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        // Determine AM or PM and convert to 12-hour format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'

        // Pad time components with leading zeros
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

        // Get Date Components
        const day = date.getDate(); // Day of the month (1-31)
        const month = date.getMonth(); // Month (0-11, so January is 0)
        const year = date.getFullYear(); // Full year (e.g., 2024)
        const dayOfWeek = date.getDay(); // Day of the week (0 for Sunday, 6 for Saturday)

        // Optional: Array for full month names and day names
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const formattedMonth = monthNames[month];

        // Pad day with leading zero if needed (though not always standard for day of month)
        const formattedDay = day < 10 ? `0${day}` : day;

        // Combine all components
        return `${formattedDay} ${formattedMonth} ${year} | ${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    const logout = () => {
        removeCookie('varCookie', { path: '/' });
        removeCookie('varMerchantId', { path: '/' });
        removeCookie('varIdVoucher', { path: '/' });
        dispatch(setForm("ParamKey", ''))
        dispatch(setForm("UserID", ''))
        dispatch(setForm("Nama", ''))
        dispatch(setForm("Role", ''))

        if (window) {
            sessionStorage.clear();
        }
    }

    const getListSupplierObat = (namaObat) => {
        let CookieParamKey = getCookie("paramkey")
        let CookieUserID = getCookie("userid")

        var requestBody = JSON.stringify({
            "Username": CookieUserID,
            "ParamKey": CookieParamKey,
            "Method": "SELECT",
            "NamaObat": namaObat,
            "Page": 1,
            "RowPage": 5
        })

        var enckey = paths.EncKey
        var url = paths.URL_API_ADMIN + 'SupplierObat'
        var Signature = generateSignature(enckey, requestBody)

        // setLoading(true)

        fetch(url, {
            method: "POST",
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
                'Signature': Signature
            },
        })
        .then(fetchStatus)
        .then(response => response.json())
        .then((data) => {
            // setLoading(false)

            if (data.ErrorCode == "0") {
                setShowDropdown(true)
                setListObat(data.Result)
            } else {
                if (data.ErrorMessage == "Error, status response <> 200") {
                    setErrorMessageAlert("Data tidak ditemukan")
                    setShowAlert(true);
                    return false;
                } else if (data.ErrorMessage === "Session Expired") {
                    setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                    setShowAlert(true);
                    return
                } else {
                    setErrorMessageAlert(data.ErrorMessage)
                    setShowAlert(true);
                    return false;
                }
            }
        })
        .catch((error) => {
            // setLoading(false)
            if (error.message == 401) {
                setErrorMessageAlert("Sesi berakhir, silakan login ulang.");
                setShowAlert(true);
                return false;
            } else if (error.message != 401) {
                setErrorMessageAlert(AlertMessage.failedConnect);
                setShowAlert(true);
                return false;
            }
        });
    }

    const insertTransaksiTemp = () => {
        let CookieParamKey = getCookie("paramkey")
        let CookieUserID = getCookie("userid")

        var requestBody = JSON.stringify({
            "Username": CookieUserID,
            "ParamKey": CookieParamKey,
            "Method": "INSERT",
            "NamaPembeli": NamaPembeliSimpanTransaksi,
            "JsonTransaksi": Cart
        })

        var enckey = paths.EncKey
        var url = paths.URL_API_ADMIN + 'TransaksiTemp'
        var Signature = generateSignature(enckey, requestBody)

        // setLoading(true)

        fetch(url, {
            method: "POST",
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
                'Signature': Signature
            },
        })
        .then(fetchStatus)
        .then(response => response.json())
        .then((data) => {
            // setLoading(false)

            if (data.ErrorCode == "0") {
                removeCookie('varCookieCart', { path: '/' })
                setCart([])
                setShowModalSimpanTransaksi(false)
                setSuccessMessage("Transaksi berhasil disimpan.")
                setShowAlert(true);
            } else {
                if (data.ErrorMessage == "Error, status response <> 200") {
                    setErrorMessageAlert("Data tidak ditemukan")
                    setShowAlert(true);
                    return false;
                } else if (data.ErrorMessage === "Session Expired") {
                    setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                    setShowAlert(true);
                    return
                } else {
                    setErrorMessageAlert(data.ErrorMessage)
                    setShowAlert(true);
                    return false;
                }
            }
        })
        .catch((error) => {
            // setLoading(false)
            if (error.message == 401) {
                setErrorMessageAlert("Sesi berakhir, silakan login ulang.");
                setShowAlert(true);
                return false;
            } else if (error.message != 401) {
                setErrorMessageAlert(AlertMessage.failedConnect);
                setShowAlert(true);
                return false;
            }
        });
    }

    const getListPembeli = (nama) => {
        let CookieParamKey = getCookie("paramkey")
        let CookieUserID = getCookie("userid")

        var requestBody = JSON.stringify({
            "Username": CookieUserID,
            "ParamKey": CookieParamKey,
            "Method": "SELECT",
            "NamaPembeli": nama,
            "Page": 1,
            "RowPage": 5
        })

        var enckey = paths.EncKey
        var url = paths.URL_API_ADMIN + 'ListPembeli'
        var Signature = generateSignature(enckey, requestBody)

        // setLoading(true)

        fetch(url, {
            method: "POST",
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
                'Signature': Signature
            },
        })
        .then(fetchStatus)
        .then(response => response.json())
        .then((data) => {
            // setLoading(false)

            if (data.ErrorCode == "0") {
                setShowDropdownListPembeli(true)
                setListPembeli(data.Result)
            } else {
                if (data.ErrorMessage == "Error, status response <> 200") {
                    setErrorMessageAlert("Data tidak ditemukan")
                    setShowAlert(true);
                    return false;
                } else if (data.ErrorMessage === "Session Expired") {
                    setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                    setShowAlert(true);
                    return
                } else {
                    setErrorMessageAlert(data.ErrorMessage)
                    setShowAlert(true);
                    return false;
                }
            }
        })
        .catch((error) => {
            // setLoading(false)
            if (error.message == 401) {
                setErrorMessageAlert("Sesi berakhir, silakan login ulang.");
                setShowAlert(true);
                return false;
            } else if (error.message != 401) {
                setErrorMessageAlert(AlertMessage.failedConnect);
                setShowAlert(true);
                return false;
            }
        });
    }

    const handleVlidasiClearCart = () => {
        setDeleteMessageAlert("Apakah Anda yakin menghapus cart?")
        return
    }

    const handleDelete = () => {
        setNominalBayar(0)
        setNamaPembeliTransaksi("")
        setKembalian(0)
        removeCookie('varCookieCart', { path: '/' })
        setCart([])
        setDeleteMessageAlert("")
        setShowAlert(true)
        setSuccessMessageTime("Sukses menghapus cart")
    }

    const removeItem = (index) => {
        setCart(Cart.filter((_, i) => i !== index));
    };

    const handleQtyChange = (e) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            setJumlah(0);
        } else {
            setJumlah(value);
        }
    };

    const handleSimpanTransaksi = () => {
        setShowModalSimpanTransaksi(true)
    }

    const handleSubmitSimpanTransaksi = () => {
        insertTransaksiTemp()
    }

    const handleUpdateValidasiCart = (indexCart) => {
        Cart.map((item,index) => {
            if (index == indexCart) {
                setIndexQtyUpdate(indexCart)
                setQtyUpdate(item.Jumlah)
            }
        })
        setShowModalUpdateQty(true)
    }

    const handleSubmitUpdateQty = () => {
        if (QtyUpdate == 0) {
            setErrorMessageQtyUpdate("Jumlah obat tidak boleh 0")
            return
        } else {
            const updatedCart = Cart.map((item, index) => {
                if (index === IndexQtyUpdate) {
                    const newQty = parseInt(QtyUpdate) || 0;
                    return { 
                        ...item, 
                        Jumlah: newQty,
                        SubTotal: newQty * parseInt(item.HargaSatuan) 
                    };
                }
                return item;
            });
            setShowModalUpdateQty(false)
            setCart(updatedCart);
            setCookie('varCookieCart', updatedCart, { path: '/' })
        }
    }

    const generateAndUploadPDF = async () => {
        try {
            const doc = new jsPDF()

            const unix = Math.floor(Date.now() / 1000) // UNIX TIMESTAMP
            const fileName = `invoice-${unix}.pdf`
            const fileNameInv = `invoice-${unix}`

            // ====== HEADER ======
            doc.setFontSize(18)
            doc.text("Invoice: " + fileNameInv, 14, 20)

            // ====== INFORMASI PEMBELI ======
            doc.setFontSize(12)
            doc.text("Informasi Pembeli", 14, 35)

            doc.setFontSize(11)
            doc.text("Nama Lengkap : " + NamaPembeliTransaksi, 14, 45)
            doc.text("Email        : " + EmailPembeli, 14, 52)
            doc.text("Nomor HP     : " + NoHPPembeli, 120, 45)
            doc.text("Nomor Rek    : " + NoRekPembeli == "" ? "-" : NoRekPembeli, 120, 52)

            // ====== TABEL PRODUK ======
            const tableColumn = ["Nama Obat", "Supplier", "Harga", "Qty", "Subtotal"]
            const tableRows = Cart.map(item => {
                const subtotal = item.HargaSatuan * item.Jumlah
              
                return [
                    item.NamaObat,
                    item.Supplier,
                    formatRupiah(item.HargaSatuan),
                    item.Jumlah.toString(),
                    formatRupiah(subtotal)
                ]
            })

            autoTable(doc, {
                startY: 65,
                head: [tableColumn],
                body: tableRows,
                theme: "grid",
                styles: { fontSize: 10 },
                headStyles: { fillColor: [220, 220, 220] }
            })
          
            const finalY = doc.lastAutoTable.finalY + 10
        
            // ====== RINGKASAN ======
            doc.setFontSize(12)
            doc.text("Total Item : " + Cart.length + " item", 140, finalY)
            doc.text("Subtotal   : " + formatRupiah(SubTotalCheckout), 140, finalY + 7)
            doc.text("Diskon     : " + formatRupiah(diskon), 140, finalY + 14)
            doc.text("PPN (11%)  : " + formatRupiah(PPN), 140, finalY + 21)
        
            // ====== TOTAL PEMBAYARAN ======
            doc.setFontSize(16)
            doc.setTextColor(0, 128, 0)
            doc.text("Total Pembayaran: " + formatRupiah(TotalBayarCart), 14, finalY + 35)
        
            // doc.save(fileName)
    
            const pdfBlob = doc.output("blob")

            const { error } = await supabase.storage
            .from("files")
            .upload(fileName, pdfBlob, {
                contentType: "application/pdf",
            })
    
            if (error) {
                console.error("Upload error:", error)
                return
            }

            const { data } = supabase.storage
            .from("files")
            .getPublicUrl(fileName)

            let publicUrl = data.publicUrl
            if (publicUrl != "") {
                // hit api 
                handleSubmitSendWA(NoHPPembeli, publicUrl, fileName)
            }

            // https://pzgwuwkpsrxeunlyhnoq.supabase.co/storage/v1/object/public/files/report-1771177852058.pdf
    
            // alert("Upload berhasil!\n" + data.publicUrl)
    
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubmitSendWA = (nomorTujuan, publicUrl, fileName) => {
        let CookieParamKey = getCookie("paramkey")
        let CookieUserID = getCookie("userid")

        var requestBody = JSON.stringify({
            "Username": CookieUserID,
            "ParamKey": CookieParamKey,
            "Method": "INSERT",
            "NomorTujuan": nomorTujuan,
            "URLUpload": publicUrl,
            "FileName": fileName
        })

        var enckey = paths.EncKey
        var url = paths.URL_API_ADMIN + 'SubmitSendWA'
        var Signature = generateSignature(enckey, requestBody)

        // setLoading(true)

        fetch(url, {
            method: "POST",
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
                'Signature': Signature
            },
        })
        .then(fetchStatus)
        .then(response => response.json())
        .then((data) => {
            // setLoading(false)

            if (data.ErrorCode == "0") {
                setNominalBayar(0)
                setNamaPembeliTransaksi("")
                setKembalian(0)
                removeCookie('varCookieCart', { path: '/' })
                setShowModalProsesPembayaran(false)
                setCart([])
                setSuccessMessage("Berhasil kirim WA")
                setShowAlert(true)
                return
            } else {
                if (data.ErrorMessage == "Error, status response <> 200") {
                    setErrorMessageAlert("Data tidak ditemukan")
                    setShowAlert(true);
                    return false;
                } else if (data.ErrorMessage === "Session Expired") {
                    setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                    setShowAlert(true);
                    return
                } else {
                    setErrorMessageAlert(data.ErrorMessage)
                    setShowAlert(true);
                    return false;
                }
            }
        })
        .catch((error) => {
            // setLoading(false)
            if (error.message == 401) {
                setErrorMessageAlert("Sesi berakhir, silakan login ulang.");
                setShowAlert(true);
                return false;
            } else if (error.message != 401) {
                setErrorMessageAlert(AlertMessage.failedConnect);
                setShowAlert(true);
                return false;
            }
        });   
    }

    return (
        <div className='main-page'>
            <div style={{ width: '100%' }}>
                <HeaderPage
                    nama={Nama}
                    // list={ListPartner}
                    // partnerCode={SessionPartnerCode}
                    setNama={setNama}
                    currentTime={getFormattedDateTime(CurrentTime)}
                    search={Search}
                    setSearch={event => setSearch(event.target.value)}
                />

                <div className='container-content-table'>
                    <div className='container-table'>
                        <div className='container-content-table-header'>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <div className='card-content-text-sm-black2-title' style={{ fontWeight:'bold', fontSize:15 }}>Penjualan Obat</div>
                            </div>
                        </div>

                        <div className="pos-container">
                            <div className="page">
                                <div className="card">
                                    <h2 className="card-title">
                                    <span className="icon">+</span> Tambah Produk
                                    </h2>

                                    <label>Nama Produk</label>
                                    <input
                                        placeholder="Masukkan nama produk..."
                                        value={NamaObat}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setNamaObat(value)
                                            getListSupplierObat(value)

                                            if (value.length > 0) {
                                                const filtered = Cart.filter((p) =>
                                                    p.nama?.toLowerCase().includes(value?.toLowerCase())
                                                );
                                                setListObat(filtered);
                                                setShowDropdown(true);
                                            } else {
                                                setListObat([])
                                                setShowDropdown(false)
                                            }
                                        }}
                                    />
                                    <ul>
                                        {ShowDropdown && ListObat?.map((item) => (
                                        <li key={item.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0', cursor:'pointer' }} onClick={() => {
                                            setShowDropdown(false)
                                            setNamaObat(item.NamaObat)
                                            setHargaSatuan(item.HargaObat)
                                            setSupplier(item.NamaSupplier)
                                        }}>
                                            <strong>Nama Obat: {item.NamaObat}</strong> <br />
                                            <div style={{ fontSize:12 }}>Supplier: <span style={{ fontWeight:'bold' }}>{item.NamaSupplier}</span></div>
                                            <div style={{ fontSize:12 }}>Harga: <span style={{ color:'blue', fontWeight:'bold' }}>Rp{item.HargaObat}</span></div>
                                            <div style={{ fontSize:12 }}>Status: <span style={{ color: item.StatusObat == '1' ? 'green' : 'red', fontWeight:'bold' }}>{item.StatusObat == "1" ? "Aktif" : "Tidak Aktif"}</span></div>
                                        </li>
                                        ))}
                                    </ul>

                                    <label>Nama Supplier</label>
                                    <input
                                        value={Supplier}
                                        disabled
                                    />
                                    
                                    <Gap height={20} />

                                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                        <div style={{ width:'50%' }}>
                                            <label>Harga Satuan (Rp)</label>
                                            <input
                                                value={HargaSatuan}
                                                disabled
                                            />
                                        </div>

                                        <Gap width={30} />

                                        <div style={{ width:'50%' }}>
                                            <label>Jumlah</label>
                                            <div className="qty-box">
                                                {/* <button onClick={() => setJumlah(Math.max(1, Jumlah - 1))}>-</button> */}
                                                <input
                                                    // type="number"
                                                    value={Jumlah}
                                                    onChange={event => handleQtyChange(event)}
                                                    className="w-full bg-transparent text-center text-lg font-medium text-slate-700 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                                {/* <button onClick={() => setJumlah(Jumlah + 1)}>+</button> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="footer">
                                        <div className="subtotal">
                                            Subtotal: <strong>{formatRupiah(HargaSatuan*Jumlah)}</strong>
                                        </div>

                                        <button className="btn-primary-keranjang" onClick={addToCart}>
                                            + Tambah ke Keranjang
                                        </button>
                                    </div>
                                </div>

                                <div className="card">
                                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                        <h2 className="card-title">🛒 Keranjang Belanja</h2>
                                        <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center' }}>
                                            <span className="badge">{Cart.length} item</span>
                                            {Cart.length > 0 &&
                                            <>
                                                <Gap width={10} />
                                                <div style={{ backgroundColor:'#004675', padding:7, borderRadius:7 }}>
                                                    <div style={{ cursor:'pointer', fontWeight:'bold', color:'#FFFFFF', fontSize:13 }} onClick={() => handleSimpanTransaksi()}>Simpan Transaksi</div>
                                                </div>
                                            </>}
                                        </div>
                                    </div>

                                    {Cart.length === 0 && (<p className="empty">Keranjang masih kosong</p>)}

                                    {Cart.map((item, i) => (
                                    <div className="cart-item" key={i}>
                                        <div>
                                            <strong>{item.NamaObat}</strong>
                                            <div className="muted">{item.Supplier}</div>
                                            <div className="muted">{item.Jumlah}x @ {formatRupiah(item.HargaSatuan)}</div>
                                        </div>

                                        <div className="cart-right">
                                            <span className="price">
                                                {formatRupiah(item.Jumlah * item.HargaSatuan)}
                                            </span>
                                            <button className="update" onClick={() => handleUpdateValidasiCart(i)}>Update</button>
                                            <button className="remove" onClick={() => removeItem(i)}>✕</button>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </div>

                            <CardRingkasanPembayaran
                                subTotal={formatRupiah(SubTotalCheckout)}
                                diskon={formatRupiah(diskon)}
                                ppn={formatRupiah(PPN)}
                                totalBayarCart={TotalBayarCart}
                                nominalBayar={NominalBayar}
                                setNominalBayar={event => setNominalBayar(event.target.value.replace(/[^0-9]/g, ''))}
                                listPembeli={ListPembeli}
                                namaPembeli={NamaPembeliTransaksi}
                                setNamaPembeli={event => {
                                    const value = event.target.value;
                                    setNamaPembeliTransaksi(value)
                                    getListPembeli(value)                                    
                                }}
                                onClickNamaPembeli={(nama, nomorHP, nomorRekening, email, jenisUser) => {
                                    if (nama != "") {
                                        setListPembeli([])
                                        setShowDropdownListPembeli(false)
                                    }
                                    setNamaPembeliTransaksi(nama)
                                    setNoHPPembeli(nomorHP)
                                    setNoRekPembeli(nomorRekening)
                                    setEmailPembeli(email)
                                    setJenisUserPembeli(jenisUser)
                                }}
                                kembalian={Kembalian}
                                cart={Cart}
                                showDropdownListPembeli={ShowDropdownListPembeli}
                                totalPembayaran={formatRupiah(totalPembayaran)}
                                clearCart={() => handleVlidasiClearCart()}
                                showModalProsesPembayaran={() => setShowModalProsesPembayaran(true)}
                            />
                            
                        </div>
                    </div>
                </div>
            </div>

            <ModalSimpanTransaksi
                onClickShowModal={ShowModalSimpanTransaksi}
                onClickCancel={() => setShowModalSimpanTransaksi()}
                namaPembeli={NamaPembeliSimpanTransaksi}
                setNamaPembeli={event => setNamaPembeliSimpanTransaksi(event.target.value)}
                cancelSimpanTransaksi={() => {
                    setNamaPembeliSimpanTransaksi("")
                    setShowModalSimpanTransaksi(false)
                }}
                submitSimpanTransaksi={() => handleSubmitSimpanTransaksi()}
            />

            <ModalUpdateQuantity
                onClickShowModal={ShowModalUpdateQty}
                onClickCancel={() => setShowModalUpdateQty()}
                qty={QtyUpdate}
                setQty={event => {
                    setErrorMessageQtyUpdate("")
                    setQtyUpdate(event.target.value.replace(/[^0-9]/g, ''))
                }}
                errorMessage={ErrorMessageQtyUpdate}
                cancelSimpanTransaksi={() => {
                    setQtyUpdate(0)
                    setShowModalUpdateQty(false)
                }}
                submitSimpanTransaksi={() => handleSubmitUpdateQty()}
            />

            <ModalProsesPembayaran
                onClickShowModal={ShowModalProsesPembayaran}
                onClickCancel={() => setShowModalProsesPembayaran(false)}
                listCart={Cart}
                nama={NamaPembeliTransaksi}
                noHP={NoHPPembeli}
                noRekening={NoRekPembeli}
                email={EmailPembeli}
                subTotal={SubTotalCheckout}
                diskon={diskon}
                ppn={PPN}
                totalBayarCart={TotalBayarCart}
                nominalBayar={NominalBayar}
                onClickCancelKonfirmasiPembayaran={() => setShowModalProsesPembayaran(false)}
                onClickKonfirmasiPembayaran={() => generateAndUploadPDF()}
            />

            {/* ALERT */}
            {SessionMessage != "" ?
                <SweetAlert
                    warning
                    show={ShowAlert}
                    onConfirm={() => {
                        setShowAlert(false)
                        logout()
                        window.location.href = "/login";
                    }}
                    btnSize="sm">
                    {SessionMessage}
                </SweetAlert>
                : ""}

            {SuccessMessage != "" ?
                <SweetAlert
                    success
                    show={ShowAlert}
                    onConfirm={() => {
                        setShowAlert(false)
                        setSuccessMessage("")
                    }}
                    btnSize="sm">
                    {SuccessMessage}
                </SweetAlert>
                : ""}
                
                {SuccessMessageTime != "" ?
                <SweetAlert
                    success
                    show={ShowAlert}
                    timeout={1500}
                    showConfirm={false}
                    onConfirm={() => {
                        setShowAlert(false)
                        setSuccessMessageTime("")
                    }}
                    btnSize="sm">
                    {SuccessMessageTime}
                </SweetAlert>
                : ""}

            {ErrorMessageAlert != "" ?
                <SweetAlert
                    danger
                    show={ShowAlert}
                    onConfirm={() => {
                        setShowAlert(false)
                        setErrorMessageAlert("")
                    }}
                    btnSize="sm">
                    {ErrorMessageAlert}
                </SweetAlert>
                : ""}

            {ErrorMessageAlertLogout != "" ?
                <SweetAlert
                    danger
                    show={ShowAlert}
                    onConfirm={() => {
                        setShowAlert(false)
                        setErrorMessageAlertLogout("")
                        window.location.href = "/login";
                    }}
                    btnSize="sm">
                    {ErrorMessageAlertLogout}
                </SweetAlert>
                : ""}
                
            {DeleteMessageAlert != "" ?
                <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="Ya, Hapus!"
                    confirmBtnBsStyle="danger"
                    cancelBtnText="Batal"
                    title={DeleteMessageAlert}
                    onConfirm={() => handleDelete()}
                    onCancel={() => {
                        setShowAlert(false)
                        setDeleteMessageAlert("")
                    }}
                    focusCancelBtn>
                </SweetAlert>
                : ""}
            {/* END OF ALERT */}

            <Gap height={30} />
        </div>
    )
}


export default PenjualanObat