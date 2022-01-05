import { useState, useEffect } from 'react'
import Web3 from 'web3'
import './App.css'
import YetiPunks from '../abis/YetiPunks.json';
import CONFIG from '../config.json';
import Banner from './Banner'
import Main from './Main'
import About from './About';

function App() {
	let yetiCount = 10000;
	const [web3, setWeb3] = useState(null)
	const [yeti, setYeti] = useState(null)

	const [supplyAvailable, setSupplyAvailable] = useState(0)
	const [balanceOf, setBalanceOf] = useState(0)

	const [account, setAccount] = useState(null)
	const [currentNetwork, setCurrentNetwork] = useState(null)

	const [mintAmount, setMintAmount] = useState(1)

	const [blockchainExplorerURL, setBlockchainExplorerURL] = useState('https://etherscan.io/')
	const [openseaURL, setOpenseaURL] = useState('https://opensea.io/')

	const [isMinting, setIsMinting] = useState(false)
	const [isError, setIsError] = useState(false)
	const [message, setMessage] = useState(null)

	const [currentTime, setCurrentTime] = useState(new Date().getTime())
	const [revealTime, setRevealTime] = useState(0)
	


	const loadBlockchainData = async () => {
		// Fetch Contract, Data, etc.
		if (web3) {
			const networkId = await web3.eth.net.getId()
			setCurrentNetwork(networkId)
			
			try {
				console.log('YetiPunks.networks[networkId].address', YetiPunks.networks)
				const yeti = new web3.eth.Contract(YetiPunks.abi, YetiPunks.networks[networkId].address)
				setYeti(yeti)



				const maxSupply = await yeti.methods.MAX_SUPPLY().call()
				const totalSupply = await yeti.methods.totalSupply().call()
				setSupplyAvailable(maxSupply - totalSupply)

				const balanceOf = await yeti.methods.balanceOf(account).call()
				setBalanceOf(balanceOf)

				if (networkId !== 5777) {
					setBlockchainExplorerURL(CONFIG.NETWORKS[networkId].blockchainExplorerURL)
					setOpenseaURL(CONFIG.NETWORKS[networkId].openseaURL)
				}

			} catch (error) {
				setIsError(true)
				setMessage("Contract not deployed to current network, please change network to Ethereum in MetaMask")
			}

		}
	}

	/*yeti.events.mint()
	.on('data', (event)=>{
		console.log(event);
	})
	.on('error', console.error);
	*/

	const loadWeb3 = async () => {
		if (typeof window.ethereum !== 'undefined' && !account) {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)

			const accounts = await web3.eth.getAccounts()

			if (accounts.length > 0) {
				setAccount(accounts[0])
			} else {
				setMessage('Please connect with MetaMask')
			}

			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
				setMessage(null)
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
			setAccount(accounts[0])
		}
	}

	// const mintNFTHandler = async (numberOfTokens) => {
	// 	console.log("numberOfTokens: ", numberOfTokens)

	// 	if (yeti) {
	// 		const amountOfEtherToSend = 0.03 * numberOfTokens
	// 		console.log("amountOfEtherToSend: ", amountOfEtherToSend)
	// 		await yeti.methods.mint(numberOfTokens).send({ from: account, value: web3.utils.toWei(amountOfEtherToSend.toString(), 'ether') })
	// 		.on('confirmation', async () => {
	// 			const supplyAvailable = await yeti.methods.remainingSupply().call()
	// 			setSupplyAvailable(supplyAvailable)

	// 			const balanceOf = await yeti.methods.balanceOf(account).call()
	// 			setBalanceOf(balanceOf)
	// 		})
	// 		.on('error', (error) => {
	// 			console.log(error)
	// 			window.alert(error)
	// 			setIsError(true)
	// 		})
	// 	}

	// 	setIsMinting(false)
	// };

	function mintNFTHandler(numberOfTokens){
		let price = web3.utils.toWei("0.03", "ether") * numberOfTokens;
		let encoded = yeti.methods.mint(numberOfTokens).encodeABI()
		// try encodeFunctionCall

		const gas = numberOfTokens * 200000;
		let gasLimit;
		// using the promise
		yeti.methods.mint(numberOfTokens).estimateGas({from: account})
			.then(limit => {
				gasLimit = limit
				console.log("gasLimit", gasLimit)
				console.log("gas", gas)
				console.log("gas - gasLimit", gas - gasLimit)
			})
			.catch(error => {
				//set a default
			});

		let gasPrice;
		web3.eth.getGasPrice()
			.then(result => {
				gasPrice = result
				console.log("gasPrice", result)
			});

	
		let tx = {
			from: account,
			to : "0xF3A20Ac99FeD9d5D37B5F0ee0297eaE852Fa75c0",
			data : encoded,
			nonce: "0x00",
			// gas: '0x76c0', // 30400 gwei
			gas: web3.utils.numberToHex(gasLimit), //gas limit?
			gasPrice: web3.utils.numberToHex(gasPrice),
			value: web3.utils.numberToHex(price)
		}
	
		let txHash = window.ethereum.request({
			method: 'eth_sendTransaction',
			params: [tx],
		}).then((hash) => {
			console.log("You can now view your transaction with hash: " + hash)
		}).catch((err) => console.log(err))
		
		return txHash
	}

	function handleMintAmountChange (e) {
		console.log("e.target.value", e.target.value)
		if (e.target.value <= 20 && e.target.value >= 0) {
			setMintAmount(e.target.value)
		} else if (e.target.value === 0) {
			e.target.value = 1
		} else {
			e.target.value = 20
		}
	}

	console.log("mint amount: ", mintAmount)

	useEffect(() => {
		loadWeb3()
		loadBlockchainData()
		verifyUserOnEthereumNetwork()
	}, [account]);

	const mintButton = () => {
		return(
			<div className="input-and-button">
				<input className="mint-input" type = 'number' min='1' max='20' placeholder='1' onChange={e => handleMintAmountChange(e)}></input>
				<button onClick={() => mintNFTHandler(mintAmount)} className='btn font'> MINT </button>
			</div>
		)
	}

	const connectButton = () => {
		return(
			<button onClick={web3Handler} className="button font">Connect Wallet</button>
		)
	}

	const verifyUserOnEthereumNetwork = async () => {
		if (currentNetwork !== 4 || currentNetwork !== 1) {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0x1' }], // chainId must be in hexadecimal numbers
			  });
		}
	}

	async function getTotalSupply() {
		try{
			let data = await yeti.remainingSupply();
			yetiCount+= data.toNumber();

		}
		catch(err){
			console.log(err);
		}
	}

	return (
		<div>
			<div>
				<Banner />
				{account ? (
					<>
						<Main button={mintButton()} />
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
