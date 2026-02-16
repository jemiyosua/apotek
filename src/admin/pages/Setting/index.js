import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Gap, HeaderPage, Switch } from '../../components'
import { useDispatch } from 'react-redux';
import { setForm } from '../../redux';
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import './setting.css';
import { generateSignature, fetchStatus } from '../../utils/functions';
import { AlertMessage, paths } from '../../utils'
import { Form } from 'react-bootstrap';

const Setting = () => {
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
    const [ErrorMessageAlert, setErrorMessageAlert] = useState("")
    const [ErrorMessageAlertLogout, setErrorMessageAlertLogout] = useState("")

    const [UserID, setUserID] = useState("")
    const [Nama, setNama] = useState("")

    const [TotalLogin, setTotalLogin] = useState("")
    const [TotalRegister, setTotalRegister] = useState("")
    const [TotalRedeem, setTotalRedeem] = useState("")
    const [TotalScan, setTotalScan] = useState("")
    const [TotalExchange, setTotalExchange] = useState("")

    const [CurrentTime, setCurrentTime] = useState(new Date());

    const [Search, setSearch] = useState("")

    const [PointStatementIsChecked, setPointStatementIsChecked] = useState(false);
    const [ActiveUsersReportIsChecked, setActiveUsersReportIsChecked] = useState(false);

    const [ListSetting, setListSetting] = useState([])
    const [EmailForExport, setEmailForExport] = useState("")

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
        setNama(CookieNama)

        if (CookieParamKey == null || CookieParamKey == "" ||
            CookieUserID == null || CookieUserID == "") {
            logout()
            window.location.href = "/login";
            return false;
        } else {
            dispatch(setForm("ParamKey", CookieParamKey))
            dispatch(setForm("UserID", CookieUserID))
            dispatch(setForm("Nama", CookieNama))
            dispatch(setForm("PageActive", "SETTING"))
            setUserID(CookieUserID)
        }

        getListMenuConfig()
        getListRedemptionReport()

        const timerId = setInterval(() => {
            setCurrentTime(new Date()); // Update the state with a new Date object
        }, 1000); // Update every second

        return () => {
            clearInterval(timerId);
        };

    }, [])

    // useEffect(() => {
    //     console.log("poin statement change")
    //     console.log("PointStatementIsChecked : ", PointStatementIsChecked)
    // },[PointStatementIsChecked])

    // useEffect(() => {
    //     console.log("active users report change")
    //     console.log("ActiveUsersReportIsChecked : ", ActiveUsersReportIsChecked)
    // },[ActiveUsersReportIsChecked])

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

    const getListMenuConfig = () => {
        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");
        var CookiePartnerCode = getCookie("partnercode")

        var requestBody = JSON.stringify({
            "UserID": CookieUserID,
            "ParamKey": CookieParamKey,
            "PartnerCode": CookiePartnerCode,
            "NotifyPointStatementTo": EmailForExport,
            "NotifyActiveUserTo": EmailForExport
        });

        var url = paths.URL_API_ADMIN_BU + 'GetConfig';
        var Signature = generateSignature(paths.EncKey, requestBody)

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
                    setListSetting(data.Result)
                    if (data.TotalRecords < 1) {
                        // setResultMessage("Data tidak ditemukan")
                    }
                } else {
                    if (data.ErrorMessage == "Param Key Expired") {
                        logout()
                        // setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                        // setShowAlert(true);
                    }
                }
            })
            .catch((error) => {
                if (error.message == 401) {
                    logout()
                    setErrorMessageAlertLogout("Sesi berakhir, silakan login ulang.");
                    setShowAlert(true);
                } else if (error.message != 401) {
                    setErrorMessageAlert(AlertMessage.failedConnect);
                    setShowAlert(true);
                }
            });
    }

    const updateStatusConfig = (key, status, emailKey = null, emailValue = null) => {
        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");
        var CookiePartnerCode = getCookie("partnercode")

        let payload = {
            "UserID": CookieUserID,
            "ParamKey": CookieParamKey,
            "PartnerCode": CookiePartnerCode,
            [key]: status
        }

        if (emailKey && emailValue !== null) {
            payload[emailKey] = emailValue
        }

        var requestBody = JSON.stringify(payload)

        var url = paths.URL_API_ADMIN_BU + 'UpdateConfig';
        var Signature = generateSignature(paths.EncKey, requestBody)

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
                // console.log("response : ", JSON.stringify(data))
                if (data.ErrorCode == "0") {
                    // console.log("berhasil update")
                } else {
                    if (data.ErrorMessage == "Param Key Expired") {
                        setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                        setShowAlert(true);
                        return
                    }
                }
            })
            .catch((error) => {
                if (error.message == 401) {
                    logout()
                    setErrorMessageAlertLogout("Sesi berakhir, silakan login ulang.");
                    setShowAlert(true);
                } else if (error.message != 401) {
                    setErrorMessageAlert(AlertMessage.failedConnect);
                    setShowAlert(true);
                }
            });
    }

    const getListRedemptionReport = () => {
        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");
        var CookiePartnerCode = getCookie("partnercode")

        var requestBody = JSON.stringify({
            "UserID": CookieUserID,
            "ParamKey": CookieParamKey,
            "PartnerCode": CookiePartnerCode
        });

        var url = paths.URL_API_ADMIN_BU + 'ListRedemptionReport';
        var Signature = generateSignature(paths.EncKey, requestBody)

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
                    setEmailForExport(data.Email)
                    if (data.TotalRecords < 1) {
                    }
                } else {
                    if (data.ErrorMessage == "Param Key Expired") {
                        logout()
                        // setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                        // setShowAlert(true);
                    }
                }
            })
            .catch((error) => {
                if (error.message == 401) {
                    logout()
                    setErrorMessageAlertLogout("Sesi berakhir, silakan login ulang.");
                    setShowAlert(true);
                } else if (error.message != 401) {
                    setErrorMessageAlert(AlertMessage.failedConnect);
                    setShowAlert(true);
                }
            });
    }

    const handleChangeValue = (targetKey, currentValue) => {
        const newStatus = currentValue == "true" ? false : true

        setListSetting(prev =>
            prev.map(item =>
                item.key === targetKey ? { ...item, value: String(newStatus) } : item
            )
        )

        const keyMap = {
            notify_point_statement: "NotifyPointStatement",
            notify_active_user: "NotifyActiveUser",
        }

        const keyEmailMap = {
            "notify_point_statement": "NotifyPointStatementTo",
            "notify_active_user": "NotifyActiveUserTo"
        }

        const backKey = keyMap[targetKey]
        const backKeyEmail = keyEmailMap[targetKey]
        if (!backKey) return

        updateStatusConfig(backKey, newStatus, backKeyEmail, EmailForExport)
    }

    return (
        <div className='main-page'>
            <div style={{ width: '100%' }}>
                <HeaderPage
                    nama={Nama}
                    currentTime={getFormattedDateTime(CurrentTime)}
                    search={Search}
                    setSearch={event => setSearch(event.target.value)}
                />

                <div className='container-title-page'>
                    <div className='text-title-page'>Send Weekly Notification to Email</div>
                </div>

                <div className='container-main-content-settings'>

                    {ListSetting.map((item, index) => {
                        return <>
                            {item.dataType == "bool" ?
                                <div className={item.value == "false" ? 'card-content' : 'card-content-active'}>
                                    <div>
                                        <div className='card-content-1'>
                                            <div>{item.key == "notify_point_statement" ? "Notify Point Statement" : item.key == "notify_active_user" ? "Notify Active User" :
                                                ""}
                                            </div>
                                            <Gap width={10} />
                                            <Form>
                                                <Form.Check
                                                    type="switch"
                                                    id={item.key}
                                                    checked={item.value === "true"}
                                                    onChange={() => handleChangeValue(item.key, item.value)}
                                                />
                                            </Form>
                                            <Gap width={10} />
                                        </div>
                                    </div>
                                </div>
                                : <></>}
                            <Gap width={50} />
                        </>
                    })}
                </div>
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

export default Setting