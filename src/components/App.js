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

	const [blockchainExplorerURL, setBlockchainExplorerURL] = useState('https://etherscan.io/')
	const [openseaURL, setOpenseaURL] = useState('https://opensea.io/')

	const [isMinting, setIsMinting] = useState(false)
	const [isError, setIsError] = useState(false)
	const [message, setMessage] = useState(null)

	const [currentTime, setCurrentTime] = useState(new Date().getTime())
	const [revealTime, setRevealTime] = useState(0)
	
	/*let multiMintEvent = yeti.multiMint();
	multiMint.watch(
		function(error, result)
		{
			if(!error)
				yetiCount =- result.args.amountMinted;
		}
	)
	yeti.events.yetiMinted({}
	.on('data', function(event){
		console.log(event);
		if(event != null)
		yetiCount =- event.returnValues['amountMinted'];
	}))*/


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
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setAccount(accounts[0])
		}
	}

	const mintNFTHandler = async (amountToMint) => {
		// Mint NFT
		console.log("yeti", yeti)
		if (yeti) {
			const amountOfEtherToSend = 0.03 * 3
			await yeti.methods.mint(1).send({ from: account, value: web3.utils.toWei(amountOfEtherToSend.toString(), 'ether') })
				// .on('confirmation', async () => {
				// 	// const supplyAvailable = await yeti.methods.remainingSupply().call()
				// 	// setSupplyAvailable(supplyAvailable)

				// 	// const balanceOf = await yeti.methods.balanceOf(account).call()
				// 	// setBalanceOf(balanceOf)
				// })
				.on('error', (error) => {
					window.alert(error)
					setIsError(true)
				})
		}

		setIsMinting(false)
	};

	useEffect(() => {
		loadWeb3()
		loadBlockchainData()
		verifyUserOnEthereumNetwork()
	}, [account]);

	const mintButton = () => {
		return(
			<div className="input-and-button">
				<input className="mint-input" type = 'number' min='1' max='20' placeholder='1' id='mint-count'></input>
				<button onClick={mintNFTHandler} className='btn font'> MINT </button>
			</div>
			//<button onClick={mintNFTHandler} className='btn font'> MINT </button>
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

	async function getTotalSupply()
	{
		try{
			let data = await yeti.totalSupply();
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
						<Main mintedMount={yetiCount} button={mintButton()} currentNetwork={currentNetwork} />
						<About />
					</>
				) : (
					<>
						<Main button={connectButton()} />
						<About />
					</>
				)}
				
			</div>
			{/* <nav className="navbar fixed-top mx-3">
				<a
					className="navbar-brand col-sm-3 col-md-2 mr-0 mx-4"
					href="http://www.dappuniversity.com/bootcamp"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src={logo} className="App-logo" alt="logo" />
					YetiPunks
				</a>

				{account ? (
					<a
						href={`https://etherscan.io/address/${account}`}
						target="_blank"
						rel="noopener noreferrer"
						className="button nav-button btn-sm mx-4">
						{account.slice(0, 5) + '...' + account.slice(38, 42)}
					</a>
				) : (
					<button onClick={web3Handler} className="button nav-button btn-sm mx-4">Connect Wallet</button>
				)}
			</nav>
			<main>
				<Row className="my-3">
					<Col className="text-center">
						<h1 className="text-uppercase">Yeti Punks</h1>
						<p className="countdown">
							{revealTime !== 0 && <Countdown date={currentTime + (revealTime - currentTime)} />}
						</p>
						<p>Y'all yeti got this?</p>
					</Col>
				</Row>
				<Row className="my-4">
					<Col className="panel grid" sm={12} md={6}>
						<button onClick={mintNFTHandler} className="button mint-button"><span>Mint</span></button>
					</Col>
					<Col className="panel grid image-showcase mx-4">
						<img
							src={isError ? (
								sadImage
							) : !isError && isMinting ? (
								excitedImage
							) : (
								happyImage
							)}
							alt="emoji-smile"
							className="image-showcase-example-1"
						/>
					</Col>
				</Row>
				<Row className="my-3">
					<Col className="flex">
						<a href={openseaURL + account} target="_blank" rel="noreferrer" className="button">View My Opensea</a>
						<a href={`${blockchainExplorerURL}address/${account}`} target="_blank" rel="noreferrer" className="button">My Etherscan</a>
					</Col>
				</Row>
				<Row className="my-2 text-center"> */}
					{/* {message ? (
						<p>{message}</p>
					) : (
						<div>
							{yeti &&
								<a href={`${blockchainExplorerURL}address/${yeti._address}`}
									target="_blank"
									rel="noreferrer"
									className="contract-link d-block my-3">
									{yeti._address}
								</a>
							}

							{CONFIG.NETWORKS[currentNetwork] && (
								<p>Current Network: {CONFIG.NETWORKS[currentNetwork].name}</p>
							)}

							<p>{`NFT's Left: ${supplyAvailable}, You've minted: ${balanceOf}`}</p>
						</div>
					)}
				</Row>
			</main> */}
		</div>
	)
}

export default App;
