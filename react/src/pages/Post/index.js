import React, { useEffect, useState, useRef } from 'react';
import { Header, Footer } from '../../components';
import { Card, CardDeck, Button, Col, Row, Container, Spinner} from 'react-bootstrap';
import { IcDisc} from '../../assets';
import './Post.css'
import { setForm } from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { paths } from '../../utils'
import { fetchStatus, generateSignature} from '../../utils/functions'
import Popup from 'reactjs-popup'
import publicIP from 'react-native-public-ip';
import { Helmet } from "react-helmet";
import { Markup } from 'interweave';

const Post = () => {
    const {form}=useSelector(state=>state.LoginReducer);
    const [Nama, setNama] = useState("")
    const [Image, setImage] = useState("")
    const [Disc, setDisc] = useState("")
    const [LogoMerchant, setLogoMerchant] = useState("")
    const [Alamat, setAlamat] = useState("")
    const [RangeHarga, setRangeHarga] = useState("")
    const [OpeningHour, setOpeningHour] = useState("")
    const [NoHp, setNoHp] = useState("")
    const [merchantId, setMerchantId] = useState("")   
    const [Promo, setPromo] = useState("")   
    const [DetailPromo, setDetailPromo] = useState("")   
    const [MulaiPromo, setMulaiPromo] = useState("")   
    const [AkhirPromo, setAkhirPromo] = useState("")   
    const [Lng, setLng] = useState("")
    const [Lat, setLat] = useState("")
    const [listImage, setListImage] = useState([])
    const [PageTitle, setPageTitle] = useState("")
    const [MetaTitle, setMetaTitle] = useState("")
    const [MetaKeyword, setMetaKeyword] = useState("")
    const [MetaDesc, setMetaDesc] = useState("")
    const [Title, setTitle] = useState("")
    const location = useLocation();
    const [Content, setContent] = useState("")
    const [Loading, setLoading] = useState("")

    useEffect(()=>{
        window.scrollTo(0, 0)
        setPageTitle(Title)
        setMetaTitle(Title)
        setMetaKeyword(Title)
        setMetaDesc(Title)

        getIP();
    },[])

    const getIP = async() => {
        setLoading(true)
		publicIP()
        .then(ip => {
            LoadDataMerchant(ip)
        })
        .catch(error => {
            setLoading(false)
            LoadDataMerchant("0.0.0.0")
        });
	}

    const LoadDataMerchant = (ip)=>{
        var Judul = window.location.href.replace("https://starpoin.id/", "")

        var requestBody = JSON.stringify({
            "param1": ip,
            "param2": Judul
        });

        var url = paths.URL_API_STATIC+'ShowDetailMerchant';
        var Signature  = generateSignature(requestBody)
		
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
            if(data.errcode=="0"){
                setNama(data.list[0].MerchantNama)
                setImage(data.list[0].MerchantVisual)
                setLogoMerchant(data.list[0].MerchantLogo)
                setAlamat(data.list[0].MerchantAddress)
                setRangeHarga(data.list[0].RangeHarga)
                setNoHp(data.list[0].MerchantTelp2)
                setOpeningHour(data.list[0].JamOperasional)
                setMerchantId(data.list[0].MerchantId)
                setLng(data.list[0].MerchantLongitude)
                setLat(data.list[0].MerchantLatitude)
                setPromo(data.list[0].ItemPromo[0].Promo)
                setDetailPromo(data.list[0].ItemPromo[0].DetailPromo)
                setAkhirPromo(data.list[0].ItemPromo[0].TanggalAkhirPromo)
                setMulaiPromo(data.list[0].ItemPromo[0].TanggalAwalPromo)
                setDisc(data.list[0].ItemPromo[0].Diskon)
                getApiImage(ip, data.list[0].MerchantId)
            }else{
                alert("Gagal memuat data detail merchant, silakan coba beberapa saat lagi")
            }
            setLoading(false)
        })
        .catch(() => {
            setLoading(false)
            alert("Gagal memuat data detail merchant, silakan coba beberapa saat lagi.")
        });
    }

  	const getApiImage = (ip, MerchantId) => {
        var requestBody = JSON.stringify({
        "param1": ip,
        "param2" : MerchantId,
        });    

        var url = paths.URL_API_STATIC+'ShowImageMerchant';
        var Signature = generateSignature(requestBody)

        fetch( url, {
            method: "POST",
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
                'Signature': Signature   
            }
        })
        .then(fetchStatus)
        .then(response => response.json())
        .then((data) => {
            if(data.errcode == "0"){
                for (let i = 0; i < data.list.length; i++) {                
                  setListImage(data.list);
                }
                
            }else{
                alert("Gagal memuat data photo merchant, silakan coba beberapa saat lagi")
            }
            setLoading(false)
        })
        .catch(() => {
            setLoading(false)
            alert("Gagal memuat data photo merchant, silakan coba beberapa saat lagi")
        });
  	}

    const contentStyle = { background: '#ffffff',borderRadius:15,padding:20, width:'100%'};
    const overlayStyle = { background: 'rgba(0,0,0,0.8)' };
    const arrowStyle = { color: '#000' };
    
    // var HtmlToReactParser = require('html-to-react').Parser;

    if (location.state == null || location.state == "") {
        var htmlInput = Content;
        var title = Title;
    } else {

        var htmlInput = location.state.postContent;
        var title = location.state.title;
    }

    const ScrollOverview = useRef(null);
    const ScrollDisc = useRef(null);
    const ScrollPhoto = useRef(null);

    const scrollToOverview = () => {
        ScrollOverview?.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToDisc = () => {
        ScrollDisc?.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToPhoto = () => {
        ScrollPhoto?.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
        <Helmet>
            <meta charSet="utf-8" />
            <meta name="description" content={MetaDesc} />
            <meta name="keywords" content={MetaKeyword} />
            <meta property="og:url" content={window.location.href}></meta>
            <meta property="og:title" content={MetaTitle}></meta>
            <meta property="og:site_name" content="StarPoin"></meta>
            <meta property="og:type" content="article"></meta>

            <title>{PageTitle}</title>
        </Helmet>
        <Header></Header>
        {Loading ?
            <div className="divLoader">
                <Spinner animation="border" />
            </div>
            :
            <div ref={ScrollOverview} style={{flexDirection:'flex', justifyContent:'center'}}>
            <div style={{paddingBottom:10, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:10}}>
                <div style={{width:1100, height:'auto', marginLeft:30, marginRight:30}}>
                    <p><a href="/all-merchant" style={{color:'#61308C'}}>All Merchant </a>&gt; <b>{Nama}</b> </p>
                </div>
            </div>
            <div style={{paddingBottom:10, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Card border="light" style={{width:1100, marginLeft:30, marginRight:30, boxShadow: '2px 2px 5px #c7c7c7'}}>
                    <Card.Text>
                        <Row>
                            <Col xs={12} md={4} lg={3}>
                                <img className="detailImage" src={Image}></img>
                            </Col>
                            <Col xs={12} md={8} lg={9}>
                                <Row>
                                    <Col xs={12} md={12} lg={1}>
                                        <div style={{padding:20}}>
                                            <img style={{width:60, height:60}} src={LogoMerchant}></img>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={12} lg={11}>
                                        <div style={{padding:25, paddingLeft:35}}>
                                            <p style={{fontWeight:'bold', margin:8, fontSize:20}}>{Nama}</p>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={12} lg={12}>
                                        <div style={{padding:20}}>
                                            <Button style={{backgroundColor:'#61308C', border:'none'}}><a href="https://onelink.to/rzxxre" style={{color:'white'}}>Open on App</a></Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Text>
                </Card>
            </div>
            <div>
                <a name="merchant"></a>
                &nbsp;
            </div>
            <div style={{paddingBottom:10, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:20}}>
                <Card border="light" style={{width:1100, height:'auto', marginLeft:30, marginRight:30, boxShadow: '2px 2px 5px #c7c7c7'}}>
                    <Card.Text style={{backgroundColor:'white', borderRadius:30, fontWeight:'bold', padding:15}}>
                        <Container>
                            <Row>
                                <Col xs={4} md={3} lg={2}>
                                    <p style={{ marginBottom:7, fontSize:14, cursor:'pointer'}} onClick={scrollToOverview}>Overview</p>
                                </Col>
                                <Col xs={5} md={4} lg={3}>
                                    <p style={{ marginBottom:7, fontSize:14, cursor:'pointer'}} onClick={scrollToDisc}>Disc/Promo</p>
                                </Col>
                                <Col xs={3} md={2} lg={2}>
                                    <p style={{ marginBottom:7, fontSize:14, cursor:'pointer'}} onClick={scrollToPhoto}> Photo</p>
                                </Col>
                            </Row>
                        </Container>
                    </Card.Text>
                </Card>
            </div>
            <div style={{paddingBottom:10, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:20}}>
                <Card border="light" style={{width:1100, height:'auto', marginLeft:30, marginRight:30, boxShadow: '2px 2px 5px #c7c7c7'}}>
                    <Card.Header style={{backgroundColor:'white', borderTopLeftRadius:30, borderTopRightRadius:30, fontWeight:'bold'}}>Merchant Detail</Card.Header>
                    <Card.Body>
                    <Card.Text>
                        <Container>
                            <Row>
                                <Col xs={12} md={6} lg={5}>
                                    <p style={{marginBottom:7, fontSize:18}}>Address</p>
                                    <p style={{color:'#828282', fontSize:14}}>{Alamat}</p>
                                </Col>
                                <Col xs={12} md={6} lg={3}>
                                    <p style={{marginBottom:7, fontSize:18}}>Phone Number</p>
                                    <p style={{color:'#828282', fontSize:14}}>{NoHp}</p>
                                </Col>
                                <Col xs={12} md={6} lg={4}>
                                    <p style={{marginBottom:7, fontSize:18}}>Price Range</p>
                                    <p style={{color:'#828282', fontSize:14}}>{RangeHarga == "" ? "-" : RangeHarga}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={6} lg={5}>
                                    <div style={{width:'50%'}}>
                                        <iframe width="100%" maxWidth="250" maxHeight="250" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src={"https://maps.google.com/maps?width=200&height=150&hl=en&q="+ Lat +","+ Lng +"+(merchant)&t=&z=15&ie=UTF8&iwloc=B&output=embed"}></iframe>
                                    </div>
                                </Col>
                                <Col xs={12} md={6} lg={4}>
                                    <p style={{marginBottom:7, fontSize:18}}>Opening Hour</p>
                                    <p style={{color:'#828282', fontSize:14}}>{OpeningHour == "" ? "-" : OpeningHour}</p>
                                    <section ref={ScrollDisc} id="disc" class="disc"></section>
                                    {/*<p><a name="disc"></a></p> */}
                                    {/* <a name="disc"></a> */}
                                </Col>
                            </Row>
                        </Container>
                    </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            <div style={{paddingBottom:10, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:20}}>
                <Card border="light" style={{width:1100, height:'auto', marginLeft:30, marginRight:30, boxShadow: '2px 2px 5px #c7c7c7'}}>
                    <Card.Header style={{backgroundColor:'white', borderTopLeftRadius:30, borderTopRightRadius:30, fontWeight:'bold'}}>Discount/Promo</Card.Header>
                    <Card.Body>
                    <Card.Text>
                        <div ref={ScrollPhoto} >
                            {Disc > 0 ? 
                            <div style={{paddingTop:10, display:'flex', flexDirection:'row'}}>
                                <img style={{width:40, height:40}} src={IcDisc}></img>
                                <p style={{margin:8, fontSize:16}}>Discount {Disc}%</p>
                            </div>
                            :
                            <div>
                                <p>{Promo}</p> 
                                <Markup content={DetailPromo}/>
                            </div>
                            }
                            <p><a name="photo"></a></p>
                        </div>
                    </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            <div style={{paddingBottom:30, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:20}}>
                <Card border="light" style={{width:1100, height:'auto', marginLeft:30, marginRight:30, boxShadow: '2px 2px 5px #c7c7c7'}}>
                    <Card.Header style={{backgroundColor:'white', borderTopLeftRadius:30, borderTopRightRadius:30, fontWeight:'bold'}}>Photo</Card.Header>
                    <Card.Body>
                    <Card.Text>
                        

                        {listImage.length > 0 ? listImage.map((img) => 
                            <div style={{display: 'inline-block'}}><Popup 
                            trigger={<img src={img.MerchantUrl} alt={img.MerchantTitle} style={{margin:'8px', width:'150px', height: '150px'}} />}
                            {...{ contentStyle, overlayStyle, arrowStyle }}
                            modal
                            nested
                        >
                        {close => (
                            <div>
                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                    <b>Tampilan Gambar</b>
                                    <button style={{backgroundColor:'#999999',color:'#ffffff',borderRadius:5}} onClick={close}>&times;</button>
                                </div>
                                <hr/>
                                <div style={{textAlign:"center"}}>
                                    <img style={{maxHeight:400}} src={img.MerchantUrl} alt={img.MerchantTitle}/>
                                </div>
                            </div>
                        )}

                        </Popup></div>
                        ) : "Kosong"}


                    </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            </div>
        }
        <Footer></Footer>
        </div>
    )
}

export default Post;
