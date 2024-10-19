import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCard, updateCard } from '../store/store';
import logo from '../assets/mastercard.png';
import mastercardSilver from '../assets/silver.jpg';
import mastercardGold from '../assets/gold.jpg';
import mastercardPlatinum from '../assets/plat.jpg';

const Card = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cards = useSelector((state) => state.cards);

    const card = cards.find(card => card.id === parseInt(id));

    if (!card) {
        return <div>Card not found.</div>;
    }

    const [utgivare, setUtgivare] = useState(card.utgivare);
    const [kortnummer, setKortnummer] = useState(card.kortnummer);
    const [kortinnehavare, setKortinnehavare] = useState(card.kortinnehavare);
    const [utgångsmånad, setUtgångsmånad] = useState(card.utgångsmånad);
    const [utgångsår, setUtgångsår] = useState(card.utgångsår);
    const [ccv, setCcv] = useState(card.ccv);
    const [felmeddelande, setFelmeddelande] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        handleIssuerChange({ target: { value: card.utgivare } });
    }, [card.utgivare]);

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

    const validateCard = () => {
        if (!utgivare) return 'Choose a card issuer';
        if (kortnummer.length !== 16 || isNaN(kortnummer)) return 'Card number must be 16 digits';
        const nuvarandeDatum = new Date();
        const fullYear = parseInt(utgångsår, 10) + 2000;
        const utgångsDatum = new Date(fullYear, utgångsmånad - 1);
        if (utgångsDatum < nuvarandeDatum) return 'Expiration date has expired';
        if (fullYear > nuvarandeDatum.getFullYear() + 10) return 'Expiration date is not in the range of 10 years';
        if (/\d/.test(kortinnehavare)) return 'Numbers are not allowed in the name';
        if (ccv.length !== 3 || isNaN(ccv)) return 'CVV must be three digits';
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
        if(window.confirm('Are u sure u want to change this card?')){

            e.preventDefault();
            const validationError = validateCard();
            if (validationError) {
                setFelmeddelande(validationError);
                return;
            }
            setFelmeddelande('');
    
            const updatedCard = {
                id: card.id,
                utgivare,
                kortnummer,
                kortinnehavare,
                utgångsmånad,
                utgångsår,
                ccv,
                isActive: card.isActive 
            };
    
            dispatch(updateCard(updatedCard));
            alert('Card has been updated!');
            navigate('/'); 
        };
        }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this Mastercard?')) {
            dispatch(deleteCard(card.id));
            alert('Card has been deleted');
            navigate('/'); 
        }
    };

    const handleToggleActivation = () => {
        if (window.confirm('Are you sure you want to change this card\'s active state?')) {
            // Kontrollera om kortet redan är aktivt
            if (card.isActive) {
                // Avaktivera det aktuella kortet
                const updatedCard = {
                    ...card,
                    isActive: false,
                };
    
                dispatch(updateCard(updatedCard)); // Uppdatera kortet i store
                alert('Card has been deactivated');
            } else {
                // Hämta alla kort
                const allCards = [...cards];
    
                // Loop genom alla kort och avaktivera dem
                allCards.forEach((c) => {
                    if (c.id !== card.id) {
                        c.isActive = false; // Sätt isActive till false för alla kort utom det nuvarande
                        dispatch(updateCard(c)); // Uppdatera kortet i store
                    }
                });
    
                // Aktivera det nuvarande kortet
                const updatedCard = {
                    ...card,
                    isActive: true, // Sätt det nuvarande kortet till aktivt
                };
    
                dispatch(updateCard(updatedCard)); // Uppdatera det aktiva kortet
                alert('Card is now active');
            }
            navigate('/'); // Navigera tillbaka
        }
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

    return (
        <div className='box'>
            <div className="kort-förhandsvisningx" style={{ backgroundImage }}>
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
                            {utgångsmånad < 10 ? `0${utgångsmånad}` : utgångsmånad}/{utgångsår}
                        </p>
                    </div>
                </div>
            </div>
            <form style={{ minHeight: '440px'}} className='box-inners' onSubmit={handleSubmit}>
                <select value={utgivare} onChange={handleIssuerChange} required>
                    <option value="" disabled hidden>Choose Card Issuer</option>
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
                    <label htmlFor="date">Expiration Date</label>
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
                <p className='error-message'>{felmeddelande}</p>
                {card.isActive === false && (
                    <div className='buttonDiv'>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={handleDelete}>Delete Card</button>
                    </div>      
                )}
                    <button type="button" onClick={handleToggleActivation}>
                    {card.isActive ? 'Deactivate' : 'Activate'} Card
                </button>
            </form>
        </div>
    );
};

export default Card;




