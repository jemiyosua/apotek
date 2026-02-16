import React, { useEffect, useState } from 'react';
import { Header, Footer, Input, Gap, Dropdown} from '../../../components';
import { Button } from 'react-bootstrap';
import { Card, CardDeck, Row, Col, Spinner } from 'react-bootstrap';
import { DiscountMerchantBgLg, DiscountMerchantBgMd, DiscountMerchantBgXs, GetDiscount1, GetDiscount2, GetDiscount3, IcLocationBar, IcSearch} from '../../../assets';
import './DiscountMerchant.css'
import { useHistory } from 'react-router-dom'
import { setForm } from '../../../redux';
import { useDispatch } from 'react-redux';
import { fetchStatus, generateSignature} from '../../../utils/functions'
import { paths } from '../../../utils'
import publicIP from 'react-native-public-ip';

const DiscountMerchant = () => {

    const [ListMerchant, setListMerchant] = useState([]);
    const [ListKota, setListKota] = useState([]);
    const dispatch = useDispatch();
    const [Search, setSearch] = useState("")
    const [Kota, setKota] = useState("")
    const history = useHistory();
    const [Loading, setLoading] = useState("")


    const getIP = async() => {
        setLoading(true)
		publicIP()
        .then(ip => {
            LoadDataKota(ip)
            LoadDataMerchant(ip)
        })
        .catch(error => {
            setLoading(false)
            LoadDataKota("0.0.0.0")
            LoadDataMerchant("0.0.0.0")
        });
	}

	useEffect(() => {
        window.scrollTo(0, 0)
        getIP()
	  },[])

	const LoadDataMerchant = (ip)=>{
        var requestBody = JSON.stringify({
            "param1": ip,
            "param2": "",
            "param3": "",
            "param5": "",
            "param6": "",
            "param7": "",
            "param8": 1,
            "param9": 3,
        });
        var url = paths.URL_API_STATIC+'ShowListMerchantNew';
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
                setListMerchant(data.list);
                dispatch(setForm("Nama",data.list.Nama))
                dispatch(setForm("Image",data.list.ImgVisual))
                dispatch(setForm("Disc",data.list.Disc))
            }else{
                alert("Gagal Memuat Data Merchant, silakan coba beberapa saat lagi")
            }
            setLoading(false)
        })
        .catch(() => {
            setLoading(false)
            alert("Gagal Memuat Data Merchant, silakan coba beberapa saat lagi.")
        });
    }

    // const LoadDataBestDeal = (Randkey, ip)=>{
    //     var requestBody = JSON.stringify({
    //         "param": Randkey,
    //         "param1": ip
    //     });
    //     var url = paths.URL_API_STATIC+'ShowBestDeal';
    //     var Signature  = generateSignature(requestBody)
		
    //     setLoading(true)
    //     fetch( url, {
    //         method: "POST",
    //         body: requestBody,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Signature': Signature
    //         },
    //     })
    //     .then(fetchStatus)
    //     .then(response => response.json())
    //     .then((data) => {
    //         if(data.errmsg==""){
    //             setListBestDeal(data.list);
    //         }else{
    //             // if(data.ErrorMessage=="Param Key Expired"){
    //             //     setSessionMessage("Session Anda Telah Habis. Silahkan Login Kembali.");
    //             //     setShowAlert(true);
    //             // }else{
    //             //     setErrorMessageAlert("Gagal Memuat Data");
    //             //     setResultMessage("Gagal Memuat Data")
    //             //     setShowAlert(true);
    //             // }
    //         }
    //         setLoading(false)
    //     })
    //     .catch((error) => {
    //         setLoading(false)
    //         // if (error.message == 401) {
    //         //     setErrorMessageAlertLogout("Maaf anda tidak memiliki ijin untuk mengakses halaman ini.");
    //         //     setShowAlert(true);
    //         // } else if (error.message != 401) {
    //         //     setErrorMessageAlert(AlertMessage.failedConnect);
    //         //     setShowAlert(true);
    //         // }
    //         // setResultMessage("")
    //     });
    // }

    const LoadDataKota = (ip)=>{
        var requestBody = JSON.stringify({
            "param1": ip,
            "param2": ""
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
            if(data.errorcode=="0"){
                setListKota(data.list);
            }else{
                setLoading(false)
                alert("Gagal Memuat Data Kota, silakan coba beberapa saat lagi");
            }
        })
        .catch(() => {
            setLoading(false)
            alert("Gagal Memuat Data Kota, silakan coba beberapa saat lagi");
        });
    }


    return (
        <div>
        <Header></Header>
        {Loading ?
            <div className="divLoader">
                <Spinner animation="border" />
            </div>
        :
        <div>
            <div className="divSearchBar">
                <div style={{display:'flex', flexDirection:'row', justifyContent:'center', paddingTop:10, paddingBottom:10, paddingLeft:15, paddingRight:15}}>
                    <div style={{border:'1px solid grey', borderRadius:5, display:'flex', flexDirection:'row', backgroundColor:'white'}}>
                        <span style={{marginLeft:10, marginTop:5, marginRight:5}}><img src={IcLocationBar} alt="Icon Location"></img></span>
                            <Dropdown className="searchKota" style={{ textAlign: "left", border:'none', margin:0, marginTop:5, backgroundColor:'white' }}
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
                        <span style={{marginLeft:10, marginTop:5, marginRight:5}}><img src={IcSearch} alt="Icon Search"></img></span>
                        <Input className="searchBar" 
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
                        <span style={{marginLeft:10, marginTop:3, marginRight:5}}><img src={IcLocationBar} alt="Icon Location StarPoin"></img></span>
                            <Dropdown style={{ textAlign: "left", border:'none', margin:0, backgroundColor:'white'}}
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
                        <span style={{marginLeft:10, marginTop:5, marginRight:5}}><img src={IcSearch} alt="Icon Search StarPoin"></img></span>
                        <Input style={{border:'none'}}
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
            <div style={{position:'relative'}}>
            <img className='imgLg' style={{width:'100%'}} src={DiscountMerchantBgLg} alt="Discount Merchant Starpoin" />
            <img className='imgMd' style={{width:'100%'}} src={DiscountMerchantBgMd} alt="Discount Merchant Starpoin" />
            <img className='imgXs' style={{width:'100%'}} src={DiscountMerchantBgXs} alt="Discount Merchant Starpoin" />
                <div className='divHeaderDiscount'>
                    <p className='txtheaderDiscount1'>Visit Our Merchant!</p>
                    <p className='txtheaderDiscount2'>Shop at more than 20,000 outlets</p>
                    <p className='txtheaderDiscount2'>easy, safe, practical.</p>
                </div>
            </div>
            {/* <div className="divSlideShow">
                <SlideShow></SlideShow>
            </div> */}
            {/* {ListBestDeal.length > 0 ?
                <div>
                    <div>
                        <div className='divJudulLarge'>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#F8F8F8', paddingTop:30, paddingLeft:20, paddingRight:20}}>
                                <CardDeck style={{alignItems:'center'}}>
                                    <Card style={{ border: 'none', width:350, height:'auto',  backgroundColor:'#F8F8F8', textAlign:'left'}}>
                                        <div style={{fontWeight:'bold', fontSize:24}}>Best Deal Merchants</div>
                                        <div style={{fontSize:18}}>Get your discount merchant here!</div>
                                    </Card>
                                    <Card style={{ border: 'none', width:350, height:'auto',  backgroundColor:'#F8F8F8', textAlign:'left'}}>
                                    </Card>
                                    <Card style={{ border: 'none', width:350, height:'auto',  backgroundColor:'#F8F8F8', textAlign:'right'}}>
                                        <a href="/all-merchant">See All</a>
                                    </Card>
                                </CardDeck>
                            </div>
                        </div>
                        <div className='divJudulSmall'>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#F8F8F8', paddingTop:30, paddingLeft:20, paddingRight:20}}>
                                <CardDeck style={{alignItems:'center'}}>
                                    <Card style={{ border: 'none', width:350, height:'auto',  backgroundColor:'#F8F8F8', textAlign:'left'}}>
                                        <div style={{display:'flex', flexDirection:'row', backgroundColor:'#F8F8F8'}}>
                                            <div style={{ textAlign:'left' }}>
                                                <div style={{fontWeight:'bold', fontSize:24}}>Best Deal Merchants</div>
                                                <div style={{fontSize:18}}>Get your discount merchant here!</div>
                                            </div>
                                            <div style={{width:35, paddingTop:20}}></div>
                                            <div style={{paddingTop:20}}>
                                                <a href="/all-merchant">See All</a>
                                            </div>
                                        </div>
                                    </Card>                                
                                </CardDeck>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{paddingBottom:30, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#F8F8F8', paddingTop:20, paddingLeft:20, paddingRight:20}}>
                            <CardDeck style={{alignItems:'center'}}>
                            { ListBestDeal.length > 0 ? ListBestDeal.map((item)=>
                                <Card style={{ border: 'none', boxShadow: '1px 2px 9px #c7c7c7',  width:350, height:450, textAlign:'center'}} 
                                onClick={()=>{
                                    history.push('/' + item.PostName)
                                }}>
                                    <img style={{width:'100%', height:'100%', maxWidth:350, maxHeight:350}} src={item.ImgValue}></img>
                                    {item.Disc > 0 ?
                                        <Row>
                                            <Col xs={9} md={9} lg={9}>
                                                <div style={{textAlign:'left', paddingLeft:15, paddingTop:10, fontWeight:'bold'}}>{item.Nama}</div>
                                                <div style={{textAlign:'left', paddingLeft:15, paddingTop:5, paddingBottom:15}}>Food & Baverage</div>
                                            </Col>
                                            <Col xs={3} md={3} lg={3}>
                                                <div>
                                                    <div style={{textAlign:'right', paddingRight:15, paddingTop:20, color:'#61308C', fontWeight:'bold' }}>Disc.</div>
                                                    <div style={{textAlign:'right', paddingRight:15, color:'#61308C', fontWeight:'bold' }}>{item.Disc}%</div>
                                                </div>
                                            </Col>
                                        </Row>
                                    :  
                                        <div>
                                            <div style={{textAlign:'left', paddingLeft:15, paddingRight:15, paddingTop:10, fontWeight:'bold'}}>{item.Nama}</div>
                                            <div style={{textAlign:'left', paddingLeft:15, paddingTop:5, paddingBottom:15}}>Food & Baverage</div>
                                        </div>
                                    }
                                    <Gap height={15} />
                                </Card>
                                ) : "Loading..." }
                            </CardDeck>
                        </div>
                    </div>
                </div>
            : <div></div>} */}
            <div>
                <div className='divJudulLarge'>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#F8F8F8', paddingTop:20, paddingLeft:20, paddingRight:20}}>
                        <CardDeck style={{alignItems:'center'}}>
                            <Card style={{ border: 'none', width:350, height:'auto',  backgroundColor:'#F8F8F8', textAlign:'left'}}>
                                <div style={{fontWeight:'bold', fontSize:24}}>New Merchants</div>
                                <div style={{fontSize:18}}>Find Your favorite merchant here!</div>
                            </Card>
                            <Card style={{ border: 'none', width:350, height:'auto',  backgroundColor:'#F8F8F8', textAlign:'left'}}>
                            </Card>
                            <Card style={{ border: 'none', width:350, height:'auto',  backgroundColor:'#F8F8F8', textAlign:'right'}}>
                                <a href="/all-merchant">See All</a>
                            </Card>
                        </CardDeck>
                    </div>
                </div>
                <div className='divJudulSmall'>
                    <div style={{display:'flex', alignItems:'left', justifyContent:'left', backgroundColor:'#F8F8F8', paddingTop:20, paddingLeft:20, paddingRight:20}}>
                        <CardDeck style={{alignItems:'left'}}>
                            <Card style={{ border: 'none', width:250, height:'auto',  backgroundColor:'#F8F8F8', textAlign:'left'}}>
                                <div style={{display:'flex', flexDirection:'row', backgroundColor:'#F8F8F8'}}>
                                    <div style={{ textAlign:'left' }}>
                                        <div style={{fontWeight:'bold', fontSize:24}}>New Merchants</div>
                                        <div style={{fontSize:18}}>Find Your favorite merchant here!</div>
                                    </div>
                                </div>
                            </Card>                                
                        </CardDeck>
                    </div>
                </div>
            </div>
            <div>
                <div className='divMerchantLarge' style={{paddingBottom:30, alignItems:'center', justifyContent:'center', backgroundColor:'#F8F8F8', paddingTop:20, paddingLeft:20, paddingRight:20}}>
                    <CardDeck style={{alignItems:'center'}}>
                    { ListMerchant.length > 0 ? ListMerchant.map((item)=>
                        <Card style={{ border: 'none', boxShadow: '1px 2px 9px #c7c7c7',  width:350, height:340, textAlign:'center', cursor:'pointer'}} 
                        onClick={()=>{
                            history.push('/' + item.PostName)
                        }}>
                            <img style={{width:'100%', height:'100%', maxWidth:350, maxHeight:230}} src={item.ImgVisual} alt={item.Nama}></img>
                            {item.Disc > 0 ?
                                <Row>
                                    <Col xs={9} md={9} lg={9}>
                                        <div style={{textAlign:'left', paddingLeft:15, paddingRight:15, paddingTop:10, fontWeight:'bold'}}>{item.Nama}</div>
                                        <div style={{textAlign:'left', paddingLeft:15, paddingTop:5, paddingBottom:15}}>{item.Category}</div>
                                    </Col>
                                    <Col xs={3} md={3} lg={3}>
                                        <div>
                                            <div style={{textAlign:'right', paddingRight:15, paddingTop:20, color:'#61308C', fontWeight:'bold' }}>Disc.</div>
                                            <div style={{textAlign:'right', paddingRight:15, color:'#61308C', fontWeight:'bold' }}>{item.Disc}%</div>
                                        </div>
                                    </Col>
                                </Row>
                            :  
                                <div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingRight:15, paddingTop:10, fontWeight:'bold'}}>{item.Nama}</div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingTop:5, paddingBottom:15}}>{item.Category}</div>
                                </div>
                            }
                            <Gap height={15} />
                        </Card>
                        ) : "Loading..." }
                    </CardDeck>
                </div>
                <div className='divMerchantMedium' style={{paddingBottom:30, alignItems:'center', justifyContent:'center', backgroundColor:'#F8F8F8', paddingTop:20, paddingLeft:20, paddingRight:20}}>
                    <CardDeck style={{alignItems:'center'}}>
                    { ListMerchant.length > 0 ? ListMerchant.map((item)=>
                        <Card style={{ border: 'none', boxShadow: '1px 2px 9px #c7c7c7',  width:350, height:400, textAlign:'center', cursor:'pointer'}} 
                        onClick={()=>{
                            history.push('/' + item.PostName)
                        }}>
                            <img style={{width:'100%', height:'100%', maxWidth:350, maxHeight:250}} src={item.ImgVisual} alt={item.Nama}></img>
                            {item.Disc > 0 ?
                                <div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingRight:15, paddingTop:10, fontWeight:'bold'}}>{item.Nama}</div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingTop:5}}>Hotel</div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingTop:10, color:'#61308C', fontWeight:'bold' }}>Disc.{item.Disc}%</div>
                                </div>
                            :  
                                <div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingRight:15, paddingTop:10, fontWeight:'bold'}}>{item.Nama}</div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingTop:5, paddingBottom:15}}>{item.Category}</div>
                                </div>
                            }
                            <Gap height={15} />
                        </Card>
                        ) : "Loading..." }
                    </CardDeck>
                </div>
                <div className='divMerchantSmall' style={{paddingBottom:30, alignItems:'center', justifyContent:'center', backgroundColor:'#F8F8F8', paddingTop:20, paddingLeft:20, paddingRight:20}}>
                    <CardDeck style={{alignItems:'center'}}>
                    { ListMerchant.length > 0 ? ListMerchant.map((item)=>
                        <Card style={{ border: 'none', boxShadow: '1px 2px 9px #c7c7c7',  width:300, height:400, textAlign:'center', cursor:'pointer'}} 
                        onClick={()=>{
                            history.push('/' + item.PostName)
                        }}>
                            <img style={{width:'100%', height:'100%', maxWidth:300, maxHeight:250}} src={item.ImgVisual} alt={item.Nama}></img>
                            {item.Disc > 0 ?
                                <div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingRight:15, paddingTop:10, fontWeight:'bold'}}>{item.Nama}</div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingTop:5}}>Hotel</div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingTop:10, color:'#61308C', fontWeight:'bold' }}>Disc.{item.Disc}%</div>
                                </div>
                            :  
                                <div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingRight:15, paddingTop:10, fontWeight:'bold'}}>{item.Nama}</div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingTop:5, paddingBottom:15}}>{item.Category}</div>
                                </div>
                            }
                            <Gap height={15} />
                        </Card>
                        ) : "Loading..." }
                    </CardDeck>
                </div>
                <div className='divMerchantXSmall' style={{paddingBottom:30, alignItems:'center', justifyContent:'center', backgroundColor:'#F8F8F8', paddingTop:20, paddingLeft:20, paddingRight:20}}>
                    <CardDeck style={{alignItems:'center'}}>
                    { ListMerchant.length > 0 ? ListMerchant.map((item)=>
                        <Card style={{ border: 'none', boxShadow: '1px 2px 9px #c7c7c7',  width:250, height:400, textAlign:'center', cursor:'pointer'}} 
                        onClick={()=>{
                            history.push('/' + item.PostName)
                        }}>
                            <img style={{width:'100%', height:'100%', maxWidth:250, maxHeight:250}} src={item.ImgVisual} alt={item.Nama}></img>
                            {item.Disc > 0 ?
                                <div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingRight:15, paddingTop:10, fontWeight:'bold'}}>{item.Nama}</div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingTop:5}}>Hotel</div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingTop:10, color:'#61308C', fontWeight:'bold' }}>Disc.{item.Disc}%</div>
                                </div>
                            :  
                                <div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingRight:15, paddingTop:10, fontWeight:'bold'}}>{item.Nama}</div>
                                    <div style={{textAlign:'left', paddingLeft:15, paddingTop:5, paddingBottom:15}}>{item.Category}</div>
                                </div>
                            }
                            <Gap height={15} />
                        </Card>
                        ) : "Loading..." }
                    </CardDeck>
                </div>
                <div className='divJudulSmall'>
                    <div style={{alignItems:'center', justifyContent:'center', paddingLeft:20, paddingRight:20, backgroundColor:'#F8F8F8'}}>
                        <CardDeck style={{alignItems:'center'}}>
                            <Card style={{ border: 'none'}}>
                                <div style={{ textAlign:'center', backgroundColor:'#F8F8F8', paddingBottom:30}}>
                                    <a href="/all-merchant">See All</a>
                                </div>
                            </Card>                                
                        </CardDeck>
                    </div>
                </div>
            </div>
            <div style={{paddingTop:30, paddingBottom:50, paddingLeft:20, paddingRight:20}}>
                <div style={{paddingTop:50, display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <CardDeck style={{alignItems:'center'}}>
                        <Card style={{ border:'none', textAlign:'center'}}>
                            <img style={{width:'100%'}} src={GetDiscount1} alt="Get Diskon ke-1 Starpoin"></img>
                        </Card>
                        <Card style={{ border:'none', textAlign:'center'}}>
                            <img style={{width:'100%'}} src={GetDiscount2} alt="Get Diskon ke-2 Starpoin"></img>
                        </Card>
                        <Card style={{ border:'none', textAlign:'center'}}>
                            <img style={{width:'100%'}} src={GetDiscount3} alt="Get Diskon ke-3 Starpoin"></img>
                        </Card>
                    </CardDeck>
                </div>
            </div>
        </div>
        }
        <Footer></Footer>
        </div>
    )
}

export default DiscountMerchant;
