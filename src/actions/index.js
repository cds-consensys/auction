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

/* helper function to transform auction addresses to a useful list of objects
 * Todo: this should move to a better place, it is not an action.
 */
export const loadAllAuctions = async (
  auctions,
  auctionContract,
  defaultAccount
) => {
  console.log('getAllAuctions...empty right now')

  const loadedAuctionsPromises = auctions.map(address =>
    auctionContract.at(address)
  )
  const loadedAuctions = await Promise.all(loadedAuctionsPromises)

  const query = async auction => {
    const startTime = await auction.auctionStartTime.call()
    const endTime = await auction.auctionEndTime.call()
    const itemName = await auction.itemName.call()
    const itemDescription = await auction.itemDescription.call()
    const ipfsHash = await auction.ipfsImage.call()
    const beneficiary = await auction.beneficiary.call()
    const isMyAuction = beneficiary === defaultAccount

    return {
      beneficiary,
      auctionInstance: auction,
      startTime: new Date(startTime.c * 1000),
      endTime: new Date(endTime.c * 1000),
      itemName,
      itemDescription,
      ipfsHash,
      isMyAuction
    }
  }

  const summaries = await Promise.all(
    loadedAuctions.map(auction => query(auction))
  )

  console.group('loadedAuction contracts')
  console.log('loadedAuctions', loadedAuctions)
  console.log('Auction summaries', summaries)
  console.groupEnd()

  summaries.sort((a, b) => b - a)
  return summaries
}

export function initalizeDappState(contracts) {
  return dispatch => {
    getWeb3.then(result => {
      // send action to save web3 instance to store
      dispatch(web3Initialized(result))

      // hacky need for call to loadAllAccounts below
      let defaultAccount

      //use web3 instance to get accounts
      result.web3.eth.getAccounts((err, accounts) => {
        if (err) throw err
        defaultAccount = accounts[0]
        // send action to save accounts to store
        dispatch(accountsInitialized(accounts))
      })

      // convert contract JSON to truffle contract instance
      // const contract = require('truffle-contract')

      const [SimpleStorage, AuctionFactory, Auction] = contracts.map(
        truffleContract
      )

      SimpleStorage.setProvider(result.web3.currentProvider)
      AuctionFactory.setProvider(result.web3.currentProvider)
      Auction.setProvider(result.web3.currentProvider)

      let loadedContracts = {
        auctionContract: Auction
      }

      SimpleStorage.deployed().then(storageContract => {
        loadedContracts.simpleStorage = storageContract

        AuctionFactory.deployed().then(async auctionFactoryContract => {
          loadedContracts.auctionFactory = auctionFactoryContract
          dispatch(contractsInitialized(loadedContracts))

          // load the actions
          const auctions = await auctionFactoryContract.getAllAuctions.call()
          const transformedAuctions = await loadAllAuctions(
            auctions,
            Auction,
            defaultAccount
          )
          /* console.group('allAuctions query')
           * console.log('auctions', auctions)
           * console.log('transformed', transformedAuctions)
           * console.groupEnd() */

          dispatch(AuctionsLoaded(defaultAccount, transformedAuctions))
        })
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

export const AuctionsLoaded = (me, auctions) => ({
  type: AUCTIONS_LOADED,
  auctions,
  me
})

export const AuctionCreated = (me, beneficiary, address) => ({
  type: AUCTION_CREATED,
  beneficiary,
  address,
  me
})

export const AuctionCancelled = (me, address) => ({
  type: AUCTION_CANCELLED,
  address,
  me
})

export const AuctionBidPlaced = (me, address, bid) => ({
  type: AUCTION_BID_PLACED,
  address,
  bid,
  me
})

export const AuctionBidRedeemed = (me, address, bid) => ({
  type: AUCTION_REDEEMED,
  address,
  bid,
  me
})
