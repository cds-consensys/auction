pragma solidity 0.4.24;


contract Auction {
    address public beneficiary;
    string public itemName;
    string public itemDescription;
    string public ipfsImage;

    uint256 public auctionStartTime;
    uint256 public auctionEndTime;

    uint256 public highestBid;
    address public highestBidder;
    bool public cancel;
    mapping (address => uint256) private currentBids;

    // events
    event LogBid(uint256 highestBid);
    event LogAuctionCancelled(string reason);
    event LogRedemption(address bidder, uint256 funds);

    modifier onlyBeneficiary() {
        require(msg.sender == beneficiary);
        _;
    }

    modifier onlyNotBeneficiary() {
        require(msg.sender != beneficiary);
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

    modifier onlyRaisesBid(uint256 _bid) {
        require(_bid > highestBid);
        _;
    }

    constructor(
        address _beneficiary,
        string _name,
        string _description,
        string _ipfsHash,
        uint256 _auctionLength
    ) public {
        beneficiary = _beneficiary;
        itemName = _name;
        ipfsImage = _ipfsHash;
        itemDescription = _description;
        auctionStartTime = now;
        auctionEndTime = auctionStartTime + _auctionLength;
        cancel = false;
    }

    function cancelAuction(string _reason)
    public onlyBeneficiary onlyNotCancelled
    {
        cancel = true;
        emit LogAuctionCancelled(_reason);
    }

    function placeBid(uint256 _bid)
    public payable
    onlyNotCancelled onlyAfterStart onlyBeforeEnd onlyNotBeneficiary
    onlyNonZeroFunds onlyHasEnoughFunds(_bid) onlyRaisesBid(_bid)
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
            if (msg.sender == beneficiary) {
                funds = highestBid;
            } else if (msg.sender == highestBidder) {
                funds = 0;
            } else {
                funds = currentBids[msg.sender];
            }
        }
        msg.sender.transfer(funds);
        emit LogRedemption(msg.sender, funds);
    }
}
