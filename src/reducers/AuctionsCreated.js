import { AUCTION_CREATED } from '../actions/types'

const initialState = {
  myAuctions: [],
  otherAuctions: []
}

export default (state = initialState, action) => {
  const { me, type, address, beneficiary, endTime } = action
  const { myAuctions, otherAuctions } = state

  if (action.type === AUCTION_CREATED) {
    return me === beneficiary
      ? { ...state, myAuctions: [...myAuctions, address] }
      : { ...state, otherAuctions: [...otherAuctions, address] }
  }
  return state
}
