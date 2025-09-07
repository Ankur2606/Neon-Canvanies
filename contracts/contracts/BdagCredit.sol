// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BdagCredit {
    address public owner;
    uint256 public constant CONVERSION_RATE = 10; // 1 BDAG = 10 Credits

    mapping(address => uint256) public userCredits;

    event CreditsPurchased(address indexed user, uint256 bdagAmount, uint256 credits);
    event CreditsUsed(address indexed user, uint256 credits);

    constructor() {
        owner = msg.sender;
    }

    function buyCredits() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        uint256 credits = msg.value * CONVERSION_RATE;
        userCredits[msg.sender] += credits;
        emit CreditsPurchased(msg.sender, msg.value, credits);
    }

    function getCredits(address user) external view returns (uint256) {
        return userCredits[user];
    }

    function useCredits(uint256 amount) external {
        require(userCredits[msg.sender] >= amount, "Insufficient credits");
        userCredits[msg.sender] -= amount;
        emit CreditsUsed(msg.sender, amount);
    }

    // Owner can withdraw BDAG
    function withdrawBDAG() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
}