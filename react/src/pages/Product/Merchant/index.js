import React, { useEffect, useState } from 'react';
import { Header, Footer, Input, Gap, Dropdown} from '../../../components';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Card, CardDeck, Container, Col, Row, Spinner } from 'react-bootstrap';
import { IcLocationBar, IcSearch } from '../../../assets';
import './Merchant.css'
import { useSelector,useDispatch } from 'react-redux';
import { fetchStatus, generateSignature} from '../../../utils/functions'
import { paths } from '../../../utils'
import ReactPaginate from 'react-paginate';
import publicIP from 'react-native-public-ip';

const Merchant = () => {

    const {form}=useSelector(state=>state.LoginReducer);
    const [ListMerchant, setListMerchant] = useState([])
    const [ListKategori, setListKategori] = useState([])
    const [Kategori, setKategori] = useState("")
    const [ListKota, setListKota] = useState([])
    const [Ip, setIP] = useState("")
    const [SearchMerchant, setSearchMerchant] = useState("")
    const [KotaMerchant, setKotaMerchant] = useState("")
    const history = useHistory();
    const [TotalMerchant, setTotalMerchant] = useState('');
    const [TotalPages, setTotalPages] = useState(1);
    const [Loading, setLoading] = useState("")
    const [LoadingMerchant, setLoadingMerchant] = useState("")
    const [Paging, setPaging] = useState(true)


	useEffect(() => {
        window.scrollTo(0, 0)
        GetData()
	  },[])

    const GetData = async () => {
        
		setLoading(true)
        publicIP()
        .then(ip => {
            setIP(ip)
            LoadDataMerchant(1, ip)
            LoadDataKategori(ip)
            LoadDataKota(ip)
        })
        .catch(error => {
            setLoading(false)
            LoadDataMerchant(1, "0.0.0.0")
            LoadDataKategori("0.0.0.0")
            LoadDataKota("0.0.0.0")
        });
    }

	const LoadDataMerchant = (currentPage, ip)=>{
        console.log("masuk sini")
        if (SearchMerchant != ""){
            var search = SearchMerchant;
        }else{
            var search = form.search;
            setSearchMerchant(form.search);
        }

        if (KotaMerchant != ""){
            var kota = KotaMerchant;
        }else{
            var kota = form.kota;
            setKotaMerchant(form.kota);
        }

        var requestBody = JSON.stringify({
            "param1": ip,
            "param2": Kategori,
            "param3": kota,
            "param5": search,
            "param6": "",
            "param7": "",
            "param8": currentPage,
            "param9": 5,
        });

        console.log(requestBody)

        var url = paths.URL_API_STATIC+'ShowListMerchantNew';
        var Signature  = generateSignature(requestBody)

		setLoadingMerchant(true)
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
            if (data.errcode=="0") {
                window.scrollTo(0, 0)
                var vListMerchant = data.list;
                setListMerchant(vListMerchant);
                setTotalMerchant(data.totalMerchant)
                var total = data.totalMerchant / 5;
                var totalPages = Math.ceil(total)
                setTotalPages(totalPages)
                setPaging(true)
                if (totalPages < 1 ) {
                    setPaging(false)
                }
                setLoading(false)
            }else{
                // alert("Gagal memuat data merchant, silakan coba beberapa saat lagi")
                setTotalMerchant(0)
                setTotalPages(0)
                setPaging(false)
                setLoading(false)
            }
            setLoading(false)
            setLoadingMerchant(false)
        })
        .catch(() => {
            setLoading(false)
            setLoadingMerchant(false)
            alert("Gagal memuat data merchant, silakan coba beberapa saat lagi.")
        });
    }

    const LoadDataKategori = (ip)=>{
        var requestBody = JSON.stringify({
            "param1": ip,
            "param2": "",
        });
        var url = paths.URL_API_STATIC+'ShowListCategoryMerchantNew';
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
                setListKategori(data.list);
            }else{
                alert("Gagal memuat data kategori, silakan coba beberapa saat lagi")
            }
            setLoading(false)
        })
        .catch(() => {
            setLoading(false)
            alert("Gagal memuat data kategori, silakan coba beberapa saat lagi.")
        });
    }

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
            if(data.errorcode=="0"){
                setListKota(data.list);
            }else{
                alert("Gagal memuat data kota, silakan coba beberapa saat lagi")
            }
            setLoading(false)
        })
        .catch((error) => {
            setLoading(false)
            alert("Gagal memuat data kota, silakan coba beberapa saat lagi.")
        });
    }

    const handlePageClick = (data) => {

        window.scrollTo(0, 0)
        let currentPage = data.selected + 1
        setListMerchant([])
        LoadDataMerchant(currentPage, Ip)
    }
    
    const [isShown, setIsShown] = useState(false);

    const handleComponent = event => {
        setKategori("")
        setIsShown(current => !current);
    }
    
    const handleChange = (e) => {
        // Destructuring
        const { value, checked } = e.target;
        // Case 1 : The user checks the box
        if (checked) {
            if(Kategori == ""){
                setKategori(value)
            }else{
                setKategori(Kategori + "," + value)
            }
        } else { // Case 2  : The user unchecks the box
            var kategori = Kategori.replaceAll(","+value, "")
            var kategori = kategori.replaceAll(value, "")
            setKategori(kategori)
        }
    };

    return (
        <div>
        <Header></Header>
        {Loading ?
            <div className="divLoaderMerchant">
                <Spinner animation="border" />
            </div>
        :
            <div>
                <div className="divSearchBar">
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center', paddingTop:10, paddingBottom:10, paddingLeft:15, paddingRight:15}}>
                        <div style={{border:'1px solid grey', borderRadius:5, display:'flex', flexDirection:'row', backgroundColor:'white'}}>
                            <span style={{marginLeft:10, marginTop:5, marginRight:5}}><img src={IcLocationBar}></img></span>
                                <Dropdown className="searchKota" style={{ textAlign: "left", border:'none', marginTop:5, backgroundColor:'white' }}
                                onChange={event => {
                                    setKotaMerchant(event.target.value)
                                }}>
                                    <option value="">All</option>
                                    { ListKota.length > 0 ? ListKota.map((item)=>
                                            <option value={item.Value} selected={item.Value == KotaMerchant}>{item.Kota}</option>
                                    ):"Loading..." }
                                </Dropdown>
                        </div>
                        <div>&nbsp;</div>
                        <div style={{border:'1px solid grey', borderRadius:5, display:'flex', flexDirection:'row', backgroundColor:'white'}}>
                            <span style={{marginLeft:10, marginTop:5, marginRight:5}}><img src={IcSearch}></img></span>
                            <Input className="searchBar" value={SearchMerchant}
                            onChange={event => {
                                setSearchMerchant(event.target.value)
                            }}></Input>
                        </div>
                        <div>&nbsp;</div>
                        <Button className="buttonSearch" style={{backgroundColor:'#61308C', borderColor:'white'}}
                            onClick={()=>{
                                form.kota = "";
                                form.search = "";
                                LoadDataMerchant(1, Ip)
                                setListMerchant([])
                            }}>Search
                        </Button>
                    </div>
                </div>
                <div className="divSearchBarXs">
                <div style={{justifyContent:'center', paddingTop:10, paddingBottom:10, paddingLeft:15, paddingRight:15}}>
                    <div style={{border:'1px solid grey', borderRadius:5, display:'flex', flexDirection:'row', backgroundColor:'white'}}>
                        <span style={{marginLeft:10, marginTop:3, marginRight:5}}><img src={IcLocationBar}></img></span>
                            <Dropdown style={{ textAlign: "left", border:'none', margin:0, backgroundColor:'white' }}
                            onChange={event => {
                                setKotaMerchant(event.target.value)
                            }}>
                                <option value="">All</option>
                                { ListKota.length > 0 ? ListKota.map((item)=>
                                        <option value={item.Value} selected={item.Value == KotaMerchant}>{item.Kota}</option>
                                ):"Loading..." }
                            </Dropdown>
                    </div>
                    <div style={{height:10}}></div>
                    <div style={{border:'1px solid grey', borderRadius:5, display:'flex', flexDirection:'row', backgroundColor:'white'}}>
                        <span style={{marginLeft:10, marginTop:5, marginRight:5}}><img src={IcSearch}></img></span>
                        <Input style={{border:'none'}} value={SearchMerchant}
                            onChange={event => {
                            setSearchMerchant(event.target.value)
                            }}>
                        </Input>
                    </div>
                    <div style={{paddingTop:20, paddingBottom:10,textAlign:'center'}}>
                        <Button style={{backgroundColor:'#61308C', borderColor:'white',justifyContent:'center', alignItems:'center'}}
                             onClick={()=>{
                                form.kota = "";
                                form.search = "";
                                LoadDataMerchant(1, Ip)
                                setListMerchant([])
                            }}>Search Merchant
                        </Button>
                    </div>
                </div>
            </div>
                <Gap height={30}></Gap>
                <Container>
                    <Row>
                        <Col xs={12} md={4} lg={4}  className="divKategori">
                                <div style={{width:300, textAlign:'left'}}>
                                    <p style={{fontWeight:'bold', fontSize:30}}>All Merchants</p>
                                    <p style={{margin:0, paddingBottom:20}}>{TotalMerchant} Merchant</p>
                                </div>
                        </Col>
                        <Col xs={12} md={8} lg={8}>
                        </Col>
                    </Row>
                </Container>
                <div className="divFilter">
                    <Button onClick={handleComponent}>Filter</Button>
                </div>
                {isShown && 
                    <div style={{paddingLeft:30, paddingRight:30, paddingBottom:30}}>
                        <CardDeck style={{alignItems:'left'}}>
                            <Card style={{ border: 'none', boxShadow: '1px 2px 9px #c7c7c7', textAlign:'left'}}>
                                { ListKategori.length > 0 ? ListKategori.map((item, index)=>
                                    <div>
                                        {item.CountMerchant > 0 ?
                                            <div style={{paddingLeft:15, paddingTop:15}}>
                                                <input
                                                    style={{ marginTop: 3 }}
                                                    type="checkbox"
                                                    name="category"
                                                    value={item.CategoryValue}
                                                    checked={item.Checked}
                                                    onChange={handleChange}
                                                />
                                                <label style={{ fontSize: 13, marginLeft: 10, textTransform:'capitalize' }}>{item.CategoryValue.replaceAll("-", " ")} &nbsp;({item.CountMerchant})</label>
                                            </div>
                                        :
                                            null
                                        }
                                    </div>
                                ): "Kosong" }
                                <hr></hr>
                                <Button style={{backgroundColor:'#61308C',border:'none', width:130, marginLeft:'auto', marginRight:'auto', marginBottom:15}} 
                                onClick={()=>{
                                    LoadDataMerchant(1, Ip)
                                    setListMerchant([])
                                    setIsShown(false)
                                }}>Apply</Button> 
                            </Card>
                        </CardDeck>
                    </div>
                }
                <Container>
                    <Row>
                        <Col xs={12} md={4} lg={4}  className="divKategori">
                            <CardDeck style={{alignItems:'left', paddingRight:20}}>
                                <Card style={{ border: 'none', boxShadow: '1px 2px 9px #c7c7c7',  width:300, textAlign:'left'}}>
                                    { ListKategori.length > 0 ? ListKategori.map((item, index)=>
                                        <div>
                                            {item.CountMerchant > 0 ?
                                                <div style={{paddingLeft:15, paddingTop:15}}>
                                                    <input
                                                        style={{ marginTop: 3 }}
                                                        type="checkbox"
                                                        name="category"
                                                        value={item.CategoryValue}
                                                        checked={item.Checked}
                                                        onChange={handleChange}
                                                    />
                                                    <label style={{ fontSize: 13, marginLeft: 10, textTransform:'capitalize' }}>{item.CategoryValue.replaceAll("-", " ")} &nbsp;({item.CountMerchant})</label>
                                                </div>
                                            :
                                                null
                                            }
                                        </div>
                                    ): "Kosong" }
                                <hr></hr>
                                <Button style={{backgroundColor:'#61308C',border:'none', width:130, marginLeft:'auto', marginRight:'auto', marginBottom:15}} 
                                onClick={()=>{
                                    LoadDataMerchant(1, Ip)
                                    setListMerchant([])
                                    window.scrollTo(0, 0)
                                }}>Apply</Button> 
                                </Card>
                            </CardDeck>
                        </Col>

                        <Col xs={12} md={8} lg={8}>
                        {LoadingMerchant ?
                            <div className="divLoaderMerchant">
                                <Spinner animation="border" />
                            </div>
                        :
                            <div>
                                <div className="divMerchantLg">
                                    { ListMerchant.length > 0 ? ListMerchant.map((item)=>
                                    <div>
                                            <Card style={{ border: 'none', boxShadow: '1px 2px 9px #c7c7c7', cursor:'pointer'}} onClick={()=>{
                                                    history.push('/' + item.PostName)
                                                }}>
                                                <Card.Text>
                                                    <Row>
                                                        <Col xs={4} md={4} lg={4}>
                                                            <img className="merchantImg" src={item.ImgVisual}></img>
                                                        </Col>
                                                        <Col xs={8} md={8} lg={8}>
                                                            <div className="divJudulText">
                                                                <p class="textNama">{item.Nama}</p>
                                                                <p class="textAlamat">{item.Alamat}</p>
                                                            </div>
                                                            <div className="divText">
                                                                <div style={{ display:'flex', alignItems:'left', justifyContent:'left'}}>
                                                                    <p style={{color:'#828282', paddingRight:35}}>Opening Hour</p>
                                                                    <p style={{color:'#828282'}}>{item.OpeningHour == "" ? "-" : item.OpeningHour}</p>
                                                                </div>
                                                                <div style={{ display:'flex', alignItems:'left', justifyContent:'left'}}>
                                                                    <p style={{color:'#828282', paddingRight:20}}>Promo/Discount</p>
                                                                    {item.Disc > 0 ? 
                                                                    <div>
                                                                        <p style={{color:'white', paddingLeft:5, paddingBottom:5, paddingRight:20, backgroundColor:'#61308C'}}>Disc. {item.Disc}%</p>
                                                                    </div>
                                                                    :
                                                                    <div>
                                                                        <p style={{paddingLeft:5, paddingBottom:5, paddingRight:20}}>{item.Promo}</p>
                                                                    </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Text>
                                            </Card>
                                            <Gap height={20}></Gap>
                                    </div>
                                    ) : <div>Merchant tidak ditemukan</div>
                                    }
                                </div>
                                <div className="divMerchantXs">
                                <div style={{paddingBottom:50, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:20, paddingLeft:20, paddingRight:20}}>
                                    <CardDeck style={{alignItems:'center'}}>
                                        { ListMerchant.length > 0 ? ListMerchant.map((item)=>
                                        <Card style={{ border: 'none', boxShadow: '1px 2px 9px #c7c7c7',  width:330, height:450, textAlign:'center'}} 
                                        onClick={()=>{
                                            history.push('/' + item.PostName)
                                        }}>
                                            <img style={{width:'100%', height:'100%', maxWidth:330, maxHeight:200}} src={item.ImgVisual}></img>
                                            <div style={{paddingLeft:20, paddingRight:20, paddingTop:20, textAlign:'left'}}>
                                                <p style={{fontWeight:'bold', fontSize:16, marginBottom:0}}>{item.Nama}</p>
                                                <p style={{marginBottom:0, fontSize:14}}>{item.Alamat}</p>
                                            </div>
                                            <div style={{padding:20}}>
                                                <div style={{ display:'flex', alignItems:'left', justifyContent:'left'}}>
                                                    <p style={{color:'#828282', paddingRight:10}}>Opening Hour</p>
                                                    <p style={{color:'#828282'}}>{item.OpeningHour == "" ? "-" : item.OpeningHour}</p>
                                                </div>
                                                <div style={{ display:'flex', alignItems:'left', justifyContent:'left'}}>
                                                    <p style={{color:'#828282', paddingRight:20}}>Promo/Discount</p>
                                                    {item.Disc > 0 ? 
                                                    <div>
                                                        <p style={{color:'white', paddingLeft:5, paddingBottom:5, paddingRight:20, backgroundColor:'#61308C'}}>{item.Disc}%</p>
                                                    </div>
                                                    :
                                                    <div>
                                                        <p style={{paddingLeft:5, paddingBottom:5, paddingRight:20}}>{item.Promo}</p>
                                                    </div>
                                                    }
                                                </div>
                                            </div>
                                            <Gap height={15} />
                                        </Card>
                                        ) : <div>Merchant tidak ditemukan</div>}
                                    </CardDeck>
                                </div>
                                </div>
                                <div className="divMerchantXXs">
                                <div style={{paddingBottom:50, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:20, paddingLeft:20, paddingRight:20}}>
                                    <CardDeck style={{alignItems:'center'}}>
                                        { ListMerchant.length > 0 ? ListMerchant.map((item)=>
                                        <Card style={{ border: 'none', boxShadow: '1px 2px 9px #c7c7c7',  width:250, height:450, textAlign:'center'}} 
                                        onClick={()=>{
                                            history.push('/' + item.PostName)
                                        }}>
                                            <img style={{width:'100%', height:'100%', maxWidth:250, maxHeight:200}} src={item.ImgVisual}></img>
                                            <div style={{paddingLeft:20, paddingRight:20, paddingTop:20, textAlign:'left'}}>
                                                <p style={{fontWeight:'bold', fontSize:16, marginBottom:0}}>{item.Nama}</p>
                                                <p style={{marginBottom:0, fontSize:14}}>{item.Alamat}</p>
                                            </div>
                                            <div style={{padding:20}}>
                                                <div style={{ display:'flex', alignItems:'left', justifyContent:'left'}}>
                                                    <p style={{color:'#828282', paddingRight:10}}>Opening Hour</p>
                                                    <p style={{color:'#828282'}}>{item.OpeningHour == "" ? "-" : item.OpeningHour}</p>
                                                </div>
                                                <div style={{ display:'flex', alignItems:'left', justifyContent:'left'}}>
                                                    <p style={{color:'#828282', paddingRight:20}}>Promo/Discount</p>
                                                    {item.Disc > 0 ? 
                                                    <div>
                                                        <p style={{color:'white', paddingLeft:5, paddingBottom:5, paddingRight:20, backgroundColor:'#61308C'}}>{item.Disc}%</p>
                                                    </div>
                                                    :
                                                    <div>
                                                        <p style={{paddingLeft:5, paddingBottom:5, paddingRight:20}}>{item.Promo}</p>
                                                    </div>
                                                    }
                                                </div>
                                            </div>
                                            <Gap height={15} />
                                        </Card>
                                        ) : <div>Merchant tidak ditemukan</div> }
                                    </CardDeck>
                                </div>
                                </div>
                            </div>
                        }
                            {Paging ? 
                            <div style={{display: 'flex', justifyContent:'center'}}>
                                <div className="divPageLg">
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
                                        pageRangeDisplayed={2} 
                                        previousLabel="Prev"
                                        nextLabel="Next"
                                    />
                                </div>
                                <div className="divPageXs">
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
                                        pageRangeDisplayed={2} 
                                        previousLabel="Prev"
                                        nextLabel="Next"
                                        marginPagesDisplayed="1"
                                    />
                                </div>
                            </div>
                            :
                            <div></div>
                        }
                        </Col>
                    </Row>
                </Container>
                <div style={{paddingBottom:20, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:20}}>
                    <div>
                        
                    </div>
                    
                </div>
            </div>
        }
        <Footer></Footer>
        </div>
    )
}

export default Merchant;
