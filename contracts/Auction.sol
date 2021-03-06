pragma solidity 0.4.24;

/// Auction contract

contract Auction {

    /// Owner and redeemer of funds
    address public beneficiary;

    /// Item namd and description
    string public itemName;
    string public itemDescription;

    /// IPFS hash corresponding to items description
    string public ipfsImage;


    /// Auction time book ends
    uint256 public auctionStartTime;
    uint256 public auctionEndTime;


    /// Current higest bid and bidder
    uint256 public highestBid;
    address public highestBidder;

    bool public cancel;
    bool public beneficiaryRedeemed;
    mapping (address => uint256) private currentBids;

    /// Notify the current best/highest bid
    event LogBid(uint256 highestBid);

    /// Notify when the auction is cancelled
    event LogAuctionCancelled(string reason);

    /// Notify when funds have been redeemed
    event LogRedemption(address bidder, uint256 funds);

    /// @dev Only the beneficiary
    modifier onlyBeneficiary() {
        require(msg.sender == beneficiary);
        _;
    }

    /// @dev Anyone but beneficiary
    modifier onlyNotBeneficiary() {
        require(msg.sender != beneficiary);
        _;
    }

    /// @dev Anyone but highest bidder
    modifier onlyNotHighestBidder() {
        require(msg.sender != highestBidder);
        _;
    }

    /// @dev Allow execution only post auction start time
    modifier onlyAfterStart() {
        // solhint-disable-next-line
        require(now >= auctionStartTime);
        _;
    }

    /// @dev Allow execution only prior to auction end time
    modifier onlyBeforeEnd() {
        // solhint-disable-next-line
        require(now < auctionEndTime);
        _;
    }

    /// @dev The contract has not been cancelled
    modifier onlyNotCancelled() {
        require(!cancel);
        _;
    }

    /// @dev Only if the beneficiary has not redeemed funds
    modifier onlyNotRedeemed() {
        require(!beneficiaryRedeemed);
        _;
    }

    /// @dev Only if past the Auction end time
    modifier onlyAuctionClosed() {
        // solhint-disable-next-line
        require(now > auctionEndTime);
        _;
    }

    /// @dev Only if past the Auction end time, or the auction was cancelled
    modifier onlyAuctionClosedOrCancelled() {
        // solhint-disable-next-line
        require(cancel || now > auctionEndTime);
        _;
    }

    /// @dev the caller must include some funds
    modifier onlyNonZeroFunds() {
        require(msg.value > 0);
        _;
    }

    /// @dev the caller must include funds to raise their bid
    modifier onlyHasEnoughFunds(uint256 _bid) {
        uint256 previousBid = currentBids[msg.sender];
        uint256 fundsNeeded = _bid - previousBid;
        require(msg.value >= fundsNeeded);
        _;
    }

    /// @dev the caller can beat highest bid
    modifier onlyRaisesBid(uint256 _bid) {
        require(_bid > highestBid);
        _;
    }

    /// @dev Create a Auction
    /// @param _beneficiary The beneficiary and owner of current Auction
    /// @param _name Name of item
    /// @param _description The description of item
    /// @param _ipfsHash The IPFS hash for the item image
    /// @param _auctionLength The duration of time the Auction will be open.
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

        // use current block time to calculate start and end time
        auctionStartTime = now;
        auctionEndTime = auctionStartTime + _auctionLength;

        // The Auction is initialized not cancelled
        cancel = false;

        // The Auction is not yet redeemed by beneficiary
        beneficiaryRedeemed = false;
    }

    /// @dev Cancel the auction
    ///      This will allow the bidders and beneficiary to redeem
    ///      funds.
    /// Preconditions Who: only the beneficiary
    /// Preconditions When: auction not cancelled
    function cancelAuction()
    public onlyBeneficiary onlyNotCancelled
    {
        cancel = true;
    }

    /// @dev Place a bid.
    /// Preconditions Who: anyone except the beneficiary.
    /// Preconditions When
    ///        - Auction is not cancelled
    ///        - Current time is after Auction began
    ///        - Current time is before Auction ends
    ///        - sender has funds (> 0)
    ///        - sender has enough funds to match her bid.
    ///        - sender beats the current bid
    function placeBid(uint256 _bid)
    public payable
    onlyNotCancelled
    onlyAfterStart
    onlyBeforeEnd
    onlyNotBeneficiary
    onlyNonZeroFunds
    onlyHasEnoughFunds(_bid)
    onlyRaisesBid(_bid)
    {
        /// Consider the bidder'sPreconditionsvious bid as they raise
        uint256 previousBid = currentBids[msg.sender];
        uint256 increment = _bid - previousBid;

        /// and Refund the excess of their increment
        uint256 refund = msg.value - increment;


        /// Update senders current bid
        currentBids[msg.sender] = _bid;

        /// store this as highest bid and bidder
        highestBid = _bid;
        highestBidder = msg.sender;

        /// Notify the world of the higest bid
        emit LogBid(highestBid);

        /// refund bider
        msg.sender.transfer(refund);
    }

    /// @dev Redeem the highest bid
    /// Preconditions Who: Only the beneficiary
    /// Preconditions When
    ///        - Auction is closed.
    ///        - Beneficiary hasn't already redeemed
    function redeem()
    public onlyAuctionClosed onlyBeneficiary onlyNotRedeemed
    {
        beneficiaryRedeemed = true;
        msg.sender.transfer(highestBid);
        emit LogRedemption(msg.sender, highestBid);
    }

    /// @dev Refund your losing bids
    /// Preconditions Who: anyone not the beneficiary
    /// Preconditions When
    ///        - Auction is closed or cancelled
    function refund()
    public
    onlyAuctionClosedOrCancelled
    onlyNotBeneficiary
    onlyNotHighestBidder
    {
        uint256 funds = currentBids[msg.sender];
        currentBids[msg.sender] = 0;

        msg.sender.transfer(funds);
        emit LogRedemption(msg.sender, funds);
    }
}

