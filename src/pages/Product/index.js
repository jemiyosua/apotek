import React from 'react';
import { Header, Footer } from '../../components';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { ProductBackground, ProductBackgroundMd, ProductBackgroundXs } from '../../assets';
import './Product.css'
import { useEffect } from 'react';

const Product = () => {
    const history =useHistory();

    useEffect(() => {
        window.scrollTo(0, 0)
	},[])

    return (
        <div>
        <Header></Header>
        <div>
        <img className='imgProductLg' src={ProductBackground} alt="Product StarPoin" />
        <img className='imgProductMd' src={ProductBackgroundMd} alt="Product StarPoin" />
        <img className='imgProductXs' src={ProductBackgroundXs} alt="Product StarPoin" />
        </div>
        <div className='divHeaderProduct'>
            <p className="txtHeaderProduct1">Our Products</p>
            <Button style={{backgroundColor:'white', color:'#61308C', borderColor:'#61308C', width:150, marginTop:30}} onClick={()=>{history.push('/discount-merchant')}}>Get Started</Button>
        </div>
        <div>
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

export default Product;
