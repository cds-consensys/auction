pragma solidity ^0.4.24;
import { Auction } from "./Auction.sol";


contract AuctionFactory {
    address[] public allAuctions;

    event LogAuctionCreated(address auction, address beneficiary, uint256 numAuctions, address[] auctions);

    function createAuction(
        address beneficiary,
        string itemName,
        string itemDescription,
        string ipfsHash,
        uint256 auctionLength
    )
    public
    {
        Auction theAuction = new Auction(beneficiary, itemName, itemDescription, ipfsHash, auctionLength);
        allAuctions.push(theAuction);

        emit LogAuctionCreated(theAuction, beneficiary, allAuctions.length, allAuctions);
    }

    function getAllAuctions()
    public constant returns(address[])
    {
        return allAuctions;
    }
}

