// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 * 
 * @author rhie-coder
 * @custom:desc-more Every solidity function has selector that is function's idendity.
 * ```solidity
 * bytes4(keccak256("balanceOf(address)"))
 * ```
 * OR
 * ```solidity
 * this.balanceOf.selector
 * ```
 * ERC165 confirms the implementation of the interface. => "Standard Interface Detection"
 * 
 * 
 * If the return value is true when all signatures of the function implemented in ERC-721 
 * are calculated as XOR and the value (expressed in hex) is entered in ERC-165 
 * it means that it has been implemented as standard.
 * 
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}