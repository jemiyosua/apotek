import React , {useState} from 'react';
import { Button, Form, Nav, Navbar, NavDropdown, Container , Card, CardDeck } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IconStarpoin, IcStarmall, Playstore, Appstore, QrDownloadApp } from '../../../assets';
import { setForm } from '../../../redux';
import './header.css';


const Header = ({noNavbar}) => {
    noNavbar = true;
    const history =useHistory();
    const [cookies, setCookie,removeCookie] = useCookies(['user']);
    const {form}=useSelector(state=>state.PaketReducer);
    const dispatch = useDispatch();

    const [isShown, setIsShown] = useState(false);

    const handleComponent = event => {
        setIsShown(current => !current);
    }

    const handleComponentFalse = event => {
        setIsShown(false)
    }

    const handleComponentTrue = event => {
        setIsShown(true)
    }
    
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const [isHoveredPartner, setIsHoveredPartner] = useState(false);
    const [isClickedPartner, setIsClickedPartner] = useState(false);
    const [isHovering, setIsHovering] = useState(false)
    const [ModalDownload, setModalDownload] = useState(false)

    // function MiniDownloadWindow() {
    //     return (
            
    //       );
    // }

    const HandleLeave = () => {
        setModalDownload(false)
    }
    
    const HandleHover = () => {
        setModalDownload(true)
    }

    return (
        <div style={{ paddingBottom:60, zIndex:100, borderBottom:1, borderBottomWidth:2}}>
            <Navbar bg="white" expand="lg" style={{zIndex:100, position:'fixed', top:0, width:'100%' }}>
                <Container fluid>
                    <Navbar.Brand href="/" style={{paddingLeft:20}}><img width="50" height="35" src={IconStarpoin} alt="Logo StarPoin" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll" className="justify-content-end" >
                    <Nav>
                        <Nav.Link href="/about-us" style={{paddingRight:20, color:'#61308C'}}>About Us</Nav.Link>
                        <NavDropdown 
                            onClick={()=>{history.push('/product')}} 
                            title={ <span style={{color: '#61308C'}}>Product</span> }
                            onMouseEnter={() => setIsHovered(true)} 
                            onMouseLeave={() => setIsHovered(false)} 
                            onToggle={() => setIsClicked(!isClicked)} 
                            show={isClicked || isHovered} 
                            id="navbarScrollingDropdownProduct" 
                            style={{paddingRight:15, color:'#61308C'}}>
                            <NavDropdown.Item href="/discount-merchant" style={{ color:'#61308C' }}>Discount Merchant</NavDropdown.Item>
                            <NavDropdown.Item href="/starvoucher" style={{ color:'#61308C' }}>StarVoucher</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown 
                            onClick={()=>{ history.push('/partnership') }} 
                            title={ <span style={{color: '#61308C'}}>Partnership</span> }
                            id="navbarScrollingDropdownPartnership" 
                            onMouseEnter={() => setIsHoveredPartner(true)}
                            onMouseLeave={() => setIsHoveredPartner(false)}
                            onToggle={() => setIsClickedPartner(!isClicked)}
                            show={isClickedPartner || isHoveredPartner}
                            style={{paddingRight:15}}>
                            {/* <NavDropdown.Item href="/partnership-ecosystem">Partnership Ecosystem</NavDropdown.Item> */}
                            <NavDropdown.Item href="/partnership-registration" style={{ color:'#61308C' }}>Partnership Registrastion</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/faq" style={{ color:'#61308C' }}>FAQ</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="justify-content-end">

                        <div onPointerOver={HandleHover} onMouseLeave={HandleLeave}>
                            <Button style={{ backgroundColor:'#61308C', border:'none' }} onClick={()=>{history.push('/download')}}>Download App</Button>
                            {ModalDownload &&  
                            <div style={{ position:'absolute', top: '80%', right: '1%', backgroundColor:'#FFFFFF', boxShadow: '1px 2px 9px #c7c7c7', borderRadius:10, padding:20, textAlign:'center' }} onMouseOver={HandleHover} onMouseLeave={ModalDownload ? HandleHover : HandleLeave}>
                                <h3 style={{ width:'100%', font:'Poppins', fontSize:"24px" }}>Scan QR Code <br/>to download</h3>
                                <div onMouseOver={() => setIsHovering(true)} style={{ marginBottom:30 }}>
                                    <img src={QrDownloadApp} width="128" height="128" alt="Qr Applikasi StarPoin"/>
                                </div>
                                <div onMouseOver={() => setIsHovering(true)} style={{ marginBottom:30 }}>
                                    <img src={Playstore} width="128" height="45" alt="PlayStore StarPoin"/>
                                </div>
                                <div onMouseOver={() => setIsHovering(true)}>
                                    <img src={Appstore} width="128" height="45" alt="AppStore StarPoin"/>
                                </div>
                            </div>
                            }
                        </div>

                        {/* {isHovering &&
                        <div style={{ position:'absolute', top: '85%', right: '3%', backgroundColor:'red', boxShadow: '1px 2px 9px #c7c7c7', borderRadius:10, padding:10, width:'auto' }} onMouseOut={() => setIsHovering(false)}>
                            {isHovering ?
                            <div>
                                <h3 style={{ width:'100%', font:'Poppins', fontSize:"24px" }}>Scan QR Code <br/>to download</h3>
                                <img src={QrDownloadApp} width="128px"/>
                                <div onMouseOver={() => setIsHovering(true)}>
                                    <img src={Playstore} width="128px"/>
                                </div>
                                <div onMouseOver={() => setIsHovering(true)}>
                                    <img src={Appstore} width="128px"/>
                                </div>
                            </div>
                            :
                            <div></div>
                            }
                        </div>
                        } */}
                        {/* onMouseOver={() => setIsHovering(true)} onMouseOut={() => setIsHovering(false)} */}
                    <div className="divHeight">&nbsp;</div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}


export default Header
