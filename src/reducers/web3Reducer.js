import { WEB3_INITIALIZED } from '../actions/types';

const initialState = null;

const web3Reducer = (state = initialState, action) => {
  if (action.type === WEB3_INITIALIZED) {
    console.log('web3Reducer action: ', action);
    const newState = action.payload;
    console.log('state', state);
    console.log('newState', newState);
    return newState;
  }
  return state;
}

export default web3Reducer;
