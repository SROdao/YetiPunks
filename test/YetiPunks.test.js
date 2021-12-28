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

        beforeEach(async () => {
            const NFT_MINT_DATE = (Date.now() + milliseconds).toString().slice(0, 10)

            yetiPunks = await YetiPunks.new(
                NAME,
                SYMBOL
                // IPFS_IMAGE_METADATA_URI,
                // IPFS_HIDDEN_IMAGE_METADATA_URI,
                // NFT_MINT_DATE
            )

            timeDeployed = NFT_MINT_DATE - Number(milliseconds.toString().slice(0, 3))
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

        // removed max mint amount per wallet
        // it('Returns the max mint amount', async () => {
        //     result = await yetiPunks.maxMintAmount()
        //     result.toString().should.equal('1')
        // })

        // it('Returns the time deployed', async () => {
        //     result = await yetiPunks.timeDeployed()

        //     if (result > 0) {
        //         assert.isTrue(true)
        //     } else {
        //         console.log(result)
        //         assert.isTrue(false)
        //     }
        // })

        // it('Returns the amount of seconds from deployment to wait until minting', async () => {
        //     let buffer = 2
        //     let target = Number(milliseconds.toString().slice(0, 3))
        //     result = await yetiPunks.allowMintingAfter()
        //     result = Number(result)

        //     // NOTE: Sometimes the seconds may be off by 1, As long as the seconds are 
        //     // between the buffer zone, we'll pass the test
        //     if (result > (target - buffer) && result <= target) {
        //         assert.isTrue(true)
        //     } else {
        //         assert.isTrue(false)
        //     }
        // })

        // it('Returns how many seconds left until minting allowed', async () => {
        //     let buffer = 2
        //     let target = Number(milliseconds.toString().slice(0, 3))
        //     result = await yetiPunks.getSecondsUntilMinting()
        //     result = Number(result)

        //     // NOTE: Sometimes the seconds may be off by 1, As long as the seconds are 
        //     // between the buffer zone, we'll pass the test
        //     if (result > (target - buffer) && result <= target) {
        //         assert.isTrue(true)
        //     } else {
        //         assert.isTrue(false)
        //     }
        // })

        it('Checks if sale is active', async () => {
            result = await yetiPunks.saleIsActive()
            result.toString().should.equal('false')
        })

        // it('Returns current reveal state', async () => {
        //     result = await yetiPunks.isRevealed()
        //     result.toString().should.equal('true')
        // })
    })

    describe('Minting', async () => {
        describe('Success', async () => {

            let result

            beforeEach(async () => {

                const NFT_MINT_DATE = Date.now().toString().slice(0, 10)

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

            // it('Returns IPFS URI', async () => {
            //     result = await yetiPunks.tokenURI(1)
            //     result.should.equal(`${IPFS_IMAGE_METADATA_URI}1.json`)
            // })

            // it('Returns how many a minter owns', async () => {
            //     result = await yetiPunks.balanceOf(user)
            //     result.toString().should.equal('1')
            // })

            // it('Returns the IDs of minted NFTs', async () => {
            //     result = await yetiPunks.walletOfOwner(user)
            //     result.length.should.equal(1)
            //     result[0].toString().should.equal('1')
            // })
        })

        describe('Failure', async () => {

            let result

            beforeEach(async () => {
                // Some date in the future
                const NFT_MINT_DATE = new Date("Nov 04, 2021 18:00:00").getTime().toString().slice(0, 10)

                yetiPunks = await YetiPunks.new(
                    NAME,
                    SYMBOL
                )
                await yetiPunks.toggleSale(false);
            })

            it('Attempt to mint before sale is live', async () => {
                await yetiPunks.mint({ from: user, value: web3.utils.toWei('0.03', 'ether') }).should.be.rejectedWith(EVM_REVERT)
            })

            // it('Attempt to mint more than 1', async () => {
            //     await yetiPunks.mint({ from: user, value: web3.utils.toWei('0', 'ether') }).should.be.rejectedWith(EVM_REVERT)
            //     await yetiPunks.mint({ from: user, value: web3.utils.toWei('0', 'ether') }).should.be.rejectedWith(EVM_REVERT)
            // })
        })
    })

    // describe('Updating Contract State', async () => {
    //     describe('Success', async () => {

    //         let result

    //         beforeEach(async () => {
    //             const NFT_MINT_DATE = Date.now().toString().slice(0, 10)

    //             yetiPunks = await YetiPunks.new(
    //                 NAME,
    //                 SYMBOL
    //             )
    //         })

    //         it('Sets the cost', async () => {
    //             let cost = web3.utils.toWei('1', 'ether')
    //             await yetiPunks.setCost(cost, { from: deployer })
    //             result = await yetiPunks.cost()
    //             result.toString().should.equal(cost)
    //         })

    //         it('Sets the pause state', async () => {
    //             let isPaused = true // Opposite of the default contract state
    //             await yetiPunks.setIsPaused(isPaused, { from: deployer })
    //             result = await yetiPunks.isPaused()
    //             result.toString().should.equal(isPaused.toString())
    //         })

    //         it('Sets the reveal state', async () => {
    //             let isRevealed = false // Opposite of the default contract state
    //             await yetiPunks.setIsRevealed(isRevealed, { from: deployer })
    //             result = await yetiPunks.isRevealed()
    //             result.toString().should.equal(isRevealed.toString())
    //         })

    //         it('Sets the max batch mint amount', async () => {
    //             let amount = 5 // Different from the default contract state
    //             await yetiPunks.setmaxMintAmount(5, { from: deployer })
    //             result = await yetiPunks.maxMintAmount()
    //             result.toString().should.equal(amount.toString())
    //         })

    //         it('Sets the IPFS not revealed URI', async () => {
    //             let uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
    //             await yetiPunks.setNotRevealedURI(uri, { from: deployer })
    //             result = await yetiPunks.notRevealedUri()
    //             result.toString().should.equal(uri)
    //         })

    //         it('Sets the base extension', async () => {
    //             let extension = '.example' // Different from the default contract state
    //             await yetiPunks.setBaseExtension('.example', { from: deployer })
    //             result = await yetiPunks.baseExtension()
    //             result.toString().should.equal(extension)
    //         })
    //     })
    // })
})