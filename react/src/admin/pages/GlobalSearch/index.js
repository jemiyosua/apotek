import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Gap, HeaderPage, ModalExport, ModalFilter, Pagination } from '../../components'
import { useDispatch } from 'react-redux';
import { setForm } from '../../redux';
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import './globalsearch.css';
import { BtnExportData, BtnFilter, icRedKYC, icGreenKYC } from '../../assets';
import { generateSignature, FormatNumberComma, formatDate, fetchStatus} from '../../utils/functions';
import { AlertMessage, paths } from '../../utils'
import Skeleton from '../../components/atoms/SkeletonListData';

const GlobalSearch = () => {
    const history = useHistory();
    const [OrderBy,setOrderBy] = useState("")
    const [Order,setOrder] = useState("DESC")
    const [Loading,setLoading] = useState(false)

    const location = useLocation();
    const dispatch = useDispatch();
    const [cookies, setCookie,removeCookie] = useCookies(['user']);
    const [PageActive,setPageActive] = useState(1)

    const [ShowAlert, setShowAlert] = useState(true)
    const [SessionMessage, setSessionMessage] = useState("")
    const [SuccessMessage, setSuccessMessage] = useState("")
    const [ErrorMessageAlert, setErrorMessageAlert] = useState("")
    const [ErrorMessageAlertLogout, setErrorMessageAlertLogout] = useState("")

    const [UserID, setUserID] = useState("")
    const [Nama, setNama] = useState("")

    const [CurrentTime, setCurrentTime] = useState(new Date());

    const[Search, setSearch] = useState("")

    const totalItems = 1000;
    const itemsPerPage = 10;

    const[ShowModalFilter, setShowModalFilter] = useState(false)
    const[ShowModalExport, setShowModalExport] = useState(false)

    const[FilterBy, setFilterBy] = useState("")
    const[SearchFilter, setSearchFilter] = useState("")
    const[StartDate, setStartDate] = useState("")
    const[EndDate, setEndDate] = useState("")
    const [CurrentPage, setCurrentPage] = useState(1)
    const [TotalPage, setTotalPage] = useState(0)

    const [ListSearch, setListSearch] = useState([])
    const [TotalRegisteredUsers, setTotalRegisteredUsers] = useState(0)
    const [KeywordResult, setKeywordResult] = useState("")


    useEffect(()=>{
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
        
        if(CookieParamKey==null || CookieParamKey=="" ||
         CookieUserID==null || CookieUserID==""){
            logout()
            window.location.href="/login";
            return false;
        }else{
            const params = new URLSearchParams(location.search)
            const globalQuery = params.get('q')|| "";
            dispatch(setForm("ParamKey",CookieParamKey))
            dispatch(setForm("UserID",CookieUserID))
            dispatch(setForm("Nama",CookieNama))
            dispatch(setForm("PageActive",""))
            setUserID(CookieUserID)
            setSearchFilter(globalQuery)
            setSearch(globalQuery)
            getListSearch()
        }

        const timerId = setInterval(() => {
            setCurrentTime(new Date()); // Update the state with a new Date object
        }, 1000); // Update every second

        return () => {
            clearInterval(timerId);
        };

    },[OrderBy,Order,PageActive, location.search])

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
    
    const logout = ()=>{
        removeCookie('varCookie', { path: '/'});
        removeCookie('varMerchantId', { path: '/'});
        removeCookie('varIdVoucher', { path: '/'});
        dispatch(setForm("ParamKey",''))
        dispatch(setForm("UserID",''))
        dispatch(setForm("Nama",''))
        dispatch(setForm("Role",''))
        dispatch(setForm("PartnerCode", ""));
        if(window){
            sessionStorage.clear();
          }
    }

    const getListSearch = () => {
        
        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");
        var CookiePartnerCode = getCookie("partnercode")

        const params = new URLSearchParams(location.search);
        const katakunci = params.get("q") || "";

        setKeywordResult(katakunci);

        var requestBody = JSON.stringify({
            "UserID": CookieUserID,
            "ParamKey": CookieParamKey,
            "PartnerCode" : CookiePartnerCode,
            "Search": katakunci
        });

        var enckey = paths.EncKey;
        var url = paths.URL_API_ADMIN_BU + 'ListSearch';
        var Signature  = generateSignature(enckey,requestBody)

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
            setListSearch(data.Result)
            if (data.ErrorMessage === "Param Key Expired"){
                    setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                    setShowAlert(true);
                    return 
            }
        })
        .catch((error) => {
            setLoading(false)
            if (error.message == 401) {
                setErrorMessageAlert("Maaf anda tidak memiliki ijin untuk mengakses halaman ini.");
                setShowAlert(true);
                return false;
            } else if (error.message != 401) {
                setErrorMessageAlert(AlertMessage.failedConnect);
                setShowAlert(true);
                return false;
            }
        }); 
    }

    const getCookie = (tipe) => {
        var SecretCookie = cookies.varCookie;
        if (SecretCookie != "" && SecretCookie != null && typeof SecretCookie=="string") {
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

    
    const handleButtonFilter = () => {
        setShowModalFilter(!ShowModalFilter)
    }
    
    const handleResetFilter = () => {
        // getListRegisteredUser(1, "reset-filter")
        setShowModalFilter(false)
    }
    
    const handleSubmitFilter = () => {
        if  (FilterBy === "" || SearchFilter === "") {
            setErrorMessageAlert("Harap mengisi kedua kolom dengan benar.")
            setShowAlert(true)
            return false
        }
        setShowModalFilter(false)
        // getListRegisteredUser(1, "")
    }
    
    const handleButtonExport = () => {
        // getListRegisteredUser(1, "export")
        setShowModalExport(false)
    }
    
    const handleSubmitExport = () => {
        setShowModalExport(false)
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
        if (strip == ""){
            return "-"
        }
        return strip
    }

    const statusKYC = (status) => {
        if (status == 0) {
            return <><img src={icRedKYC} className='img-fluid' /><span> Incompleted</span></>
        }
        return <><img src={icGreenKYC} /><span> Completed</span></>;
    }

    return (
        <div className='main-page'>
            <div style={{ width:'100%' }}>
                <HeaderPage
                    nama={Nama}
                    currentTime={getFormattedDateTime(CurrentTime)}
                    search={Search}
                    setSearch={event => setSearch(event.target.value)}
                />

                <div className='container-content-table'>
                    <div className='container-table2'>
                        <div className='container-content-table-header'>
                            <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center' }}>
                                <div className='card-content-text-sm-black2'>Searched for {KeywordResult} in All</div>
                            </div>
                            <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center' }}>
                            </div>
                        </div>
                        {Loading ?
                        <div className="loader-container">
                            <div className="spinner-border purple-spinner" />
                        </div>
                        : (
                            <>
                            {ListSearch.every(item => item.Data.length === 0) ? (
                                <div className='card-container2' style={{ display:'flex', justifyContent:'center', alignItems:'center', padding: '300px' }}>
                                    <h3>Sorry, no result found</h3>
                                </div>
                            ) : (
                                <div>
                            {ListSearch.map((item,index) => {
                                 return <>
                                 {item.Page == "Active User" && item.Data.length > 0 ?
                                 <><div className='card-container2'>
                                        <h2 style={{ paddingLeft: '10px' }}>{item.Page}</h2>
                                        <table className='table-content'>
                                            <tr className='table-content-tr'>
                                                <td className='table-content-td-header'>No</td>
                                                <td className='table-content-td-header'>Nama</td>
                                                <td className='table-content-td-header'>Total Reedem</td>
                                                <td className='table-content-td-header'>Total Nominal</td>
                                            </tr>
                                            {item.Data.map((itemListData, indexData) => {
                                                return <tr className='table-content-tr'>
                                                    <td className='table-content-td'>{indexData + 1}</td>
                                                    <td className='table-content-td'>{datakosong(itemListData.FullName)}</td>
                                                    <td className='table-content-td'>{itemListData.TotalRedeem}</td>
                                                    <td className='table-content-td'>{FormatNumberComma(itemListData.TrxAmount)}</td>
                                                </tr>;
                                            })}
                                        </table>
                                    </div><Gap height={40} /></>

                                : item.Page == "Redemption Report" && item.Data.length > 0 ? 
                                <><div className='card-container2'>
                                     <h2 style={{paddingLeft:'10px'}}>{item.Page}</h2>
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
                                         {item.Data.map((itemListData, indexData) => {
                                             return <tr className='table-content-tr'>
                                                <td className='table-content-td'>{indexData + 1}</td>
                                                <td className='table-content-td'>{itemListData.OrderNo}</td>
                                                <td className='table-content-td'>{datakosong(itemListData.FullName)}</td>
                                                <td className='table-content-td'>{datakosong(itemListData.ProductName)}</td>
                                                <td className='table-content-td'>{itemListData.Qty}</td>
                                                <td className='table-content-td'>{FormatNumberComma(itemListData.Nominal)}</td>
                                                <td className='table-content-td'>{formatDate(itemListData.TransactionDate)}</td>
                                             </tr>;
                                         })}
                                     </table>
                                </div><Gap height={40} /></>

                                : item.Page == "Registered User" && item.Data.length > 0 ?
                                <><div className='card-container2'>
                                     <h2 style={{paddingLeft:'10px'}}>{item.Page}</h2>
                                     <table className='table-content'>
                                         <tr className='table-content-tr'>
                                            <td className='table-content-td-header'>No</td>
                                            <td className='table-content-td-header'>eKTP</td>
                                            <td className='table-content-td-header'>Name</td>
                                            <td className='table-content-td-header'>Phone</td>
                                            <td className='table-content-td-header'>Email</td>
                                            <td className='table-content-td-header'>KYC Status</td>
                                         </tr>
                                         {item.Data.map((itemListData, indexData) => {
                                             return <tr className='table-content-tr'>
                                                <td className='table-content-td'>{indexData + 1}</td>
                                                <td className='table-content-td'>{itemListData.NIK}</td>
                                                <td className='table-content-td'>{itemListData.FullName}</td>
                                                <td className='table-content-td'>{itemListData.MobileNumber}</td>
                                                <td className='table-content-td'>{itemListData.Email}</td>
                                                <td className='table-content-td'>{statusKYC(itemListData.KYCStatus)}</td>
                                             </tr>;
                                         })}
                                     </table>
                                </div><Gap height={40} /></>

                                : item.Page == "Point Statement" && item.Data.length > 0 ?
                                <><div className='card-container2'>
                                     <h2 style={{paddingLeft:'10px'}}>{item.Page}</h2>
                                     <table className='table-content'>
                                         <tr className='table-content-tr'>
                                            <td className='table-content-td-header'>No</td>
                                            <td className='table-content-td-header'>Transaction ID</td>
                                            <td className='table-content-td-header'>Request ID</td>
                                            <td className='table-content-td-header'>Transaction Date</td>
                                            <td className='table-content-td-header'>Points Mutation</td>
                                            <td className='table-content-td-header'>Balance</td>
                                         </tr>
                                         {item.Data.map((itemListData, indexData) => {
                                             return <tr className='table-content-tr'>
                                                <td className='table-content-td'>{indexData + 1}</td>
                                                <td className='table-content-td'>{itemListData.TransactionId}</td>
                                                <td className='table-content-td'>{itemListData.TransactionReferenceNumber}</td>
                                                <td className='table-content-td'>{formatDate(itemListData.TransactionDate)}</td>
                                                <td className='table-content-td'>{FormatNumberComma(itemListData.PointsMutation)}</td>
                                                <td className='table-content-td'>{FormatNumberComma(itemListData.Balance)}</td>
                                             </tr>;
                                         })}
                                     </table>
                                </div><Gap height={40} /></>
                                :<></>
                                }
                                </>
                            })}
                        </div>
                            )}</>
                        )}
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
                    showDateFilter={false}
                    showStatusFilter={false}
                    showSearchFilter={true}
                    showOther={false}
                    showName={true}
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

                {/* <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    initialPage={1}
                    currentPage={CurrentPage}
                    handlePageChange={handlePageChange}
                    displayedPageNumbers={displayedPageNumbers}
                    totalPages={TotalPage}
                /> */}

            </div>

            {/* ALERT */}
            {SessionMessage != "" ?
            <SweetAlert 
                warning 
                show={ShowAlert}
                onConfirm={() => {
                    setShowAlert(false)
                    logout()
                    window.location.href="/login";
                }}
                btnSize="sm">
                {SessionMessage}
            </SweetAlert>
            :""}

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
            :""}          

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
            :""}

            {ErrorMessageAlertLogout != "" ?
            <SweetAlert 
                danger 
                show={ShowAlert}
                onConfirm={() => {
                    setShowAlert(false)
                    setErrorMessageAlertLogout("")
                    window.location.href="/login";
                }}
                btnSize="sm">
                {ErrorMessageAlertLogout}
            </SweetAlert>
            :""}
            {/* END OF ALERT */}

            <Gap height={20} />                 
        </div>
    )
}


export default GlobalSearch