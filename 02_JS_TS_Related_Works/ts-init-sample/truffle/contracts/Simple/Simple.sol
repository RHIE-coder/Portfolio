// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Simple {
    uint256 private _num;

    function getNum() public view returns(uint256) {
        return _num;
    }

    function inc() public {
        _num++;
    }

    function dec() public {
        _num--;
    }
}