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

    modifier onlyAuctionEndedOrCancelled() {
        require(cancel || now > auctionEndTime);
        _;
    }

    modifier checkValue(uint256 _bid) {
        uint256 previousBid = currentBids[msg.sender];
        uint256 transactionRefund = msg.value - previousBid;
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
        auctionEndTime = now + _auctionTimeLimit;
        cancel = false;
    }

    function cancelAuction(string _reason)
    public onlyOwner onlyNotCancelled
    {
        cancel = true;
        emit LogAuctionCancelled(_reason);
    }

    function bid(uint256 _bid)
    public payable onlyNotCancelled onlyAfterStart onlyBeforeEnd onlyNotOwner checkValue(_bid)
    {
        currentBids[msg.sender] = _bid;
        if (_bid > highestBid) {
            highestBid = _bid;
            highestBidder = msg.sender;
        }
        emit LogBid(highestBid);
    }

    function redeem()
    public onlyAuctionEndedOrCancelled
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
    }
}
