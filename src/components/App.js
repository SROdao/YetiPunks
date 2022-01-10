import { useState, useEffect } from 'react'
import Web3 from 'web3'
import './App.css'
import YetiPunks from '../abis/YetiPunks.json';
import CONFIG from '../config.json';
import Banner from './Banner'
import Main from './Main'
import About from './About';

function App() {
	const [web3, setWeb3] = useState(null)
	const [yetiPunks, setYetiPunks] = useState(null)

	const [supplyAvailable, setSupplyAvailable] = useState(0)
	const [totalSupply, setTotalSupply] = useState(0)

	const [usersAccount, setUsersAccount] = useState(null)
	const [currentNetwork, setCurrentNetwork] = useState(null)

	const [mintAmount, setMintAmount] = useState(1)

	const [blockchainExplorerURL, setBlockchainExplorerURL] = useState('https://etherscan.io/')
	const [openseaURL, setOpenseaURL] = useState('https://opensea.io/')
	
	const MAX_YETI_COUNT = 10000;
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


	const verifyUserOnEthereumNetwork = async () => {
		// if (currentNetwork !== 4 || currentNetwork !== 1) {
		// 	await window.ethereum.request({
		// 		method: 'wallet_switchEthereumChain',
		// 		params: [{ chainId: '0x1' }], // chainId must be in hexadecimal numbers
		// 	  });
		// }
	}

	function mintNFTHandler(numberOfTokens){
		verifyUserOnEthereumNetwork();
		if(supplyAvailable !== 0 || numberOfTokens < supplyAvailable) {
			const price = web3.utils.toWei("0.03", "ether") * numberOfTokens;
			const encoded = yetiPunks.methods.mint(numberOfTokens).encodeABI()
	
			// Saving the below variables in case our fallback defaults are not working down the road
			const defaultGas = numberOfTokens * 90000;
			const defaultGasPrice = 10000000000000;
	
			const tx = {
				from: usersAccount,
				to : contractAddress,
				data : encoded,
				nonce: "0x00",
				value: web3.utils.numberToHex(price)
			}
	
			yetiPunks.methods.mint(numberOfTokens).estimateGas({from: usersAccount})
				.then(limit => {
					tx.gas = web3.utils.numberToHex(limit)
					console.log("fetched gasLimit", limit)
				})
				.catch(error => {
					//tx.gas will get set to whatever the default is automatically
					console.error(error)
					alert(error.message)
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

	function handleMintAmountChange (e) {
		if (e.target.value <= 20 && e.target.valueAsNumber > 0) {
			setMintAmount(parseInt(e.target.value, 10))
		} else if (e.target.valueAsNumber === 0 || e.target.value === "") {
			e.target.value = ""
		} else {
			e.target.value = mintAmount
		}
	}

	const incrementMintAmount = () => {
		if (mintAmount < 20) {
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

	const mintButton = () => {
		return(
			<>
				<div className="input-and-button">
					<button className="btn green-btn" onClick={decrementMintAmount}>-</button>
					<input className="mint-input" type = 'number' min='1' max='20' value={mintAmount} onChange={e => handleMintAmountChange(e)}></input>
					<button className="btn green-btn" onClick={incrementMintAmount}>+</button>
				</div>
				<div className="plus-minus">
					<button onClick={() => mintNFTHandler(mintAmount)} className='btn mint-btn'> MINT </button>
				</div>
			</>
		)
	}

	const connectButton = () => {
		return(
			<div className="plus-minus">
				<button onClick={web3Handler} className="btn mint-btn">Connect Wallet</button>
			</div>

		)
	}

	async function withdrawFunds() {
		const encoded = yetiPunks.methods.withdrawBalance().encodeABI()
		const tx = {
			from: usersAccount,
			to : contractAddress,
			data : encoded,
			nonce: "0x00",
		}

		yetiPunks.methods.withdrawBalance().estimateGas({from: usersAccount})
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
		<div>
			<div>
				<Banner />
				{usersAccount ? (
					<>
						<Main button={mintButton()} supplyAvailable={supplyAvailable} />
						{/* <button onClick={withdrawFunds}>Withdraw</button> */}
						<About />
					</>
				) : (
					<>
						<Main button={connectButton()} />
						<About />
					</>
				)}
				
			</div>
		</div>
	)
}

export default App;
