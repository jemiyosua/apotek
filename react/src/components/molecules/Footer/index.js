import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import { LogoKominfo, Playstore, Appstore, IcEmail, IcPhone, IcLocation, Instagram, Twitter, Facebook, Youtube, Tiktok, IcStarmall } from '../../../assets';
import './footer.css';

const Footer = ({}) => {
  return (
    <MDBFooter className='text-center text-lg-start' style={{backgroundColor:'#F8F8F8'}}>

      <section className=''>
        <MDBContainer>
          <MDBRow style={{paddingLeft:20, paddingTop:30, textAlign:'left'}}>
            <MDBCol sm="6" md="3" lg="3" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{color:'black'}}> STARPOIN</h6>
              <p>
                <a href='/about-us' style={{color:'#626467'}}>
                  About Us
                </a>
              </p>
              <p>
                <a href='/product' style={{color:'#626467'}}>
                  Product
                </a>
              </p>
              <p>
                <a href='/partnership' style={{color:'#626467'}}>
                  Partnership
                </a>
              </p>
              <p>
                <a href='/kebijakan-privasi' style={{color:'#626467'}}>
                  Kebijakan Privasi
                </a>
              </p>
              {/* <p>
                <a href='#!' className='text-reset'>
                  Blog
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Starmall&nbsp;<img src={IcStarmall} style={{width:20}}></img>
                </a>
              </p> */}
            </MDBCol>

            <MDBCol sm="6" md="3" lg="3" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{color:'black'}}>CUSTOMER SERVICE</h6>
              <p>
                <a href='/faq' style={{color:'#626467'}}>
                  FAQ
                </a>
              </p>
              <h6 className='text-uppercase fw-bold mb-4' style={{color:'black'}}>BECOME OUR PARTNER</h6>
              <p>
                <a href='/partnership-registration' className='text-reset'>
                    <Button style={{backgroundColor:'#61308C', border:'none'}}>Request Demo</Button>
                </a>
              </p>
            </MDBCol>

            <MDBCol sm="6" md="3" lg="3" xl="3" className='mx-auto mb-4'>
                <h6 className='text-uppercase fw-bold mb-4' style={{color:'black'}}>REGISTERED ON</h6>
                <p>
                    <img src={LogoKominfo} width="66" height="89" alt="keminfo" />
                </p>
                <h6 className='text-uppercase fw-bold mb-4' style={{color:'black'}}>DOWNLOAD APP</h6>
                <p>
                    <a href="https://play.google.com/store/apps/details?id=com.starpoin.co.id"><img src={Playstore} width="70" height="25" alt="PlayStore StarPoin" />{'  '}</a>
                    <a href="https://apps.apple.com/id/app/starpoin/id1548266396"><img src={Appstore} width="70" height="25" alt="AppsStore StarPoin" /></a>
                </p>
            </MDBCol>

            <MDBCol sm="6" md="3" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{color:'black'}}>CONTACT US</h6>
              <p>
                <img src={IcEmail} width="22" height="22" alt="Icon Location StarPoin"></img>{' '}
                <a href="mailto:support@starpoin.id" style={{color:'#626467'}}>support@starpoin.id</a>
              </p>
              {/* <p style={{color:'#626467'}}>
                <img src={IcPhone} width="22" height="22" alt="Icon Location StarPoin"></img>{' '}
				          <a href="tel:+62213925660" style={{color:'#626467'}}>021-3925660,</a> WA.088223789167 / 08872965503
              </p> */}
              <p style={{color:'#626467'}}>
                <img src={IcPhone} width="22" height="22" alt="Icon Location StarPoin"></img>{' '}
				          WA.088223789167 / 08872965503
              </p>
              <p style={{color:'#626467'}}>
                <img src={IcLocation} width="22" height="22" alt="Icon Location StarPoin"></img>{' '}
                PT. Star Poin Indonesia
                Menara Tekno Lantai 8,
                Jl. H. Fachrudin No.19,
                RT.1/Rw.7, Kebon Sirih,
                Tanah Abang, Central Jakarta City,
                Jakarta 10250
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
        <div style={{ backgroundColor: '#000000', paddingTop:50, paddingLeft:35, paddingRight:50, paddingBottom:50}}>
            <div className='divFooterLg'>
				<div className='divFooterFollowUs'>Follow us.
                    <div style={{paddingLeft:17}}><a href="https://www.instagram.com/starpoin_id/?hl=en" aria-label="Instagram StarPoin"><img src={Instagram} width="28" height="28" alt="Instagram StarPoin"></img></a></div>
                    <div style={{paddingLeft:17}}><a href="https://twitter.com/starpoin_id" aria-label="Twitter StarPoin"><img src={Twitter} width="28" height="28" alt="Twitter StarPoin"></img></a></div>
                    <div style={{paddingLeft:17}}><a href="https://www.facebook.com/starpoin_id/" aria-label="Faceook StarPoin"><img src={Facebook} width="28" height="28" alt="Facebook StarPoin"></img></a></div>
                    <div style={{paddingLeft:17}}><a href="https://www.youtube.com/watch?v=gZ15UVjnFRI" aria-label="Youtube StarPoin"><img src={Youtube} width="28" height="28" alt="Youtube StarPoin"></img></a></div>
                    <div style={{paddingLeft:17}}><a href="https://www.tiktok.com/@starpoin.id?_t=8W6T2zapQEk&_r=1" aria-label="Tiktok StarPoin"><img src={Tiktok} width="28" height="28" alt="Tiktok StarPoin"></img></a></div>
                </div>
                <div className='divCopyRight'>Copyright @ 2023 PT. Star Poin Indonesia. All rights reserved.</div> 
            </div>
			<div className='divFooterXs'>
				<div style={{color:'white'}}>Follow us.</div>
				<div className='divFooterFollowUs'>
                    <div><a href="https://www.instagram.com/starpoin_id/?hl=en" aria-label="Instagram StarPoin"><img src={Instagram} width="28" height="28" alt="Instagram StarPoin"></img></a></div>
                    <div style={{paddingLeft:17}}><a href="https://twitter.com/starpoin_id" aria-label="Twitter StarPoin"><img src={Twitter} width="28" height="28" alt="Twitter StarPoin"></img></a></div>
                    <div style={{paddingLeft:17}}><a href="https://www.facebook.com/starpoin_id/" aria-label="Facebook StarPoin"><img src={Facebook} width="28" height="28" alt="Facebook StarPoin"></img></a></div>
                    <div style={{paddingLeft:17}}><a href="https://www.youtube.com/watch?v=gZ15UVjnFRI" aria-label="Youtube StarPoin"><img src={Youtube} width="28" height="28" alt="Youtube StarPoin"></img></a></div>
                    <div style={{paddingLeft:17}}><a href="https://www.tiktok.com/@starpoin.id?_t=8W6T2zapQEk&_r=1" aria-label="Tiktok StarPoin"><img src={Tiktok} width="28" height="28" alt="Tiktok StarPoin"></img></a></div>
                </div>
                <div className='divCopyRight'>Copyright @ 2023 PT. Star Poin Indonesia. All rights reserved.</div> 
            </div>
        </div>
    </MDBFooter>
  );
}

export default Footer