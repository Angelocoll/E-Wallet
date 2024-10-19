import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteCard } from '../store/store'; // Importera deleteCard från store
import logo from '../assets/mastercard.png'; // Logotyp
import mastercardSilver from '../assets/silver.jpg';
import mastercardGold from '../assets/gold.jpg';
import mastercardPlatinum from '../assets/plat.jpg';
import Card from './card';

const CardList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cards = useSelector((state) => state.cards); 
    console.log(cards)

    // Funktion för delete knappen 
    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this Mastercard?")) {
            dispatch(deleteCard(id));
            alert("Card deleted successfully."); 
        }
    };

    const addNewCard = () => {
        navigate('/addcard');
    };

    // Funktion för att hämta kort bilden
    //enkel switch and case fungerar lite som C#
    const getBackgroundImage = (utgivare) => {
        switch (utgivare) {
            case "Mastercard Silver":
                return mastercardSilver;
            case "Mastercard Gold":
                return mastercardGold;
            case "Mastercard Platinum":
                return mastercardPlatinum;
            default:
                return null; 
        }
    };

    // Funktion för att dela kortnummer i grupper om 4
    const formatCardNumber = (number) => {
        return number.match(/.{1,4}/g) || []; 
    };

    // Om det inte finns kort returnerar detta
    if (cards.length === 0) {
        return (
            <div className='no-cards'>
                <h3>No Cards Available Right Now...</h3>
                <button onClick={addNewCard}>Add New Card</button>
            </div>
        );
    }

    const activeCards = cards.filter(card => card.isActive);
    const inactiveCards = cards.filter(card => !card.isActive);

    const CardDisplay = ({ card }) => (
        <div className="kort-förhandsvisning-startsidan"
            onClick={() => navigate(`/card/${card.id}`)}
            style={{
                backgroundImage: `url(${getBackgroundImage(card.utgivare)})`,
                cursor: 'pointer',  
            }}
        >
            <div className='card-header'>
                <img src={logo} alt="Kortutgivare logo" className='card-logo' />
                <h4>{card.utgivare}</h4>
            </div>
            <div className='cardnumber-field'>
                {formatCardNumber(card.kortnummer).map((group, index) => (
                    <div key={index} className='card-group'>{group}</div>
                ))}
            </div>
            <div className='footer-card'>
                <div className='card-holder'>
                    <p className='label-card'>Card Holder</p>
                    <p>{card.kortinnehavare}</p>
                </div>
                <div>
                    <p className='label-card'>Expire</p>
                    <p>{`${card.utgångsmånad < 10 ? `0${card.utgångsmånad}` : card.utgångsmånad}/${card.utgångsår}`}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className='startsidan'>
            {activeCards.length > 0 && (
                <div className='startsidan-content'>
                    <CardDisplay card={activeCards[0]} />
                </div>
            )}
            
            {activeCards.length === 0 && (
                <p className='no-cardss'>No active cards available...</p>
            )}

            {cards.length < 4 && (
                <div>
                    <button className='addcard' onClick={addNewCard}>Add New Card</button>
                </div>
            )}

            <h3 className='inactive'>Inactive Cards</h3>
            {inactiveCards.length === 0 ? (
                <div className='inactive-cardsBox'>
                    <p className='no-cardss'>No inactive cards available...</p>

                </div>
            ) : (
                <div className='inactive-cardsBox'>
                    {inactiveCards.map(card => (
                        <div className='startsidan-content' key={card.id}>
                            <CardDisplay card={card} />
                            <button className='del-card' onClick={(e) => handleDelete(e, card.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CardList;

