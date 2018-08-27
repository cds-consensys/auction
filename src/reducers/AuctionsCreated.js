import { AUCTION_CREATED, AUCTIONS_LOADED } from '../actions/types'

const initialState = {}

/*
 *     return {
 *       beneficiary,
 *       auctionInstance: auction,
 *       startTime: new Date(startTime.c * 1000),
 *       endTime: new Date(endTime.c * 1000),
 *       itemName,
 *       itemDescription,
 *       ipfsHash,
 *       isMyAuction
 *     }
 **/

export default (state = initialState, action) => {
  const { me, actions, type, address, beneficiary, endTime, auctions } = action

  if (type === AUCTION_CREATED) {
    return state
  } else if (type === AUCTIONS_LOADED) {
    return auctions.reduce((pre, cur) => {
      const { auctionInstance } = cur
      pre[auctionInstance.address] = cur
      return pre
    }, {})
  }
  return state
}
