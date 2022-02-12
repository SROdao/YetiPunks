import { useState, useEffect, useRef } from 'react'
import Web3 from 'web3'
import './App.css'
import YetiPunks from '../abis/YetiPunks.json';
import CONFIG from '../config.json';
import Banner from './Banner'
import Main from './Main'
import About from './About';
import Footer from './Footer'

function App() {
	const [isVisible, setIsVisible] = useState(false);
	const [isPublic, setIsPublic] = useState(false);
	const [web3, setWeb3] = useState(null)
	const [yetiPunks, setYetiPunks] = useState(null)

	const [supplyAvailable, setSupplyAvailable] = useState(0)
	const [totalSupply, setTotalSupply] = useState(0)

	const [usersAccount, setUsersAccount] = useState(null)
	const [currentNetwork, setCurrentNetwork] = useState(null)

	const [mintAmount, setMintAmount] = useState(1)

	const [blockchainExplorerURL, setBlockchainExplorerURL] = useState('https://etherscan.io/')
	const [openseaURL, setOpenseaURL] = useState('https://opensea.io/')

	const MAX_YETI_COUNT = 6420;
	const contractAddress = "0x716Cc763C6DC805Ff9d0f58bb63131383DF2471E"
	  
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
				await yetiPunksContract.events.Transfer({ filter: { value: [] }, fromBlock: 0 })
					.on('data', event => console.log("EVENT", event))
					.on('changed', changed => console.log(changed))
					.on('error', err => { throw err })
					.on('connected', str => console.log(str))

				if (networkId !== 5777) {
					setBlockchainExplorerURL(CONFIG.NETWORKS[networkId].blockchainExplorerURL)
					setOpenseaURL(CONFIG.NETWORKS[networkId].openseaURL)
				}

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
				alert('Please connect with MetaMask')
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
			setUsersAccount(accounts[0])
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
			const price = web3.utils.toWei("0.03", "ether") * numberOfTokens;
			const encoded = yetiPunks.methods.mint(numberOfTokens).encodeABI()

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

			yetiPunks.methods.mint(numberOfTokens).estimateGas({ from: usersAccount, value: web3.utils.numberToHex(price) })
				.then(limit => {
					tx.gas = web3.utils.numberToHex(limit)
					console.log("fetched gasLimit", limit)
				})
				.catch(error => {
					console.error(error.message)
					// alert(error.message) <---- alerts when there's not enough funds in the wallet
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
				console.error(err)
			});

			return txHash
		}
	}

	const handleMintAmountChange = (e) => {
		const maxPerTxn = isPublic ? 20 : 5
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
		const maxPerTxn = isPublic ? 20 : 5
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
	
	//JUnk this?
	const checkPublic = ()=> {		
			setIsPublic(true)				
	};

	const setPublicSale = () => {
		setIsPublic(true)
	};
	console.log("isPublic: ", isPublic)

	const mintButton = () => {
		return (
			<>
				<div className="input-and-button">
					<button className="btn green-btn" onClick={decrementMintAmount}>-</button>
					<input className="mint-input" type='number' min='1' max={isPublic ? '20' : '5'} placeholder="1" value={mintAmount} onChange={e => handleMintAmountChange(e)}></input>
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
				<button onClick={web3Handler} className="btn mint-btn">Connect</button>
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
		const timeOut = setTimeout(setPublicSale, 1000 * 60 * 60 * 24);
		loadWeb3()
		loadBlockchainData()
		verifyUserOnEthereumNetwork()
		console.log(timeOut);
	}, [usersAccount]);

	return (
		<div>
			<Banner />

			{usersAccount ? (
				<>
					<Main button={mintButton()} supplyAvailable={supplyAvailable} isPresale={isPublic} maxYetis={MAX_YETI_COUNT} />
					{/* <button onClick={withdrawFunds}>Withdraw</button> */}
				</>
			) : (
				<>
					<Main button={connectButton()} />
				</>
			)}

			<About />
			<Footer />
		</div>
	)
}

export default App;
