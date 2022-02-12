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
            yetiPunks = await YetiPunks.new(20, 6420, 20, 20, "https://safelips.online/assets/meta/contract.json")
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
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20, "https://safelips.online/assets/meta/contract.json")
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
                await yetiPunks.safeTransferFrom(user, vitalikWallet, tokenId, { from: user })

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
                await yetiPunks.safeTransferFrom(user, vitalikWallet, tokenId, { from: user })

                const numberMintedAfterTransfer = await yetiPunks.balanceOf(user)
                numberMintedAfterTransfer.toString().should.equal('0')
            });

            // it(`refunds if value is over price`, async () => {

            // });
        })

        describe('Failure', async () => {
            let result

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20, "https://safelips.online/assets/meta/contract.json")
            })

            it(`reverts if not enough ETH is sent for a mint`, async () => {
                await yetiPunks.publicSaleMint(1, { from: user, value: web3.utils.toWei('0.02', 'ether') })
                    .should.be.rejectedWith('out of gas -- Reason given: Need to send more ETH')
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
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20, "https://safelips.online/assets/meta/contract.json")
                await yetiPunks.seedAllowlist([user], [user])
            })

            it(`allows you to mint if you're on the list`, async () => {
                result = await yetiPunks.allowlistMint(5, { from: user, value: web3.utils.toWei('0.15', 'ether') })
            });
        })

        describe('Failure', async () => {
            let result

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20, "https://safelips.online/assets/meta/contract.json")
                await yetiPunks.seedAllowlist([user], [user])
            })

            it(`reverts if minter address is not on the allow list`, async () => {
                const somkid = "0xE826d5f95c4503137daD9cA67aFa380EcB23b532"
                await yetiPunks.allowlistMint(5, { from: somkid, value: web3.utils.toWei('0.03', 'ether') })
                    .should.be.rejectedWith('Reason given: not eligible for whitelist mint')
            });

            it(`reverts if whitelisted address doesn't send enough ether`, async () => {
                const somkid = "0xE826d5f95c4503137daD9cA67aFa380EcB23b532"
                await yetiPunks.allowlistMint(5, { from: user, value: web3.utils.toWei('0.10', 'ether') })
                    .should.be.rejectedWith('Reason given: Need to send more ETH')
            });

            // it(`reverts if trying to mint from contract address`, async () => {

            // });
        })
    })

    describe('Dev Mint', async () => {
        describe('Success', async () => {
            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20, "https://safelips.online/assets/meta/contract.json")
            });

            it(`mints if amount doesn't exceed amountForDevs`, async () => {
                await yetiPunks.devMint(5)

                const numberMintedAfterTransfer = await yetiPunks._numberMinted(deployerAddress)
                numberMintedAfterTransfer.toString().should.equal('5')
            });
        });

        describe('Failure', async () => {
            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20, "https://safelips.online/assets/meta/contract.json")
            });

            it(`reverts if you are not the owner`, async () => {
                await yetiPunks.devMint(1, { from: user })
                    .should.be.rejectedWith('Reason given: Ownable: caller is not the owner')
            });

            it(`reverts if attempting to mint more than amountForDevs`, async () => {
                await yetiPunks.devMint(21)
                    .should.be.rejectedWith('Reason given: too many already minted before dev mint')
            });
        });
    });

    describe('Updating Contract State', async () => {
        describe('Success', async () => {

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20, "https://safelips.online/assets/meta/contract.json")
            })

            it('Allows onwer to set baseURI', async () => {
                const uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
                await yetiPunks.setBaseURI(uri, { from: deployerAddress }) // Doesn't fail
            })


            it(`allows the owner/deployer to withdraw all funds`, async () => {
                await yetiPunks.seedAllowlist([user], [user])
                await yetiPunks.allowlistMint(5, { from: user, value: web3.utils.toWei('0.15', 'ether') })

                let balanceBefore = await web3.eth.getBalance(yetiPunks.address)
                balanceBefore.should.equal('150000000000000000')

                await yetiPunks.withdrawBalance({ from: deployerAddress })

                let balance = await web3.eth.getBalance(yetiPunks.address)
                balance.should.equal('0')
            });

            // Update pre-reveal URI

            //read pre-reveal URI and assert
        })

        describe('Failure', async () => {

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(20, 6420, 20, 20, "https://safelips.online/assets/meta/contract.json")
            })

            it('throws an error when trying to READ baseURI', async () => {
                const uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
                await yetiPunks.setBaseURI(uri, { from: deployerAddress })
                // await yetiPunks._baseUri()   <---- fails with type error bc function is internal
            })

            it(`doesn't allow non-owner to set baseUri`, async () => {
                const uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
                await yetiPunks.setBaseURI(uri, { from: user })
                    .should.be.rejectedWith('Reason given: Ownable: caller is not the owner')
            });

            it(`doesn't allow anyone who is not the owner/deployer to withdraw balance`, async () => {
                await yetiPunks.withdrawBalance({ from: user })
                    .should.rejectedWith("Reason given: Ownable: caller is not the owner")
            });
        })

    })
})