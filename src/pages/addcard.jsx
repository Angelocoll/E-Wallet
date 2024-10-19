import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCard } from '../store/store'; 
import { useNavigate } from 'react-router-dom';
import logo from '../assets/mastercard.png';
import mastercardSilver from '../assets/silver.jpg';
import mastercardGold from '../assets/gold.jpg';
import mastercardPlatinum from '../assets/plat.jpg';

const AddCard = () => {
    const [utgivare, setUtgivare] = useState(''); 
    const [kortnummer, setKortnummer] = useState('');
    const [kortinnehavare, setKortinnehavare] = useState('');
    const [utgångsmånad, setUtgångsmånad] = useState('');
    const [utgångsår, setUtgångsår] = useState('');
    const [ccv, setCcv] = useState('');
    const [felmeddelande, setFelmeddelande] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cards = useSelector((state) => state.cards); 
    const [backgroundImage, setBackgroundImage] = useState('');

    const validateCard = () => {
        if(cards.length > 3) return '4 cards maximum'
        if (!utgivare) return 'Choice a Card issuer';
        if (kortnummer.length !== 16 || isNaN(kortnummer)) return 'Card number need to be 16 numbers';
        
        const nuvarandeDatum = new Date();
        const fullYear = parseInt(utgångsår, 10) + 2000; 
        const utgångsDatum = new Date(fullYear, utgångsmånad - 1);
        
        if (utgångsDatum < nuvarandeDatum) return 'Expire date has expired my son';
        if (fullYear > nuvarandeDatum.getFullYear() + 10) return 'Expire date is more then 10 years away';
        if (/\d/.test(kortinnehavare)) return 'Card holders name can not contain numbers';
        if (ccv.length !== 3 || isNaN(ccv)) return 'CCV need to be three numbers';
        return ''; 
    };

    const handleCardNumberInput = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
        setKortnummer(value);
    };

    const handleCcvInput = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
        setCcv(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationError = validateCard();
        if (validationError) {
            setFelmeddelande(validationError);
            return;
        }
        setFelmeddelande(''); 

        
        const nextId = cards.length > 0 ? Math.max(...cards.map(card => card.id)) + 1 : 1;

        const nyttKort = {
            id: nextId,
            utgivare,
            kortnummer,
            kortinnehavare,
            utgångsmånad,
            utgångsår,
            ccv,
            isActive: cards.length === 0,
        };

        dispatch(addCard(nyttKort));
        navigate('/');
    };

    const formattedCardNumber = () => {
        let cardNum = kortnummer.padEnd(16, '#'); 
        const formattedGroups = []; 

        for (let i = 0; i < cardNum.length; i += 4) {
            const group = []; 

            for (let j = 0; j < 4; j++) {
                if (i + j < cardNum.length) {
                    group.push(
                        <span key={i + j} className={`card-char ${cardNum[i + j] !== '#' ? 'animate' : ''}`}>
                            {cardNum[i + j] === '#' ? '#' : cardNum[i + j]}
                        </span>
                    );
                }
            }

            formattedGroups.push(<div key={i} className='card-group'>{group}</div>);
        }

        return formattedGroups; 
    };

    const handleIssuerChange = (e) => {
        const selectedIssuer = e.target.value;
        setUtgivare(selectedIssuer);
        switch (selectedIssuer) {
            case "Mastercard Silver":
                setBackgroundImage(`url(${mastercardSilver})`);
                break;
            case "Mastercard Gold":
                setBackgroundImage(`url(${mastercardGold})`);
                break;
            case "Mastercard Platinum":
                setBackgroundImage(`url(${mastercardPlatinum})`);
                break;
            default:
                setBackgroundImage(''); 
                break;
        }
    };

    return (
        <div className='box'>
            <div className="kort-förhandsvisning" style={{ backgroundImage: backgroundImage }}>
                <div className='card-header'>
                    <img src={logo} alt="Kortutgivare logo" className='card-logo'/>
                    <h4>{utgivare || "Card Issuer"}</h4>
                </div>
                <div className='cardnumber-field'>
                    {formattedCardNumber()} 
                </div>
                <div className='footer-card'>
                    <div className='card-holder'>
                        <p className='label-card'>Card Holder</p>
                        <p>{kortinnehavare || "Full Name"}</p>
                    </div>
                    <div>
                        <p className='label-card'>Expire</p>
                        <p>
                            {utgångsmånad || "MM"}/{utgångsår || "YY"}
                        </p>
                    </div>
                </div>

            </div>
            <form className='box-inners' onSubmit={handleSubmit}>
                <select value={utgivare} onChange={handleIssuerChange} required>
                    <option value="" disabled hidden>Choice Card Issuer</option>
                    <option value="Mastercard Silver">Mastercard Silver</option>
                    <option value="Mastercard Gold">Mastercard Gold</option>
                    <option value="Mastercard Platinum">Mastercard Platinum</option>
                </select>

                <label htmlFor="kortnummer">Card Number</label>
                <input
                    type="text"
                    value={kortnummer}
                    onChange={handleCardNumberInput}
                    id='kortnummer'
                    required
                />
                <label htmlFor="kortinnehavare">Card Holder</label>
                <input
                    type="text"
                    value={kortinnehavare}
                    onChange={(e) => setKortinnehavare(e.target.value)}
                    id='kortinnehavare'
                    required
                />
                <div className='label-box'>
                    <label htmlFor="date">Expire Date</label>
                    <div>

                    <label htmlFor="ccv">CVV</label>
                    </div>
                </div>
                <div className='date-inputs'>
                    <select value={utgångsmånad} onChange={(e) => setUtgångsmånad(e.target.value)} id='date' required>
                        <option value="" disabled hidden>Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                    </select>
                    <select value={utgångsår} onChange={(e) => setUtgångsår(e.target.value)} required>
                        <option value="" disabled hidden>Year</option>
                        {Array.from({ length: 75 }, (_, i) => (
                            <option key={i + 24} value={i + 24}>{i + 24}</option>
                            ))}
                    </select>
                           
                    <input
                        type="text"
                        value={ccv}
                        onChange={handleCcvInput}
                        id='ccv'
                        required
                    />
                </div>
               
                <button type="submit">Submit</button>
                {felmeddelande && <div style={{ color: 'red', marginTop: '1rem' }}>{felmeddelande}</div>}
            </form>
        </div>
    );
};

export default AddCard;

