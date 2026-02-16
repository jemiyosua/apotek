import React, { useEffect } from 'react';
import { Gap, Header, Footer } from '../../components';
import { Card, CardDeck, Row, Col, Container } from 'react-bootstrap';
import { AboutUsBackgroundLg, AboutUsBackgroundMd, AboutUsBackgroundXs, BoardTeam1, BoardTeam2 } from '../../assets';
import './AboutUs.css'

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
	},[])

    return (
        <div>
        <Header></Header>
        <div style={{position:'relative'}}>
            <img className='imgLg' style={{width:'100%'}} src={AboutUsBackgroundLg} alt="logo" />
            <img className='imgMd' style={{width:'100%'}} src={AboutUsBackgroundMd} alt="logo" />
            <img className='imgXs' style={{width:'100%'}} src={AboutUsBackgroundXs} alt="logo" />
            <div className='divHeaderAboutUs'>
                <p className="txtHeaderAboutUs1">About</p>
                <p className="txtHeaderAboutUs2">PT Star Poin Indonesia</p>
                <p className="txtHeaderAboutUs3">Starpoin App is an application for
                    Become a nationally integrated loyalty platform 
                    and points aggregator, and provide various 
                    products such as e-vouchers for users. As a points 
                    aggregator, StarPoin provides an ecosystem for 
                    merchants and users to interact with each other.
                </p>
            </div>
        </div>
        <div style={{backgroundColor:'#F8F8F8', paddingLeft:20, paddingRight:20}}>
            <div style={{textAlign:'center', paddingTop:100, fontSize:22, fontWeight: 500, paddingBottom:20}}>Our business is inspired to integrated loyalty programs as Loyalty Aggregator and Ecosystem Platform.</div>
            <div style={{textAlign:'center', paddingTop:40, fontSize:30, fontWeight: 500, paddingBottom:20}}> Our Vision and Mission</div>
            <div style={{paddingBottom:100, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <CardDeck style={{alignItems:'center'}}>
                    <Card style={{ border: 'none', width:'100%', maxWidth:350, maxHeight:250, textAlign:'center', padding:20}}>
                        <div style={{color:'#888888', fontSize:20, paddingTop:15, paddingBottom:15}}>01.</div>
                        <div style={{fontWeight:'bold', fontSize:23, paddingBottom:15}}>Users</div>
                        <div>Engaging users with selected</div>
                        <div>and popular merchants</div>
                        <Gap height={15} />
                    </Card>
                    <Card style={{ border: 'none', width:'100%', maxWidth:350, maxHeight:250, textAlign:'center', padding:20}}>
                        <div style={{color:'#888888', fontSize:20, paddingTop:15, paddingBottom:15}}>02.</div>
                        <div style={{fontWeight:'bold', fontSize:23, paddingBottom:15}}>Trusted</div>
                        <div>Become a trusted loyalty</div>
                        <div>program for users</div>
                        <Gap height={15} />
                    </Card>
                    <Card style={{ border: 'none', width:'100%', maxWidth:350, maxHeight:250, textAlign:'center', alignItems:'center', padding:20}}>
                        <div style={{color:'#888888', fontSize:20, paddingTop:15, paddingBottom:15}}>03.</div>
                        <div style={{fontWeight:'bold', fontSize:23, paddingBottom:15}}>Innovative</div>
                        <div>Introducing new innovative products</div>
                        <Gap height={15} />
                    </Card>
                </CardDeck>
            </div>
        </div>
        <Gap height={20}></Gap>
        {/* <Container>
            <Row>
                <Col xs={12} md={6} lg={6}>
                    <div>
                        <div style={{fontSize:24}}>Board Of Team</div>
                    </div>
                </Col>
            </Row>
        </Container>
        <Gap height={20}></Gap>
        <div>
            <Container>
                <Row>
                    <Col xs={12} md={6} lg={6}>
                        <div>
                            <Row>
                                <Col xs={4} md={4} lg={4}>
                                    <img style={{width:150}} src={BoardTeam1} class="img-fluid rounded-start" alt="..."></img>
                                </Col>
                                <Col xs={8} md={8} lg={8}>
                                    <h4 class="card-title" style={{marginBottom:5}}>Name</h4>
                                    <h5 class="card-title">Position</h5>
                                    <p class="card-text" style={{paddingBottom:20}}>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={12} md={6} lg={6}>
                        <div>
                            <Row>
                                <Col xs={4} md={4} lg={4}>
                                    <img style={{width:150}} src={BoardTeam1} class="img-fluid rounded-start" alt="..."></img>
                                </Col>
                                <Col xs={8} md={8} lg={8}>
                                    <h4 class="card-title" style={{marginBottom:5}}>Name</h4>
                                    <h5 class="card-title">Position</h5>
                                    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Gap height={30}></Gap>
                <Row>
                    <Col xs={12} md={6} lg={6}>
                        <div>
                            <Row>
                                <Col xs={4} md={4} lg={4}>
                                    <img style={{width:150}} src={BoardTeam1} class="img-fluid rounded-start" alt="..."></img>
                                </Col>
                                <Col xs={8} md={8} lg={8}>
                                    <h4 class="card-title" style={{marginBottom:5}}>Name</h4>
                                    <h5 class="card-title">Position</h5>
                                    <p class="card-text" style={{paddingBottom:20}}>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={12} md={6} lg={6}>
                        <div>
                            <Row>
                                <Col xs={4} md={4} lg={4}>
                                    <img style={{width:150}} src={BoardTeam1} class="img-fluid rounded-start" alt="..."></img>
                                </Col>
                                <Col xs={8} md={8} lg={8}>
                                    <h4 class="card-title" style={{marginBottom:5}}>Name</h4>
                                    <h5 class="card-title">Position</h5>
                                    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div> */}
        <Gap height={70}></Gap>
        <div style={{paddingRight:20, paddingLeft:20}}>
            <Container>
                <Row>
                    <Col xs={12} md={6} lg={6}>
                        <div className='divContact'>
                            <div>
                                <div style={{fontSize:22}}>Our</div>
                                <div style={{fontSize:30}}>Office Location</div>
                                <div>Menara Tekno Lantai 7.</div>
                                <div>Jl. H. Fachrudin No.19, RT.1/RW.7, Kebon Sirih,</div>
                                <div>Tanah Abang, Central Jakarta City, Jakarta 10250</div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={6} lg={6}>
                        <iframe className="divIframe" title="Map Office StarPoin" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5972462252626!2d106.81325931458852!3d-6.184620895522621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f7efde39effd%3A0xcf55346206a2578c!2sMenara%20Tekno!5e0!3m2!1sen!2sid!4v1662103724438!5m2!1sen!2sid"style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </Col>
                </Row>
            </Container>
        </div>
        <Gap height={100}></Gap>
        <Footer></Footer>
        </div>
    )
}

export default AboutUs;
