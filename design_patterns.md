### Design patterns and consideration
  This document outlines the design patterns used for writing the Solidity
  contracts.

#### Open Auction
  An auction is created when someone, now known as the beneficiary, creates an
  auction contract to sell an item. Other people may choose to place bids in the
  hope of acquiring the goods. At the end of the auction the beneficiary redeems
  the highest bid, and all losing bidders can withdraw their bids from the
  auction/escrow contract. The highest bidder gets no ether, but he or she just
  purchased joy.

#### Manage state to track redemption and withdraw of value
  This is an interesting situation. Auctions allow the beneficiary to redeem
  funds when an Auction completes. In this case the beneficiary is one of many
  users whose funds are escrowed in the Auction contract. It is possible
  for a malicious beneficiary contract to redeem funds if care isn't taken into
  managing state.

  The solution is to track if the auction redeemed the beneficiary and use
  `onlyNotRedeemed` modifier to guard the `redeem` function.

#### Restricting access based on Roles

  The beneficiary is the Auction creator who will benefit in value from the
  outcome of the Auction. As the creator, there are certain functions he can be
  granted access to.The modifiers `onlyBeneficiary` and `onlyNotBeneficiary`
  work nicely in this small example.

#### Fail fast, fail loud

  The approach I took is to fail early and loud using multiple modifiers to
  limit gas costs and short circuit/revert execution. The names relate to the
  Auction contract state in a meaningful way and helps to remove the noise of
  overly complicated expressions.

  An Auction has a start and end time separating different stages of the
  contract. Bidders can bid `onlyAfterStart` and `onlyBeforeEnd`.

  Refunds occur when `onlyAuctionClosedOrCancelled`

  The final set of modifiers `onlyNonZeroFunds`, `onlyHasEnoughFunds`,
  `onlyRaisesBid` checks to make sure a caller has funds, has enough funds to
  cover a bid and process a bid only if it raises the current highest bid.
