import { AUCTION_CREATED, AUCTIONS_LOADED } from '../actions/types'

const initialState = {
  myAuctions: [],
  otherAuctions: []
}

export default (state = initialState, action) => {
  const { me, actions, type, address, beneficiary, endTime, auctions } = action
  const { myAuctions, otherAuctions } = state

  if (type === AUCTION_CREATED) {
    return me === beneficiary
      ? { ...state, myAuctions: [...myAuctions, address] }
      : { ...state, otherAuctions: [...otherAuctions, address] }
  } else if (type === AUCTIONS_LOADED) {
    const mine = []
    const others = []
    auctions.forEach(auction => {
      if (auction.beneficiary === me) mine.push(auction)
      else others.push(auction)
    })
    return { myAuctions: mine, otherAuctions: others }
  }
  return state
}
