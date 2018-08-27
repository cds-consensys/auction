import { AUCTION_CREATED, AUCTIONS_LOADED } from '../actions/types'

const initialState = {}

export default (state = initialState, action) => {
  if (action.type === AUCTION_CREATED) {
    const { address: summary } = action
    return { ...state, [summary.auctionInstance.address]: summary }
  } else if (action.type === AUCTIONS_LOADED) {
    const { auctions } = action
    return auctions.reduce((pre, cur) => {
      const { auctionInstance } = cur
      pre[auctionInstance.address] = cur
      return pre
    }, {})
  }
  return state
}
