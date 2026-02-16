import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button,Dropdown,Gap,Input, Sort } from '../../components'
import "../../App.css"
import LeftMenu from '../../components/molecules/LeftMenu'
import md5 from 'md5'
import { useSelector,useDispatch } from 'react-redux';
import { setForm } from '../../redux';
import { AlertMessage, paths } from '../../utils'
import { useCookies } from 'react-cookie';
import Pagination from 'react-bootstrap/Pagination'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import * as ReactBootStrap from 'react-bootstrap'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import LabelTH from '../../components/molecules/LabelTH'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faFilter, faTrash, faEdit, faUsers, faAngleUp,faBan, faBars } from '@fortawesome/free-solid-svg-icons'
import { fetchStatus, generateSignature } from '../../utils/functions'
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactPaginate from 'react-paginate';

const UserLogin = () => {
    const history = useHistory();
    const [ListMenu,setListMenu] = useState([])
    const [loading,setLoading] = useState(false)
    const [Filter,setFilter] = useState("")
    const [OrderBy,setOrderBy] = useState("Menu")
    const [Order,setOrder] = useState("ASC")
    const [FieldFilterUserID,setFieldFilterUserID] = useState("")
    const [FieldFilterNamaMenu,setFieldFilterNamaMenu] = useState("")
    const [FieldFilterNote,setFieldFilterNote] = useState("")
S
    const location = useLocation();
    const {form}=useSelector(state=>state.LoginReducer);
    const {formPaket}=useSelector(state=>state.PaketReducer);
    // location.state.postContent
    const dispatch = useDispatch();
    const [cookies, setCookie,removeCookie] = useCookies(['user']);
    const [FieldFilterSource,setFieldFilterSource] = useState("")
    const [FieldFilterUser,setFieldFilterUser] = useState("")
    const [PageNumber,setPageNumber] = useState(1)
    const [PageActive,setPageActive] = useState(1)
    const [TotalRecord,setTotalRecord] = useState(0)
    const [TotalPages,setTotalPages] = useState(1)
    const [RowPage,setRowPage] = useState(15)
    const [ResultMessage,setResultMessage] = useState("")
    const [showFilter,setShowFilter] = useState(false)

    const [ShowAlert, setShowAlert] = useState(true)
    const [SessionMessage, setSessionMessage] = useState("")
    const [DeleteMessage, setDeleteMessage] = useState("")
    const [SuccessMessage, setSuccessMessage] = useState("")
    const [ConfirmDeleteMessage, setConfirmDeleteMessage] = useState(false)
    const [NamaMenu, setNamaMenu] = useState("")
    const [IDMenuDelete, setIDMenuDelete] = useState("")
    const [ErrorMessageAlert, setErrorMessageAlert] = useState("")
    const [ErrorMessageAlertLogout, setErrorMessageAlertLogout] = useState("")

    useEffect(()=>{
        if (location.state == null) {
            setSuccessMessage("");
        } else {
            setSuccessMessage(location.state.Message);
            setShowAlert(true);
        }

        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");
        
        if(CookieParamKey==null || CookieParamKey=="" ||
         CookieUserID==null || CookieUserID==""){
            logout()
            window.location.href="admin/login";
            return false;
        }else{
            dispatch(setForm("ParamKey",CookieParamKey))
            dispatch(setForm("UserID",CookieUserID))
            dispatch(setForm("PageActive","MENU"))

            loadData(1);
        }

    },[OrderBy,Order,PageActive])
    
    const logout = ()=>{
        removeCookie('varCookie', { path: '/'});
        removeCookie('CookieProductName', { path: '/'});
        removeCookie('CookieSourceCode', { path: '/'});
        dispatch(setForm("ParamKey",''))
        dispatch(setForm("UserID",''))
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

    const loadData = (currentPage)=>{

        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");

        if (FieldFilterNamaMenu != "") {
            var FilterNamaMenu = "%"+FieldFilterNamaMenu+"%";
        } else {
            var FilterNamaMenu = "";
        } 

        if (FieldFilterNote != "") {
            var FilterNote = "%"+FieldFilterNote+"%";
        } else {
            var FilterNote = "";
        }

        var requestBody = JSON.stringify({
            "Method":"SELECT",
            "Page": currentPage,
            "RowPage": RowPage,
            "OrderBy": OrderBy,
            "Order": Order,
        });

        var enckey = CookieParamKey;
        var url = paths.URL_API_ADMIN+'Menu';
        var Signature  = generateSignature(enckey,requestBody)
        setLoading(true)
        setResultMessage("Loading ...")
        fetch( url, {
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
            if(data.ErrorCode=="0"){
                setListMenu(data.Result);
                
                setTotalRecord(data.TotalRecords)
                setTotalPages(data.TotalPages)
                if(data.TotalRecords<1){
                    setResultMessage("Data tidak ditemukan")
                }
            }else{
                if(data.ErrorMessage=="Param Key Exipred"){
                    setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                    setShowAlert(true);
                }
            }
            setLoading(false)
        })
        .catch((error) => {
            setLoading(false)
            if (error.message == 401) {
                setErrorMessageAlertLogout("Maaf anda tidak memiliki ijin untuk mengakses halaman ini.");
                setShowAlert(true);
            } else if (error.message != 401) {
                setErrorMessageAlert(AlertMessage.failedConnect);
                setShowAlert(true);
            }
            setResultMessage("")
        });
    }

    const clickDelete = ()=>{
        var CookieParamKey = getCookie("paramkey");
        var CookieUserID = getCookie("userid");
        var IDMenu = IDMenuDelete;
        
        var requestBody = JSON.stringify({
            "UserID": CookieUserID,
            "ParamKey": CookieParamKey,
            "Method":"DELETE",
            "IDMenu":IDMenu
        });
        
        // var enckey = paths.EncKey;
        var enckey = CookieParamKey;
        // var url = paths.URL_API_ADMIN+'users';
        var url = paths.URL_API_ADMIN+'menu';
        var Signature  = generateSignature(enckey,requestBody)
        setLoading(true)
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
            if(data.ErrorCode=="0"){
                loadData(1);
                setSuccessMessage("Berhasil Menghapus Data");
                setShowAlert(true);
            }else{
                if(data.ErrorMessage=="Param Key Exipred"){
                    // alert("Session anda telah habis. Silahkan login kembali.");
                    setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
                    setShowAlert(true)
                }else{
                    // setErrorMessageAlert(data.ErrorMessage);
                    setErrorMessageAlert("Gagal menghapus data");
                    setShowAlert(true);
                }
            }
            setLoading(false)
        })
        .catch((error) => {
            setLoading(false)
            if (error.message == 401) {
                setErrorMessageAlertLogout("Maaf anda tidak memiliki ijin untuk mengakses halaman ini.");
                setShowAlert(true);
            } else if (error.message != 401) {
                setErrorMessageAlert(AlertMessage.failedConnect);
                setShowAlert(true);
            }
        });
    }

    const handleSort=(OrderBy)=>{
         setOrderBy(OrderBy);
        if(Order.toUpperCase()=="ASC"){
             setOrder("DESC");
        }else{
            setOrder("ASC");
        }
    }

    const handlePageClick = (data) => {

        let currentPage = data.selected + 1

        setResultMessage("Loading ...")
        setListMenu([])

        loadData(currentPage)
    }


    return (
        <div className="main-page">
           
            <div className="content-wrapper-2">
                <div className="blog-post">
                    <p className="title"><FontAwesomeIcon icon={faBars}/> List Menu</p>

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

                    {SuccessMessage != "" ?
                    <SweetAlert 
                        success 
                        show={ShowAlert}
                        onConfirm={() => {
                            setShowAlert(false)
                            setSuccessMessage("")
                            history.replace("/list-menu")
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
                            window.location.href="admin/login";
                        }}
                        btnSize="sm">
                        {ErrorMessageAlertLogout}
                    </SweetAlert>
                    :""}
                    {/* END OF ALERT */}

                    <hr style={{backgroundColor: 'black'}} />

                    {showFilter ?
                    <div>
                        <div style={{display:'flex'}}>
                            <Button style={{width:120,backgroundColor:"#7F8C8D",fontSize:12}}
                                        onClick={()=>{
                                        setShowFilter(false)
                                    }}
                                >
                                <FontAwesomeIcon icon={faAngleUp}/> Hide Filter
                            </Button>
                                
                        </div>
                        <Gap height={10} />
                        <Row xs={12} md={12} lg={8}> 
                            <Col>
                                <Input
                                    label="Filter Nama Menu"
                                    value={FieldFilterNamaMenu}
                                    style={{width:300}}
                                    onChange = {(event) => {setFieldFilterNamaMenu(event.target.value)}}
                                />
                            </Col>
                            <Col>
                                <Input
                                    label="Filter Note"
                                    value={FieldFilterNote}
                                    style={{width:300}}
                                    onChange = {(event) => {setFieldFilterNote(event.target.value)}}
                                />
                            </Col>
                            <Col></Col>
                        </Row>
                        <Row xs={12} md={12} lg={8}>
                            <Col>
                                <Dropdown label = "Sorting"
                                    style={{width:300}}
                                    value={OrderBy}
                                    onChange = {(event) => {setOrderBy(event.target.value)}}>
                                        {/* <option value= "IDMenu" selected={"IDMenu"==OrderBy}>ID Menu</option> */}
                                        {/* <option value= "userid" selected={"userid"==OrderBy}>User ID</option> */}
                                        <option value= "Menu" selected={"Menu"==OrderBy}>Menu</option>
                                        <option value= "Note" selected={"Note"==OrderBy}>Note</option>
                                </Dropdown>
                            </Col>
                            <Col>
                                <Dropdown label = "Sorting Type"
                                    style={{width:300}}
                                    value={Order}
                                    onChange = {(event) => {setOrder(event.target.value)}}>
                                        <option value= "ASC" selected={"ASC"==Order}>Ascending</option>
                                        <option value= "DESC" selected={"DESC"==Order}>Descending</option>
                                </Dropdown>
                            </Col>
                            <Col></Col>
                        </Row>
                    <Gap height={10} />
                    <div style={{display:'flex'}}>
                        <Button onClick={()=>{
                            if(PageActive==1){
                                loadData(1)
                            }else{
                                setPageActive(1)
                            }
                        }} style={{width:120,backgroundColor:"#7F8C8D",fontSize:12}}>
                            <FontAwesomeIcon icon={faFilter}/> Terapkan
                        </Button>
                        <Gap width={10} />
                        <Button style={{width:100,backgroundColor:"#7F8C8D",fontSize:12}}
                                    onClick={()=>{
                                        loadData()
                                        setFieldFilterNamaMenu("")
                                        setFieldFilterNote("")
                                        setOrderBy("InputDate")
                                }}
                            >
                            <FontAwesomeIcon icon={faBan}/> Reset
                        </Button>
                        <Gap width={10} />
                    </div>
                    </div>
                    :
                    <div style={{display:'flex'}}>
                        <Button style={{width:120,backgroundColor:"#7F8C8D",fontSize:12}}
                            onClick={()=>{ setShowFilter(true) }} >
                            <FontAwesomeIcon icon={faFilter}/> Filter Data
                        </Button>
                        <Gap width={10} />
                        <Button style={{width:120,fontSize:12}} 
                            onClick={()=>history.push('/input-list-menu')}>
                            <FontAwesomeIcon icon={faPlusCircle}/> Tambah Baru
                        </Button>
                    </div>
                    }
                    
                    <hr 
                        style={{
                            backgroundColor: 'black'
                        }} 
                    />

                    {!loading ? (
                        <div>
                        <Table striped bordered hover responsive cellspacing="0" border="1" cellpadding="7" style={{borderColor:"#CCCCCC",fontSize:13}}>
                        <Thead>
                        <Tr style={{color:"#3d3c3c",backgroundColor:"#CCCCCC"}}>
                            <Th className="tabelHeader" onClick={()=>handleSort("Menu")}><LabelTH>Menu </LabelTH></Th>
                            <Th className="tabelHeader" onClick={()=>handleSort("Note")}><LabelTH>Note </LabelTH></Th>
                            <Th width="30">Action</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                        { ListMenu.length > 0 ? ListMenu.map((item,index)=>{
                                return <Tr style={{backgroundColor:index%2==0?'#d1e4da':'white'}}>
                                    <Td>{item.Menu}</Td>
                                    <Td>{item.Note}</Td>
                                    <Td>
                                        <div style={{display:'flex'}}>
                                            <Button 
                                                style={{backgroundColor:"#ca9d1f",width:80}}   
                                                onClick={()=>{
                                                    history.push('/edit-list-menu')
                                                    dispatch(setForm("Detail",item))
    
                                                }}
                                            ><FontAwesomeIcon icon={faEdit}/> Edit</Button>
                                            <Gap width={10}/>
                                            <Button style={{backgroundColor:"#e05858",width:80}}  
                                                // onClick={()=> {
                                                //     clickDelete(item.Login,item.IDLogin)
                                                // }}
                                                onClick={()=>{
                                                    setConfirmDeleteMessage(true)
                                                    setNamaMenu(item.Menu)
                                                    setIDMenuDelete(item.IDMenu)
                                                }}
                                            ><FontAwesomeIcon icon={faTrash}/> Hapus</Button>
                                        </div>
                                    </Td>
                                </Tr>;
                           }) : <Tr><Td colSpan="9" align="center" style={{color:'red'}}>{ResultMessage}</Td></Tr>}
                        
                      
                        </Tbody>
                    </Table>

                    {ConfirmDeleteMessage == true ?
                    <SweetAlert
                        info
                        showCancel
                        confirmBtnText="Yes"
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="info"
                        onConfirm={()=>{
                            clickDelete()
                            setShowAlert(false)
                            setConfirmDeleteMessage(false)
                        }}
                        onCancel={() => {
                            setShowAlert(false)
                            setConfirmDeleteMessage(false)
                        }}
                        focusCancelBtn
                        btnSize="sm"
                    >
                    {"Apakah Anda Yakin Ingin Menghapus Menu "+NamaMenu+"?"}
                    </SweetAlert>
                    :""} 

                    <hr style={{backgroundColor: 'black'}} />
                    <Gap height={5}/>
                    <ReactPaginate
                        pageCount={TotalPages}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        breakClassName={'page-item'}
                        breakLinkClassName={'page-link'}
                        activeClassName={'active'}

                    />
                    <div>
                        Total Data : {TotalRecord}
                    </div>
                    </div>
                    ) : (
                    <div style={{textAlign: 'center'}}>
                        <ReactBootStrap.Spinner animation="border" />
                    </div>)}

                </div>
            </div>

        </div>
    )
}

export default UserLogin

