export const getAuctionSummary = async (auction, defaultAccount) => {
  const startTime = await auction.auctionStartTime.call()
  const endTime = await auction.auctionEndTime.call()
  const itemName = await auction.itemName.call()
  const itemDescription = await auction.itemDescription.call()
  const ipfsHash = await auction.ipfsImage.call()
  const beneficiary = await auction.beneficiary.call()
  const isMyAuction = beneficiary === defaultAccount

  return {
    beneficiary,
    auctionInstance: auction,
    startTime: new Date(startTime.c * 1000),
    endTime: new Date(endTime.c * 1000),
    itemName,
    itemDescription,
    ipfsHash,
    isMyAuction
  }
}
