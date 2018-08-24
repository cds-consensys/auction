import { combineReducers } from 'redux';
import web3Reducer from './web3Reducer';
import accountsReducer from './accountsReducer';
import contractsReducer from './contractsReducer';
import ipfsReducer from './ipfsReducer';

const rootReducer = combineReducers({
  accounts: accountsReducer,
  contracts: contractsReducer,
  ipfs: ipfsReducer,
  web3: web3Reducer
});

export default rootReducer;
