import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import StartSidan from './pages/startsidan';
import Settings from './pages/settings';
import Card from './pages/card';
import AddCard from './pages/addcard';
import CardList from './pages/startsidan'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

function App() {
    const theme = useSelector((state) => state.theme.theme); 
    
    return (
        <Router>
            <div className={theme}>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">
                                <img src="https://www.mastercard.se/content/dam/public/mastercardcom/eu/se/logos/mc-logo-52.svg" alt="" />
                                Master<span className='purple'>Card</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/settings"><FontAwesomeIcon icon={faGear} /></Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<CardList />} /> 
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/card/:id" element={<Card />} />
                    <Route path="/addcard" element={<AddCard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;






