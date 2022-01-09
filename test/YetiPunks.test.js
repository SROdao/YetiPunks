const { assert } = require('chai')

const YetiPunks = artifacts.require("./YetiPunks")

require('chai')
    .use(require('chai-as-promised'))
    .should()

const EVM_REVERT = 'VM Exception while processing transaction: revert'

contract('YetiPunks', ([deployer, user]) => {
    let yetiPunks

    describe('Deployment', () => {
        let result

        beforeEach(async () => {
            yetiPunks = await YetiPunks.new()
        })

        it("is possible to mint tokens", async ()=>{
            let token = await yetiPunks.deployed();
            await token.mint(tokenAddr1);
        })

        it("Is possible to set royalties", async ()=>{
            let token = await yetiPunks.deployed();
            await token.setRoyalties(0, deployerAddress, 1000);
            let royalties = await token.getRaribleV2Royalties(0);
            assert.equal(royalties[0].value, '1000');
            assert.equal(royalties[0].account, deployerAddress);
        })

        if("Works with ERC2981 royalites", async ()=>{
            let token = await yetiPunks.deployed();
            let royalites = await token.royaltyInfo(0, 100000);

            assert.equal(royalites.royaltyAmount.toString(), '10000');
            assert.equal(royalites.reciever, deployerAddress);
        })

        it('Returns the contract name', async () => {
            result = await yetiPunks.name()
            result.should.equal(NAME)
        })

        it('Returns the symbol', async () => {
            result = await yetiPunks.symbol()
            result.should.equal(SYMBOL)
        })

        // TODO: decide if there's any reason to make MAX_YETIS public to be able to call this

        // it('Returns the max supply', async () => { 
        //     result = await yetiPunks.MAX_YETIS()
        //     result.toString().should.equal('5000')
        // })

        // it('Checks if sale is active', async () => {
        //     result = await yetiPunks.saleIsActive()
        //     result.toString().should.equal('false')
        // })
    })

    describe('Minting', async () => {
        describe('Success', async () => {
            let result

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new()
                result = await yetiPunks.mint(1)
            })

            // it('Returns the address of the minter', async () => {
            //     let event = result.logs[0].args
            //     console.log("event.to", event.to)
            //     // event.to.should.equal(user)
            // })

            it('Updates the total supply', async () => {
                result = await yetiPunks.totalSupply()
                result.toString().should.equal('1')
            })
        })

        describe('Failure', async () => {
            let result

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new()
            })
        })
    })

    describe('Updating Contract State', async () => {
        describe('Success', async () => {

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new()
            })

        })
        
        // it('Does not allow an outsider to read base URI', async () => {
        //     let uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
        //     await yetiPunks.setBaseURI(uri, { from: deployer })
        //     result = await yetiPunks._baseUri().should.be.rejectedWith(TypeError, "yetiPunks._baseUri is not a function")
        // })
    })
})