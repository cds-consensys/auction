### Measures taken to protect against common attacks

:
- Utilized OpenZeppelin Pausable lifecycle modifier to implement a circuit
    breaker to stop new Auction contract from being created. This approach
    still allows for existing Auctions to run.

- Implemented a circuit breaker / emergency stop using simple moodifiers. Only the contract owner can use this feature.

- In the function acceptSubmission, the transfer of funds is the last sequential execution to mitigate reentrancy attacks.

- No calling of external contracts occcurs in this project. This increases the security as no other controact takes over control flow.

- Added a default payable function to accept erroneous payments made to contract without calling a function:
	> function() public payable {} Fallback function, which accepts ether when sent to contract
