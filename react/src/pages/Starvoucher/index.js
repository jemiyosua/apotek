import React from 'react';
import { Gap, Header, Footer} from '../../components';
import { Card, CardDeck, Col, Row } from 'react-bootstrap';
import { StarVoucherBg, GetStarVoucher1, GetStarVoucher2, GetStarVoucher3, StarvoucherDisplay, StarVoucherBgMd, StarVoucherBgXs } from '../../assets';
import './Starvoucher.css'
import { useEffect } from 'react';


const Starvoucher = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
	  },[])

    return (
        <div>
        <Header></Header>
        <div style={{position:'relative'}}>
            <img className="imgLgStarvoucher" style={{width:'100%'}} src={StarVoucherBg} alt="Starvoucher" />
            <img className="imgMdStarvoucher" style={{width:'100%'}} src={StarVoucherBgMd} alt="Starvoucher" />
            <img className="imgXsStarvoucher" style={{width:'100%'}} src={StarVoucherBgXs} alt="Starvoucher" />
            <div className='divHeaderStarvoucher'>
                <p className="txtHeaderStarvoucher1">Enjoy the Savings and get the prizes</p>
                <div style={{height:30}}></div>
                <p className="txtHeaderStarvoucher3">Transactions, payments, </p>
                <p className="txtHeaderStarvoucher3">cashback and rewards </p>
                <p className="txtHeaderStarvoucher3">—with StarVoucher</p>
            </div>
        </div>

        <div style={{justifyContent:'center', alignItems:'center', backgroundColor:'#F8F8F8', padding:50}}>
                <Row>
                    <Col xs={12} md={12} lg={6}>
                        <div style={{padding:20}}>
                            <img className="imgStarVoucher" src={StarvoucherDisplay} alt="StarvoucherDisplay"></img>
                        </div>
                    </Col>
                    <Col xs={12} md={12} lg={6}>
                        <div className="textStarVoucher">
                            <div className="divJudulTextStarvoucher">StarVoucher</div>
                            <div className="divJudulTextStarvoucher1">StarVoucher StarVoucher has various merchant categories, from
                            Food & Beverage, Lifestyle, E-commerce,
                            Entertainment, Investment, Department Store, Beauty & Relaxation, Hotel & Travel, Accessories &
                            Jewelry categories.</div>
                            <div className="divJudulTextStarvoucher1" style={{paddingTop:20}}>You can get all vouchers and share them with everyone.
                            So you can get many benefits and happiness.</div>
                            <Gap height={15} />
                        </div>
                    </Col>
                </Row>
                
        </div>
        <div style={{paddingBottom:50}}>
            <div style={{textAlign:'center', padding:20, fontSize:25}}>How to get StarVoucher:</div>
            <div style={{paddingTop:50, display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
                <CardDeck style={{alignItems:'center'}}>
                    <Card style={{ border:'none', textAlign:'center'}}>
                        <img style={{width:'100%', maxWidth:350, maxHeight:300,}} src={GetStarVoucher1} alt="GetStarVoucher1"></img>
                    </Card>
                    <Card style={{ border:'none', textAlign:'center'}}>
                        <img style={{width:'100%', maxWidth:350, maxHeight:300,}} src={GetStarVoucher2} alt="GetStarVoucher2"></img>
                    </Card>
                    <Card style={{ border:'none', textAlign:'center'}}>
                        <img style={{width:'100%', maxWidth:350, maxHeight:300,}} src={GetStarVoucher3} alt="GetStarVoucher3"></img>
                    </Card>
                </CardDeck>
            </div>
        </div>

        <Footer></Footer>
        </div>
    )
}

export default Starvoucher;
