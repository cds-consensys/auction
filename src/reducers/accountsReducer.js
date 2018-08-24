import { ACCOUNTS_INITIALIZED } from '../actions/types';

const initialState = null;

const accountsReducer = (state = initialState, action) => {
  if (action.type === ACCOUNTS_INITIALIZED) {
    console.log('accountsReducer action: ', action);
    return action.payload;
  }
  return state;
}

export default accountsReducer;
