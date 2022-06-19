// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library Strings {

    function toString(uint256 num) internal pure returns (string memory) {
        if (num == 0){
            return "0";
        }

        uint256 tmp = num;
        uint256 digits;

        while(tmp != 0) {
            digits++;
            tmp /= 10;
        }

        bytes memory buffer = new bytes(digits);

        while(num != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(num % 10));
            num /= 10;
        }

        return string(buffer);
    }
}