import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Gap, HeaderPage, ModalExport, ModalFilter, SkeletonListData } from '../../components'
import { useDispatch } from 'react-redux';
import { setForm } from '../../redux';
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import './dashboard.css';
import { IcLineBU, IcOpenNewTab } from '../../assets';
import { generateSignature, fetchStatus, FormatNumberComma } from '../../utils/functions';
import { AlertMessage, paths } from '../../utils'
import Skeleton from '../../components/atoms/SkeletonListData';

const Dashboard = () => {
    const history = useHistory();
    const [OrderBy, setOrderBy] = useState("")
    const [Order, setOrder] = useState("DESC")
    const [Loading, setLoading] = useState(false)

    const location = useLocation();
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
                return PartnerCode;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    const SessionPartnerCode = getCookie("partnercode");

    const [PageActive, setPageActive] = useState(1)

    const [ShowAlert, setShowAlert] = useState(true)
    const [SessionMessage, setSessionMessage] = useState("")
    const [SuccessMessage, setSuccessMessage] = useState("")
    const [ErrorMessageAlert, setErrorMessageAlert] = useState("")
    const [ErrorMessageAlertLogout, setErrorMessageAlertLogout] = useState("")

    const [UserID, setUserID] = useState("")
    const [Nama, setNama] = useState("")

    const [TotalLogin, setTotalLogin] = useState(0)
    const [TotalRegister, setTotalRegister] = useState(0)

    const [currentTime, setCurrentTime] = useState(new Date());

    const [Search, setSearch] = useState("")

    const [ShowModalFilter, setShowModalFilter] = useState(false)
    const [ShowModalExport, setShowModalExport] = useState(false)

    const [FilterBy, setFilterBy] = useState("")
    const [SearchFilter, setSearchFilter] = useState("")
    const [StartDate, setStartDate] = useState("")
    const [EndDate, setEndDate] = useState("")

    const [TotalPoin, setTotalPoin] = useState("")
    const [ListActiveUser, setListActiveUser] = useState([])
    const [ListRedemptionReport, setListRedemptionReport] = useState([])
    const [TotalRegisteredUsers, setTotalRegisteredUsers] = useState(0)
    const [TotalRedemptionReport, setTotalRedemptionReport] = useState(0)
    const [PartnerCodes, setPartnerCodes] = useState(SessionPartnerCode || "")
    const [ListPartner, setListPartner] = useState([])


    useEffect(() => {
        if (location.state == null) {
            setSuccessMessage("");
        } else {
            setSuccessMessage(location.state.Message);
            setShowAlert(true);
        }

        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");
        var CookieNama = getCookie("nama");
        var CookiePartnerCode = getCookie("partnercode");
        console.log(CookiePartnerCode)

        if (CookieParamKey == null || CookieParamKey == "" ||
            CookieUserID == null || CookieUserID == "") {
            logout()
            window.location.href = "/login";
            return false;
        } else {
            dispatch(setForm("ParamKey", CookieParamKey))
            dispatch(setForm("UserID", CookieUserID))
            dispatch(setForm("Nama", CookieNama))
            dispatch(setForm("PageActive", "DASHBOARD"))
            setUserID(CookieUserID)
        }
    }, [OrderBy, Order, PageActive, PartnerCodes])

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
                } else if (error.message != 401) {
                    setErrorMessageAlert(AlertMessage.failedConnect);
                    setShowAlert(true);
                    return false;
                }
            });
    }

    const handleButtonFilter = () => {
        setShowModalFilter(!ShowModalFilter)
    }

    const handleResetFilter = () => {
        setFilterBy("")
        setSearchFilter("")
        setStartDate("")
        setEndDate("")
    }

    const handleSubmitFilter = () => {
        setShowModalFilter(false)
    }

    const handleButtonExport = () => {
        setShowModalExport(false)
    }

    const handleSubmitExport = () => {
        setShowModalExport(false)
    }

    const GoToMenu = (GoTo) => {
        const PartnerCodeCarrier = {
            selectedPartner: PartnerCodes,
            selectedNama: Nama
        }

        if (GoTo == "depositDetails") {
            history.push("deposit-details", PartnerCodeCarrier)
        } else if (GoTo == "registeredUser") {
            history.push("registered-users", PartnerCodeCarrier)
        } else if (GoTo == "activeUser") {
            history.push("active-users", PartnerCodeCarrier)
        } else if (GoTo == "redemptionReport") {
            history.push("redemption-report", PartnerCodeCarrier)
        }
    }

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
                    list={ListPartner}
                    partnerCode={SessionPartnerCode}
                    setNama={setNama}
                    currentTime={getFormattedDateTime(currentTime)}
                    search={Search}
                    setSearch={event => setSearch(event.target.value)}
                />

                {/* <div className='container-main-content'>
                    <div className='card-content-dashboard'>
                        <div>
                            <div className='card-content-1'>
                                {Loading ?
                                    <>
                                        <SkeletonListData width={250} height={40} />
                                        <Gap height={62} />
                                    </>
                                    :
                                    <div className='card-content-text-lg-black' style={{ fontSize: 40 }}> {FormatNumberComma(TotalPoin.EndingBalance) + ' IDR'}</div>}
                                <Gap width={10} />
                                <img src={IcLineBU} className='img-fluid' />
                                <Gap width={10} />
                                <div className='card-content-text-sm-grey'>Balance</div>
                                <Gap width={10} />
                                <img src={IcOpenNewTab} style={{ cursor: 'pointer' }} className='img-fluid' onClick={() => GoToMenu("depositDetails")} />
                            </div>
                            <div className='card-content-2'>
                                {Loading ?
                                    <SkeletonListData width={120} />
                                    :
                                    <div className='card-content-text-sm-black' style={{ paddingLeft: '4px' }}>{FormatNumberComma(TotalPoin.TotalPoint)}</div>
                                }
                                <Gap width={10} />
                                <div className='card-content-text-sm-grey'>Point Generated</div>
                            </div>
                        </div>
                    </div>

                    <Gap width={50} />

                    <div className='card-content-dashboard'>
                        <div className='card-content-1'>
                            {Loading ?
                                <Skeleton />
                                :
                                <div className='card-content-text-sm-black'>{TotalRegisteredUsers}</div>}
                            <Gap width={10} />
                            <img src={IcLineBU} className='img-fluid' />
                            <Gap width={10} />
                            <div className='card-content-text-sm-grey'>Registered Users</div>
                            <Gap width={10} />
                            <img src={IcOpenNewTab} style={{ cursor: 'pointer' }} className='img-fluid' onClick={() => GoToMenu("registeredUser")} />
                        </div>
                    </div>
                </div> */}

                {/* <div className='container-main-content'>
                    <div className='card-content-dashboard'>
                        <div className='card-content-1'>
                            {Loading ?
                                <Skeleton />
                                :
                                <div className='card-content-text-sm-black'>{TotalLogin}</div>}
                            <Gap width={10} />
                            <img src={IcLineBU} className='img-fluid' />
                            <Gap width={10} />
                            <div className='card-content-text-sm-grey'>Active Users</div>
                            <Gap width={10} />
                            <img src={IcOpenNewTab} style={{ cursor: 'pointer' }} className='img-fluid' onClick={() => GoToMenu("activeUser")} />
                        </div>
                    </div>
                    <Gap width={50} />
                    <div className='card-content-dashboard'>
                        <div className='card-content-1'>
                            {Loading ?
                                <Skeleton />
                                :
                                <div className='card-content-text-sm-black'>{TotalRedemptionReport}</div>}
                            <Gap width={10} />
                            <img src={IcLineBU} className='img-fluid' />
                            <Gap width={10} />
                            <div className='card-content-text-sm-grey'>Redemption Report</div>
                            <Gap width={10} />
                            <img src={IcOpenNewTab} style={{ cursor: 'pointer' }} className='img-fluid' onClick={() => GoToMenu("redemptionReport")} />
                        </div>
                    </div>
                </div> */}

                {/* <div className='container-content-table'>
                    <div className='container-table'>
                        <div className='container-content-table-header'>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <div className='card-content-text-sm-black'>Active Users</div>
                                <Gap width={10} />
                                <img src={IcOpenNewTab} style={{ cursor: 'pointer' }} className='img-fluid' onClick={() => GoToMenu("activeUser")} />
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
                                        <td className='table-content-td-header'>No.</td>
                                        <td className='table-content-td-header'>Name</td>
                                        <td className='table-content-td-header'>Total Redeem</td>
                                        <td className='table-content-td-header'>Total Nominal</td>
                                    </tr>
                                    {ListActiveUser.map((item, index) => {
                                        return <tr className='table-content-tr'>
                                            <td className='table-content-td'>{index + 1}</td>
                                            <td className='table-content-td'>{datakosong(item.fullName)}</td>
                                            <td className='table-content-td'>{item.totaRedeem}</td>
                                            <td className='table-content-td'>{FormatNumberComma(item.trxAmt)}</td>
                                        </tr>
                                    })}
                                </table>
                            </div>}
                    </div>
                </div> */}

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
                />

                <ModalExport
                    onClickShowModal={ShowModalExport}
                    onClickCancel={() => handleButtonExport()}
                    onClickSubmit={() => handleSubmitExport()}
                    startDate={StartDate}
                    setStartDate={event => setStartDate(event.target.value)}
                    endDate={EndDate}
                    setEndDate={event => setEndDate(event.target.value)}
                    submitExport={handleSubmitExport}
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
                        history.replace("/dashboard")
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


export default Dashboard