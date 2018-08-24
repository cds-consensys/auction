import { IPFS_INITIALIZED } from '../actions/types';

const initialState = null;

const ipfsReducer = (state = initialState, action) => {
  if (action.type === IPFS_INITIALIZED) {
    console.log('ipfsReducer action: ', action);
    const newState = action.payload;
    console.log('state', state);
    console.log('newState', newState);
    return newState;
  }
  return state;
}

export default ipfsReducer;
