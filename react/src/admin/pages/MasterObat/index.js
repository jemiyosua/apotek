import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Gap, HeaderPage, ModalAddNewObat, ModalExport, ModalFilter, Pagination, SkeletonListData } from '../../components'
import { useDispatch } from 'react-redux';
import { setForm } from '../../redux';
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import './master_obat.css';
import { BtnExportData, BtnFilter, IcActive, IcAddNew, IcDelete, IcExport, IcFilter, IcInactive, icQuestionMark } from '../../assets';
import { generateSignature, fetchStatus, FormatNumberComma, validEmail } from '../../utils/functions';
import { AlertMessage, paths } from '../../utils';
import xlsx from 'xlsx'

const MasterObat = () => {
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

    const totalItems = 1000;
    const itemsPerPage = 10;

    const [ShowModalFilter, setShowModalFilter] = useState(false)
    const [ShowModalExport, setShowModalExport] = useState(false)
    const [ShowModalAddnew, setShowModalAddnew] = useState(false)

    const [FilterBy, setFilterBy] = useState("")
    const [SearchFilter, setSearchFilter] = useState("")
    const [StartDate, setStartDate] = useState("")
    const [EndDate, setEndDate] = useState("")
    const [StatusFilter, setStatusFilter] = useState("")

    const [ListMasterObat, setListMasterObat] = useState([])
    const [ListMasterSupplier, setListMasterSupplier] = useState([])
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

    const [NamaObat, setNamaObat] = useState("")
    const [Supplier, setSupplier] = useState("")
    const [Satuan, setSatuan] = useState("")
    const [Kategori, setKategori] = useState("")

    const [IdDeleteData, setIdDeleteData] = useState("")

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

        getListMasterObat(1)

    }, [location.state]);

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

    const getListMasterObat = (currentPage, position) => {
        let CookieParamKey = getCookie("paramkey")
        let CookieUserID = getCookie("userid")

        let filter = FilterBy
        let valueSearchObat = ""
        let valueSearchSupplier = ""

        if (filter == "nama_obat") {
            valueSearchObat = SearchFilter
        } else if (filter == "supplier") {
            valueSearchSupplier = SearchFilter
        }

        let statusFilter = ""
        if (position == "reset-filter") {
            valueSearchSupplier = ""
            valueSearchObat = ""
            statusFilter = ""
        } else {
            statusFilter = StatusFilter
        }

        let rowPage = 5
        if (position == "export") {
            rowPage = -1
        }

        var requestBody = JSON.stringify({
            "Username": CookieUserID,
            "ParamKey": CookieParamKey,
            "Method": "SELECT",
            "Id": "",
            "NamaObat": valueSearchObat,
            "Supplier": valueSearchSupplier,
            "Status": statusFilter,
            "Page": currentPage,
            "RowPage": rowPage
        })

        var enckey = paths.EncKey
        var url = paths.URL_API_ADMIN + 'Obat'
        var Signature = generateSignature(enckey, requestBody)

        setLoading(true)

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
            setLoading(false)

            if (data.ErrorCode == "0") {
                if (position == "export") {
                    exportToExcel(data.Result)
                } else {
                    setListMasterObat(data.Result)
                    setTotalRecords(data.TotalRecords)
                    setTotalPage(data.TotalPage)
                }
                
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
            setLoading(false)
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

    const getListSupplier = () => {
        let CookieParamKey = getCookie("paramkey")
        let CookieUserID = getCookie("userid")

        var requestBody = JSON.stringify({
            "Username": CookieUserID,
            "ParamKey": CookieParamKey,
            "Method": "SELECT",
            "Page": 1,
            "RowPage": -1
        })

        var enckey = paths.EncKey
        var url = paths.URL_API_ADMIN + 'Supplier'
        var Signature = generateSignature(enckey, requestBody)

        setLoading(true)

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
            setLoading(false)

            if (data.ErrorCode == "0") {
                setListMasterSupplier(data.Result)
                setTotalRecords(data.TotalRecords)
                setTotalPage(data.TotalPage)
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
            setLoading(false)
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

    const getListSatuan = () => {
        let CookieParamKey = getCookie("paramkey")
        let CookieUserID = getCookie("userid")

        var requestBody = JSON.stringify({
            "Username": CookieUserID,
            "ParamKey": CookieParamKey,
            "Method": "SELECT",
            "Page": 1,
            "RowPage": -1
        })

        var enckey = paths.EncKey
        var url = paths.URL_API_ADMIN + 'Satuan'
        var Signature = generateSignature(enckey, requestBody)

        setLoading(true)

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
            setLoading(false)

            if (data.ErrorCode == "0") {
                setListSatuan(data.Result)
                setTotalRecords(data.TotalRecords)
                setTotalPage(data.TotalPage)
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
            setLoading(false)
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

    const getListKategori = () => {
        let CookieParamKey = getCookie("paramkey")
        let CookieUserID = getCookie("userid")

        var requestBody = JSON.stringify({
            "Username": CookieUserID,
            "ParamKey": CookieParamKey,
            "Method": "SELECT",
            "Page": 1,
            "RowPage": -1
        })

        var enckey = paths.EncKey
        var url = paths.URL_API_ADMIN + 'Kategori'
        var Signature = generateSignature(enckey, requestBody)

        setLoading(true)

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
            setLoading(false)

            if (data.ErrorCode == "0") {
                setListKategori(data.Result)
                setTotalRecords(data.TotalRecords)
                setTotalPage(data.TotalPage)
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
            setLoading(false)
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

    const handleButtonFilter = () => {
        // setSearchFilter("")
        // setFilterBy("")
        setShowModalFilter(!ShowModalFilter)
    }

    const handleResetFilter = () => {
        setFilterBy("")
        setSearchFilter("")
        setStatusFilter("")
        setShowModalFilter(false)
        getListMasterObat(1, "reset-filter")
    }

    const handleSubmitFilter = () => {
        if (FilterBy !== "") {
            if (SearchFilter == "") {
                setErrorMessageAlert("Kolom pencarian tidak boleh kosong.")
                setShowAlert(true);
                return
            }
        }
        setShowModalFilter(false)
        getListMasterObat(1)
    }

    const handleButtonExport = () => {
        getListMasterObat(1, "export")
    }

    const handleSubmitExport = () => {
        if (validEmail(EmailForExport)) {
            setEmailForExport("")
            setLoading(true)
            setShowModalExport(false);
        } else {
            setErrorMessageAlert("Email tidak valid")
            setShowAlert(true);
            return
        }
    }

    const handleResetExport = () => {
        setErrorMessageAlert("Silahkan hubungi CS Starpoin untuk melakukan reset pada email business.")
        setShowAlert(true)
    }

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > TotalPage) {
            return;
        }
        setCurrentPage(pageNumber);
        getListMasterObat(pageNumber)
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const pageRangeDisplayed = 3;
        const maxPagesToShow = pageRangeDisplayed * 2 + 1;

        if (TotalPage <= maxPagesToShow) {
            for (let i = 1; i <= TotalPage; i++) {
                pageNumbers.push(i);
            }
        } else {
            const startPage = Math.max(1, CurrentPage - pageRangeDisplayed);
            const endPage = Math.min(TotalPage, CurrentPage + pageRangeDisplayed);

            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) {
                    pageNumbers.push('...');
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < TotalPage) {
                if (endPage < TotalPage - 1) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(TotalPage);
            }
        }
        return pageNumbers;
    };

    const displayedPageNumbers = getPageNumbers();

    const datakosong = (strip) => {
        if (strip == "") {
            return "-"
        }
        return strip
    }

    const handleValidasiDelete = (id) => {
        setIdDeleteData(id)
        setDeleteMessageAlert("Apakah Anda yakin menghapus data ini?")
        return
    }

    const handleDelete = () => {
        console.log("id delete data : ", IdDeleteData )
        setDeleteMessageAlert("")
        setShowAlert(true)
        setSuccessMessageTime("Sukses menghapus data")
    }

    const handleButtonAddNew = () => {
        getListSupplier()
        getListSatuan()
        getListKategori()
        setShowModalAddnew(true)
    }

    const handleCloseAddNew = () => {
        setNamaObat("")
        setSupplier("")
        setSatuan("")
        setKategori("")
        setShowModalAddnew(false)
    }

    const handleButtonSubmitAddNew = () => {
        // hit API add new obat
    }

    const renameAtributForClient = (csvData) => {
        return csvData.map(function (row) {
            return {
                KodeObat: row.KodeObat, 
                NamaObat: row.NamaObat, 
                SupplierObat: row.Supplier,  
                StatusObat:row.Status == "1" ? "Aktif" : "Tidak Aktif",
                Satuan:row.Satuan,
                Kategori:row.Kategori
            }
        })
    }

    const exportToExcel = (csvData) => {

        var fileName = "export_master_obat";
        var DataExcel = csvData;

        var ws = "";
            ws = xlsx.utils.json_to_sheet(removeAtribut(renameAtributForClient(DataExcel)));

        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

        xlsx.writeFile(wb, fileName + ".xlsx")
    }

    const removeAtribut = (data) => {
        data.forEach(dt => {
            delete dt.ParamKey;
            delete dt.UserID;
            delete dt.Method;
            delete dt.Page;
            delete dt.RowPage;
            delete dt.OrderBy;
            delete dt.Order;
        });
        return data;
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
                                <div className='card-content-text-sm-black2-title' style={{ fontWeight:'bold', fontSize:15 }}>Master Obat</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <div>
                                    <img src={IcAddNew} style={{ cursor: 'pointer', width:27 }} onClick={() => handleButtonAddNew()} />
                                </div>
                                <Gap width={15} />
                                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding:8, backgroundColor:'orange', borderRadius:10 }}>
                                    <img src={IcFilter} style={{ cursor: 'pointer', width:20 }} onClick={() => handleButtonFilter()} />
                                    <Gap width={20} />
                                    <img src={IcExport} style={{ cursor: 'pointer', width:26 }} onClick={() => handleButtonExport()} />
                                </div>
                            </div>
                        </div>

                        {Loading ?
                            <div className="loader-container">
                                <div className="spinner-border purple-spinner" />
                            </div>
                            :
                            <div>
                                <table className='table-content'>
                                    <tr className='table-content-tr'>
                                        <td className='table-content-td-header'>No</td>
                                        <td className='table-content-td-header'>Kode Obat</td>
                                        <td className='table-content-td-header' style={{ textAlign:'left' }}>Nama Obat</td>
                                        <td className='table-content-td-header' style={{ textAlign:'left' }}>Supplier Obat</td>
                                        <td className='table-content-td-header' style={{ textAlign:'center' }}>Status obat</td>
                                        <td className='table-content-td-header' style={{ textAlign:'left' }}>Satuan obat</td>
                                        <td className='table-content-td-header' style={{ textAlign:'left' }}>Kategori obat</td>
                                        <td className='table-content-td-header' style={{ textAlign:'left' }}></td>
                                    </tr>
                                    {ListMasterObat.map((item, index) => {
                                        return <tr className='table-content-tr'>
                                            <td className='table-content-td'>{index + 1}</td>
                                            <td className='table-content-td' style={{ color:'blue', cursor:'pointer' }}>{item.KodeObat}</td>
                                            <td className='table-content-td' style={{ textAlign:'left' }}>{item.NamaObat}</td>
                                            <td className='table-content-td' style={{ textAlign:'left' }}>{item.Supplier}</td>
                                            <td className='table-content-td-mid' style={{ textAlign:'center' }}>{item.Status == "1" ? <img src={IcActive} style={{ width:18 }} /> : <img src={IcInactive} style={{ width:18 }} />}</td> 
                                            <td className='table-content-td' style={{ textAlign:'left' }}>{item.Satuan}</td>
                                            <td className='table-content-td' style={{ textAlign:'left' }}>{item.Kategori}</td>
                                            <td className='table-content-td-mid' style={{ textAlign:'left' }}>
                                                <div onClick={() => handleValidasiDelete(item.Id)} style={{ cursor:'pointer' }}>
                                                    <img src={IcDelete} style={{ width:18 }} />
                                                </div>
                                            </td>
                                        </tr>
                                    })}
                                </table>
                            </div>}

                        {TotalRecords < 1 && 
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ paddingTop:15, color:'red', fontSize:15, fontWeight:'bold' }}>Data Tidak Ditemukan</div>
                        </div>}

                        {Loading ?
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <SkeletonListData width={200} height={30} />
                            </div>
                            : TotalRecords < 1 ?
                            <></>
                            :
                            <div style={{
                                paddingTop: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: 'bold'
                            }}> Total Data : {TotalRecords}
                            </div>}
                    </div>
                </div>

                <ModalAddNewObat
                    onClickShowModal={ShowModalAddnew}
                    onClickCancel={() => handleCloseAddNew()}
                    listSupplier={ListMasterSupplier}
                    listSatuan={ListSatuan}
                    listKategori={ListKategori}
                    namaObat={NamaObat}
                    setNamaObat={event => setNamaObat(event.target.value)}
                    supplier={Supplier}
                    setSupplier={event => setSupplier(event.target.value)}
                    satuan={Satuan}
                    setSatuan={event => setSatuan(event.target.value)}
                    kategori={Kategori}
                    setKategori={event => setKategori(event.target.value)}
                    cancelAddNew={() => handleCloseAddNew()}
                    submitAddNew={() => handleButtonSubmitAddNew()}
                />

                <ModalFilter
                    onClickShowModal={ShowModalFilter}
                    onClickCancel={() => handleButtonFilter()}
                    filterBy={FilterBy}
                    setFilterBy={event => setFilterBy(event.target.value)}
                    searchFilter={SearchFilter}
                    setSearchFilter={event => setSearchFilter(event.target.value)}
                    startDate={StartDate}
                    setStartDate={event => setStartDate(event.target.value)}
                    endDate={EndDate}
                    setEndDate={event => setEndDate(event.target.value)}
                    resetFilter={() => handleResetFilter()}
                    submitFilter={() => handleSubmitFilter()}
                    showDateFilter={false}
                    showStatusFilter={true}
                    showSearchFilter={true}
                    showSupplier={true}
                    showName={true}
                    setStatusFilter={event => setStatusFilter(event.target.value)}
                    statusFilter={StatusFilter}
                />

                <ModalExport
                    onClickShowModal={ShowModalExport}
                    onClickCancel={() => {
                        setShowModalExport(false)
                        setEmailForExport("")
                    }}
                    onClickSubmit={() => handleSubmitExport()}
                    startDate={StartDate}
                    setStartDate={event => setStartDate(event.target.value)}
                    endDate={EndDate}
                    setEndDate={event => setEndDate(event.target.value)}
                    submitExport={handleSubmitExport}
                    resetFilter={() => handleResetExport()}
                    emailForExport={EmailForExport}
                    setemailForExport={setEmailForExport}
                    tempMail={EmailFilled}
                />

                {TotalRecords > 0 && 
                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    initialPage={1}
                    currentPage={CurrentPage}
                    handlePageChange={handlePageChange}
                    displayedPageNumbers={displayedPageNumbers}
                    totalPages={TotalPage}
                />}
            </div>

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

            <Gap height={20} />
        </div>
    )
}


export default MasterObat