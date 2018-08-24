import { CONTRACTS_INITIALIZED } from '../actions/types';

const initialState = [];

const contractsReducer = (state = initialState, action) => {
  if (action.type === CONTRACTS_INITIALIZED) {
    console.log('contractsReducer', action);
    const newState = [ ...state, action.payload ];
    console.log('old state', state);
    console.log('new state', newState);
    return newState;
  }
  return state;
}

export default contractsReducer;
