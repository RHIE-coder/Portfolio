// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library SafeMath {

    function add(uint256 n1, uint256 n2) external pure returns (uint256) {
        unchecked {
            uint256 result = n1 + n2;
            require(result >= n1, "SafeMath: Addition cannot overflow");
            return result;
        }
    }

    function sub(uint256 n1, uint256 n2) external pure returns (uint256) {
        unchecked {
            uint256 result = n1 - n2;
            require(n1 >= n2, "SafeMath: Substraction cannot overflow");
            return result;
        }
    }

    function mul(uint256 n1, uint256 n2) external pure returns (uint256) {
        unchecked {
            if( n1 == 0 ) {
                return 0;
            }
            
            uint256 result = n1 * n2;
            require(result / n1 == n2, "SafeMath: Multiplication cannot overflow");
            return result;
        }
    }

    function div(uint256 n1, uint256 n2) external pure returns (uint256) {
        unchecked {
            require(n2 > 0, "SafeMath: The divisor cannot be zero");
            return n1 / n2;
        }
    }

    function mod(uint256 n1, uint256 n2) external pure returns (uint256) {
        unchecked {
            require(n2 > 0, "SafeMath: The divisor cannot be zero");
            return n1 % n2;
        }
    }
    
}