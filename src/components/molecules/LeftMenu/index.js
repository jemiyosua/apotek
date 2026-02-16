

import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// import { Logout } from '../../../utils/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { FaBoxes, FaImages, FaNetworkWired, FaTags, FaUserMinus, FaBars, FaUsers, FaUsersCog, FaComment } from 'react-icons/fa';
// import { useIntl } from 'react-intl';
import {
  Menu,
  MenuItem, ProSidebar, SidebarContent, SidebarFooter, SidebarHeader
} from 'react-pro-sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { favicon } from '../../../assets';
// import sidebarBg from './assets/bg1.jpg';
import { setForm } from '../../../redux';
import { paths } from '../../../utils';
import { fetchStatus, generateSignature } from '../../../utils/functions';
// import { Button } from 'bootstrap';
import { Button } from '../../atoms';

const LeftMenu = ({ image, collapsed, rtl, toggled, handleToggleSidebar }) => {
//   const intl = useIntl();
if (window) {
  var vMenu = [];
  var sessionstore = (sessionStorage.getItem('MNStore'));
  if (sessionstore != null && sessionstore != "" && sessionstore != []) {
    sessionstore = JSON.parse((sessionstore));
    vMenu = sessionstore;
  }
}

  const history = useHistory();
    const [cookies, setCookie,removeCookie] = useCookies(['user']);
    const {form}=useSelector(state=>state.PaketReducer);
    const dispatch = useDispatch()
    const [ListMenu,setListMenu] = useState(vMenu)
    const [PageActive,setPageActive] = useState(1)
    const [RowPage,setRowPage] = useState(20)
    const [OrderBy,setOrderBy] = useState("")
    const [Order,setOrder] = useState("DESC")

    useEffect(()=>{
     
      if (window) {
        var sessionstore = (sessionStorage.getItem('MNStore'));
        if (sessionstore != null && sessionstore != "" && sessionstore != []) {
          sessionstore = JSON.parse((sessionstore));
          setListMenu(sessionstore)
        }else{
          loadMenu();
        }
      }else{
        loadMenu();
      }
    },[])

  const loadMenu = ()=>{

      var CookieParamKey = getCookie("paramkey");
      var CookieUserID = getCookie("userid");

      
      var requestBody = JSON.stringify( {
        "UserID": CookieUserID,
        "ParamKey": CookieParamKey,
        "Method": "SELECT",
        "Page": PageActive,
        "RowPage": RowPage,
        "OrderBy": OrderBy,
        "Order": Order,
        
     });

      var enckey = CookieParamKey;
      var url = paths.URL_API+'viewLoginMenu';
      var Signature  = generateSignature(enckey,requestBody)
      
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
              if (window) {
                sessionStorage.setItem('MNStore', (JSON.stringify(data.Result)));
              }
          }
      })
      .catch((error) => {
          if (error.message != 401) {
              setErrorMessageAlert(AlertMessage.failedConnect);
              setShowAlert(true);
          }
      });
  }

    const logout = ()=>{
      removeCookie('varCookie', { path: '/'});
      removeCookie('CookieProductName', { path: '/'});
      removeCookie('CookieSourceCode', { path: '/'});
      dispatch(setForm("ParamKey",''))
      dispatch(setForm("UserID",''))
      if(window){
        sessionStorage.clear();
      }
      history.push('/login')
    }

    const getCookie = (tipe) => {
        var SecretCookie = cookies.varCookie;
        if (SecretCookie != "" && SecretCookie != null) {
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

  var ReturnPolisKredit = null;
  var ReturnKlaimKredit = null;
  var ReturnPolisCargo = null;
  var ReturnPolisMoveable = null;
  var ReturnPolisTravel = null;
  var ReturnPolisPa = null;
  var ReturnLogin = null;
  var ReturnMenu = null;
  var ReturnMenuAkses = null;
  var ReturnKlaimCargo = null;


  return (
    <ProSidebar
      image={image ? false : false}
      rtl={rtl}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
      style={{zIndex:3,width:240,minWidth:240}}
    >
      <SidebarHeader>
        <div
          style={{
            padding: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
           <img 
              style={{width:170,marginRight:10,borderRadius:4}}
              src={favicon} alt="logo" /> 
        </div>
      </SidebarHeader>
      {((getCookie("paramkey")!=null && getCookie("paramkey")!="" &&
        getCookie("userid")!=null && getCookie("userid")!="") || (form.ParamKey!=null && form.ParamKey!="" &&
        form.UserID!=null && form.UserID!=""))
        && 
      <SidebarContent>
        <Menu iconShape="circle">

          <div>

            {ListMenu.map((item,index)=>{
                if( item.Menu == "VIEWPOLISKREDIT" ){
                    ReturnPolisKredit = 
                      <MenuItem icon={<FaTags />} >
                        <a
                            style={{color:form.PageActive=="KREDITPOLIS" &&'#70e885'}} 
                            href={"kredit-polis"}>
                              {item.LabelMenu}</a>
                      </MenuItem>;
                }     
                if( item.Menu == "VIEWKLAIMKREDIT" ){
                    ReturnKlaimKredit = 
                      <MenuItem icon={<FaTags />} >
                        <a
                            style={{color:form.PageActive=="KREDITKLAIM" &&'#70e885'}} 
                            href={"kredit-klaim"}>
                              {item.LabelMenu}</a>
                      </MenuItem>;
                } 
                if( item.Menu == "VIEWPOLISCARGO" ){
                    ReturnPolisCargo = 
                      <MenuItem icon={<FaTags />} >
                        <a
                            style={{color:form.PageActive=="CARGOPOLIS" &&'#70e885'}} 
                            href={"cargo-polis"}>
                              {item.LabelMenu}</a>
                      </MenuItem>;
                }     
                if( item.Menu == "VIEWKLAIMCARGO" ){
                    ReturnKlaimCargo = 
                      <MenuItem icon={<FaTags />} >
                        <a
                            style={{color:form.PageActive=="CARGOKLAIM" &&'#70e885'}} 
                            href={"cargo-klaim"}>
                              {item.LabelMenu}</a>
                      </MenuItem>;
                }     
                if( item.Menu == "VIEWPOLISTRAVEL" ){
                    ReturnPolisTravel = 
                      <MenuItem icon={<FaTags />} >
                        <a
                            style={{color:form.PageActive=="TRAVELPOLIS" &&'#70e885'}} 
                            href={"travel-polis"}>
                              {item.LabelMenu}</a>
                      </MenuItem>;
                }      
                if( item.Menu == "VIEWPOLISPA" ){
                    ReturnPolisPa = 
                      <MenuItem icon={<FaTags />} >
                        <a
                            style={{color:form.PageActive=="PAPOLIS" &&'#70e885'}} 
                            href={"pa-polis"}>
                              {item.LabelMenu}</a>
                      </MenuItem>;
                }      
                if( item.Menu == "VIEWPOLISMOVEABLE" ){
                    ReturnPolisMoveable = 
                      <MenuItem icon={<FaTags />} >
                        <a
                            style={{color:form.PageActive=="MOVEABLEPOLIS" &&'#70e885'}} 
                            href={"moveable-polis"}>
                              {item.LabelMenu}</a>
                      </MenuItem>;
                }     
                if( item.Menu == "ADDLOGIN" ){
                    ReturnLogin = 
                      <MenuItem icon={<FaUsers />} >
                        <a
                            style={{color:form.PageActive=="ADDLOGIN" &&'#70e885'}} 
                            href={"list-user-login"}>
                              {item.LabelMenu}</a>
                      </MenuItem>;
                }       
                if( item.Menu == "MENU" ){
                    ReturnMenu = 
                      <MenuItem icon={<FaBars/>} >
                        <a
                            style={{color:form.PageActive=="MENU" &&'#70e885'}} 
                            href={"list-menu"}>
                              {item.LabelMenu}</a>
                      </MenuItem>;
                }                 
                if( item.Menu == "ADDAKSESMENU" ){
                    ReturnMenuAkses = 
                      <MenuItem icon={<FaUsersCog />} >
                        <a
                            style={{color:form.PageActive=="MENULOGIN" &&'#70e885'}} 
                            href={"list-menu-login"}>
                              {item.LabelMenu}</a>
                      </MenuItem>;
                }
            })} 

            {ReturnPolisKredit}
            {ReturnKlaimKredit}
            {ReturnPolisCargo}
            {ReturnKlaimCargo}
            {ReturnPolisMoveable}
            {ReturnPolisTravel}
            {ReturnPolisPa}
            {ReturnLogin}
            {ReturnMenu}
            {ReturnMenuAkses}
              
            
            
          </div>
       
          <MenuItem>
            <Button style={{width:100}} variant="outline-success" onClick={()=>{
                    
                    logout();
                }}><FontAwesomeIcon icon={faSignOutAlt}/> Logout</Button>
          </MenuItem>
          
        </Menu>
        <Menu iconShape="circle">
         
        </Menu>
      </SidebarContent>
        }

      <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >
         
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default LeftMenu;