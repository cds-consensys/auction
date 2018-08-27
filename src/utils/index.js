export const getAuctionSummary = async auction => {
  const promises = [
    auction.itemName.call(),
    auction.itemDescription.call(),
    auction.ipfsImage.call(),
    auction.auctionStartTime.call(),
    auction.auctionEndTime.call(),
    auction.highestBid.call(),
    auction.cancel.call(),
    auction.beneficiaryRedeemed.call()
  ]

  const data = await Promise.all(promises)
  const contractState = 'name description ipfsHash startTime endTime highestBid cancel beneficiaryRedeemed'.split(
    ' '
  )

  const summary = contractState.reduce(
    (pre, cur, dx) => {
      pre[cur] = data[dx]
      return pre
    },
    { auctionInstance: auction }
  )

  summary.endTime = new Date(summary.endTime.c * 1000)
  summary.startTime = new Date(summary.startTime.c * 1000)
  return summary
}
