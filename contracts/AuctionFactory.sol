pragma solidity 0.4.24;
import { Auction } from "./Auction.sol";

/// @title Auction factory.
///
/// Allows anyone actor to create an auction.

contract AuctionFactory {

    /// array of all auctions created
    address[] public allAuctions;

    /// @dev log when an auction is created.
    /// @param auction Address of created auction.
    /// @param beneficiary The address of the beneficiary, or owner of this auction.
    /// @param numActions The number of auctions.
    /// @param array All auctions in the system

    event LogAuctionCreated(address auction, address beneficiary, uint256 numAuctions, address[] auctions);

    /// @dev factory method to create a new Auction contract.
    /// @param beneficiary The entity to be rewarded from the auction.
    /// @param itemName The name of the item.
    /// @param itemDescription Description of the item.
    /// @param ipfsHash IPFS image hash of auctioned item's picture.
    /// @param aucitonLength The auction's duration specifid in seconds.

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

    /// @dev query for all auctions
    /// @return array of auctions
    ///
    function getAllAuctions()
    public constant returns(address[])
    {
        return allAuctions;
    }
}

