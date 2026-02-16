import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Gap, Header, Input, Footer, Dropdown } from '../../components';
import './Home.css'
import { useDispatch } from 'react-redux';
import { Button, Card, CardDeck, Modal } from 'react-bootstrap';
import { setForm } from '../../redux';
import { paths } from '../../utils'
import { fetchStatus, historyConfig, generateSignature } from '../../utils/functions';
import { EVoucher, DiscountMerchants, EarnPoints, SearchStarpoin, Playstore, Appstore, Partner01, Partner02, Partner03, Partner04, Partner05, Partner06, Partner07, Partner08, Partner09, Partner10, HomeBackgroundLg, IcSearch, IcLocationBar, HomeBackgroundMd, BannerPopup, IcCopy } from '../../assets';
import publicIP from 'react-native-public-ip';
import { IconCloseGray } from '../../admin/assets';

const Home = () => {
    const history = useHistory(historyConfig);
    const dispatch = useDispatch();
    const [Search, setSearch] = useState("")
    const [Kota, setKota] = useState("")
    const [ListKota, setListKota] = useState([]);
    const [ModalBanner, setModalBanner] = useState(false)


    const getIP = async() => {
		publicIP()
        .then(ip => {
            LoadDataKota(ip)
            // setModalBanner(true)
        })
        .catch(error => {
            LoadDataKota("0.0.0.0")
        });
	}

	useEffect(() => {
        window.scrollTo(0, 0)
        getIP()
	  },[])
    
    const LoadDataKota = (ip)=>{
        var requestBody = JSON.stringify({
            "param1": ip,
            "param2": "",
        });
        var url = paths.URL_API_STATIC+'ShowListKota';
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
            if(data.errorcode === "0"){
                setListKota(data.list);
            }else{
                alert("Gagal memuat data kota, silakan coba beberapa saat lagi");
            }
        })
        .catch(() => {
            alert("Gagal memuat data kota, silakan coba beberapa saat lagi.");
        });
    }

    return (
        <div>
            <Header></Header>
            <div className="divSearchBar">
                <div style={{ display:'flex', flexDirection:'row', justifyContent:'center', paddingTop:10, paddingBottom:10, paddingLeft:15, paddingRight:15}}>
                    <div style={{border:'1px solid grey', borderRadius:5, display:'flex', flexDirection:'row', backgroundColor:'white'}}>
                        <span style={{marginLeft:10, marginTop:5, marginRight:5}}><img src={IcLocationBar} width="24" height="24" alt="Icon Location StarPoin"></img></span>
                            <Dropdown className="searchKota" style={{ textAlign: "left", border:'none', margin:0, marginTop:7, backgroundColor:'white' }}
                            onChange={event => {
                                setKota(event.target.value)
                                dispatch(setForm("kota", event.target.value))
                            }}>
                                <option value="">All</option>
                                { ListKota.map((item)=>
                                    <option value={item.Value}>{item.Kota}</option>
                                )}
                            </Dropdown>
                    </div>
                    <div>&nbsp;</div>
                    <div style={{border:'1px solid grey', borderRadius:5, display:'flex', flexDirection:'row', backgroundColor:'white'}}>
                        <span style={{marginLeft:10, marginTop:5, marginRight:5}}><img src={IcSearch} width="20" height="20" alt="Icon Search StarPoin"></img></span>
                        <Input className="searchBar" label="Search Merchant" placeholder ="Search Merchant"
                            onChange={event => {
                                setSearch(event.target.value)
                                dispatch(setForm("search", event.target.value))
                            }}>
                        </Input>
                    </div>
                    <div>&nbsp;</div>
                    <Button className="buttonSearch" style={{backgroundColor:'#61308C', borderColor:'white'}}
                        onClick={()=>{
                            history.push('/all-merchant')
                            dispatch(setForm("Search",Search))
                            dispatch(setForm("Kota",Kota))
                        }}>Search
                    </Button>
                </div>
            </div>
            <div className="divSearchBarXs">
                <div style={{justifyContent:'center', paddingTop:10, paddingBottom:10, paddingLeft:15, paddingRight:15}}>
                    <div style={{border:'1px solid grey', borderRadius:5, display:'flex', flexDirection:'row', backgroundColor:'white'}}>
                        <span style={{marginLeft:10, marginTop:3, marginRight:5}}><img src={IcLocationBar} width="24" height="24" alt="Icon Location StarPoin"></img></span>
                            <Dropdown style={{ textAlign: "left", border:'none', margin:0, backgroundColor:'white' }}
                            onChange={event => {
                                setKota(event.target.value)
                                dispatch(setForm("kota", event.target.value))
                            }}>
                                <option value="">All</option>
                                { ListKota.map((item)=>
                                    <option value={item.Value}>{item.Kota}</option>
                                )}
                            </Dropdown>
                    </div>
                    <div style={{height:10}}></div>
                    <div style={{border:'1px solid grey', borderRadius:5, display:'flex', flexDirection:'row', backgroundColor:'white'}}>
                        <span style={{marginLeft:10, marginTop:5, marginRight:5}}><img src={IcSearch} width="20" height="20" alt="Icon Search StarPoin"></img></span>
                        <Input style={{border:'none'}} label="Search Merchant" placeholder="Search Merchant"
                            onChange={event => {
                                setSearch(event.target.value)
                                dispatch(setForm("search", event.target.value))
                            }}>
                        </Input>
                    </div>
                    <div style={{paddingTop:20, paddingBottom:10,textAlign:'center'}}>
                        <Button style={{backgroundColor:'#61308C', borderColor:'white',justifyContent:'center', alignItems:'center'}}
                            onClick={()=>{
                                history.push('/all-merchant')
                                dispatch(setForm("Search",Search))
                                dispatch(setForm("Kota",Kota))
                            }}>Search Merchant
                        </Button>
                    </div>
                </div>
            </div>
            <div>
                <div style={{position:'relative'}}>
                    <img className='imgLgHome' width='100%' height='auto' src={HomeBackgroundLg} alt="Home Background StarPoin" />
                    <img className='imgMdHome' width='100%' height='auto' src={HomeBackgroundMd} alt="Home Background StarPoin" />
                    <div className='divHeaderHome'>
                        <p className="txtHeaderHome1">StarPoin App</p>
                        <p className="txtHeaderHome2">Loyalty Platform</p>
                        <p className="txtHeaderHome3">Starpoin App is an application for</p>
                        <p className="txtHeaderHome3">Redemption channel for every user</p>
                        <p className="txtHeaderHome3">Join <img src={SearchStarpoin} width="40%" height="auto" alt="Icon Search StarPoin"/> Now!</p>
                        <p>
                        <a href="https://play.google.com/store/apps/details?id=com.starpoin.co.id"><img width="30%" height="auto" src={Playstore} alt="Play Store StarPoin" />{'  '}</a>
                        <a href="https://apps.apple.com/id/app/starpoin/id1548266396"><img width="30%" height="auto" src={Appstore} alt="Apps Store StarPoin" /></a>
                        </p>
                    </div>
                </div>
            </div>
            <div style={{backgroundColor:'#F8F8F8', paddingBottom:40}}>
                <div className='txtJudulHome'>StarPoin Main Features</div>
                <div style={{paddingTop:50, display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <CardDeck style={{alignItems:'center'}}>
                        <Card style={{ border:'none', textAlign:'center', backgroundColor:'#F8F8F8'}}>
                            <img width="250" height="74" src={EarnPoints} alt="Earn Points StarPoin"></img>
                        </Card>
                        <Card style={{ border:'none', textAlign:'center', backgroundColor:'#F8F8F8'}}>
                            <img width="250" height="74" src={DiscountMerchants} alt="Discount Merchant StarPoin"></img>
                        </Card>
                        <Card style={{ border:'none', textAlign:'center', backgroundColor:'#F8F8F8'}}>
                            <img width="250" height="74" src={EVoucher} alt="E Voucher StarPoin"></img>
                        </Card>
                    </CardDeck>
                </div>
                <div className='txtJudulHome'>It’s Easy To Get Started (And Free)</div>
                <div style={{paddingTop:50, display:'flex', alignItems:'center', justifyContent:'center', paddingLeft:10, paddingRight:10}}>
                    <CardDeck style={{alignItems:'center'}}>
                        <Card style={{ border: 'none', width:'100%', maxWidth:350, height:300, textAlign:'center', padding:10}}>
                            <div style={{color:'#626467', fontSize:20, paddingTop:15, paddingBottom:15}}>01.</div>
                            <div style={{fontWeight:'bold', fontSize:20, paddingBottom:15}}>Sign Up</div>
                            <div>Join StarPoin now for free.</div>
                            <div>Simply enter your email,</div>
                            <div>create a password, and you're</div>
                            <div>ready to earn and redeem!</div>
                            <Gap height={15} />
                        </Card>
                        <Card style={{ border: 'none', width:'100%', maxWidth:350, height:300, textAlign:'center', padding:10}}>
                            <div style={{color:'#626467', fontSize:20, paddingTop:15, paddingBottom:15}}>02.</div>
                            <div style={{fontWeight:'bold', fontSize:20, paddingBottom:15}}>Search Favorite Merchant</div>
                            <div>We're providing variety of E-Vouchers /
                            Discount from different category like F&B,
                            Fashion, Beauty, Travel, Financial Product,
                            and many others. </div>
                            <Gap height={15} />
                        </Card>
                        <Card style={{ border: 'none', width:'100%', maxWidth:350, height:300, textAlign:'center', alignItems:'center', padding:10}}>
                            <div style={{color:'#626467', fontSize:20, paddingTop:15, paddingBottom:15}}>03.</div>
                            <div style={{fontWeight:'bold', fontSize:20, paddingBottom:15}}>Get Discount / E-Vouchers</div>
                            <div>Get your Discount / E-Vouchers instantly now.</div>
                            <Gap height={15} />
                        </Card>
                    </CardDeck>
                </div>
            </div>
            <div style={{paddingBottom:50}}>
                <div className='txtJudulHome'>We are Partnering with 500+ Merchant</div>
                <div style={{display:'flex', flexDirection:'row', alignContent:'center', alignItems:'center', justifyContent:'center'}}>
                    <img className='imgPartner' src={Partner01} alt="Partner Simas Invest"></img>
                    <img className='imgPartner' src={Partner02} alt="Partner Simas Fund"></img>
                    <img className='imgPartner' src={Partner03} alt="Partner Tokopedia"></img>
                    <img className='imgPartner' src={Partner04} alt="Partner Indomaret"></img>
                    <img className='imgPartner' src={Partner05} alt="Partner Alfamart"></img>
                </div>
                <div style={{display:'flex', flexDirection:'row', alignContent:'center', alignItems:'center', justifyContent:'center'}}>
                    <img className='imgPartner' src={Partner06} alt="Partner Grab"></img>
                    <img className='imgPartner' src={Partner07} alt="Partner Gojek"></img>
                    <img className='imgPartner' src={Partner08} alt="Partner Ace Hardware"></img>
                    <img className='imgPartner' src={Partner09} alt="Partner Excelso"></img>
                    <img className='imgPartner' src={Partner10} alt="Partner Wei Cafe"></img>
                </div>
            </div>
            <Footer></Footer>
                <Modal
                        show={ModalBanner}
                        onHide={() => ModalBanner(false)}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        style={{ borderRadius:10 }}
                        >
                        <Modal.Body>
                            <div style={{ display:'flex', justifyContent:'flex-end' }}>
                                <img src={IconCloseGray} style={{ width:20, marginLeft:10, cursor:'pointer' }} onClick={() => setModalBanner(false)}></img>
                            </div>
                            <Gap height={10} />
                            <div style={{position:'relative'}}>
                                <a href="https://nanovest.onelink.me/dcRw/download" target="_blank">
                                    <img style={{}} width='100%' height='auto' src={BannerPopup} alt="Nanovest"/>
                                </a>
                                    <div className='txtBanner1'>
                                        <div style={{position:'absolute', display:'flex', flexDirection:'row', width:'100%'}}>
                                            <p style={{fontWeight:'bold', fontSize:17, paddingTop:4, paddingRight:4}}>STARPOIN25 &nbsp;</p>
                                            <div style={{width:15}}></div>
                                            <img src={IcCopy} width={30} height={30} style={{cursor:'pointer'}} onClick={() => {navigator.clipboard.writeText("STARPOIN25")}}></img>
                                        </div>
                                    </div>
                                    <div className='txtBanner2'>
                                        <a href="https://starpoin.notion.site/Cari-Cuan-di-Nanovest-Dapatkan-Cashback-StarPoin-maks-25-000-Points-642fb80ba969467eada88fbca9fd987f" target="_blank" style={{color:'black'}}>Baca disini cara dapat cashback StarPoin di Nanovest</a>
                                    </div>
                            </div>
                        </Modal.Body>
                </Modal>
        </div>
    )
}

export default Home;
