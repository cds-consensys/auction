import { IPFS_INITIALIZED } from '../actions/types'

const initialState = null

const ipfsReducer = (state = initialState, action) =>
  action.type === IPFS_INITIALIZED ? action.payload : state

export default ipfsReducer
