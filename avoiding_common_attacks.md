### Avoiding common attacks in the Auction contract

This document outlines how the AuctionFactory and Auction contract mitigate some
of the most common Solidity contract vulnerabilities.

#### DoS with Block Gas Limit.
  Auctions could have many bidders and only one will win. As a result it may be
  gas prohibitive to initiate refunds. Instead the Auction contract follows a
  withdraw pattern.

#### Reentrancy Attacks
  When transferring Ether for the beneficiary or refunders, state variables were
  updated before value is transferred. This prevents a malicious contract from
  double dipping into the escrow's funds.

#### Circuit breaker
  Use OpenZeppelin Pausable lifecycle modifier to implement a circuit
  breaker to stop new Auction contract from being created. This approach
  still allows for existing Auctions to run.

