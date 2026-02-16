import { faArrowAltCircleLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SHA256 } from 'crypto-js';
import { Markup } from 'interweave';
import md5 from 'md5';
import React, { useEffect, useState } from 'react';
import { CardDeck } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import Card from 'react-bootstrap/Card';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Gap, Input } from '../../../components';
import { setForm } from '../../../redux';
import { AlertMessage, paths } from '../../../utils';
import { fetchStatus, generateSignature } from '../../../utils/functions';

const EditUserLogin = () => {
    const history = useHistory();
    const [IDMenu,setIDMenu] = useState("")
    const [NamaMenu,setNamaMenu] = useState("")
    const [OldNamaMenu,setOldNamaMenu] = useState("")
    const [Note,setNote] = useState("")
    const [OldNote,setOldNote] = useState("")

    const [UserID,setUserID] = useState("")
    const [ParamKey,setParamKey] = useState("")
    const [StatusAktif,setStatusAktif] = useState("")
    const [ListSource,setListSource] = useState("")
    const [IsLoading,setIsLoading] = useState(false)
    const [IsLoading2,setIsLoading2] = useState(false)
    // const location = useLocation();
    const {form}=useSelector(state=>state.LoginReducer);
    const [cookies, setCookie,removeCookie] = useCookies(['user']);
    const dispatch = useDispatch();

    const [ShowAlert, setShowAlert] = useState(true)
    const [SessionMessage, setSessionMessage] = useState("")
    const [ValidationMessage, setValidationMessage] = useState("")
    const [ErrorMessageAlert, setErrorMessageAlert] = useState("")
    const [ErrorMessageAlertLogout, setErrorMessageAlertLogout] = useState("")
    const [ConfirmUpdateMessage, setConfirmUpdateMessage] = useState(false)

    useEffect(()=>{

        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");

        if(CookieParamKey==null || CookieParamKey=="" ||
            CookieUserID==null || CookieUserID==""){
            logout()
            setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
            setShowAlert(true);
            return false;
        // }else if(CookieFlagBU!="0"){
        //     history.push('/list-voucher');
        //     return false;
        }else{
            setUserID(CookieUserID)
            setParamKey(CookieParamKey)
            setIDMenu(form.Detail.IDMenu)
            setNamaMenu(form.Detail.Menu)
            setOldNamaMenu(form.Detail.Menu)
            setNote(form.Detail.Note)
            setOldNote(form.Detail.Note)
        }
    },[])

    const logout = ()=>{
        removeCookie('varCookie', { path: '/'});
        removeCookie('CookieProductName', { path: '/'});
        removeCookie('CookieSourceCode', { path: '/'});
        dispatch(setForm("ParamKey",''))
        dispatch(setForm("UserID",''))
        // history.push('/login')
        // window.location.href='/login';
        if(window){
            sessionStorage.clear();
          }
    }

    const getCookie = (tipe) => {
        var SecretCookie = cookies.varCookie;
        if (SecretCookie != "" && SecretCookie != null && typeof SecretCookie=="string") {
            var LongSecretCookie = SecretCookie.split("|");
            var UserID = LongSecretCookie[0];
            var ParamKeyArray = LongSecretCookie[1];
            var ParamKey = ParamKeyArray.substring(0, ParamKeyArray.length)
        
            if (tipe == "userid") {
                return UserID;            
            } else if (tipe == "paramkey") {
                return ParamKey;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    const simpanData = () => {

        let validasiMessage = "";
        if(NamaMenu == ""){
            validasiMessage = validasiMessage + "- Silahkan isi Nama Menu terlebih dahulu.\n";
        }
        if(Note == ""){
            validasiMessage = validasiMessage + "- Silahkan isi Note terlebih dahulu.\n";
        }
        
        if(validasiMessage!=""){
            setValidationMessage(validasiMessage);
            setShowAlert(true)
            return false;
        }else{
            if (NamaMenu == OldNamaMenu) {
                var vNamaMenu = "-";
            } else {
                var vNamaMenu = NamaMenu;
            }

            if (Note == OldNote) {
                var vNote = "-";
            } else {
                var vNote = Note;
            }

            if (vNamaMenu == "-" && vNote == "-") {
                setConfirmUpdateMessage(true)
            } else {
                var requestBody = JSON.stringify({
                    "UserID": UserID,
                    "ParamKey": ParamKey,
                    "Method":"UPDATE",
                    "IDMenu":IDMenu,
                    "Menu":vNamaMenu,
                    "Note":vNote
                });
                
                // var enckey = paths.EncKey;
                var enckey = ParamKey;
                // var url = paths.URL_API_ADMIN+'users';
                var url = paths.URL_API_ADMIN+'menu';
                var Signature  = generateSignature(enckey,requestBody)
                
                setIsLoading2(true)
                fetch( url, {
                    method: "POST",
                    // mode: 'no-cors',
                    body: requestBody,
                    headers: {
                        'Content-Type': 'application/json',
                        'Signature': Signature
                    },
                })
                .then(fetchStatus)
                .then(response => response.json())
                .then((data) => {
                    // var errmsg = data.errmsg;
                    setIsLoading2(false)
                    
                    if(data.ErrorCode=="0"){
                        history.push({
                            pathname: '/list-menu',
                            state: { Message : "Berhasil Update Data" }
                          })
                    }else{
                        if(data.ErrorMessage=="Param Key Exipred"){
                            logout()
                            setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                            setShowAlert(true);
                        }else{
                            // setErrorMessageAlert(data.ErrorMessage);
                            setErrorMessageAlert("Gagal mengubah data");
                            setShowAlert(true);
                        }
                    }
                })
                .catch((error) => {
                    setIsLoading2(false)
                    
                    if (error.message == 401) {
                        logout()
                        setErrorMessageAlertLogout("Maaf anda tidak memiliki ijin untuk mengakses halaman ini.");
                        setShowAlert(true);
                    } else if (error.message != 401) {
                        setErrorMessageAlert(AlertMessage.failedConnect);
                        setShowAlert(true);
                    }
                });
            }
        }
    }

    return (
        <div className="main-page">
           
            <div className="content-wrapper-2">
            <div className="blog-post">
                {/* <Link title="Kembali" onClick={()=>history.push('/')}/> */}
                <p className="title"><a href="/list-menu"><FontAwesomeIcon icon={faArrowAltCircleLeft}/></a> Edit List Menu</p>

                {/* ALERT */}
                {SessionMessage != "" ?
                <SweetAlert 
                    warning 
                    show={ShowAlert}
                    onConfirm={() => {
                        setShowAlert(false)
                        setSessionMessage("")
                        window.location.href="admin/login";
                    }}
                    btnSize="sm">
                    {SessionMessage}
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
                        window.location.href="admin/login";
                    }}
                    btnSize="sm">
                    {ErrorMessageAlertLogout}
                </SweetAlert>
                :""}
                {/* END OF ALERT */}

                <hr style={{backgroundColor: 'black'}} />
                
                <CardDeck>
                    <Card style={{border:'none'}}>
                        <Input 
                            required
                            label="Nama Menu" 
                            value={NamaMenu} 
                            onChange={event=>setNamaMenu(event.target.value)}
                        />
                    </Card>
                    <Card style={{border:'none'}}>
                        <Input 
                            required
                            label="Note" 
                            value={Note} 
                            onChange={event=>setNote(event.target.value)}
                        />
                    </Card>
                </CardDeck>
                
                <Gap height={20}/>
                <div className="button-action">
                    <Button spinner={IsLoading2} onClick={()=>simpanData()}><FontAwesomeIcon icon={faCheckCircle}/> SIMPAN</Button>
                </div>

                {ConfirmUpdateMessage == true ?
                <SweetAlert
                    info
                    showCancel
                    confirmBtnText="Yes"
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="info"
                    onConfirm={()=>{
                        window.location.href="admin/list-menu";
                        setShowAlert(false)
                        setConfirmUpdateMessage(false)
                    }}
                    onCancel={() => {
                        setShowAlert(false)
                        setConfirmUpdateMessage(false)
                    }}
                    focusCancelBtn
                    btnSize="sm"
                >
                {"Apakah Anda Yakin Tidak Ada Data Yang Akan Diubah?"}
                </SweetAlert>
                :""} 

                {ValidationMessage != "" ?
                <SweetAlert
                    show={ShowAlert}
                    onConfirm={() => {
                        setShowAlert(false)
                        setValidationMessage("")
                    }}
                    onEscapeKey={() => setShowAlert(false)}
                    onOutsideClick={() => setShowAlert(false)}
                    btnSize="sm"
                    >
                    {() => (
                        <div>
                            <p style={{fontSize:'20px', textAlign:'left'}}><Markup content={ValidationMessage}/></p>
                        </div>
                    )}
                </SweetAlert>
                :""}

            </div>
            </div>
        </div>
        
    )
}


export default EditUserLogin
