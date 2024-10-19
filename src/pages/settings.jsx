import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteInactiveCards } from '../store/store'; 
import fiber from '../assets/fiber.avif'
import GoldPapper from '../assets/goldPapper.jpg'


const Settings = () => {
  const dispatch = useDispatch();
  //hämtar korten globalt för att kunna se hur många de är och om det finns inactiva 
  const cards = useSelector((state) => state.cards);

  const handleTheme = () => {
   //payload blir theme.value då jag kan hämta value direkt med hjälp av id i react
   if(window.confirm(`Are u sure u want to change theme to ${theme.value} Mode`)){

     dispatch({ type: 'SET_THEME', payload: theme.value });
   }
  };



  //funktion som hanterar delete alla kort
  const handleDeleteInactiveCards = () => {
    //kollar och filrerar efter inaktiva kort 
    const inactiveCards = cards.filter(card => !card.isActive);
    if(inactiveCards.length > 0){
      if(window.confirm('Are you sure u want to Delete all inActive cards')){
        dispatch(deleteInactiveCards()); 
        alert(`-${inactiveCards.length}- inActive Cards has been deleted!`)
      }

    }else{
      alert('No inActive Cards was found!')
    }
  };

  return (
    <div className='content'>
      <div className='set' style={{backgroundImage: `url(${GoldPapper})`}}>
        
      
        <h2>Settings</h2>
        <select id='theme' defaultValue='Choice Theme'>
          <option disabled value="Choice Theme">Choice Theme</option>
          <option value="light">Light Theme</option>
          <option value="dark">Dark Theme</option>
          <option value="Pink">Pink Theme</option>
        </select>

        <div>
          <button onClick={handleTheme} className='change'>Save changes</button>
          <button onClick={handleDeleteInactiveCards} className='del'>Delete all inactive cards</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
