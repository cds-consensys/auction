import React, { Component } from 'react'
import { connect } from 'react-redux'

// create a new auction
// 1. name
// 2. description
// 3. ipfs
//
// 4. invoke auctionFactory

class CreateAuction extends Component {
  constructor() {
    super()
    this.state = {
      buffer: null,
      ipfsHash: ''
    }

    this.inputName = React.createRef()
    this.inputDescription = React.createRef()

    this.captureFile = this.captureFile.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    try {
      this.props.contractInstance.LogAuctionCreated(this.contractEvent)
      await this.getAllAuctions()
    } catch (error) {
      console.log(error)
    }
  }

  async contractEvent(err, value) {
    // Whenver an event is emitted, then do a read to update values
    // Use this event as a trigger to invoke the get value
    console.log(JSON.stringify(value, null, 2))
  }

  captureFile(event) {
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
    }
  }

  async handleSubmit(event) {
    event.preventDefault()
    const { ipfs, web3Context, contractInstance } = this.props
    const [result] = await ipfs.add(this.state.buffer)
    const { hash } = result
    const oneHour = 60 * 60

    console.group('handleSubmit')
    console.log('hash is ...', hash)
    console.log('name', this.inputName.current.value)
    console.log('desc', this.inputDescription.current.value)
    console.log('state', this.state)
    console.groupEnd()

    await contractInstance.createAuction(
      this.props.accounts[0],
      this.inputName.current.value,
      this.inputDescription.current.value,
      hash,
      oneHour,
      web3Context
    )

    await this.getAllAuctions()

    /* function createAuction(address beneficiary, string itemName, string itemDescription, string ipfsHash, uint256 auctionLength) */
  }

  async getAllAuctions() {
    const { defaultAccount, web3Context, contractInstance } = this.props

    const auctions = await contractInstance.getAllAuctions.call()
    console.group('allAuctions query')
    console.log('auctions', auctions)
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
    ipfs: state.ipfs,
    web3: state.web3,
    web3Context: {
      from: state.accounts[0],
      gas: 1000000
    }
  }
}

export default connect(mapStateToProps)(CreateAuction)
