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

const AuctionFactory = artifacts.require('AuctionFactory')

contract('AuctionFactory', ([owner, eve, ...otherAccounts]) => {
  let factory

  beforeEach(async () => {
    factory = await AuctionFactory.new()
  })

  it('should start out knowing the owner', async () => {
    const boss = await factory.owner()
    assert.equal(owner, boss, 'The boss should be the owner')
  })

  it('should start out in non paused mode', async () => {
    const state = await factory.paused()
    assert.isFalse(state)
  })

  it('should be pausable by the owner', async () => {
    await factory.pause({ from: owner })
    const state = await factory.paused()
    assert.isTrue(state)
  })

  it('should guard the create auction method', async () => {
    await factory.pause({ from: owner })
    const state = await factory.paused()
    assert.isTrue(state)
    assertRevert(factory.createAuction(eve, 'a', 'b', 'c', 1))
  })

  it('should be unpausable by owner', async () => {
    await factory.pause({ from: owner })
    let state = await factory.paused()
    assert.isTrue(state)

    await factory.unpause({ from: owner })

    state = await factory.paused()
    assert.isFalse(state)
  })

  it('should not be unpausable by others', async () => {
    await factory.pause({ from: owner })
    let state = await factory.paused()
    assert.isTrue(state)

    assertRevert(factory.pause({ from: eve }))
  })
})
