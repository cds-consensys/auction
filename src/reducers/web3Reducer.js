import { WEB3_INITIALIZED } from '../actions/types'

const initialState = null

const web3Reducer = (state = initialState, action) =>
  action.type === WEB3_INITIALIZED ? action.payload : state

export default web3Reducer
