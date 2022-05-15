//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @author rhie-coder
 * @dev To prevent underflow or overflow.
 * We need to add the `unchecked` keyword to use `require`.
 * We don't need SafeMath anymore since ^0.8.0, 
 * because the overflow checking is built-in function now (occur `revert`).
 *
 * Inspired by Openzeppelin
 */
library SafeMath {

    function add(uint256 num1, uint256 num2) external pure returns (uint256) {
        unchecked {
            uint256 result = num1 + num2;
            require(result >= num1, "SafeMath: Addition cannot overflow");
            return result;
        }
    }

    function sub(uint256 num1, uint256 num2) external pure returns (uint256) {
        unchecked {
            uint256 result = num1 - num2;
            require(num2 <= num1, "SafeMath: Subtraction cannot overflow");
            return result;
        }
    }

    function mul(uint256 num1, uint256 num2) external pure returns (uint256) {
        unchecked {
            if (num1 == 0) {
                return 0;
            }

            uint256 result = num1 * num2;
            require(result / num1 == num2, "SafeMath: Multiplication cannot overflow");
            return result;
        }
    }

    function div(uint256 num1, uint256 num2) external pure returns (uint256) {
        unchecked {
            require(num2 > 0, "SafeMath: The divisor cannot be zero");
            return num1 / num2;
        }
    }

    function mod(uint256 num1, uint256 num2) external pure returns (uint256) {
        unchecked {
            require(num2 > 0, "SafeMath: The divisor cannot be zero");
            return num1 % num2;
        }
    }
    
}