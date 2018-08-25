import React, { Component } from 'react'
import { connect } from 'react-redux'

class AuctionList extends Component {
  constructor() {
    super()

    this.state = {}
  }

  async componentDidMount() {
    try {
      console.log('componentDidMount')
    } catch (error) {
      console.log(error)
    }
  }

  async getAllAuctions() {
    const {
      defaultAccount,
      web3Context,
      contractInstance,
      auctionContract
    } = this.props
    const auctions = await contractInstance.getAllAuctions.call()
    console.group('allAuctions query')
    console.log('auctions', auctions)
    console.groupEnd()

    const loadedAuctionsPromises = auctions.map(address =>
      auctionContract.at(address)
    )
    const loadedAuctions = await Promise.all(loadedAuctionsPromises)

    const query = async auction => {
      const endTime = await auction.auctionEndTime.call()
      const itemName = await auction.itemName.call()
      const itemDescription = await auction.itemDescription.call()

      return {
        endTime: new Date(endTime.c * 1000),
        itemName,
        itemDescription
      }
    }

    let descriptions = await Promise.all(
      loadedAuctions.map(auction => query(auction))
    )

    console.group('loadedAuction contracts')
    console.log('loadedAuctions', loadedAuctions)
    console.log('Auction summaries', descriptions)
    console.groupEnd()
  }

  render() {
    return (
      <React.Fragment>
        <div className="jumbotron">
          <h1 className="display-4">Create a new auction</h1>
          <p className="lead">Use this form to create your new auction</p>
        </div>

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              className="form-control"
              type="text"
              id="name"
              ref={this.inputName}
              placeholder="enter name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              className="form-control"
              type="text"
              id="description"
              ref={this.inputDescription}
              placeholder="enter description"
            />
          </div>
          <div className="form-group">
            <label htmlFor="captureFile">Picture</label>
            <input
              type="file"
              id="captureFile"
              className="form-control-file"
              onChange={this.captureFile}
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    defaultAccount: state.accounts[0],
    contractInstance: state.contracts.auctionFactory,
    auctionContract: state.contracts.auctionContract,
    /* loadAuctionContractFromAddress:
     *   state.contracts.loadAuctionContractFromAddress, */
    ipfs: state.ipfs,
    web3: state.web3,
    web3Context: {
      from: state.accounts[0],
      gas: 1000000
    }
  }
}

export default connect(mapStateToProps)(AuctionList)
