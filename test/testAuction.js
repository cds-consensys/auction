const should = require('chai').should()

async function assertRevert(promise) {
  try {
    await promise
  } catch (error) {
    error.message.should.include(
      'revert',
      `Expected "revert", got ${error} instead`
    )
    return
  }
  should.fail('Expected revert not received')
}

const Auction = artifacts.require('Auction')
contract('Auction', ([_, beneficiary, tom, dick, harry, ...otherAccounts]) => {
  let auction
  const itemName = 'name'
  const itemDescription = 'description'
  const ipfsHash = 'DEADBEEF'
  const oneHour = 60 * 60

  beforeEach(async () => {
    auction = await Auction.new(
      beneficiary,
      itemName,
      itemDescription,
      ipfsHash,
      oneHour
    )
  })

  it('should benefit the beneficiary', async () => {
    const owner = await auction.beneficiary({ from: tom })
    assert.equal(owner, beneficiary, 'the owner should be the beneficiary')
  })

  it('should allow beneficiary to cancel auction', async () => {
    await auction.cancelAuction({ from: beneficiary })
    const state = await auction.cancel()
    assert.isTrue(state)
  })

  it('should bar others from cancelling auction', async () => {
    assertRevert(auction.cancelAuction({ from: dick }))
    const state = await auction.cancel()
    assert.isFalse(state)
  })

  it('should be able to take a bid', async () => {
    await auction.placeBid(100, { from: dick, value: 100 })
    const highestBid = await auction.highestBid()
    assert.equal(highestBid, 100, 'The highest bid should be the only bid')
  })

  it('should be able to raise a bid', async () => {
    await auction.placeBid(200, { from: dick, value: 200 })
    let highestBid = await auction.highestBid()
    assert.equal(highestBid, 200, 'The highest bid should be the only bid')

    await auction.placeBid(400, { from: dick, value: 200 })
    highestBid = await auction.highestBid()
    assert.equal(highestBid, 400, 'The highest bid should be the only bid')
  })
})
