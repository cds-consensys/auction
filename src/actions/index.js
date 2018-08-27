import getWeb3 from '../utils/getWeb3'
import truffleContract from 'truffle-contract'

import {
  WEB3_INITIALIZED,
  ACCOUNTS_INITIALIZED,
  CONTRACTS_INITIALIZED,
  IPFS_INITIALIZED,
  AUCTIONS_LOADED,
  AUCTION_CREATED,
  AUCTION_CANCELLED,
  AUCTION_BID_PLACED,
  AUCTION_REDEEMED
} from './types'

import { getAuctionSummary } from '../utils'

export function initalizeDappState(contracts) {
  return dispatch => {
    getWeb3.then(result => {
      // send action to save web3 instance to store
      dispatch(web3Initialized(result))

      //use web3 instance to get accounts
      result.web3.eth.getAccounts((err, accounts) => {
        if (err) throw err
        // send action to save accounts to store
        dispatch(accountsInitialized(accounts))
      })

      // convert contract JSON to truffle contract instance
      // const contract = require('truffle-contract')

      const [AuctionFactory, Auction] = contracts.map(truffleContract)

      AuctionFactory.setProvider(result.web3.currentProvider)
      Auction.setProvider(result.web3.currentProvider)

      let loadedContracts = {
        auctionContract: Auction
      }

      AuctionFactory.deployed().then(async auctionFactoryContract => {
        loadedContracts.auctionFactory = auctionFactoryContract
        dispatch(contractsInitialized(loadedContracts))

        // load the auction contracts
        const auctionAddresses = await auctionFactoryContract.getAllAuctions.call()

        const contracts = await Promise.all(
          auctionAddresses.map(auction => Auction.at(auction))
        )
        const promises = contracts.map(auction => getAuctionSummary(auction))
        const transformedAuctions = await Promise.all(promises)
        console.group('allAuctions query')
        console.log('auctionAddresses', auctionAddresses)
        console.log('transformed', transformedAuctions)
        console.groupEnd()

        dispatch(AuctionsLoaded(transformedAuctions))
      })

      // initialize IPFS, connect to trusted infura node
      const ipfsAPI = require('ipfs-api')
      const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })
      dispatch(ipfsInitialized(ipfs))

      // load auctions
      console.log('main props', this.props)
    })
  }
}

export function web3Initialized(results) {
  return {
    type: WEB3_INITIALIZED,
    payload: results.web3
  }
}

export function accountsInitialized(accounts) {
  return {
    type: ACCOUNTS_INITIALIZED,
    payload: accounts
  }
}

export function contractsInitialized(contracts) {
  return {
    type: CONTRACTS_INITIALIZED,
    payload: contracts
  }
}

export function ipfsInitialized(results) {
  return {
    type: IPFS_INITIALIZED,
    payload: results
  }
}

// contract events

export const AuctionsLoaded = auctions => ({
  type: AUCTIONS_LOADED,
  auctions
})

export const AuctionCreated = (beneficiary, address) => ({
  type: AUCTION_CREATED,
  beneficiary,
  address
})

export const AuctionCancelled = address => ({
  type: AUCTION_CANCELLED,
  address
})

export const AuctionBidPlaced = (address, bid) => ({
  type: AUCTION_BID_PLACED,
  address,
  bid
})

export const AuctionBidRedeemed = (address, bid) => ({
  type: AUCTION_REDEEMED,
  address,
  bid
})
