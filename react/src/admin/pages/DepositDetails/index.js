import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Gap, HeaderPage, ModalExport, ModalFilter, ModalTopUp, Pagination, SkeletonListData } from '../../components'
import { useDispatch } from 'react-redux';
import { setForm } from '../../redux';
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import './deposit_details.css';
import { BtnExportData, icQuestionMark, BtnDropdown, icInformation } from '../../assets';
import { generateSignature, fetchStatus, FormatNumberComma, formatDate, validEmail } from '../../utils/functions';
import { AlertMessage, paths } from '../../utils'
import Skeleton from '../../components/atoms/SkeletonListData';
import Overlay from 'react-bootstrap/Overlay';

const DepositDetails = () => {
    const history = useHistory();
    const [OrderBy, setOrderBy] = useState("")
    const [Order, setOrder] = useState("DESC")
    const [Loading, setLoading] = useState(false)
    const [Loading2, setLoading2] = useState(false)

    const location = useLocation();
    // location.state.postContent
    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const getCookie = (tipe) => {
        var SecretCookie = cookies.varCookie;
        if (SecretCookie != "" && SecretCookie != null && typeof SecretCookie == "string") {
            var LongSecretCookie = SecretCookie.split("|");
            var UserID = LongSecretCookie[0];
            var ParamKeyArray = LongSecretCookie[1];
            var Nama = LongSecretCookie[2];
            var PartnerCode = LongSecretCookie[3];
            var ParamKey = ParamKeyArray.substring(0, ParamKeyArray.length)

            if (tipe === "userid") {
                return UserID;
            } else if (tipe === "paramkey") {
                return ParamKey;
            } else if (tipe === "nama") {
                return Nama;
            } else if (tipe === "partnercode") {
                return PartnerCode;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    const SessionPartnerCode = getCookie("partnercode")

    const [ShowAlert, setShowAlert] = useState(true)
    const [SessionMessage, setSessionMessage] = useState("")
    const [SuccessMessage, setSuccessMessage] = useState("")
    const [ErrorMessageAlert, setErrorMessageAlert] = useState("")
    const [ErrorMessageAlertLogout, setErrorMessageAlertLogout] = useState("")

    const [UserID, setUserID] = useState("")
    const [Nama, setNama] = useState("")

    const [CurrentTime, setCurrentTime] = useState(new Date());

    const [Search, setSearch] = useState("")

    const totalItems = 1000;
    const itemsPerPage = 10;

    const [ShowModalFilter, setShowModalFilter] = useState(false)
    const [ShowModalTopUp, setShowModalTopUp] = useState(false)
    const [ShowModalExport, setShowModalExport] = useState(false)

    const [FilterBy, setFilterBy] = useState("")
    const [SearchFilter, setSearchFilter] = useState("")
    const [StartDate, setStartDate] = useState("")
    const [EndDate, setEndDate] = useState("")
    const [NominalTopUp, setNominalTopUp] = useState("")

    const [ListPoinStatement, setListPoinStatement] = useState([])
    const [TotalPoin, setTotalPoin] = useState("")
    const [CurrentPage, setCurrentPage] = useState(1)
    const [TotalPage, setTotalPage] = useState(0)
    const [TotalDepositDetails, setTotalDepositDetails] = useState(0)
    const [IsDropdownOpen, setIsDropdownOpen] = useState(false);
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const [EmailForExport, setEmailForExport] = useState("")
    const [EmailFilled, setEmailFilled] = useState("")
    const [PartnerCodes, setPartnerCodes] = useState(SessionPartnerCode || "")
    const [ListPartner, setListPartner] = useState([])

    useEffect(() => {
        if (Nama) {
            if (SessionPartnerCode === "119") {
                const selectedPartner = ListPartner.find(item => item.nama === Nama)
                const NewPCode = selectedPartner ? selectedPartner.bu_id : getCookie("partnercode")
                if (PartnerCodes !== NewPCode) {
                    setPartnerCodes(NewPCode || "");
                    console.log(`terganti: ${Nama} -> Code: ${NewPCode}`);
                }
            }
            else {
                if (PartnerCodes !== SessionPartnerCode) {
                    setPartnerCodes(SessionPartnerCode);
                }
            }
        }
    }, [Nama, SessionPartnerCode, ListPartner])

    useEffect(() => {
        var CookieNama = getCookie("nama")
        var CookiePartnerCode = getCookie("partnercode")
        var CookieParamKey = getCookie("paramkey")
        var CookieUserID = getCookie("userid")

        if (CookieParamKey == null || CookieParamKey === "" ||
            CookieUserID == null || CookieUserID === "") {
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

        if (PartnerCodes !== switchedCode) {
            setPartnerCodes(switchedCode)
        }
        if (Nama !== switchedName) {
            setNama(switchedName)
        }

        dispatch(setForm("ParamKey", CookieParamKey))
        dispatch(setForm("UserID", CookieUserID))
        dispatch(setForm("Nama", switchedName))
        dispatch(setForm("PageActive", "DEPOSIT_DETAILS"))

        if (switchedCode) {
            loadDataOverallWithCode(switchedCode)
        }

        getListPartner()

        const timerId = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timerId);

    }, [location.state]);

    useEffect(() => {
        if (UserID && PartnerCodes) {
            loadDataOverallWithCode(PartnerCodes);
        }
    }, [PartnerCodes]);

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

    const getListPartner = () => {

        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");

        var requestBody = JSON.stringify({
            "UserID": CookieUserID,
            "ParamKey": CookieParamKey,
        });


        var enckey = paths.EncKey;
        var url = paths.URL_API_ADMIN_BU + 'ListPartnerCodes';
        var Signature = generateSignature(enckey, requestBody)

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
                if (data.ErrorCode == "0") {
                    setListPartner(data.Result || [])
                } else if (data.ErrorMessage === "Param Key Expired") {
                    setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                    setShowAlert(true);
                    return
                } else {
                    setErrorMessageAlert(data.ErrorMessage)
                    setShowAlert(true);
                    return false;
                }
            })
            .catch((error) => {
                if (error.message == 401) {
                    setErrorMessageAlert("Sesi berakhir, silakan login ulang.");
                    setShowAlert(true);
                    return false;
                } else if (error.message === "Failed to fetch" || error.message.includes("NetworkError")) {
                    setErrorMessageAlert(AlertMessage.failedFecthTooBig)
                    setShowAlert(true)
                    return false
                }
                setErrorMessageAlert(AlertMessage.failedConnect)
                setShowAlert(true)
                return false
            });
    }

    const getListPoinStatement = (currentPage, posisi, overrideCode = null) => {

        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");
        var CurrentPartnerCode = overrideCode ? overrideCode : PartnerCodes;

        let email = ""
        if (posisi === "export") {
            email = EmailForExport
        }

        var reqid = ""
        var trxid = ""

        let startDate = formatApiDate(StartDate, 'start')
        let endDate = formatApiDate(EndDate, 'end')

        if (posisi === "reset-filter") {
            setFilterBy("")
            setSearchFilter("")
            setStartDate("")
            setEndDate("")
            startDate = ""
            endDate = ""
        } else {
            if (FilterBy === "transactionReferenceNumber") {
                reqid = SearchFilter
            } else if (FilterBy === "transactionId") {
                trxid = SearchFilter
            }
        }

        var requestBody = JSON.stringify({
            "UserID": CookieUserID,
            "ParamKey": CookieParamKey,
            "PartnerCode": CurrentPartnerCode,
            "ExportTo": email,
            "ItemPerPage": 10,
            "Page": currentPage,
            "ReqId": reqid,
            "TrxId": trxid,
            "StartDate": startDate,
            "EndDate": endDate,
            "BalanceOwner": ""
        });

        var enckey = paths.EncKey;
        var url = paths.URL_API_ADMIN_BU + 'ListPoinStatement';
        var Signature = generateSignature(enckey, requestBody)

        return fetch(url, {
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

                if (data.ErrorCode == "0") {
                    if (posisi == "export") {
                        setSuccessMessage("Export berhasil dikirim ke email.");
                        setShowAlert(true);
                        return;
                    }
                    setListPoinStatement(data.Result)
                    setTotalPage(data.TotalPage)
                    setTotalDepositDetails(data.Total)
                    setEmailFilled(data.Email)
                } else {
                    setErrorMessageAlert(data.ErrorMessage)
                    setShowAlert(true);
                    return false;
                }
            })
            .catch((error) => {
                if (error.message == 401) {
                    setErrorMessageAlert("Sesi berakhir, silakan login ulang.");
                    setShowAlert(true);
                    return false;
                } else if (error.message === "Failed to fetch" || error.message.includes("NetworkError")) {
                    setErrorMessageAlert(AlertMessage.failedFecthTooBig)
                    setShowAlert(true)
                    return false
                }
                setErrorMessageAlert(AlertMessage.failedConnect)
                setShowAlert(true)
                return false
            });
    }

    const getPoinStatement = (overrideCode = null) => {

        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");
        var CurrentPartnerCode = overrideCode ? overrideCode : PartnerCodes


        var requestBody = JSON.stringify({
            "UserID": CookieUserID,
            "ParamKey": CookieParamKey,
            "PartnerCode": CurrentPartnerCode
        });

        var enckey = paths.EncKey;
        var url = paths.URL_API_ADMIN_BU + 'GetPoinStatementInfo';
        var Signature = generateSignature(enckey, requestBody)

        return fetch(url, {
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
                if (data.ErrorCode == "0") {
                    setTotalPoin(data.Result)
                } else if (data.ErrorMessage === "Param Key Expired") {
                    setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                    setShowAlert(true);
                    return
                } else {
                    setErrorMessageAlert(data.ErrorMessage)
                    setShowAlert(true);
                    return false;
                }
            })
            .catch((error) => {
                if (error.message == 401) {
                    setErrorMessageAlert("Sesi berakhir, silakan login ulang.");
                    setShowAlert(true);
                    return false;
                } else if (error.message === "Failed to fetch") {
                    setErrorMessageAlert(AlertMessage.failedFecthTooBig)
                    setShowAlert(true)
                    return false
                }
                setErrorMessageAlert(AlertMessage.failedConnect)
                setShowAlert(true)
                return false
            });
    }

    const loadDataOverallWithCode = async (code) => {
        setLoading(true);
        setLoading2(true);
        try {
            await Promise.all([
                getPoinStatement(code),
                getListPoinStatement(1, "", code)
            ]);
        } catch (err) {
            console.error(err);
            setErrorMessageAlert("Gagal memuat data");
            setShowAlert(true);
        } finally {
            setLoading(false);
            setLoading2(false);
        }
    };


    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > TotalPage) {
            return;
        }
        setCurrentPage(pageNumber);
        setLoading(true);

        getListPoinStatement(pageNumber, "")
            .finally(() => {
                setLoading(false);
            });
    }

    const handleButtonFilter = () => {
        setShowModalFilter(!ShowModalFilter)
    }

    const handleButtonTopUp = () => {
        setShowModalTopUp(!ShowModalTopUp)
    }

    const handleResetFilter = () => {
        setShowModalFilter(false)
        setCurrentPage(1)
        setLoading(true);

        getListPoinStatement(1, "reset-filter")
            .finally(() => {
                setLoading(false)
            });
    }

    const handleSubmitFilter = () => {
        if ((StartDate && !EndDate) || (!StartDate && EndDate)) {
            setErrorMessageAlert("Tanggal Mulai dan Tanggal Selesai Tidak Boleh Kosong!")
            setShowAlert(true);
            return
        }

        if (StartDate && EndDate) {
            const start = new Date(StartDate);
            const end = new Date(EndDate);
            if (start.getTime() > end.getTime()) {
                setErrorMessageAlert("Tanggal Mulai tidak boleh setelah Tanggal Selesai.")
                setShowAlert(true);
                return
            }
        }

        if ((SearchFilter && !FilterBy) || (FilterBy && !SearchFilter)) {
            setErrorMessageAlert("Harap mengisi kedua kolom dengan benar.");
            setShowAlert(true);
            return;
        }
        setShowModalFilter(false)
        setCurrentPage(1)

        setLoading(true)

        getListPoinStatement(1, "")
            .finally(() => {
                setLoading(false)
            });
    }

    const formatApiDate = (dateString, state) => {
        if (!dateString) return ""

        const [year, month, day] = dateString.split('-')

        return `${day}-${month}-${year} ${state == 'start' ? '00:00:00' : '23:59:59'}`
    }

    const handleChangeNominalTopUp = (event) => {
        const numericValue = event.target.value.replace(/[^0-9]/g, '');
        setNominalTopUp(numericValue);
    };

    const handleSubmitTopUp = () => {

    }

    const handleButtonExport = () => {
        if (EmailFilled) {
            setEmailForExport(EmailFilled)
        }
        setShowModalExport(true)
    }

    const handleSubmitExport = () => {
        if (validEmail(EmailForExport)) {
            getListPoinStatement(1, "export")
            setShowModalExport(false)
            setEmailForExport("")
        } else {
            setErrorMessageAlert("Email tidak valid.")
            setShowAlert(true);
            return
        }
    }

    const handleResetExport = () => {
        setErrorMessageAlert("Silahkan hubungi CS Starpoin untuk melakukan reset pada email business.")
        setShowAlert(true)
    }

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

    return (
        <div className='main-page'>
            <div style={{ width: '100%' }}>
                <HeaderPage
                    nama={Nama}
                    list={ListPartner}
                    partnerCode={SessionPartnerCode}
                    setNama={setNama}
                    currentTime={getFormattedDateTime(CurrentTime)}
                    search={Search}
                    setSearch={event => setSearch(event.target.value)}
                />

                <div className='container-main-content-deposit'>
                    <div className='card-content-deposit'>
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className='text-sm-black2'>BU Ending Balance</div>
                            </div>
                            {Loading2 ?
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'center', }}>
                                        <SkeletonListData height={55} width={350} />
                                    </div>
                                </>
                                :
                                <div style={{ fontSize: 51, fontWeight: 700, textAlign: 'center' }}>{FormatNumberComma(TotalPoin.EndingBalance) + ' IDR'}</div>
                            }
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {Loading2 ?
                                    <Skeleton />
                                    :
                                    <div className='text-sm-black' style={{ fontSize: 24, fontWeight: 700 }}>   {FormatNumberComma(TotalPoin.TotalPoint)}</div>
                                }
                                <Gap width={10} />
                                <div className='text-sm-grey'>Point Generated</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div className='text-sm-grey'>{getFormattedDateTime(CurrentTime)}</div>
                            </div>

                        </div>
                    </div>

                    <Gap width={150}></Gap>

                    <div className='card-content-filter-2' >
                        <div className='container-filter'>

                            <div className='card-content-filter'>
                                <div className="custom-dropdown-container">
                                    <div className="custom-dropdown-header">
                                        {FilterBy === "transactionId" ? "Transaction ID" :
                                            FilterBy === "transactionReferenceNumber" ? "Request ID" :
                                                "Select Filter Type"}
                                        <img src={BtnDropdown} style={{ cursor: 'pointer' }} onClick={() => setIsDropdownOpen(!IsDropdownOpen)} />
                                    </div>

                                    {IsDropdownOpen && (
                                        <div className="custom-dropdown-list">
                                            <div
                                                className="custom-dropdown-item"
                                                onClick={() => {
                                                    setFilterBy("transactionId");
                                                    setIsDropdownOpen(false);
                                                }}>
                                                Transaction ID
                                            </div>

                                            <div
                                                className="custom-dropdown-item"
                                                onClick={() => {
                                                    setFilterBy("transactionReferenceNumber");
                                                    setIsDropdownOpen(false);
                                                }}>
                                                Request ID
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='card-content-filter'>
                                <input
                                    type="text"
                                    className='custom-input'
                                    placeholder="Search"
                                    value={SearchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                />
                            </div>

                            <div className='card-content-filter'>
                                <label className='input-label'>Start Date</label>
                                <input
                                    type="date"
                                    className='custom-input'
                                    value={StartDate}
                                    style={{ cursor: 'text' }}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div className='card-content-filter'>
                                <label className='input-label'>End Date</label>
                                <input
                                    type="date"
                                    className='custom-input'
                                    value={EndDate}
                                    style={{ cursor: 'text' }}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ cursor: 'pointer', paddingTop: '5px', fontSizeAdjust: '0.5' }} onClick={handleResetFilter}>Reset Filter</div>
                            <Gap width={10} />
                            <div style={{ backgroundColor: '#5C2A96', width: 60, height: 30, borderRadius: 25, color: '#FFFFFF', fontSize: 13, cursor: 'pointer', textAlign: 'center' }}>
                                <div style={{ marginTop: 4 }} onClick={handleSubmitFilter}>Apply</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container-content-table'>
                    <div className='container-table'>
                        <div className='container-content-table-header-dd'>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <div className='card-content-text-sm-black-dd'>Poin Statement</div>
                                <Gap width={10} />
                                <div>
                                    <img
                                        ref={target}
                                        src={icQuestionMark}
                                        style={{ paddingLeft: '5px', cursor: 'pointer' }}
                                        onClick={() => setShow(prev => !prev)}
                                    />
                                    <Overlay target={target.current} show={show} placement="right">
                                        {(props) => (
                                            <div
                                                {...props}
                                                style={{
                                                    position: 'absolute',
                                                    backgroundColor: '#F2EBE3',
                                                    padding: '8px 12px',
                                                    color: 'black',
                                                    borderRadius: 12,
                                                    maxWidth: '500px',
                                                    whiteSpace: 'normal',
                                                    wordWrap: 'break-word',
                                                    textAlign: 'left',
                                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',

                                                    ...props.style,
                                                }}
                                            >
                                                Point Statement merupakan kumpulan data seluruh transaksi terkait proses generate saldo StarPoin, baik yang berasal dari transaksi deposit BU maupun dari proses pemberian atau pengalokasian saldo StarPoin kepada pengguna.
                                            </div>
                                        )}
                                    </Overlay>
                                </div>
                            </div>
                            {Loading ? <></>
                                : <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <img src={BtnExportData} style={{ cursor: 'pointer' }} onClick={() => handleButtonExport()} />
                                </div>
                            }
                        </div>
                        <div
                            style={{
                                // boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                border: '1px solid #BEDBFF',
                                borderRadius: '10px',
                                backgroundColor: '#EFF6FF',
                                padding: '8px 12px',
                                display: 'flex',
                                alignItems: 'flex-start'
                            }}
                        >
                            <img src={icInformation} style={{ paddingTop: '3px' }} />
                            <Gap width={15} />

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ color: '#1C398E', fontWeight: 600 }}>
                                    Informasi:
                                </div>
                                <div style={{ color: '#1C398E' }}>
                                    Hanya menampilkan data 1 minggu terakhir. Silahkan ubah tanggal pada filter untuk melihat periode lainnya.
                                </div>
                            </div>
                        </div>
                        <Gap height={20} />
                        {Loading ?
                            <div className="loader-container">
                                <div className="spinner-border purple-spinner" />
                            </div>
                            :
                            <div>
                                <table className='table-content'>
                                    <tr className='table-content-tr'>
                                        <td className='table-content-td-header'>No</td>
                                        <td className='table-content-td-header'>Transaction ID</td>
                                        <td className='table-content-td-header'>Request ID</td>
                                        <td className='table-content-td-header'>Transaction Date</td>
                                        <td className='table-content-td-header'>Points Mutation</td>
                                        <td className='table-content-td-header'>Balance</td>
                                    </tr>
                                    {ListPoinStatement.map((item, index) => {
                                        return <tr className='table-content-tr'>
                                            <td className='table-content-td'>{index + 1}</td>
                                            <td className='table-content-td'>{item.transactionId}</td>
                                            <td className='table-content-td'>{item.transactionReferenceNumber}</td>
                                            <td className='table-content-td'>{formatDate(item.transactionDate)}</td>
                                            <td className='table-content-td'>{FormatNumberComma(item.pointsMutation)}</td>
                                            <td className='table-content-td'>{FormatNumberComma(item.balance)}</td>
                                        </tr>
                                    })}
                                </table>
                            </div>}
                        <Gap height={20} />
                        {Loading ?
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <SkeletonListData height={30} width={200} />
                            </div>
                            :
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}> Total Data : {FormatNumberComma(TotalDepositDetails)}
                            </div>
                        }
                    </div>
                </div>

                <ModalTopUp
                    onClickShowModal={ShowModalTopUp}
                    onClickCancel={() => handleButtonTopUp()}
                    onClickSubmit={() => handleSubmitTopUp()}
                    nominalTopUp={NominalTopUp}
                    handleChange={event => handleChangeNominalTopUp(event)}
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
                    showDateFilter={true}
                    showStatusFilter={false}
                    showSearchFilter={true}
                    showName={false}
                    showOther={true}
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
                    emailForExport={EmailForExport}
                    setemailForExport={setEmailForExport}
                    resetFilter={() => handleResetExport()}
                    tempMail={EmailFilled}
                />

                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    initialPage={1}
                    currentPage={CurrentPage}
                    handlePageChange={handlePageChange}
                    displayedPageNumbers={displayedPageNumbers}
                    totalPages={TotalPage}
                />

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
                        history.replace("/deposit-details")
                    }}
                    btnSize="sm">
                    {SuccessMessage}
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
            {/* END OF ALERT */}

            <Gap height={20} />
        </div>
    )
}


export default DepositDetails