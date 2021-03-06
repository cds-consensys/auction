import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { AuctionCreated as AuctionCreatedAction } from '../actions'
import { getAuctionSummary } from '../utils'

class AuctionList extends Component {
  constructor() {
    super()
    this.state = { summaries: [] }

    this.auctionCreatedListener = this.auctionCreatedListener.bind(this)
    this.web3events = []
  }

  async componentDidMount() {
    const { auctionFactory } = this.props

    try {
      const event = auctionFactory.LogAuctionCreated(
        this.auctionCreatedListener
      )
      this.web3events.push[event]
    } catch (error) {
      console.log(error)
    }
  }

  componentWillUnmount() {
    console.log('AuctionList::Stop watching web3 events')
    this.web3events.forEach(event => event.stopWatching())
    this.web3events = []
  }

  async auctionCreatedListener(err, value) {
    const { args } = value
    const { auction: address, beneficiary } = args
    const { AuctionCreatedAction, auctionContract } = this.props

    const auctionInstance = await auctionContract.at(address)

    const summary = await getAuctionSummary(auctionInstance)
    AuctionCreatedAction(beneficiary, summary)
  }

  render() {
    const { auctionsMine, auctionsOthers } = this.props
    console.group('render')
    console.log('props', this.props)
    console.log('auctionsMine', auctionsMine)
    console.log('auctionsOthers', auctionsOthers)
    console.groupEnd()
    // return <h1>fooey</h1>
    return (
      <React.Fragment>
        <h1 className="display-4">Your Auctions</h1>
        <AuctionTable auctions={auctionsMine} />

        <h1 className="display-4">Other Auctions</h1>
        <AuctionTable auctions={auctionsOthers} />
      </React.Fragment>
    )
  }
}

const AuctionTable = ({ auctions }) => (
  <table className="table table-dark table-striped table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Start</th>
        <th scope="col">End</th>
        <th scope="col">Image</th>
        <th scope="col">Name</th>
        <th scope="col">Description</th>
      </tr>
    </thead>
    <tbody>
      {auctions.map(
        (
          { startTime, endTime, name, description, ipfsHash, auctionInstance },
          index
        ) => (
          <tr key={startTime.toString() + index}>
            <th scope="row">{index}</th>
            <td>{moment(startTime).fromNow()}</td>
            <td>{moment(endTime).fromNow()}</td>
            <td>
              <img
                style={{ maxWidth: '100px', height: 'auto' }}
                src={`https://ipfs.io/ipfs/${ipfsHash}`}
                alt=""
              />
            </td>
            <td>
              <Link to={`/auction/${auctionInstance.address}`}>{name}</Link>
            </td>
            <td>{description}</td>
          </tr>
        )
      )}
    </tbody>
  </table>
)

const mapStateToProps = state => {
  const auctions = Object.values(state.auctions)
  const defaultAccount = state.accounts[0]

  const mine = []
  const others = []
  auctions.forEach(auction => {
    if (auction.beneficiary === defaultAccount) mine.push(auction)
    else others.push(auction)
  })

  console.group('mstp')
  console.log('auctions', auctions)
  console.log('mine', mine)
  console.log('others', others)
  console.groupEnd()

  return {
    auctionsMine: mine,
    auctionsOthers: others,
    defaultAccount: state.accounts[0],
    auctionFactory: state.contracts.auctionFactory,
    auctionContract: state.contracts.auctionContract,
    web3: state.web3,
    web3Context: {
      from: state.accounts[0],
      gas: 1000000
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    AuctionCreatedAction: (...args) => dispatch(AuctionCreatedAction(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuctionList)
