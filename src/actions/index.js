import getWeb3 from '../utils/getWeb3';

import { WEB3_INITIALIZED, ACCOUNTS_INITIALIZED, CONTRACTS_INITIALIZED, IPFS_INITIALIZED } from './types';

export function initalizeDappState(contracts) {
  return dispatch => {
    getWeb3.then(result => {
      // send action to save web3 instance to store
      console.log('web3 instance sent to store: ', result);
      dispatch(web3Initialized(result));

      //use web3 instance to get accounts
      result.web3.eth.getAccounts((err, accounts) => {
        if (err) throw err;
        // send action to save accounts to store
        console.log('accounts sent to store: ', accounts);
        dispatch(accountsInitialized(accounts));
      });

      // convert contract JSON to truffle contract instance
      const contract = require('truffle-contract');
      const simpleStorage = contract(contracts);
      simpleStorage.setProvider(result.web3.currentProvider);
      simpleStorage.deployed().then(contract => {
        console.log('truffle contract sent to store: ', contract);
        dispatch(contractsInitialized(contract));
      });

      // initialize IPFS, connect to trusted infura node
      const ipfsAPI = require('ipfs-api');
      const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
      dispatch(ipfsInitialized(ipfs));
    });
  };
}

export function web3Initialized(results) {
  return {
    type: WEB3_INITIALIZED,
    payload: results.web3
  };
}

export function accountsInitialized(accounts) {
  return {
    type: ACCOUNTS_INITIALIZED,
    payload: accounts
  };
}

export function contractsInitialized(contracts) {
  return {
    type: CONTRACTS_INITIALIZED,
    payload: contracts
  };
}

export function ipfsInitialized(results) {
  return {
    type: IPFS_INITIALIZED,
    payload: results
  };
}