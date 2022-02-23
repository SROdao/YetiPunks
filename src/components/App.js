import { useState, useEffect } from 'react'
import Web3 from 'web3'
import './App.css'
import YetiPunks from '../abis/YetiPunks.json';
import Banner from './Banner'
import Main from './Main'
import About from './About';
import Footer from './Footer'
import swal from 'sweetalert';

function App() {
	const [web3, setWeb3] = useState(null)
	const [yetiPunks, setYetiPunks] = useState(null)
	
	const [supplyAvailable, setSupplyAvailable] = useState(0)
	const [totalSupply, setTotalSupply] = useState(0)
	
	const [usersAccount, setUsersAccount] = useState(null)
	const [currentNetwork, setCurrentNetwork] = useState(null)
	
	const [mintAmount, setMintAmount] = useState(1)
	
	const maxPerTxn = 20;
	const MAX_YETI_COUNT = 6420;
	const contractAddress = "0x45a2391E71811806E4858ab53808c67A23e26AC2"

	const loadBlockchainData = async () => {
		// Fetch Contract, Data, etc.
		if (web3) {
			const networkId = await web3.eth.net.getId()
			setCurrentNetwork(networkId)

			try {
				console.log('YetiPunks.networks[networkId].address', YetiPunks.networks)
				const yetiPunksContract = new web3.eth.Contract(YetiPunks.abi, YetiPunks.networks[networkId].address)
				setYetiPunks(yetiPunksContract)

				const totalSupply = await yetiPunksContract.methods.totalSupply().call()
				setTotalSupply(parseInt(totalSupply, 10))
				setSupplyAvailable(MAX_YETI_COUNT - totalSupply)

				// listen for Transfer event
				// await yetiPunksContract.events.Transfer({ filter: { value: [] }, fromBlock: 0 })
				// 	.on('data', event => console.log("EVENT", event))
				// 	.on('changed', changed => console.log(changed))
				// 	.on('error', err => { throw err })
				// 	.on('connected', str => console.log(str))

			} catch (error) {
				console.error("Contract not deployed to current network, please change network to Ethereum in MetaMask")
				verifyUserOnEthereumNetwork();
			}

		}
	}

	const loadWeb3 = async () => {
		if (typeof window.ethereum !== 'undefined' && !usersAccount) {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)

			const accounts = await web3.eth.getAccounts()

			if (accounts.length > 0) {
				setUsersAccount(accounts[0])
			} else {
				swal('Log in/connect to MetaMask')
				// console.error("please log in to metamask")
			}

			window.ethereum.on('accountsChanged', function (accounts) {
				setUsersAccount(accounts[0])
			});

			window.ethereum.on('chainChanged', (chainId) => {
				// Handle the new chain.
				// Correctly handling chain changes can be complicated.
				// We recommend reloading the page unless you have good reason not to.
				window.location.reload();
			});
		}
	}

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
				.catch(e => {
					console.error(e.message)
				})
			if (accounts) {
				setUsersAccount(accounts[0])
			}
		}
	}

	// TODO: switch to mainnet before launch
	const verifyUserOnEthereumNetwork = async () => {
		const rinkeby = '0x4'
		const ethereumMainnet = '0x1'
		if (currentNetwork !== 4 || currentNetwork !== 1) {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: rinkeby }], // chainId must be in hexadecimal numbers
			});
		}
	}

	const mintNFTHandler = (numberOfTokens) => {
		if (isNaN(numberOfTokens)) {
			numberOfTokens = 1
		}

		verifyUserOnEthereumNetwork();

		if (supplyAvailable !== 0 || numberOfTokens < supplyAvailable) {
			const price = web3.utils.toWei("0.024", "ether") * numberOfTokens;
			const encoded = yetiPunks.methods.publicSaleMint(numberOfTokens).encodeABI()

			// Saving the below variables in case our fallback defaults are not working down the road
			const defaultGas = numberOfTokens * 90000;
			const defaultGasPrice = 10000000000000;

			const tx = {
				from: usersAccount,
				to: contractAddress,
				data: encoded,
				nonce: "0x00",
				value: web3.utils.numberToHex(price)
			}

			yetiPunks.methods.publicSaleMint(numberOfTokens).estimateGas({ from: usersAccount, value: web3.utils.numberToHex(price) })
				.then(limit => {
					tx.gas = web3.utils.numberToHex(limit)
					console.log("fetched gasLimit", limit)
				})
				.catch(error => {
					if (error.message.match(/insufficient funds/gi)) {
						swal("Insufficent funds for this transaction =(")
					} else if (error.message.match(/minting limit exceeded/gi)) {
						swal("Wallet limit exceeded")
					} else {
						swal(error.message)
					}
				});

			web3.eth.getGasPrice()
				.then(price => {
					tx.gasPrice = web3.utils.numberToHex(price)
					console.log("fetched gasPrice", price)
				})
				.catch(error => {
					//tx.gasPrice will get set to whatever the default is automatically
					console.error("Unable to fetch latest gas price, falling back to default ", error)
				});

			const txHash = window.ethereum.request({
				method: 'eth_sendTransaction',
				params: [tx],
			}).then(async (hash) => {
				console.log("You can now view your transaction with hash: " + hash)
				const newTotalSupply = totalSupply + numberOfTokens
				setTotalSupply(newTotalSupply)
				setSupplyAvailable(MAX_YETI_COUNT - newTotalSupply)
			}).catch((err) => {
				swal(err.message.slice(0, -1) + ' =(')
			});

			return txHash
		}
	}

	const handleMintAmountChange = (e) => {
		if (e.target.value <= maxPerTxn && e.target.valueAsNumber >= 0) {
			const newMintAmouint = e.target.valueAsNumber
			setMintAmount(newMintAmouint)
		} else if (e.target.valueAsNumber === 0 || e.target.value === "") {
			setMintAmount(e.target.valueAsNumber)
		} else {
			e.target.value = mintAmount
		}
	}

	const incrementMintAmount = () => {
		if (mintAmount < maxPerTxn) {
			const newMintAmount = mintAmount + 1;
			setMintAmount(newMintAmount)
		}
	}

	const decrementMintAmount = () => {
		if (mintAmount > 1) {
			const newMintAmount = mintAmount - 1;
			setMintAmount(newMintAmount)
		}
	}

	const handleKeypress = (e) => {
		if (e.key === 'Enter') {
			mintNFTHandler(mintAmount)
		}
	}

	const mintButton = () => {
		return (
			<>
				<div className="input-and-button">
					<button className="btn green-btn" onClick={decrementMintAmount}>-</button>
					<input className="mint-input" type='number' min='1' max={maxPerTxn} placeholder="1" value={mintAmount} onChange={e => handleMintAmountChange(e)} onKeyPress={e => handleKeypress(e)}></input>
					<button className="btn green-btn" onClick={incrementMintAmount}>+</button>
				</div>
				<div className="plus-minus">
					<button onClick={() => mintNFTHandler(mintAmount)} className='btn mint-btn'> MINT </button>
				</div>
			</>
		)
	}

	const connectButton = () => {
		return (
			<div className="plus-minus">
				<button onClick={web3Handler} className="btn mint-btn">CONNECT</button>
			</div>

		)
	}

	const withdrawFunds = async () => {
		const encoded = yetiPunks.methods.withdrawBalance().encodeABI()
		const tx = {
			from: usersAccount,
			to: contractAddress,
			data: encoded,
			nonce: "0x00",
		}

		yetiPunks.methods.withdrawBalance().estimateGas({ from: usersAccount })
			.then(limit => {
				tx.gas = web3.utils.numberToHex(limit)
				console.log("fetched gasLimit", limit)
			})
			.catch(error => {
				//tx.gas will get set to whatever the default is automatically
				console.error("Unable to fetch gas estimation, falling back to default", error)
			});

		web3.eth.getGasPrice()
			.then(price => {
				tx.gasPrice = web3.utils.numberToHex(price)
				console.log("fetched gasPrice", price)
			})
			.catch(error => {
				//tx.gasPrice will get set to whatever the default is automatically
				console.error("Unable to fetch latest gas price, falling back to default ", error)
			});

		const txHash = window.ethereum.request({
			method: 'eth_sendTransaction',
			params: [tx],
		}).then(async (hash) => {
			console.log("You can now view your transaction with hash: " + hash)

		}).catch((err) => {
			console.error(err)
		});

		return txHash
	}

	useEffect(() => {
		loadWeb3()
		loadBlockchainData()
		verifyUserOnEthereumNetwork()
	}, [usersAccount]);

	return (
		<>
			<Banner />

			{usersAccount ? (
				<>
					<Main button={mintButton()} supplyAvailable={supplyAvailable} maxPerTxn={maxPerTxn} maxYetis={MAX_YETI_COUNT} isConnected={!!usersAccount} />
					{/* <button onClick={withdrawFunds}>Withdraw</button> */}
				</>
			) : (
				<>
					<Main button={connectButton()} isConnected={!!usersAccount} />
				</>
			)}

			<About />
			<Footer />
		</>
	)
}

export default App;
