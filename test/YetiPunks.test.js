const { assert } = require('chai')

const YetiPunks = artifacts.require("./YetiPunks")

require('chai')
    .use(require('chai-as-promised'))
    .should()

const EVM_REVERT = 'VM Exception while processing transaction: revert'

contract('YetiPunks', ([deployer, user]) => {

    const NAME = 'YetiPunks'
    const SYMBOL = 'YETI'

    // NOTE: If images are already uploaded to IPFS, you may choose to update the links, otherwise you can leave it be.
    const IPFS_IMAGE_METADATA_URI = 'ipfs://IPFS-IMAGE-METADATA-CID/'
    const IPFS_HIDDEN_IMAGE_METADATA_URI = 'ipfs://IPFS-HIDDEN-METADATA-CID/hidden.json'

    let yetiPunks

    describe('Deployment', () => {

        let milliseconds = 120000 // Number between 100000 - 999999
        let result, timeDeployed
        const [deployerAddress, tokenAddr1] = accounts;

        beforeEach(async () => {
            yetiPunks = await YetiPunks.new(
                NAME,
                SYMBOL
            )
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

        it('Returns the cost to mint', async () => {
            result = await yetiPunks.cost()
            result.toString().should.equal('30000000000000000')
        })

        it('Returns the max supply', async () => {
            result = await yetiPunks.MAX_SUPPLY()
            result.toString().should.equal('5000')
        })

        it('Checks if sale is active', async () => {
            result = await yetiPunks.saleIsActive()
            result.toString().should.equal('false')
        })
    })

    describe('Minting', async () => {
        describe('Success', async () => {

            let result

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(
                    NAME,
                    SYMBOL
                )
                await yetiPunks.toggleSale(true);

                result = await yetiPunks.mint({ from: user, value: web3.utils.toWei('0.03', 'ether') })
            })

            it('Returns the address of the minter', async () => {
                let event = result.logs[0].args
                event.to.should.equal(user)
            })

            it('Updates the total supply', async () => {
                result = await yetiPunks.tokenSupply()
                result.toString().should.equal('1')
            })
        })

        describe('Failure', async () => {
            let result

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(
                    NAME,
                    SYMBOL
                )
                await yetiPunks.toggleSale(false);
            })

            it('Attempt to mint before sale is live', async () => {
                await yetiPunks.mint({ from: user, value: web3.utils.toWei('0.03', 'ether') }).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('Updating Contract State', async () => {
        describe('Success', async () => {
            let result

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(
                    NAME,
                    SYMBOL
                )
                await yetiPunks.toggleSale(true);
            })

            it('Sets the IPFS not revealed URI', async () => {
                let uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
                await yetiPunks.setBaseURI(uri, { from: deployer })
                result = await yetiPunks.getBaseUri()
                result.toString().should.equal(uri)
            })
        })
    })
})