import { icCSWhatsApp, IcLineBU, IcMessagesBU, IcNotifBU } from '../../../assets';
import { Gap, Input } from '../../atoms'
import './header_page.css';
import { useHistory } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown';

const HeaderPage = ({ nama, currentTime, search, setSearch, setNama, partnerCode, list }) => {
    const history = useHistory();

    return (
        <div className='container-box-header-page'>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ width: '70%' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Gap width={10} />
                        <div>
                            {partnerCode == "119" ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <div className='title-page' style={{ paddingTop: '2px' }}>Welcome, Admin</div>
                                        <Gap width={10} />
                                        <div style={{ display: 'flex', justifyContent: 'start' }}>
                                            <Dropdown onSelect={(eventKey) => setNama(eventKey)}>
                                                <Dropdown.Toggle
                                                    style={{
                                                        backgroundColor: '#61308C',
                                                        fontWeight: 800,
                                                        color: 'white',
                                                        width: '300px',
                                                        fontSize: 16,
                                                        borderRadius: '12px',
                                                    }}
                                                >
                                                    {nama && nama !== "" ? nama : "Select Admin"}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto', borderRadius:'12px' }}>
                                                    {list && list.length > 0 ? (
                                                        list.map((item, index) => {
                                                            return (
                                                                <Dropdown.Item
                                                                    key={item.id} 
                                                                    eventKey={item.nama}
																	style={{width:'300px', textAlign:'center'}}
                                                                >
																	{item.nama == "ASM" ? item.nama = "Asuransi Sinar Mas" : item.nama == "Simas Jiwa" ? item.nama = "Asuransi Simas Jiwa" : item.nama == "Insurtech" ? item.nama = "Asuransi Simas Insurtech" : item.nama == "DSB" ? item.nama = "Dana Saham Bersama" : item.nama}
                                                                </Dropdown.Item>
                                                            )
                                                        })
                                                    ) : (
                                                        <Dropdown.Item disabled>No Data Available</Dropdown.Item>
                                                    )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='title-page'>Welcome,
                                        <span className='title-page'> {nama}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className='date-time-page' style={{}}>{currentTime}</div>
                </div>
                {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', width: '75%', cursor: 'pointer' }} onClick={() => window.open('https://wa.me/628872965503')}>
                        <img src={icCSWhatsApp} className='img-fluid' />
                        <span>Chat CS StarPoin</span>
                    </div>
                    <img src={IcLineBU} className='img-fluid' />
                    <Gap width={30} />
                    <div style={{ width: '100%' }}>
                        <Input
                            placeholder="Search"
                            value={search}
                            onChange={setSearch}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    const value = event.target.value.trim();
                                    if (value !== "") {
                                        history.push(`/globalsearch?q=${encodeURIComponent(value)}`);
                                    }
                                }
                            }}
                        />
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default HeaderPage;