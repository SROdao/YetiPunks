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

	const [usersAccount, setUsersAccount] = useState(null)
	const [currentNetwork, setCurrentNetwork] = useState(null)

	const [mintAmount, setMintAmount] = useState(1)

	const [blockchainExplorerURL, setBlockchainExplorerURL] = useState('https://etherscan.io/')
	const [openseaURL, setOpenseaURL] = useState('https://opensea.io/')

	const [isMinting, setIsMinting] = useState(false)
	const [isError, setIsError] = useState(false)
	const [message, setMessage] = useState(null)
	


	const loadBlockchainData = async () => {
		// Fetch Contract, Data, etc.
		if (web3) {
			const networkId = await web3.eth.net.getId()
			setCurrentNetwork(networkId)
			
			try {
				console.log('YetiPunks.networks[networkId].address', YetiPunks.networks)
				const yeti = new web3.eth.Contract(YetiPunks.abi, YetiPunks.networks[networkId].address)
				setYetiPunks(yeti)



				const maxSupply = await yeti.methods.MAX_SUPPLY().call()
				const totalSupply = await yeti.methods.totalSupply().call()
				setSupplyAvailable(maxSupply - totalSupply)

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

	const loadWeb3 = async () => {
		if (typeof window.ethereum !== 'undefined' && !usersAccount) {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)

			const accounts = await web3.eth.getAccounts()

			if (accounts.length > 0) {
				setUsersAccount(accounts[0])
			} else {
				setMessage('Please connect with MetaMask')
			}

			window.ethereum.on('accountsChanged', function (accounts) {
				setUsersAccount(accounts[0])
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

	/*yeti.events.mint()
	.on('data', (event)=>{
		console.log(event);
	})
	.on('error', console.error);
	*/

	function mintNFTHandler(numberOfTokens){
		verifyUserOnEthereumNetwork();
		
		const price = web3.utils.toWei("0.03", "ether") * numberOfTokens;
		const encoded = yetiPunks.methods.mint(numberOfTokens).encodeABI()

		// Saving the below variables in case our fallback defaults are not working down the road
		const defaultGas = numberOfTokens * 90000;
		const defaultGasPrice = 10000000000000;

		const tx = {
			from: usersAccount,
			to : "0xD4f9aF13881a60e8B4b94124adf2FAe55b71E344",
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
			const supplyAvailable = await yetiPunks.methods.totalSupply().call() //Is a lag involved here?
			setSupplyAvailable(supplyAvailable)
		}).catch((err) => {
			alert(err)
		});
		
		return txHash
	}

	function handleMintAmountChange (e) {
		if (e.target.value <= 20 && e.target.valueAsNumber > 0) {
			setMintAmount(e.target.value)
		} else if (e.target.valueAsNumber === 0 || e.target.value === "") {
			e.target.value = ""
		} else {
			e.target.value = mintAmount
		}
	}

	useEffect(() => {
		loadWeb3()
		loadBlockchainData()
		verifyUserOnEthereumNetwork()
	}, [usersAccount]);

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

	async function getTotalSupply() {
		try{
			const supplyFromContract = await yetiPunks.methods.totalSupply().call();
			return supplyFromContract
		}
		catch(err){
			console.log(err);
		}
	}

	return (
		<div>
			<div>
				<Banner />
				{usersAccount ? (
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
