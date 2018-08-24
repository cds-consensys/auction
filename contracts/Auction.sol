pragma solidity ^0.4.24;


contract Auction {
    address public owner;
    string public ipfsImage;
    string public description;

    uint256 public auctionStartTime;
    uint256 public auctionEndTime;

    uint256 public highestBid;
    address public highestBidder;
    bool public cancel;
    mapping (address => uint256) private currentBids;

    // events
    event LogBid(uint256 highestBid);
    event LogAuctionCancelled(string reason);
    event LogRedemption(account bidder, funds);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyNotOwner() {
        require(msg.sender != owner);
        _;
    }

    modifier onlyAfterStart() {
        require(now > auctionStartTime);
        _;
    }

    modifier onlyBeforeEnd() {
        require(now < auctionEndTime);
        _;
    }

    modifier onlyNotCancelled() {
        require(!cancel);
        _;
    }

    modifier onlyAuctionClosed() {
        require(cancel || now > auctionEndTime);
        _;
    }

    modifier onlyNonZeroFunds() {
        require(msg.value > 0);
        _;
    }

    modifier onlyHasEnoughFunds(uint256 _bid) {
        uint256 previousBid = currentBids[msg.sender];
        uint256 fundsNeeded = _bid - previousBid;
        require(msg.value > fundsNeeded);
        _;
    }

    modifier onlyBeatsBid(uint256 _bid) {
        require(_bid > highestBid);
        _;
    }

    constructor(
        address _seller,
        string _ipfsImage,
        string _description,
        uint256 _auctionTimeLimit
    ) public {
        owner = _seller;
        ipfsImage = _ipfsImage;
        description = _description;
        auctionStartTime = now;
        auctionEndTime = auctionStartTime + _auctionTimeLimit;
        cancel = false;
    }

    function cancelAuction(string _reason)
    public onlyOwner onlyNotCancelled
    {
        cancel = true;
        emit LogAuctionCancelled(_reason);
    }

    function placeBid(uint256 _bid)
    public payable
    onlyNotCancelled onlyAfterStart onlyBeforeEnd onlyNotOwner
    onlyNonZeroFunds onlyHasEnoughFunds(_bid) onlyBeatsBid(_bid)
    {
        uint256 previousBid = currentBids[msg.sender];
        uint256 increment = _bid - previousBid;
        uint256 refund = msg.value - increment;

        currentBids[msg.sender] = _bid;
        highestBid = _bid;
        highestBidder = msg.sender;
        emit LogBid(highestBid);

        msg.sender.transfer(refund);
    }

    function redeem()
    public onlyAuctionClosed
    {
        uint256 funds;
        if (cancel) {
            funds = currentBids[msg.sender];
            currentBids[msg.sender] = 0;
        } else {
            if (msg.sender == owner) {
                funds = highestBid;
            } else if (msg.sender == highestBidder) {
                funds = 0;
            } else {
                funds = currentBids[msg.sender];
            }
        }
        msg.sender.transfer(funds);
        LogRedemption(msg.sender, funds);
    }
}
