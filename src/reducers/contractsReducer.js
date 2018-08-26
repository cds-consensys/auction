import { CONTRACTS_INITIALIZED } from '../actions/types'

const initialState = {}

const contractsReducer = (state = initialState, action) =>
  action.type === CONTRACTS_INITIALIZED
    ? { ...state, ...action.payload }
    : state

export default contractsReducer
