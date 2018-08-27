pragma solidity 0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Auction.sol";


contract TestAuction {
    // uint public initialBalance = 80 ether;

    Auction public auction;
    Auction public shortAuction;

    Actor public beneficiary;
    Actor public tom;
    Actor public dick;
    Actor public harry;

    string public itemName = "These Goods";
    string public itemDescription = "The best in the world! You need it";
    string public ipfsHash = "DEADBEEF";

    uint256 public oneSecond = 1;
    uint256 public oneHour = 60 * 60;
    uint256 public oneDay  = 60 * 60 * 24;
    uint256 public oneEther = 1000000000000000000;

    // allow contract to receive ether
    function() public payable {}

    function initialBalance() public pure returns(uint) {
        return 10 ether;
    }

    function beforeEach() public
    {
        // Beneficiary and bidders
        beneficiary = new Actor();
        tom = new Actor();
        // dick = new Actor();
        // harry = new Actor();

        // Seed the actors with some funds
        // Note: these values are in wei
        uint256 seedValue =  50000;
        address(tom).transfer(oneEther);
        address(dick).transfer(seedValue);
        address(harry).transfer(seedValue);

        // Contracts to test
        auction = new Auction(beneficiary, itemName, itemDescription, ipfsHash, oneHour);
    }

    function testBeneficiaryCanCancelAuction() public {

        bool result = beneficiary.cancel(auction);
        Assert.isTrue(result, "Beneficiary should be able to cancel auction");

        bool cancelled = auction.cancel();
        Assert.isTrue(cancelled, "Auction should be cancelled");
        Assert.isTrue(address(tom).balance == 1 ether, "Tom has funds");
    }

    // Cancel
    // test others cannot cancel auction
    function testNonBeneficiaryCannotCancelAuction() public {

        bool result = tom.cancel(auction);
        Assert.isFalse(result, "Only beneficiary should be able to cancel auction");

        bool cancelled = auction.cancel();
        Assert.isFalse(cancelled, "Auction should not be cancelled");
    }

    // placeBid when cancelled
    // bidding should not be allowed for cancelled auction
    function testPlaceBidWhenCancelled() public {

        bool result = beneficiary.cancel(auction);
        bool cancelled = auction.cancel();
        Assert.isTrue(cancelled, "Auction should be cancelled");

        result = tom.placeBid(auction, 100);
        Assert.isFalse(result, "Cannot bid on cancelled auction");
        tom.returnFunds(this);
    }

    // Auction can take bids
    function testPlaceBid() public {
        bool result = tom.placeBid(auction, 100);
        Assert.isTrue(result, "Auction should accept bid");
    }

}


// Proxy contract Actors for buying and selling
//
contract Actor {

    // Allow contract to receive ether
    // solhint-disable-next-line
    function() public payable {}

    function cancel(address auction)
        public returns(bool)
    {
        // solhint-disable-next-line
        return auction.call(abi.encodeWithSignature("cancelAuction()"));
    }

    function placeBid(address auction, uint256 bid)
        public returns(bool)
    {
        // solhint-disable-next-line
        return auction.call.value(bid)(abi.encodeWithSignature("placeBid(uint256)", bid));
    }

    function returnFunds(address runner)
    public
    {
        uint256 wad = address(this).balance;
        runner.transfer(wad);
    }
}
