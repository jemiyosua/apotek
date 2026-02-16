import React from 'react';
import { Button, Form, Nav, Navbar } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { favicon } from '../../../assets';
import { setForm } from '../../../redux';
import './header.css';


const Header = ({noNavbar}) => {
    noNavbar = true;
    const history =useHistory();
    const [cookies, setCookie,removeCookie] = useCookies(['user']);
    const {form}=useSelector(state=>state.PaketReducer);
    const dispatch = useDispatch();
    return (
        <div>
            {noNavbar ? 
            <Navbar style={{backgroundColor:'#e9ecef',paddingLeft:30}} expand="lg">
                <Navbar.Brand 
                // href="/" 
                >
                    <img 
                        style={{width:40,height:40,marginRight:10}}
                        src={favicon} alt="logo" /> 
                    SimasInsurtech
                </Navbar.Brand>
                    
            </Navbar>  
            :
            <Navbar style={{backgroundColor:'#e9ecef',paddingLeft:100}} expand="lg">
                <Navbar.Brand href="/">
                    <img 
                        style={{width:40,height:40,marginRight:10}}
                        src={favicon} alt="logo" /> 
                    SimasInsurtech
                </Navbar.Brand>
                {((cookies.CookieParamKey!=null && cookies.CookieParamKey!="" &&
                            cookies.ckUI!=null && cookies.ckUI!="") || (form.ParamKey!=null && form.ParamKey!="" &&
                            form.UserID!=null && form.UserID!=""))
                            &&
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                }
                    {((cookies.CookieParamKey!=null && cookies.CookieParamKey!="" &&
                            cookies.ckUI!=null && cookies.ckUI!="") || (form.ParamKey!=null && form.ParamKey!="" &&
                            form.UserID!=null && form.UserID!=""))
                            && 
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        {/* <Nav.Link href="/list-user-login" active={form.PageActive=="User"}>List User</Nav.Link>
                        <Nav.Link href="/list-WhiteList" active={form.PageActive=="Whitelist"}>IP Whitelist</Nav.Link>
                        <Nav.Link href="/" active={form.PageActive=="Paket"}>Paket</Nav.Link>
                        <Nav.Link href="/list-template-microsite" active={form.PageActive=="Microsite"}>Template Microsite</Nav.Link>
                        <Nav.Link href="/list-template-sms-email" active={form.PageActive=="SMSEMAIL"}>Template SMS & Email</Nav.Link>
                        <Nav.Link href="/list-koleksi-gambar" active={form.PageActive=="Gambar"}>Koleksi Gambar</Nav.Link> */}
                    
                        </Nav>
                        <Form inline>
                            {/* {cookies.CookieParamKey!=null && cookies.CookieParamKey!="" &&
                            cookies.ckUI!=null && cookies.ckUI!=""
                            && */}
                        <Button variant="outline-success" onClick={()=>{
                            removeCookie('ckUI', { path: '/' });
                            removeCookie('CookieParamKey', { path: '/'});
                            dispatch(setForm("ParamKey",''))
                            dispatch(setForm("UserID",''))
                            history.push('/login')
                        }}>Logout</Button>
                        {/* } */}
                        </Form>
                    </Navbar.Collapse>
                    }
                    
            </Navbar>    
            }
        </div>
    )
}


export default Header
