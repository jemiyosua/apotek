import React, { useEffect, useState } from 'react'
import { Button, Gap, Header, Footer } from '../../components';
import { Accordion, Card, CardDeck } from 'react-bootstrap';
import { FaqBackgroundLg, FaqBackgroundMd, FaqBackgroundXs } from '../../assets';
import "./FAQ.css"
import { fetchStatus, generateSignature} from '../../utils/functions'
import { paths } from '../../utils'
import publicIP from 'react-native-public-ip';
import { Markup } from 'interweave';

const Faq = () => {
	
	const [ListFaq, setListFaq] = useState([]);

	useEffect(() => {
		getIP();
        window.scrollTo(0, 0)
	},[])

    const getIP = async() => {
		publicIP()
        .then(ip => {
            LoadData(ip)
        })
        .catch(error => {
            LoadData("0.0.0.0")
        });
	}

	const LoadData = (ip)=>{
        var requestBody = JSON.stringify({
            "param1": ip
        });
        
        var url = paths.URL_API_STATIC+'ShowListWebFaq';
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
                setListFaq(data.list);
            }else{
                alert("Gagal Memuat Data Faq, silakan coba beberapa saat lagi");
            }
        })
        .catch(() => {
            alert("Gagal Memuat Data Faq, silakan coba beberapa saat lagi.");
        });
    }

    return (
        <div>
        <Header></Header>

        <div style={{position:'relative'}}>
            <img className='imgFaqLg' style={{width:'100%'}} src={FaqBackgroundLg} alt="Faq" />
            <img className='imgFaqMd' style={{width:'100%'}} src={FaqBackgroundMd} alt="Faq" />
            <img className='imgFaqXs' style={{width:'100%'}} src={FaqBackgroundXs} alt="Faq" />
            <div className='divHeaderFaq'>
                <p className="txtHeaderFaq1">FAQ&nbsp;</p><p className='txtHeaderFaq2'> about Starpoin</p>
            </div>
        </div>
     
        <div style={{paddingTop:50, paddingBottom:50, justifyContent:'center', alignItems:'center', marginLeft:'11%', marginRight:'10%'}}>
            <CardDeck style={{display:'flex', flexDirection:'row'}}>
                <Card style={{ border: 'none', width:450, textAlign:'left', display:'flex', flexDirection:'row'}}>
                    <div style={{fontSize:24, fontWeight:'Bold'}}>All Questions</div>
                    <div>&nbsp;</div>
                    <Gap height={15} />
                </Card>
            </CardDeck>
        </div>
        
        <div style={{ paddingBottom:100, justifyContent:'center', alignItems:'center', marginLeft:'10%', marginRight:'10%'}}>
            <CardDeck style={{display:'flex', flexDirection:'row'}}>
                <Card style={{ border: 'none', width:'100%', textAlign:'left', display:'flex', flexDirection:'row'}}>
					<div style={{width:'100%'}}>
						{ ListFaq.length > 0 ? ListFaq.map((item)=>
							<Accordion defaultActiveKey="1" style={{marginBottom:'15px'}}>
							<Card>
							    <Accordion.Toggle as={Button} eventKey="0">
									{item.FaqAsk}
								</Accordion.Toggle>
								<Accordion.Collapse eventKey="0">
								<Card.Body>
                                    <Markup content={item.FaqAnswer}/>
								</Card.Body>
								</Accordion.Collapse>
							</Card>
							</Accordion>
							) : "Loading..." 
                        }
                    </div>
                    <div>&nbsp;</div>
                    <Gap height={15} />
                </Card>
            </CardDeck>
        </div>

        <Footer></Footer>
        </div>
    )
}

export default Faq;
