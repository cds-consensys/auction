import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { AuctionCreated as AuctionCreatedAction } from '../actions'
import { getAuctionSummary } from '../utils'

class AuctionDetail extends Component {
  constructor() {
    super()
    this.state = {}

    this.auctionBidListener = this.auctionBidListener.bind(this)
    this.auctionRedemptionListener = this.auctionRedemptionListener.bind(this)
    this.web3events = []
  }

  async componentDidMount() {
    const { address } = this.props.match.params
    const auction = this.props.auctions[address]
    const auctionInstance = auction.auctionInstance

    try {
      this.web3events = [
        auctionInstance.LogBid(this.auctionBidListener),
        auctionInstance.LogRedemption(this.auctionRedemptionListener)
      ]
      this.setState(auction)
    } catch (error) {
      console.log(error)
    }
  }

  async auctionBidListener(err, value) {
    console.group('aucitonBidListener')
    console.log(value)
    console.groupEnd()
  }

  async auctionRedemptionListener(err, value) {
    console.group('auctionRedemptionListener')
    console.log(value)
    console.groupEnd()
  }

  componentWillUnmount() {
    console.log('AuctionDetail::Stop watching web3 events')
    this.web3events.forEach(event => event.stopWatching())
    this.web3events = []
  }

  render() {
    const {
      beleficiaryRedeemed,
      cancel,
      description,
      name,
      ipfsHash,
      highestBid,
      endTime,
      startTime,
      web3
    } = this.state
    console.group('auctionDetails')
    console.log('STATE', this.state)
    console.log('PROPS', this.props)
    console.groupEnd()

    if (this.state.startTime === null || this.state.startTime === undefined)
      return <div>loading...</div>
    console.group('auctionDetails - 2')
    console.log('highestBid', highestBid)
    console.log('highestBid', highestBid.toNumber())
    console.groupEnd()

    return (
      <React.Fragment>
        <h1>Auction Details</h1>
        <div className="card" style={{ width: '18rem' }}>
          <img
            className="card-img-top"
            style={{ maxWidth: '300px', height: 'auto' }}
            src={`https://ipfs.io/ipfs/${ipfsHash}`}
            alt={``}
          />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p className="card-text">{description}</p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              Started: {moment(startTime).fromNow()}
            </li>
            <li className="list-group-item">
              Ends: {moment(endTime).fromNow()}
            </li>
            <li className="list-group-item">
              Highest Bid: {highestBid.toNumber()}
            </li>
            <li className="list-group-item">isCancelled: {cancel}</li>
          </ul>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    auctions: state.auctions,
    defaultAccount: state.accounts[0],
    web3: state.web3,
    web3Context: {
      from: state.accounts[0],
      gas: 1000000
    }
  }
}

/* const mapDispatchToProps = dispatch => {
 *   return {
 *     AuctionCreatedAction: (...args) => dispatch(AuctionCreatedAction(...args))
 *   }
 * } */

export default connect(mapStateToProps)(AuctionDetail)
