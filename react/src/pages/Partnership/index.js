import React from 'react';
import { Header, Footer } from '../../components';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router'
import { PartnerMd, PartnerXs} from '../../assets';
import './Partner.css';
import { useEffect } from 'react';

const Partnership = () => {
    const history =useHistory();

    useEffect(() => {
        window.scrollTo(0, 0)
	  },[])

    return (
        <div>
        <Header></Header>
        <div>
            <img className='imgPartnerLg' src={PartnerMd} alt="Partner" />
            <img className='imgPartnerMd' src={PartnerMd} alt="Partner" />
            <img className='imgPartnerXs' src={PartnerXs} alt="Partner" />
        </div>
        <div className='divHeaderPartner'>
            <div style={{display:'flex', flexDirection:'row', textAlign:'center'}}>
                <p className="txtHeaderPartner1">Partner&nbsp;</p><p className='txtHeaderPartner2'> with Us</p>
            </div>
        </div>
        <div style={{paddingLeft:20, paddingRight:20}}>
            <div style={{clear:'both'}}></div>
                <div style={{textAlign:'center', fontSize:22, fontWeight: 500}}>Use StarPoin to  Retain Your Loyalty Program</div> 
                <div style={{textAlign:'center', paddingBottom:150, paddingTop:50}}>
                    <Button style={{backgroundColor:'#61308C', width:150}} onClick={()=>{history.push('/partnership-registration')}}>Request Demo</Button>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Partnership;
