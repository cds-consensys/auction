pragma solidity 0.4.24;
import "zeppelin/contracts/math/SafeMath.sol";


contract SimpleStorage {
    using SafeMath for uint256;

    uint256 private storedData;
    uint256 private twiceStoredData;
    string private ipfsHash;


    event DataStored(uint256 data);
    event DataStoredDoubled(uint256 data);
    event EtherStored(uint256 value);
    event IPFSHashSet(string hash);

    function setIPFSHash(string _ipfsHash) public {
        ipfsHash = _ipfsHash;
        emit IPFSHashSet(_ipfsHash);
    }

    function getIPFSHash() public view returns (string) {
        return ipfsHash;
    }

    // make function payable
    function set(uint256 x) public payable {
        storedData = x;
        twiceStoredData = x * 2;

        emit DataStored(storedData);
        emit DataStoredDoubled(twiceStoredData);

        // only if the caller sends ether should an event be emitted
        if (msg.value > 0) {
            emit EtherStored(msg.value);
        }
    }

    function get() public view returns (uint256) {
        return storedData;
    }

    function getDoubled() public view returns (uint256) {
        return twiceStoredData;
    }
}
