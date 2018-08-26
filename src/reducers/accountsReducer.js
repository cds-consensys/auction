import { ACCOUNTS_INITIALIZED } from '../actions/types'

const initialState = null

const accountsReducer = (state = initialState, action) =>
  action.type === ACCOUNTS_INITIALIZED ? action.payload : state

export default accountsReducer
