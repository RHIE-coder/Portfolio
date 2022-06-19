// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC20.sol";

/**
 * @author rhie-coder
 * @dev Publishing RhitherCoin Token to Ethereum Network
 */
contract RhitherCoin is ERC20 {
    constructor(uint256 issueAmount) ERC20("RhitherCOIN", "Rhither") {
        address tokenIssuer = _msgSender();
        require(tokenIssuer != address(0), "RhitherCoin: The tokenIssuer is zero address");
        uint256 unit = 10**uint256(decimals()); // imitating 10^18wei
        _mint(tokenIssuer, SafeMath.mul(issueAmount, unit)); 
    }
}