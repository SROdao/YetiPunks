const { assert } = require('chai')

const YetiPunks = artifacts.require("./YetiPunks")

require('chai')
    .use(require('chai-as-promised'))
    .should()

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
                const event = result.logs[0].args
                const toAddress = event.to
                toAddress.should.equal(user)
            })
            
            it('Updates the total supply', async () => {
                result = await yetiPunks.totalSupply()
                result.toString().should.equal('1')
            })

            it(`shows how many NFTs a given address has minted so far (1 in beforeEach)`, async () => {
                result = await yetiPunks._numberMinted(user)
                result.toString().should.equal('1')
            });

            it(`shows that 1 has been minted after mint and transfer out of wallet`, async () => {
                const numberMintedBeforeTransfer = await yetiPunks._numberMinted(user)
                numberMintedBeforeTransfer.toString().should.equal('1')
                
                const vitalikWallet = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'
                const tokenId = 0 // the first token minted
                await yetiPunks.safeTransferFrom(user, vitalikWallet, tokenId, {from: user})

                const numberMintedAfterTransfer = await yetiPunks._numberMinted(user)
                numberMintedAfterTransfer.toString().should.equal('1')
            });

            it(`shows the balance of NFTs a given address currently has`, async () => {
                result = await yetiPunks.balanceOf(user)
                result.toString().should.equal('1')
            });

            it(`shows that the balance is 0 after mint and transfer out of wallet`, async () => {
                const numberMintedBeforeTransfer = await yetiPunks.balanceOf(user)
                numberMintedBeforeTransfer.toString().should.equal('1')
                
                const vitalikWallet = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'
                const tokenId = 0 // the first token minted
                await yetiPunks.safeTransferFrom(user, vitalikWallet, tokenId, {from: user})

                const numberMintedAfterTransfer = await yetiPunks.balanceOf(user)
                numberMintedAfterTransfer.toString().should.equal('0')
            });

            it(`refunds if value is over price`, async () => {
                
            });
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

            it(`reverts if trying to mint more than 20`, async () => {
                await yetiPunks.publicSaleMint(21, { from: user, value: web3.utils.toWei('0.03', 'ether') })
                    .should.be.rejectedWith('Reason given: can not mint this many')
            });
        })
    })

    describe('Allow list Mint', async () => {
        describe('Success', async () => {
            let result

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20)
                result = await yetiPunks.allowlistMint({ from: user, value: web3.utils.toWei('0.03', 'ether') })
            })

            // it(`allows you to mint if you're on the list`, async () => {
                
            // });
        })

        describe('Failure', async () => {
            let result

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20)
            })

            it(`reverts if minter address is not on the allow list`, async () => {
                await yetiPunks.allowlistMint({ from: user, value: web3.utils.toWei('0.02', 'ether') })
                    .should.be.rejectedWith('Reason given: not eligible for allowlist mint')
            });

            // it(`reverts if trying to mint from contract address`, async () => {
               
            // });
        })
    })

    describe('Updating Contract State', async () => {
        describe('Success', async () => {

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20)
            })
            
            it('Does not allow an outsider to read base URI', async () => {
                const uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
                await yetiPunks.setBaseURI(uri, { from: deployerAddress }) //Doesn't fail
            })

            it(`allows the owner/deployer to withdraw funds`, async () => {
                await yetiPunks.withdrawBalance({ from: deployerAddress }) //Doesn't fail
            });
        })

        describe('Failure', async () => {

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20)
            })
            
            it('throws an error when trying to READ baseURI', async () => {
                const uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
                await yetiPunks.setBaseURI(uri, { from: deployerAddress })
                // await yetiPunks._baseUri()   <---- fails with type error bc function is internal
            })

            it(`doesn't allow anyone who is not the owner/deployer to withdraw balance`, async () => {
                await yetiPunks.withdrawBalance({ from: user }).should.rejectedWith("Reason given: Ownable: caller is not the owner")
            });
        })
        
    })
})