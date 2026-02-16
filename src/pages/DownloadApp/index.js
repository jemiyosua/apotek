import React, {useEffect } from 'react';
import { Header, Footer, Gap } from '../../components';
import { Col, Container, Row } from 'react-bootstrap';
import { DownloadPage, QrDownloadApp } from '../../assets';

const DownloadApp = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
	},[])

    return (
        <div>
        <Header></Header>
        <Container>
            <Row>
                <Col xs={12} md={6} lg={6}>
                    <div style={{padding:20}}>
                        {/* <img src={DownloadPage} style={{width:'100%', maxWidth:300}} alt="Download StarPoin"></img> */}
                        <img className="imgStarVoucher" src={DownloadPage} alt="Download StarPoin"></img>
                    </div>
                </Col>
                <Col xs={12} md={6} lg={6}>
                    <div style={{paddingTop:50, paddingBottom:50}}>
                        <p style={{fontSize:30}}>Install & Register to StarPoin</p>
                        <p>Download StarPoin app on Play Store & App Store and register your account.</p>
                        <img src={QrDownloadApp} width="231" height="231" alt="Qr Download StarPoin"></img>
                    </div>
                </Col>
            </Row>
            <Gap height={30}></Gap>
        </Container>
        <Footer></Footer>
        </div>
    )
}

export default DownloadApp;
