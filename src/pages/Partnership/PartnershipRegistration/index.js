import React, { useEffect, useState } from 'react';
import { Header, Footer, Input, TextArea } from '../../../components';
import { Button } from 'react-bootstrap';
import { Card, CardDeck, Spinner } from 'react-bootstrap';
import { IcRefresh, PartnershipRegistrationBg} from '../../../assets';
import './PartnershipRegistration.css';
import { fetchStatus, generateSignature, validEmail} from '../../../utils/functions'
import { paths } from '../../../utils'
import publicIP from 'react-native-public-ip';

const PartnershipRegistration = () => {
    
    const [Loading, setLoading] = useState("")
    const [Name, setName] = useState("")
    const [Company, setCompany] = useState("")
    const [Email, setEmail] = useState("")
    const [Phone, setPhone] = useState("")
    const [Industry, setIndustry] = useState("")
    const [CompanyAddress, setCompanyAddress] = useState("")
    const [Captcha, setCaptcha] = useState("")
    const [IpAddress, setIpAddress] = useState("")

    const getIP = async() => {
		publicIP()
        .then(ip => {
            setIpAddress(ip)
        })
        .catch(error => {
            setIpAddress("0.0.0.0")
        });
	}

    useEffect(() => {
        window.scrollTo(0, 0)
        getIP()
        generate()
	  },[])


    const btnAction = () => {
        setLoading(true)
        vadidate();
    }

    const vadidate = () => {
        var randomCaptcha = document.getElementById("image")

        if(Name == ""){
            setLoading(false)
            alert("Name harus diisi")
        }else if(Company == ""){
            setLoading(false)
            alert("Company Name harus diisi")
        }else if(Email == ""){
            setLoading(false)
            alert("Email harus diisi")
        }else if(!validEmail(Email)){
            setLoading(false)
            alert("Format Email tidak sesuai")
        }else if(Phone == ""){
            setLoading(false)
            alert("Phone Number harus diisi")
        }else if (isNaN(Phone)){
            alert("Phone Number harus angka");
        }else if(Phone.length > 14){
            setLoading(false)
            alert("Phone Number max 13 angka");
        }else if(Phone.length < 10){
            setLoading(false)
            alert("Phone Number min 10 angka");
        }else if(Industry == ""){
            setLoading(false)
            alert("Industry harus diisi")
        }else if(CompanyAddress == ""){
            setLoading(false)
            alert("Company Address harus diisi")
        }else if(randomCaptcha.innerHTML != Captcha){
            setLoading(false)
            alert("Captcha Salah")
        }else{
            register();
        }
    }

    const register = () => {

        var requestBody = JSON.stringify({
            "param1": IpAddress,
            "param2" : Name,
            "param3" : Company,
            "param4" : Email,
            "param5" : Phone,
            "param6" : Industry,
            "param7" : CompanyAddress,
        });

        var url = paths.URL_API_DYNAMIC+'RequestDemo';
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
            if(data.errcode=="0"){
                alert("Terima kasih! StarPoin akan segera menghubungi Anda.")
                setName("")
                setCompany("")
                setEmail("")
                setPhone("")
                setIndustry("")
                setCompanyAddress("")
                setCaptcha("")
                generate()
            }else{
                alert(data.errmsg)
                generate()
            }
            setLoading(false)
        })
        .catch((error) => {
            setLoading(false);
            alert("Terjadi kesalahan pada internal server! Harap tunggu beberapa saat lagi");
        });
    }

    var captcha;
    const generate = () => {
    
        // Access the element to store
        // the generated captcha
        captcha = document.getElementById("image");
        var uniquechar = "";
    
        const randomchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        // Generate captcha for length of
        // 5 with random character
        for (let i = 1; i < 5; i++) {
            uniquechar += randomchar.charAt(Math.random() * randomchar.length)
        }
    
        // Store generated input
        captcha.innerHTML = uniquechar;
    }

    return (
        <div>
        <Header></Header>
        <div>
            <img style={{width:'100%'}} src={PartnershipRegistrationBg} alt="PartnershipRegistration" />
            <div className='divHeaderPartnership'>
                <p><span className="txtHeaderPartnership1">Partnership </span><span className='txtHeaderPartnership2'>Registration</span></p>
            </div>
        </div>
        <div style={{paddingLeft:30, paddingRight:20}}>
            <div style={{textAlign:'center', fontSize:38, fontWeight: 500, paddingBottom:20, paddingTop:30}}>Consult with Us Now!</div> 
            <div style={{textAlign:'center', fontSize:28, paddingBottom:20}}>Leave us some information and we will be in touch as soon as possible!</div> 
        </div>
        <div className="divRegister" style={{paddingTop:30, paddingBottom:30, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <CardDeck className="divBorder" >
                    <Card style={{ textAlign:'center'}}>
                        <div style={{ padding:20, display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <CardDeck className="divKolom">
                                <Card style={{ border:'none', textAlign:'left'}}>
                                    <div>Name<span style={{color:'red'}}> *</span></div>
                                    <div>
                                        <Input id='name' value={Name} label="name"
                                        onChange={event => {
                                            setName(event.target.value)
                                        }}>
                                    </Input>
                                    </div>
                                </Card>
                                <Card style={{ border:'none', textAlign:'left'}}>
                                    <div>Company Name<span style={{color:'red'}}> *</span></div>
                                    <div>
                                        <Input id='company_name' value={Company}
                                            onChange={event => {
                                                setCompany(event.target.value)
                                            }}>
                                        </Input>
                                    </div>
                                </Card>
                            </CardDeck>
                        </div>
                        <div style={{ paddingLeft:20, paddingRight:20, display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <CardDeck className="divKolom">
                                <Card style={{ border:'none', textAlign:'left'}}>
                                    <div>Email<span style={{color:'red'}}> *</span></div>
                                    <div>
                                        <Input id='email' value={Email}
                                            onChange={event => {
                                                setEmail(event.target.value)
                                            }}>
                                        </Input>
                                    </div>
                                </Card>
                                <Card style={{ border:'none', textAlign:'left'}}>
                                    <div>Phone Number<span style={{color:'red'}}> *</span></div>
                                    <div>
                                        <Input id='phone_number' value={Phone} maxLength="13"
                                            onChange={event => {
                                                setPhone(event.target.value)
                                            }}>
                                        </Input>
                                    </div>
                                </Card>
                            </CardDeck>
                        </div>
                        <div style={{ paddingLeft:20, paddingRight:20, display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <CardDeck className="divKolom">
                                <Card style={{ border:'none', textAlign:'left'}}>
                                    <div>Industry<span style={{color:'red'}}> *</span></div>
                                    <div>
                                        <Input id='industry' value={Industry}
                                            onChange={event => {
                                                setIndustry(event.target.value)
                                            }}>
                                        </Input>
                                    </div>
                                </Card>
                            </CardDeck>
                        </div>
                        <div style={{ paddingTop:20, paddingLeft:20, paddingRight:20, display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <CardDeck className="divKolom">
                                <Card style={{ border:'none', textAlign:'left'}}>
                                    <div>Company Address<span style={{color:'red'}}> *</span></div>
                                    <div>
                                        <TextArea id='company_address' value={CompanyAddress}
                                            onChange={event => {
                                                setCompanyAddress(event.target.value)
                                            }}>
                                        </TextArea>
                                    </div>
                                </Card>
                            </CardDeck>
                        </div>

                        <div style={{ paddingTop:20, paddingLeft:20, paddingRight:20, display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <CardDeck className="divKolom">
                                <Card style={{ border:'none', textAlign:'left'}}>
                                    <div>Captcha<span style={{color:'red'}}> *</span></div>
                                    <div>
                                        <Input
                                            onChange={event => {
                                                setCaptcha(event.target.value)
                                            }}>
                                        </Input>
                                    </div>
                                </Card>
                                <Card style={{ border:'none', textAlign:'left'}}>
                                    <div id="image" ></div>
                                </Card>
                                <img src={IcRefresh} style={{width:20, paddingTop:20}} onClick={generate}></img>
                            </CardDeck>
                        </div>
                        
                        <div style={{alignItems:'start', justifyContent:'start', paddingBottom:25, paddingTop:20}}>
                            <Button style={{backgroundColor:'#61308C', border:'none'}} onClick={btnAction}>
                                {Loading ?
                                <span>
                                    <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    Loading ...
                                </span>
                                : "Request Demo"}</Button>
                        </div>
                    </Card>
                </CardDeck>
            </div>
        <Footer></Footer>
        </div>
    )
}

export default PartnershipRegistration;
