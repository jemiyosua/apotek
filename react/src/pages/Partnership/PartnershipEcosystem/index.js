import React, { useEffect} from 'react';
import { Header, Footer, Gap } from '../../../components';
import { Card, CardDeck} from 'react-bootstrap';
import { StarpoinLaep, StarpoinEngage, StarpoinMarketPlace, StarpoinPay, PartnershipEcosystemBgLg, PartnershipEcosystemBgMd, PartnershipEcosystemBgXs} from '../../../assets';
import './PartnershipEcosystem.css';

const PartnerEcosystem = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
	  },[])

    return (
        <div>
        <Header></Header>
        <img className='imgLg' style={{width:'100%'}} src={PartnershipEcosystemBgLg} alt="PartnershipEcosystem" />
        <img className='imgMd' style={{width:'100%'}} src={PartnershipEcosystemBgMd} alt="PartnershipEcosystem" />
        <img className='imgXs' style={{width:'100%'}} src={PartnershipEcosystemBgXs} alt="PartnershipEcosystem" />
        <div className='divHeaderEcosystem'>
            <p className="txtHeaderEcosystem1">Partnership&nbsp;</p><p className='txtHeaderEcosystem2'> Ecosystem</p>
        </div>
        <Gap height={60}></Gap>
        <div style={{paddingLeft:50, paddingRight:50, paddingTop:50, paddingBottom:50, justifyContent:'center', alignItems:'center', display:'flex', backgroundColor:'#E5E5E5'}}>
            <CardDeck style={{alignItems:'center'}}>
                <Card style={{ border: 'none', textAlign:'center', backgroundColor:'#E5E5E5'}}>
                    <img style={{width:'100%'}} src={StarpoinLaep}></img>
                    <Gap height={15} />
                </Card>
                <Card style={{ border: 'none', width:350, height:250, textAlign:'left', backgroundColor:'#E5E5E5'}}>
                    <div style={{fontSize:30}}><hr></hr></div>
                    <div style={{fontSize:30}}>StarPoin<span style={{fontWeight:'bold'}}>LAEP</span></div>
                    <div>Our company is motivated to include loyalty programs</div>
                    <div>as a Loyalty Aggregator and Ecosystem Platform.</div>
                    <Gap height={15} />
                </Card>
            </CardDeck>
        </div>
        <div style={{paddingTop:50, paddingBottom:50, justifyContent:'center', alignItems:'center', display:'flex'}}>
            <CardDeck style={{alignItems:'center'}}>
                <Card style={{ border: 'none', textAlign:'left'}}>
                    <div style={{fontSize:30}}><hr></hr></div>
                    <div style={{fontSize:30}}>StarPoin<span style={{fontWeight:'bold'}}>Marketplace</span></div>
                    <div>An redemption and lifestyle marketplace.</div>
                    <Gap height={15} />
                </Card>
                <Card style={{ border: 'none', width:350, height:350, textAlign:'center'}}>
                    <img style={{width:'100%'}} src={StarpoinMarketPlace}></img>
                    <Gap height={15} />
                </Card>
            </CardDeck>
        </div>
        <div style={{paddingTop:50, paddingBottom:50, paddingLeft:50, paddingRight:50, justifyContent:'center', alignItems:'center', display:'flex', backgroundColor:'#E5E5E5'}}>
            <CardDeck style={{alignItems:'center'}}>
                <Card style={{ border: 'none', textAlign:'center', backgroundColor:'#E5E5E5'}}>
                    <img style={{width:'100%'}} src={StarpoinEngage}></img>
                    <Gap height={15} />
                </Card>
                <Card style={{ border: 'none', width:350, height:250, textAlign:'left', backgroundColor:'#E5E5E5'}}>
                    <div style={{fontSize:30}}><hr></hr></div>
                    <div style={{fontSize:30}}>StarPoin<span style={{fontWeight:'bold'}}>Engage</span></div>
                    <div>NFT Games Engagement Platform. (Future Development)</div>
                    <Gap height={15} />
                </Card>
            </CardDeck>
        </div>
        <div style={{paddingTop:50, paddingBottom:50,  paddingLeft:50, paddingRight:50, justifyContent:'center', alignItems:'center', display:'flex'}}>
            <CardDeck style={{alignItems:'center'}}>
                <Card style={{ border: 'none', width:350, height:250, textAlign:'left'}}>
                    <div style={{fontSize:30}}><hr></hr></div>
                    <div style={{fontSize:30}}>StarPoin<span style={{fontWeight:'bold'}}>Pay</span></div>
                    <div>Financial Services Product for Loyalty Platform (Future Development)</div>
                    <Gap height={15} />
                </Card>
                <Card style={{ border: 'none', textAlign:'center'}}>
                    <img style={{width:'100%'}} src={StarpoinPay}></img>
                    <Gap height={15} />
                </Card>
            </CardDeck>
        </div>
        <Footer></Footer>
        </div>
    )
}

export default PartnerEcosystem;
