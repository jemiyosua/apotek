import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
// import { BrowserRouter } from "react-router-dom";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from '../../pages/Login';
import MainApp from '../../pages/MainApp';

const Routes = () => {
    const [cookies, setCookie] = useCookies(['user']);
    // const {form}=useSelector(state=>state.PaketReducer);

    useEffect(()=>{
        
        
    },[])
    
    return (
        // <BrowserRouter basename="/admin"> 
            <BrowserRouter basename="">
                <Switch>
                        <Route path='/login'>
                        <Login/>
                        </Route>
                        <Route path="/overview">
                            <MainApp/>
                        </Route>
                        <Route path="/merchant">
                            <MainApp/>
                        </Route>
                        <Route path="/report">
                            <MainApp/>
                        </Route>
                        <Route path="/content">
                            <MainApp/>
                        </Route>
                        <Route path="/faq-apps">
                            <MainApp/>
                        </Route>
                        <Route path="/voucher">
                            <MainApp/>
                        </Route>
                        <Route path="/user">
                            <MainApp/>
                        </Route>
                        <Route path="/edit-merchant">
                            <MainApp/>
                        </Route>
                        <Route path="/edit-ultravoucher">
                            <MainApp/>
                        </Route>
                        <Route path="/ultravoucher-import">
                            <MainApp/>
                        </Route>
                        <Route path="/input-admin-access">
                            <MainApp/>
                        </Route>
                        <Route path="/edit-admin-access">
                            <MainApp/>
                        </Route>
                        <Route path="/profile">
                            <MainApp/>
                        </Route>
                        <Route path="/globalsearch">
                            <MainApp/>
                        </Route>
                        <Route exact path='/'>
                        <Login/>
                    </Route>
                </Switch>
            {/* </Router> */}
       </BrowserRouter>
    )
}

export default Routes;
