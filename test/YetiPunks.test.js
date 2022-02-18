const YetiPunks = artifacts.require("./YetiPunks")

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('YetiPunks', ([deployerAddress, user]) => {
    let yetiPunks

    describe('Deployment', () => {
        let result

        beforeEach(async () => {
            yetiPunks = await YetiPunks.new(10, 6420, 10, 21, "https://safelips.online/assets/meta/contract.json")
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
            let uri

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(10, 6420, 10, 21, "https://safelips.online/assets/meta/contract.json")
                uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/'
                await yetiPunks.setBaseURI(uri, { from: deployerAddress })
                result = await yetiPunks.publicSaleMint(1, { from: user, value: web3.utils.toWei('0.03', 'ether') })
            })

            it('Returns the address of the minter', async () => {
                const event = result.logs[0].args
                const toAddress = event.to
                toAddress.should.equal(user)
            })

            it('Updates the total supply', async () => {
                result = await yetiPunks.totalSupply()
                const amountForDevs = 21
                result.toString().should.equal((amountForDevs + 1).toString())
            })

            it(`shows how many NFTs a given address has minted so far (1 in beforeEach)`, async () => {
                result = await yetiPunks._numberMinted(user)
                result.toString().should.equal('1')
            });

            it(`shows that 1 has been minted after mint and transfer out of wallet`, async () => {
                const numberMintedBeforeTransfer = await yetiPunks._numberMinted(user)
                numberMintedBeforeTransfer.toString().should.equal('1')

                const vitalikWallet = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'
                const tokenId = 21 // the first token minted after mint for devs
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
                const tokenId = 21 // the first token minted after mint for devs
                await yetiPunks.safeTransferFrom(user, vitalikWallet, tokenId, { from: user })

                const numberMintedAfterTransfer = await yetiPunks.balanceOf(user)
                numberMintedAfterTransfer.toString().should.equal('0')
            });

            it(`shows the tokenURI of the first NFT (baseURI + tokenId) for the owner of the contract`, async () => {
                const tokenId = 0
                const result = await yetiPunks.tokenURI(tokenId, { from: deployerAddress })
                result.should.equal(uri + tokenId)
            });

            it(`refunds if value is over price`, async () => {
                const balanceBeforeMint = await web3.eth.getBalance(yetiPunks.address)
                balanceBeforeMint.should.equal(web3.utils.toWei('0.024', 'ether'))
                
                await yetiPunks.publicSaleMint(1, { from: user, value: web3.utils.toWei('0.1', 'ether') })

                const balanceAfterMint = await web3.eth.getBalance(yetiPunks.address)
                balanceAfterMint.should.equal(web3.utils.toWei('0.048', 'ether'))
                balanceAfterMint.should.not.equal(web3.utils.toWei('0.124', 'ether')) 
            });
        })

        describe('Failure', async () => {
            let uri

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(10, 6420, 10, 21, "https://safelips.online/assets/meta/contract.json")
                uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/'
                await yetiPunks.setBaseURI(uri, { from: deployerAddress })
            })

            it(`reverts if not enough ETH is sent for a mint, no NFT is minted`, async () => {
                await yetiPunks.publicSaleMint(1, { from: user, value: web3.utils.toWei('0.02', 'ether') })
                    .should.be.rejectedWith('Reason given: Need to send more ETH')

                const balance = await yetiPunks.balanceOf(user)
                balance.toString().should.equal('0')

                const numberMinted = await yetiPunks._numberMinted(user)
                numberMinted.toString().should.equal('0')
            });

            it(`reverts if trying to mint more than 20`, async () => {
                await yetiPunks.publicSaleMint(21, { from: user, value: web3.utils.toWei('0.03', 'ether') })
                    .should.be.rejectedWith('Reason given: public sale minting limit exceeded')
            });

            it(`reverts when calling the tokenURI function for a tokenId that hasn't been minted`, async () => {
                const tokenId = 100
                await yetiPunks.tokenURI(tokenId)
                    .should.be.rejectedWith('URI query for nonexistent token')

            });

            it(`reverts when calling the tokenURI function from non-owner`, async () => {
                const tokenId = 0
                await yetiPunks.tokenURI(tokenId, { from: user })
                    .should.be.rejectedWith('Ownable: caller is not the owner')
            });


            it(`reverts if tokenURI() is called by anyone other than contract owner`, async () => {
                const tokenId = 0
                await yetiPunks.tokenURI(tokenId, { from: user })
                    .should.be.rejectedWith('Ownable: caller is not the owner')
            });
        })
    })

    // describe('Allow list Mint', async () => {
    //     describe('Success', async () => {
    //         let result

    //         beforeEach(async () => {
    //             yetiPunks = await YetiPunks.new(10, 6420, 10, 21, "https://safelips.online/assets/meta/contract.json")
    //             await yetiPunks.seedAllowlist([user], [user])
    //         })

    //         it(`allows you to mint if you're on the list`, async () => {
    //             result = await yetiPunks.allowlistMint(3, { from: user, value: web3.utils.toWei('0.15', 'ether') })
    //         });
    //     })

    //     describe('Failure', async () => {
    //         beforeEach(async () => {
    //             yetiPunks = await YetiPunks.new(10, 6420, 10, 21, "https://safelips.online/assets/meta/contract.json")
    //             await yetiPunks.seedAllowlist([user], [user])
    //         })

    //         it(`reverts if minter address is not on the allow list`, async () => {
    //             const somkid = "0xE3Ce04B3BcbdFa219407870Ca617e18fBF503F28"
    //             await yetiPunks.allowlistMint(3, { from: somkid, value: web3.utils.toWei('0.09', 'ether') })
    //                 .should.be.rejectedWith('Reason given: not eligible for whitelist mint')
    //         });

    //         it(`reverts if minter tries to mint more than whitelist limit`, async () => {
    //             const somkid = "0xE3Ce04B3BcbdFa219407870Ca617e18fBF503F28"
    //             await yetiPunks.allowlistMint(4, { from: user, value: web3.utils.toWei('0.09', 'ether') })
    //                 .should.be.rejectedWith('Reason given: mint amount exceeds whitelist')
    //         });

    //         it(`reverts if whitelisted address doesn't send enough ether`, async () => {
    //             const somkid = "0xE3Ce04B3BcbdFa219407870Ca617e18fBF503F28"
    //             await yetiPunks.allowlistMint(3, { from: user, value: web3.utils.toWei('0.05', 'ether') })
    //                 .should.be.rejectedWith('Reason given: Need to send more ETH')

    //             const balance = await yetiPunks.balanceOf(user)
    //             balance.toString().should.equal('0')

    //             const numberMinted = await yetiPunks._numberMinted(user)
    //             numberMinted.toString().should.equal('0')
    //         });

    //         // it(`reverts if trying to mint from contract address`, async () => {

    //         // });
    //     })
    // })

    describe('Dev Mint', async () => {
        describe('Success', async () => {
            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(10, 6420, 10, 21, "https://safelips.online/assets/meta/contract.json")
            });

            it(`allows devMint to mint to co-creators past amountForDevs`, async () => {
                const somkid = "0xE3Ce04B3BcbdFa219407870Ca617e18fBF503F28"
                await yetiPunks.devMint([somkid], 1)

                const somkidMinted = await yetiPunks.numberMinted(somkid)
                somkidMinted.toString().should.equal('8')
            });

            it(`allows a devMint up to a batch size of 10`, async () => {
                const vitalikWallet = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'
                await yetiPunks.devMint([vitalikWallet], 10)

                const somkidMinted = await yetiPunks.numberMinted(vitalikWallet)
                somkidMinted.toString().should.equal('10')
            });

            it(`allows a devMint for over 10 wallet addresses (one NFT each)`, async () => {
                const vitalikWallet = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'
                const arr = new Array(11)
                const arrayOfWallets = arr.fill(vitalikWallet)

                await yetiPunks.devMint(arrayOfWallets, 1)

                const somkidMinted = await yetiPunks.numberMinted(vitalikWallet)
                somkidMinted.toString().should.equal('11')
            })
        });

        describe('Failure', async () => {
            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(10, 6420, 10, 21, "https://safelips.online/assets/meta/contract.json")
            });

            it(`reverts if you are not the owner`, async () => {
                const somkid = "0xE3Ce04B3BcbdFa219407870Ca617e18fBF503F28"
                await yetiPunks.devMint([somkid], 1, { from: user })
                    .should.be.rejectedWith('Reason given: Ownable: caller is not the owner')
            });

            it(`reverts if attempting to mint more than maxBatchSize`, async () => {
                const somkid = "0xE3Ce04B3BcbdFa219407870Ca617e18fBF503F28"
                await yetiPunks.devMint([somkid], 11)
                    .should.be.rejectedWith('Reason given: ERC721A: quantity to mint too high')
            });
        });
    });

    describe('Updating Contract State', async () => {
        describe('Success', async () => {

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(10, 6420, 10, 21, "https://safelips.online/assets/meta/contract.json")
            })

            it('Allows onwer to set baseURI', async () => {
                const uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
                await yetiPunks.setBaseURI(uri, { from: deployerAddress })
                    .should.not.be.rejectedWith('error')
            })

            it('shows the tokenURI of already minted NFTs', async () => {
                const uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/'
                const tokenId = 0
                await yetiPunks.setBaseURI(uri, { from: deployerAddress })
                const result = await yetiPunks.tokenURI(tokenId, { from: deployerAddress })
                result.should.equal(uri + tokenId)
            })

            it('Allows onwer to set notRevealedUri', async () => {
                const uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state

                await yetiPunks.setNotRevealedURI(uri, { from: deployerAddress })

                const result = await yetiPunks.notRevealedUri()
                result.toString().should.equal(uri)
            })

            it(`allows the owner/deployer to withdraw all funds`, async () => {
                await yetiPunks.publicSaleMint(3, { from: user, value: web3.utils.toWei('0.072', 'ether') })

                const balanceBefore = await web3.eth.getBalance(yetiPunks.address)
                balanceBefore.should.equal(web3.utils.toWei('0.072', 'ether'))

                await yetiPunks.withdrawBalance({ from: deployerAddress })

                const balance = await web3.eth.getBalance(yetiPunks.address)
                balance.should.equal('0')
            });

            it(`explicitly sets the owner `, async () => {
                
            });

            it(`gets ownership data of a certain NFT tokenId`, async () => {
                await yetiPunks.publicSaleMint(1, { from: user, value: web3.utils.toWei('0.024', 'ether') })
                const tokenId = 21 // the first token minted after mint for devs

                const ownershipData = await yetiPunks.getOwnershipData(tokenId)
                
                ownershipData.addr.should.equal(user)
            });

            // Update pre-reveal URI

            //read pre-reveal URI and assert
        })

        describe('Failure', async () => {

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(10, 6420, 10, 21, "https://safelips.online/assets/meta/contract.json")
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

            it(`doesn't allow non-owner to set notRevealedUri`, async () => {
                const uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
                await yetiPunks.setNotRevealedURI(uri, { from: user })
                    .should.be.rejectedWith('Reason given: Ownable: caller is not the owner')
            });

            it(`doesn't allow anyone who is not the owner/deployer to withdraw balance`, async () => {
                await yetiPunks.withdrawBalance({ from: user })
                    .should.rejectedWith("Reason given: Ownable: caller is not the owner")
            });
        })

    })
})