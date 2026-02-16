import React, { useEffect, useState, useRef } from 'react'
import Overlay from 'react-bootstrap/Overlay';
import { useHistory, useLocation } from 'react-router-dom'
import { Gap, HeaderPage, ModalExport, ModalFilter, Pagination, SkeletonListData } from '../../components'
import { useDispatch } from 'react-redux';
import { setForm } from '../../redux';
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import './redemption_report.css';
import { BtnExportData, BtnFilter, icQuestionMark } from '../../assets';
import { generateSignature, fetchStatus, FormatNumberComma, formatDate, validEmail } from '../../utils/functions';
import { AlertMessage, paths } from '../../utils'

const RedemptionReport = () => {
    const history = useHistory();
    const [OrderBy, setOrderBy] = useState("")
    const [Order, setOrder] = useState("DESC")
    const [Loading, setLoading] = useState(false)

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

            if (tipe == "userid") {
                return UserID;
            } else if (tipe == "paramkey") {
                return ParamKey;
            } else if (tipe == "nama") {
                return Nama;
            } else if (tipe == "partnercode") {
                return PartnerCode
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    const SessionPartnerCode = getCookie("partnercode")
    const [PageActive, setPageActive] = useState(1)

    const [ShowAlert, setShowAlert] = useState(true)
    const [SessionMessage, setSessionMessage] = useState("")
    const [SuccessMessage, setSuccessMessage] = useState("")
    const [ErrorMessageAlert, setErrorMessageAlert] = useState("")
    const [ErrorMessageAlertLogout, setErrorMessageAlertLogout] = useState("")

    const [UserID, setUserID] = useState("")
    const [Nama, setNama] = useState("")

    const [CurrentTime, setCurrentTime] = useState(new Date());

    const [Search, setSearch] = useState("")

    const totalItems = 1000
    const itemsPerPage = 10

    const [ShowModalFilter, setShowModalFilter] = useState(false)
    const [ShowModalExport, setShowModalExport] = useState(false)
    const [EmailForExport, setEmailForExport] = useState("")

    const [FilterBy, setFilterBy] = useState("")
    const [SearchFilter, setSearchFilter] = useState("")
    const [StartDate, setStartDate] = useState("")
    const [EndDate, setEndDate] = useState("")
    const [EmailFilled, setEmailFilled] = useState("")

    const [ListRedemptionReport, setListRedemptionReport] = useState([])
    const [CurrentPage, setCurrentPage] = useState(1)
    const [TotalPage, setTotalPage] = useState(0)
    const [TotalRedemptionCount, setTotalRedemptionCount] = useState(0)
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const timerRef = useRef(null);
    const [ListPartner, setListPartner] = useState([])
    const [PartnerCodes, setPartnerCodes] = useState(SessionPartnerCode || "")

    useEffect(() => {
        if (!show) return;

        timerRef.current = setTimeout(() => {
            setShow(false);
        }, 17000);

        return () => {
            clearTimeout(timerRef.current);
        };
    }, [show]);

    useEffect(() => {
        if (Nama) {
            if (SessionPartnerCode === "119") {
                const selectedPartnerCode = ListPartner.find(item => item.nama === Nama)
                const NewPartnerCode = selectedPartnerCode ? selectedPartnerCode.bu_id : getCookie("partnercode")
                if (PartnerCodes !== NewPartnerCode) {
                    setPartnerCodes(NewPartnerCode || "")
                }
            } else {
                if (PartnerCodes !== SessionPartnerCode) {
                    setPartnerCodes(SessionPartnerCode)
                }
            }
        }
    }, [Nama, ListPartner, SessionPartnerCode])

    useEffect(() => {
        var CookieNama = getCookie("nama")
        var CookiePartnerCode = getCookie("partnercode")
        var CookieParamKey = getCookie("paramkey")
        var CookieUserID = getCookie("userid")

        if (CookieParamKey == null || CookieParamKey === "" || CookieUserID == null || CookieUserID == "") {
            logout()
            window.location.href = "/login"
            return false
        }

        let switchedCode = ""
        let switchedName = ""

        if (location.state && location.state.selectedPartner) {
            switchedCode = location.state.selectedPartner
            switchedName = location.state.selectedNama
        } else {
            switchedCode = CookiePartnerCode || ""
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
        dispatch(setForm("PageActive", "REDEMPTION_REPORT"))

        if (switchedCode) {
            loadDataOverall(switchedCode)
        }

        getListPartner()

        const timerId = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timerId)

    }, [location.state])

    useEffect(() => {
        if (UserID && PartnerCodes) {
            loadDataOverall(PartnerCodes)
        }
    }, [PartnerCodes])

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

    const loadDataOverall = async (code) => {
        setLoading(true)

        try {
            await Promise.all([
                getListRedemptionReport(1, "", code)
            ])
        } catch (err) {
            console.error(err)
            setErrorMessageAlert("gagal fecth data")
            setShowAlert(true)
        } finally {
            setLoading(false)
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
                    setListPartner(data.Result)
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
                } else if (error.message != 401) {
                    setErrorMessageAlert(AlertMessage.failedConnect);
                    setShowAlert(true);
                    return false;
                }
            });
    }

    const getListRedemptionReport = (currentPage, posisi, overrideCode = null) => {

        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");
        var CurrentPartnerCode = overrideCode ? overrideCode : PartnerCodes
        let email = ""
        if (posisi == "export") {
            email = EmailForExport
        }

        let startDate = formatApiDate(StartDate, 'start')
        let endDate = formatApiDate(EndDate, 'end')

        var name = ""
        var orderNo = ""
        var produk = ""

        if (posisi === "reset-filter") {
            setFilterBy("")
            setSearchFilter("")
            setStartDate("")
            setEndDate("")
            startDate = ""
            endDate = ""
        } else {
            if (FilterBy === "order_no") {
                orderNo = SearchFilter
            } else if (FilterBy === "name") {
                name = SearchFilter
            } else if (FilterBy === "product") {
                produk = SearchFilter
            }
        }

        var requestBody = JSON.stringify({
            "UserID": CookieUserID,
            "ParamKey": CookieParamKey,
            "PartnerCode": CurrentPartnerCode,
            "ExportTo": email,
            "ItemPerPage": 10,
            "Page": currentPage,
            "OrderNo": orderNo,
            "Name": name,
            "Product": produk,
            "StartDate": startDate,
            "EndDate": endDate
        });

        var enckey = paths.EncKey;
        var url = paths.URL_API_ADMIN_BU + 'ListRedemptionReport';
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
                        {
                            Loading ?
                                <div className="loader-container">
                                    <div className="spinner-border purple-spinner" />
                                </div>
                                :
                                setSuccessMessage("Export berhasil dikirim ke email.");
                            setShowAlert(true);
                            return false;
                        }
                    }
                    setListRedemptionReport(data.Result)
                    setTotalPage(data.TotalPage)
                    setTotalRedemptionCount(data.Total)
                    setEmailFilled(data.Email)
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
            })
    }

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > TotalPage) {
            return;
        }
        setCurrentPage(pageNumber);
        setLoading(true)
        getListRedemptionReport(pageNumber, "")
            .finally(() => {
                setLoading(false)
            })
    }

    const handleButtonFilter = () => {
        setFilterBy("")
        setSearchFilter("")
        setShowModalFilter(!ShowModalFilter)
    }

    const handleResetFilter = () => {
        setCurrentPage(1)
        setShowModalFilter(false)
        setLoading(true)
        getListRedemptionReport(1, "reset-filter")
            .finally(() => {
                setLoading(false)
            })
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
        setCurrentPage(1);
        setLoading(true)
        getListRedemptionReport(1, "")
            .finally(() => {
                setLoading(false)
            })
    }

    const formatApiDate = (dateString, state) => {
        if (!dateString) return ""

        const [year, month, day] = dateString.split('-')

        return `${day}-${month}-${year} ${state == 'start' ? '00:00:00' : '23:59:59'}`
    }

    const handleButtonExport = () => {
        if (EmailFilled) {
            setEmailForExport(EmailFilled)
        }
        setShowModalExport(true)
    }

    const handleSubmitExport = () => {
        if (validEmail(EmailForExport)) {
            setLoading(true)
            getListRedemptionReport(1, "export")
                .finally(() => {
                    setLoading(false)
                })
            setShowModalExport(false)
            setEmailForExport("")
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

    return (
        <div className='main-page'>
            <div style={{ width: '100%' }}>
                <HeaderPage
                    nama={Nama}
                    setNama={setNama}
                    list={ListPartner}
                    partnerCode={SessionPartnerCode}
                    currentTime={getFormattedDateTime(CurrentTime)}
                    search={Search}
                    setSearch={event => setSearch(event.target.value)}
                />

                <div className='container-content-table'>
                    <div className='container-table'>
                        <div className='container-content-table-header'>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <div className='card-content-text-sm-black2'>Redemption Report</div>
                                <img
                                    ref={target}
                                    src={icQuestionMark}
                                    style={{ paddingLeft: '10px', cursor: 'pointer' }}
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
                                            Redemption Report merupakan kumpulan data seluruh produk yang telah dilakukan proses redeem oleh pengguna, mencakup informasi transaksi penukaran yang tercatat dalam sistem.
                                        </div>
                                    )}
                                </Overlay>
                            </div>
                            {Loading ? <></> :
                                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <img src={BtnFilter} style={{ cursor: 'pointer' }} onClick={() => handleButtonFilter()} />
                                    <Gap width={20} />
                                    <img src={BtnExportData} style={{ cursor: 'pointer' }} onClick={() => handleButtonExport()} />
                                </div>}
                        </div>

                        {Loading ?
                            <div className="loader-container">
                                <div className="spinner-border purple-spinner" />
                            </div>
                            // <Skeleton />
                            :
                            <div>
                                <table className='table-content'>
                                    <tr className='table-content-tr'>
                                        <td className='table-content-td-header'>No</td>
                                        <td className='table-content-td-header'>Order No</td>
                                        <td className='table-content-td-header'>Name</td>
                                        <td className='table-content-td-header'>Product</td>
                                        <td className='table-content-td-header'>Quantity</td>
                                        <td className='table-content-td-header'>Nominal</td>
                                        <td className='table-content-td-header'>Date</td>
                                    </tr>
                                    {ListRedemptionReport.map((item, index) => {
                                        return <tr className='table-content-tr'>
                                            <td className='table-content-td'>{index + 1}</td>
                                            <td className='table-content-td'>{item.orderNo}</td>
                                            <td className='table-content-td'>{datakosong(item.fullName)}</td>
                                            <td className='table-content-td'>{datakosong(item.productName)}</td>
                                            <td className='table-content-td'>{item.qty}</td>
                                            <td className='table-content-td'>{FormatNumberComma(item.nominal)}</td>
                                            <td className='table-content-td'>{formatDate(item.transactionDate)}</td>
                                        </tr>
                                    })}
                                </table>
                            </div>}
                        {Loading ?
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <SkeletonListData width={200} height={30} />
                            </div>
                            :
                            <div
                                style={{
                                    display: 'flex',
                                    paddingTop: '20px',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            > Total Data: {TotalRedemptionCount}
                            </div>
                        }
                    </div>
                </div>

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
                    showRedemptionReport={true}
                    showDateFilter={true}
                    showSearchFilter={true}
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
                    showDateFilter={false}
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
                        history.replace("/redemption-report")
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

export default RedemptionReport