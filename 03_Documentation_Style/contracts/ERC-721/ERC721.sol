// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC721.sol";
import "./IERC721Receiver.sol";
import "./IERC721Metadata.sol";
import "./introspection/ERC165.sol";
import "./utils/Context.sol";
import "./utils/Address.sol";
import "./utils/Strings.sol";
import "./utils/SafeMath.sol";

contract ERC721 is IERC721, IERC721Receiver, IERC721Metadata, ERC165, Context {

    using Address for address;
    using Strings for uint256;

    string private _name;
    string private _symbol;

    mapping(uint256 => address) private _owners;

    mapping(address => uint256) private _balances;

    mapping(uint256 => address) private _tokenApprovals;

    mapping(address => mapping(address => bool)) private _operatorApprovals;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /*  
        Implements IERC165
    */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns(bool) {
        return interfaceId == type(IERC721).interfaceId || 
               interfaceId == type(IERC721Metadata).interfaceId || 
               super.supportsInterface(interfaceId);
    }

    /*  
        Get value of state value
        Implements IERC721Metadata
    */
    function name() public view virtual override returns(string memory) {
        return _name;
    }

    function symbol() public view virtual override returns(string memory) {
        return _symbol;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI)) : "";
    }

    function _baseURI() internal view virtual returns (string memory) {
        return ""; //URI prefix example: https://ipfs.io/ipfs
    }
    
    /*  
        Related Variables : `_balances`
    */
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "ERC721: address zero is not a valid owner");
        return _balances[owner];
    }

    /*  
        Related Variables : `_owners`
    */
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }
    
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    /*  
        Related Variables : `_balances` & `_owners`
    */
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");
        /*  Hook function place. Declare below function if you want.

            ```solidity
            function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}
            ```
        */
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);

        /*  Hook function place. Declare below function if you want.

            ```solidity
            function _afterTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}
            ```
        */
    }

    /*  
        Related Variables : `_balances` & `_owners` & `tokenApprovals`
    */
    function _burn(uint256 tokenId) internal virtual {
        address owner = ERC721.ownerOf(tokenId);
        /*  Hook function place. Declare below function if you want.

            ```solidity
            function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}
            ```
        */
        _approve(address(0), tokenId); // tokenId --> address(0) : no one

        _balances[owner] -= 1;
        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);
        /*  Hook function place. Declare below function if you want.

            ```solidity
            function _afterTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}
            ```
        */
    }


    /*  
        Related Variables : `_tokenApprovals`
    */
    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ERC721.ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");
        require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()), "ERC721: approve caller is not owner nor approved for all");
        // operator also can approve
        _approve(to, tokenId);
    }

    function getApproved(uint tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");

        return _tokenApprovals[tokenId];
    }

    function _approve(address to, uint256 tokenId) internal virtual {
        _tokenApprovals[tokenId] = to;
        emit Approval(ERC721.ownerOf(tokenId), to, tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal virtual {
        require(ERC721.ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
        require(to != address(0), "ERC721: transfer to zero address");
        /*  Hook function place. Declare below function if you want.

            ```solidity
            function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}
            ```
        */
        _approve(address(0), tokenId); // Clear

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
        /*  Hook function place. Declare below function if you want.

            ```solidity
            function _afterTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}
            ```
        */

    }

    /*  
        Related Variables : `_operatorApprovals`
    */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    function _setApprovalForAll(address owner, address operator, bool approved) internal virtual{
        require(owner != operator, "ERC721: approve to caller");
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /*  
        Related Variables : `_tokenApprovals` && `_operatorApprovals`    
    */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ERC721.ownerOf(tokenId);
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override{
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }

    /*  
        Safe Functions Section
         - transfer()
         - mint()
    */
    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory data) private returns (bool) {
        if(to.isContract()) {
            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) { //retval means "return value"
                return retval == IERC721Receiver.onERC721Received.selector;
            // } catch (bytes memory reason) {
            } catch { 
                revert("ERC721: transfer to non ERC721Received.selector");
                /** 
                 * @custom:author rhie-coder
                 * @dev Since I didn't fully understand the code below, I will comment on it.
                 * ```solidity
                 * if(reason.length == 0) {
                 *     revert("ERC721: transfer to non ERC721Received.selector");
                 * } else {
                 *     assembly {
                 *         //-- Yul
                 *         //The byte sequence must not exceed 32 bytes. 
                 *         //The byte sequence is padded with zeros on the right to reach 32 bytes in length; 
                 *         //in other words, the string is stored left-aligned.
                 *         revert(add(32, reason), mload(reason))
                 *     }
                 * }
                 * ```
                 */  
            }
        } else {
            return true;
        }
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, data);
    }

    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data) public virtual {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    function _safeMint(address to, uint256 tokenId) internal virtual {
        _safeMint(to, tokenId, "");
    }

    function _safeMint(address to, uint256 tokenId, bytes memory data) internal virtual {
        _mint(to, tokenId);
        require(_checkOnERC721Received(address(0), to, tokenId, data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /*  
        Return Magic Value : Function Selector
        --> `bytes4(keccak256("onERC721Received(address, address, uint256,bytes)"))`

        Maybe this function is optional, because there are checking behavior in `_checkOnERC721Received` function.
    */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector; //0x150b7a02
    }
 }