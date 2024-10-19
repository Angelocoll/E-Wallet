import { createStore, combineReducers } from "redux";

const initialThemeState = {
  theme: "dark",
};

const themeReducer = (state = initialThemeState, action) => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

const initialCardState = [];

const cardReducer = (state = initialCardState, action) => {
  switch (action.type) {
    case "ADD_CARD":
      if (state.length < 4) {
        return [...state, action.payload];
      }
      return state;

    case "DELETE_CARD":
      return state.filter((card) => card.id !== action.payload);

    case "DELETE_INACTIVE_CARDS":
      return state.filter((card) => card.isActive);

    case "UPDATE_CARD":
      return state.map((card) =>
        card.id === action.payload.id ? { ...card, ...action.payload } : card
      );

    case "TOGGLE_CARD_ACTIVATION":
      return state.map((card) =>
        card.id === action.payload
          ? { ...card, isActive: !card.isActive }
          : { ...card, isActive: false }
      );

    default:
      return state;
  }
};

export const addCard = (card) => ({
  type: "ADD_CARD",
  payload: card,
});

export const deleteCard = (id) => ({
  type: "DELETE_CARD",
  payload: id,
});

export const deleteInactiveCards = () => ({
  type: "DELETE_INACTIVE_CARDS",
});

export const updateCard = (updatedCard) => ({
  type: "UPDATE_CARD",
  payload: updatedCard,
});

export const toggleCardActivation = (id) => ({
  type: "TOGGLE_CARD_ACTIVATION",
  payload: id,
});

const rootReducer = combineReducers({
  theme: themeReducer,
  cards: cardReducer,
});

const store = createStore(rootReducer);

export default store;
