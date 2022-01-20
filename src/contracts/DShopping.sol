// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract DShopping {
    address owner;
    uint public productCount = 0;
    
    struct Product 
    {
        uint id;
        string serialNo;
        string name;
        string desc;
        uint price;
        string imageHash;
        address owner;
    }

    mapping(uint256 => Product) public products;

    event ProductCreated
    (
        uint id,
        string serialNo,
        string name,
        string desc,
        uint price,
        string imageHash,
        address owner
    );

    event ProductFetch
    (
        uint id,
        string serialNo,
        string name,
        string desc,
        uint price,
        string imageHash,
        address owner
    );

    constructor() public { 
        owner = msg.sender;
    }

    function createProduct(string memory _serialNo, string memory _name, string memory _desc, uint _price, string memory _imageHash) public {
        // Require a valid Owner address
        require(msg.sender != address(0x0));
        // Require a valid serlialNo
        require(bytes(_serialNo).length > 0);
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid desc
        require(bytes(_desc).length > 0);
        // Require a valid price
        require(_price >= 0);
        // Make sure the video hash exists
        require(bytes(_imageHash).length > 0);
        //assign value to products
        productCount++;
        products[productCount] = Product(
            productCount,
            _serialNo,
            _name,
            _desc,
            _price,
            _imageHash,
            msg.sender
        );

        // Trigger an event
        emit ProductCreated(productCount, _serialNo, _name, _desc, _price, _imageHash, msg.sender);
    }

    function getProductById(uint id) public {
        Product storage p = products[id];
        emit ProductFetch(p.id, p.serialNo, p.name, p.desc, p.price, p.imageHash, p.owner); 
    }

    function getProductCount() view public returns(uint){
        return productCount;
    }
}