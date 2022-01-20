const DShoppingContract = artifacts.require("../src/contracts/DShopping.sol");
const { assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();

contract('Products', ([deployer, author]) => {
    let dShoppingContract

    before(async () => {
        dShoppingContract = await DShoppingContract.deployed()
    })

    describe("deployment", () => {
        it("should be an instance of ProductsContract", async () => {
            const address = await dShoppingContract.address;
            assert.notEqual(address, null);
            assert.notEqual(address, 0x0);
            assert.notEqual(address, "");
            assert.notEqual(address, undefined);
        });
    });

    describe('products', async () => {
        let result, productCount;
        const imageHash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb';

        before(async () => {
            result = await dShoppingContract.createProduct("T1100001", "Product Name", 'Product Desc', 499, imageHash);
            productCount = await dShoppingContract.getProductCount();
        })

        //check event
        it('creates product', async () => {
            // SUCCESS
            assert.equal(productCount, 1);
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.serialNo, "T1100001", 'Serial no. is correct');
            assert.equal(event.name, 'Product Name', 'Name is correct');
            assert.equal(event.desc, 'Product Desc', 'Description is correct');
            assert.equal(event.price.toNumber(), 499, 'Price is correct');
            assert.equal(event.imageHash, imageHash, 'Image hash is correct');

            // FAILURE: Product must have a title
            await dShoppingContract.createProduct("T1100001", "", "Product Desc", 499).should.be.rejected;
        });

        //check from Struct
        it('get product', async () => {
            const product = await dShoppingContract.getProductById(1);
            const event = product.logs[0].args;
            assert.equal(event.id.toNumber(), 1, 'id is correct');
            assert.equal(event.serialNo, "T1100001", 'Serial no. is correct');
            assert.equal(event.name, 'Product Name', 'Name is correct');
            assert.equal(event.desc, 'Product Desc', 'Description is correct');
            assert.equal(event.price.toNumber(), 499, 'Price is correct');
            assert.equal(event.imageHash, imageHash, 'Image hash is correct');
        });

        //check from Struct
        it('get products count', async () => {
            const count = await dShoppingContract.getProductCount();
            assert.equal(count, 1, 'count is correct');
        });
    });
});