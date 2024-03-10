// SPDX-License-Identifier: MIT

/**
 * Author: Mr. Potato
 *                                     
 * /$$                   /$$                                 /$$                 /$$              
 *| $$                  | $$                                | $$                | $$              
 *| $$$$$$$   /$$$$$$  /$$$$$$          /$$$$$$   /$$$$$$  /$$$$$$    /$$$$$$  /$$$$$$    /$$$$$$ 
 *| $$__  $$ /$$__  $$|_  $$_/         /$$__  $$ /$$__  $$|_  $$_/   |____  $$|_  $$_/   /$$__  $$
 *| $$  \ $$| $$  \ $$  | $$          | $$  \ $$| $$  \ $$  | $$      /$$$$$$$  | $$    | $$  \ $$
 *| $$  | $$| $$  | $$  | $$ /$$      | $$  | $$| $$  | $$  | $$ /$$ /$$__  $$  | $$ /$$| $$  | $$
 *| $$  | $$|  $$$$$$/  |  $$$$/      | $$$$$$$/|  $$$$$$/  |  $$$$/|  $$$$$$$  |  $$$$/|  $$$$$$/
 *|__/  |__/ \______/    \___/        | $$____/  \______/    \___/   \_______/   \___/   \______/ 
 *                                    | $$                                                        
 *                                    | $$                                                        
 *                                    |__/                                                        
 */

pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "erc721a/contracts/ERC721A.sol";


contract HotPotato is ERC721A, Ownable, Pausable {
	using Strings for uint256;

    string private baseURI;
    string private baseExt = ".json";
    bool private _locked = false; // for re-entrancy guard

    uint256 public constant MAX_SUPPLY = 1;
    uint256 public CURRENT_PRICE = 0.002 ether; // initial price

    uint256 public constant BASIS_POINTS = 10000; // bps
    uint256 public constant PRICE_INCREASE_BP = 1000; // bps 10%
    uint256 public constant FEE_BP = 350; // bps 3.5%

    uint256 public constant TOKEN_ID = 0; // Only 1 token

    constructor(string memory _initBaseURI)
        ERC721A("Hot Potato", "HP")
    {
        setBaseURI(_initBaseURI);
        _safeMint(msg.sender, 1);
    }


    // internals and overrides
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // start at token 1
    function _startTokenId() internal pure override returns (uint256) {
        return 0;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }


    function purchase() external payable{
        require(msg.value >= CURRENT_PRICE, "No deal!");
        require(msg.sender != ownerOf(TOKEN_ID), "No deal!");

        // amount sent  = at least 100% + PRICE_INCREASE + FEE
        uint256 onePc = msg.value*BASIS_POINTS/(BASIS_POINTS+PRICE_INCREASE_BP+FEE_BP);
        uint256 salePrice = onePc*(BASIS_POINTS+PRICE_INCREASE_BP)/BASIS_POINTS;

        payable(ownerOf(TOKEN_ID)).transfer(salePrice);

        //uint256 fee = (onePc*FEE_BP)/BASIS_POINTS; // we just leave this in the contract

    }

    function nextPrice() public view returns (uint256) {
        return CURRENT_PRICE + (CURRENT_PRICE*(PRICE_INCREASE_BP+FEE_BP)/BASIS_POINTS);
    }

/*
    function setCurrentPrice(uint256 _price) external onlyOwner {
        CURRENT_PRICE = _price;
    }
*/

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    // OpenSea metadata initialization
    function contractURI() external pure returns (string memory) {
        return "https://hot-potato-frame.vercel.app/contract_metadata.json";
    }

    // Get metadata URI
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token."
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExt))
                : "";
    }

    // Technicals
    receive() external payable {}

    // Reentrancy guard modifier
    modifier nonReentrant() {
        require(!_locked, "No re-entrant call.");
        _locked = true;
        _;
        _locked = false;
    }
}
