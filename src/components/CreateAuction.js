import React, { Component } from 'react'
import { connect } from 'react-redux'

import CircularProgressbar from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import { AuctionCreated as AuctionCreatedAction } from '../actions'

class CreateAuction extends Component {
  constructor() {
    super()
    this.state = {
      buffer: null,
      ipfsHash: '',
      progress: {
        outstanding: false,
        percent: 0
      }
    }

    this.inputName = React.createRef()
    this.inputDescription = React.createRef()

    this.captureFile = this.captureFile.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.auctionCreatedListener = this.auctionCreatedListener.bind(this)
  }

  async componentDidMount() {
    try {
      this.props.contractInstance.LogAuctionCreated(this.auctionCreatedListener)
    } catch (error) {
      console.log(error)
    }
  }

  async auctionCreatedListener(err, value) {
    console.log(JSON.stringify(value, null, 2))
    console.log('listener props: ', this.props)

    const { args } = value
    const { auction: address, beneficiary } = args
    const { defaultAccount, AuctionCreatedAction } = this.props

    console.log(defaultAccount, beneficiary, address)
    AuctionCreatedAction(defaultAccount, beneficiary, address)
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
    const progress = {
      outstanding: true,
      percent: 0
    }
    this.setState({ progress })

    const { ipfs, web3Context, contractInstance } = this.props
    const [result] = await ipfs.add(this.state.buffer)
    progress.percent = 45
    this.setState({ progress })

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
    progress.percent = 75
    this.setState({ progress })

    progress.percent = 75
    this.setState({ progress })

    this.inputName.current.value = ''
    this.inputDescription.current.value = ''

    progress.outstanding = false
    progress.percent = 0
    this.setState({
      buffer: null,
      ipfsHash: '',
      progress
    })
  }

  render() {
    const { progress } = this.state
    return (
      <React.Fragment>
        <h1 className="display-4">Create a new auction</h1>
        <div className="row">
          <div className="col-sm-6">
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

              {!progress.outstanding && (
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
              )}

              {progress.outstanding && (
                <CircularProgressbar
                  percentage={progress.percent}
                  text={`${progress.percent}`}
                />
              )}
            </form>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    defaultAccount: state.accounts[0],
    contractInstance: state.contracts.auctionFactory,
    auctionContract: state.contracts.auctionContract,
    ipfs: state.ipfs,
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateAuction)
