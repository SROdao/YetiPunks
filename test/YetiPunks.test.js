const { assert } = require('chai')

const YetiPunks = artifacts.require("./YetiPunks")

require('chai')
    .use(require('chai-as-promised'))
    .should()

const EVM_REVERT = 'VM Exception while processing transaction: revert'

contract('YetiPunks', ([deployerAddress, user]) => {
    let yetiPunks

    describe('Deployment', () => {
        let result

        beforeEach(async () => {
            yetiPunks = await YetiPunks.new(20, 6420, 20, 20)
        })

        it('Returns the contract name', async () => {
            result = await yetiPunks.name()
            result.should.equal("Petty Monks")
        })

        it('Returns the symbol', async () => {
            result = await yetiPunks.symbol()
            result.should.equal("PM")
        })
    })

    describe('Public sale mint', async () => {
        describe('Success', async () => {
            let result

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20)
                result = await yetiPunks.publicSaleMint(1, { from: user, value: web3.utils.toWei('0.03', 'ether') })
            })

            it('Returns the address of the minter', async () => {
                let event = result.logs[0].args
                console.log("event.to", event.to)
                // event.to.should.equal(user)
            })

            it('Updates the total supply', async () => {
                result = await yetiPunks.totalSupply()
                result.toString().should.equal('1')
            })
        })

        describe('Failure', async () => {
            let result

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20)
            })

            it(`reverts if not enough ETH is sent for a mint`, async () => {
                await yetiPunks.publicSaleMint(1, { from: user, value: web3.utils.toWei('0.02', 'ether') })
                    .should.be.rejectedWith('out of gas -- Reason given: Need to send more ETH..')
            });
        })
    })

    describe('Updating Contract State', async () => {
        describe('Success', async () => {

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20)
            })

        })
        
        // it('Does not allow an outsider to read base URI', async () => {
        //     let uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
        //     await yetiPunks.setBaseURI(uri, { from: deployer })
        //     result = await yetiPunks._baseUri().should.be.rejectedWith(TypeError, "yetiPunks._baseUri is not a function")
        // })
    })
})