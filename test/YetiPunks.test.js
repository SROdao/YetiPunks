const YetiPunks = artifacts.require("./YetiPunks")

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('YetiPunks', ([deployerAddress, user]) => {
    let yetiPunks

    describe('Deployment', () => {
        let result

        beforeEach(async () => {
            yetiPunks = await YetiPunks.new(10, 1420, 25, "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/", "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/notRevealed.json")
        })

        it('Returns the contract name', async () => {
            result = await yetiPunks.name()
            result.should.equal("YETIPUNKS")
        })

        it('Returns the symbol', async () => {
            result = await yetiPunks.symbol()
            result.should.equal("YP")
        })
    })

    describe('Public sale mint', async () => {
        describe('Success', async () => {
            let result
            let uri

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(10, 1420, 25, "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/", "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/notRevealed.json")
                uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/'
                await yetiPunks.setPublicSale(true);
                await yetiPunks.setBaseURI(uri, { from: deployerAddress })
                result = await yetiPunks.publicSaleMint(1, { from: user, value: web3.utils.toWei('0.02', 'ether') })
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
                result = await yetiPunks.numberMinted(user)
                result.toString().should.equal('1')
            });

            it(`shows that 1 has been minted after mint and transfer out of wallet`, async () => {
                const numberMintedBeforeTransfer = await yetiPunks.numberMinted(user)
                numberMintedBeforeTransfer.toString().should.equal('1')

                const vitalikWallet = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'
                const tokenId = 21 // the first token minted after mint for devs
                await yetiPunks.safeTransferFrom(user, vitalikWallet, tokenId, { from: user })

                const numberMintedAfterTransfer = await yetiPunks.numberMinted(user)
                numberMintedAfterTransfer.toString().should.equal('1')
            });


            it(`succeeds if trying to mint a batch of 6`, async () => {
                // Mint 5, since 'user' minted one in beforeEach
                await yetiPunks.publicSaleMint(5, { from: user, value: web3.utils.toWei('0.22', 'ether') })
                const numberUserMinted = await yetiPunks.numberMinted(user)
                numberUserMinted.toString().should.equal('6')
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

            it(`shows the prereveal JSON URI before reveal`, async () => {
                const tokenId = 0
                const result = await yetiPunks.tokenURI(tokenId, { from: deployerAddress })
                result.should.equal("ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/notRevealed.json")
            });

            it(`refunds if value is over price`, async () => {
                const balanceBeforeMint = await web3.eth.getBalance(yetiPunks.address)
                balanceBeforeMint.should.equal(web3.utils.toWei('0.02', 'ether'))

                await yetiPunks.publicSaleMint(1, { from: user, value: web3.utils.toWei('0.1', 'ether') })

                const balanceAfterMint = await web3.eth.getBalance(yetiPunks.address)
                balanceAfterMint.should.equal(web3.utils.toWei('0.04', 'ether'))
                balanceAfterMint.should.not.equal(web3.utils.toWei('0.12', 'ether'))
            });

            it(`allows a devMint to mint more than the 6 NFT public sale limit to the same wallet address`, async () => {
                const testWallet = '0xA6E23d1775Ed0f77DDb173bd3484f7ead1fAD001'
                await yetiPunks.publicSaleMint(5, { from: user, value: web3.utils.toWei('0.12', 'ether') })
                const nftsOwnedByTestWalletBefore = await await yetiPunks.balanceOf(user)
                nftsOwnedByTestWalletBefore.toString().should.equal('6') // user has the max for public mint

                await yetiPunks.devMint([user], 6)
                const nftsOwnedByTestWalletAfter = await await yetiPunks.balanceOf(user)
                nftsOwnedByTestWalletAfter.toString().should.equal('12')
            })
        })

        describe('Failure', async () => {
            let uri

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(10, 1420, 25, "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/", "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/notRevealed.json")
                uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/'
                await yetiPunks.setPublicSale(true);
                await yetiPunks.setBaseURI(uri, { from: deployerAddress })
            })

            it(`reverts if not enough ETH is sent for a mint, no NFT is minted`, async () => {
                await yetiPunks.publicSaleMint(1, { from: user, value: web3.utils.toWei('0.015', 'ether') })
                    .should.be.rejectedWith('Reason given: Need to send more ETH')

                const balance = await yetiPunks.balanceOf(user)
                balance.toString().should.equal('0')

                const numberMinted = await yetiPunks.numberMinted(user)
                numberMinted.toString().should.equal('0')
            });

            it(`reverts if trying to mint more than 10 at once due to max batch limit`, async () => {
                await yetiPunks.publicSaleMint(11, { from: user, value: web3.utils.toWei('0.02', 'ether') })
                    .should.be.rejectedWith('Reason given: Max batch minting quantity exceeded')
            });

            it(`reverts if trying to mint more than 6 due to wallet limit exceeded`, async () => {
                await yetiPunks.publicSaleMint(7, {
                    from: user, value: web3.utils.toWei('0.2', 'ether')
                }).should.be.rejectedWith('Reason given: Wallet limit exceeded')
            });

            it(`reverts if trying to mint more than 20 due to BATCH LIMIT`, async () => {
                await yetiPunks.publicSaleMint(21, { from: user, value: web3.utils.toWei('0.02', 'ether') })
                    .should.be.rejectedWith('Reason given: Max batch minting quantity exceeded')
            });

            it(`reverts when calling the tokenURI function for a tokenId that hasn't been minted`, async () => {
                const tokenId = 100
                await yetiPunks.tokenURI(tokenId)
                    .should.be.rejectedWith('URI query for nonexistent token')
            });
        })
    })

    describe('Dev Mint', async () => {
        describe('Success', async () => {
            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(10, 1420, 25, "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/", "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/notRevealed.json")
            });

            it(`allows devMint to mint to co-creators past amountForDevs`, async () => {
                const somkid = "0xAE534782fE40DA31a4D890d3bADAeF0352FEead7"
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
                yetiPunks = await YetiPunks.new(10, 1420, 25, "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/", "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/notRevealed.json")
            });

            it(`reverts if you are not the owner`, async () => {
                const somkid = "0xAE534782fE40DA31a4D890d3bADAeF0352FEead7"
                await yetiPunks.devMint([somkid], 1, { from: user })
                    .should.be.rejectedWith('Reason given: Ownable: caller is not the owner')
            });

            it(`reverts if attempting to mint more than maxBatchSize`, async () => {
                const somkid = "0xAE534782fE40DA31a4D890d3bADAeF0352FEead7"
                await yetiPunks.devMint([somkid], 21)
                    .should.be.rejectedWith('Reason given: ERC721A: quantity to mint too high')
            });
        });
    });

    describe('Updating Contract State', async () => {
        describe('Success', async () => {

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(10, 1420, 25, "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/", "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/notRevealed.json")
            })

            it('Allows onwer to set baseURI', async () => {
                const uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
                await yetiPunks.setBaseURI(uri, { from: deployerAddress })
                    .should.not.be.rejectedWith('error')
            })

            it('shows the tokenURI of already minted NFTs', async () => {
                const uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/'
                const tokenId = 0
                await yetiPunks.revealCollection()
                await yetiPunks.setBaseURI(uri, { from: deployerAddress })
                const result = await yetiPunks.tokenURI(tokenId, { from: deployerAddress })
                result.should.equal(uri + tokenId + ".json")
            })

            it('Allows onwer to set notRevealedUri', async () => {
                const uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state

                await yetiPunks.setNotRevealedURI(uri, { from: deployerAddress })

                const result = await yetiPunks.notRevealedUri()
                result.toString().should.equal(uri)
            })

            it(`allows the owner/deployer to withdraw all funds`, async () => {
                await yetiPunks.setPublicSale(true);
                await yetiPunks.publicSaleMint(3, { from: user, value: web3.utils.toWei('0.06', 'ether') })

                const balanceBefore = await web3.eth.getBalance(yetiPunks.address)
                balanceBefore.should.equal(web3.utils.toWei('0.06', 'ether'))

                await yetiPunks.withdrawBalance({ from: deployerAddress })

                const balance = await web3.eth.getBalance(yetiPunks.address)
                balance.should.equal('0')
            });

            it(`???explicitly sets the owner???`, async () => {
                const unorthadoxant = "0xbe16A803431fB1694656187334c50792031CD6Ac"
                const somkid = "0xAE534782fE40DA31a4D890d3bADAeF0352FEead7"
                const andreas = "0x7638aC632C177BB6eB88826065eb62b878F93754"

                await yetiPunks.setOwnersExplicit(21, { from: deployerAddress })

                const ownerOfFirst = await yetiPunks.ownerOf(0)
                ownerOfFirst.toString().should.equal(unorthadoxant)
                const ownerOfEighth = await yetiPunks.ownerOf(7)
                ownerOfEighth.toString().should.equal(somkid)
                const ownerOfFifteenth = await yetiPunks.ownerOf(14)
                ownerOfFifteenth.toString().should.equal(andreas)
            });

            it(`gets ownership data of a certain NFT tokenId`, async () => {
                await yetiPunks.setPublicSale(true);
                await yetiPunks.publicSaleMint(1, { from: user, value: web3.utils.toWei('0.02', 'ether') })
                const tokenId = 21 // the first token minted after mint for devs

                const ownershipData = await yetiPunks.getOwnershipData(tokenId)

                ownershipData.addr.should.equal(user)
            });

            // Update pre-reveal URI

            //read pre-reveal URI and assert
        })

        describe('Failure', async () => {

            beforeEach(async () => {
                yetiPunks = await YetiPunks.new(10, 1420, 25, "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/", "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/notRevealed.json")
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