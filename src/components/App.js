import { useState, useEffect } from "react";
import Web3 from "web3";
import swal from "sweetalert";
import detectEthereumProvider from '@metamask/detect-provider'

import "./App.css";
import YetiPunks from "../abis/YetiPunks.json";
import Banner from "./Banner";
import Main from "./Main";
import About from "./About";
import Footer from "./Footer";

function App() {
	const [web3, setWeb3] = useState(null);
	// const [initialRender, setInitialRender] = useState(true);
	const [yetiPunks, setYetiPunks] = useState(null);

	const [supplyAvailable, setSupplyAvailable] = useState(0);
	const [totalSupply, setTotalSupply] = useState(0);

	const [usersAccount, setUsersAccount] = useState(null);
	const [currentNetwork, setCurrentNetwork] = useState(null);

	const [mintAmount, setMintAmount] = useState(1);

	const maxPerTxn = 20;
	const MAX_YETI_COUNT = 50;
	const contractAddress = "0x02482fa0cca95f71E1074946Ff9b9Fc7D897F93F";

	const loadBlockchainData = async () => {
		// Fetch Contract, Data, etc.
		if (web3) {
			const networkId = await web3.eth.net.getId();
			setCurrentNetwork(networkId);

			try {
				console.log(
					"YetiPunks.networks[networkId].address",
					YetiPunks.networks
				);
				const yetiPunksContract = new web3.eth.Contract(
					YetiPunks.abi,
					YetiPunks.networks[networkId].address
				);
				setYetiPunks(yetiPunksContract);

				const totalSupply = await yetiPunksContract.methods
					.totalSupply()
					.call();
				setTotalSupply(parseInt(totalSupply, 10));
				setSupplyAvailable(MAX_YETI_COUNT - totalSupply);

				// listen for Transfer event
				// await yetiPunksContract.events.Transfer({ filter: { value: [] }, fromBlock: 0 })
				// 	.on('data', event => console.log("EVENT", event))
				// 	.on('changed', changed => console.log(changed))
				// 	.on('error', err => { throw err })
				// 	.on('connected', str => console.log(str))
			} catch (error) {
				console.error(
					"Contract not deployed to current network, please change network to Ethereum in MetaMask"
				);
				verifyUserOnEthereumNetwork();
			}
		}
	};

	const loadWeb3 = async () => {
		const ethereumProvider = await detectEthereumProvider()
		if (ethereumProvider) {
			const web3 = new Web3(ethereumProvider);
			setWeb3(web3);

			await web3Handler(); //call this to pop up MM

			const accounts = await web3.eth.getAccounts();

			if (accounts.length > 0) {
				setUsersAccount(accounts[0]);
			} else {
				console.error("not logged in/connected to metamask");
			}

			window.ethereum.on("accountsChanged", function (accounts) {
				setUsersAccount(accounts[0]);
			});

			window.ethereum.on("chainChanged", (chainId) => {
				// Handle the new chain.
				// Correctly handling chain changes can be complicated.
				// We recommend reloading the page unless you have good reason not to.
				verifyUserOnEthereumNetwork();
				window.location.reload();
			});
		} else {
			swal('Please install and use MetaMask').then(() => {
				// TODO: Change deeplink to point to real domain
				window.open("https://metamask.app.link/dapp/9f89-2601-348-1-2980-314f-78b2-979e-8e51.ngrok.io")
			})
		}
	};

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum
				.request({ method: "eth_requestAccounts" })
				.catch((e) => {
					console.error(e.message);
				});
			if (accounts) {
				setUsersAccount(accounts[0]);
			}
		}
	};

	// TODO: switch to mainnet before launch
	const verifyUserOnEthereumNetwork = async () => {
		const rinkeby = "0x4";
		//?const ethereumMainnet = "0x1";
		if (currentNetwork !== 4 || currentNetwork !== 1) {
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: rinkeby }], // chainId must be in hexadecimal numbers
			});
		}
	};

	const mintNFTHandler = (numberOfTokens) => {
		if (isNaN(numberOfTokens)) {
			numberOfTokens = 1;
		}

		verifyUserOnEthereumNetwork();

		if (supplyAvailable !== 0 || numberOfTokens < supplyAvailable) {
			const price = web3.utils.toWei("0.024", "ether") * numberOfTokens;
			const encoded = yetiPunks.methods
				.publicSaleMint(numberOfTokens)
				.encodeABI();

			// Saving the below variables in case our fallback defaults are not working down the road
			//?const defaultGas = numberOfTokens * 90000;
			//?const defaultGasPrice = 10000000000000;

			const tx = {
				from: usersAccount,
				to: contractAddress,
				data: encoded,
				value: web3.utils.numberToHex(price),
			};

			yetiPunks.methods
				.publicSaleMint(numberOfTokens)
				.estimateGas({
					from: usersAccount,
					value: web3.utils.numberToHex(price),
				})
				.then((limit) => {
					tx.gas = web3.utils.numberToHex(limit);
					console.log("fetched gasLimit", limit);
				})
				.catch((error) => {
					if (error.message.match(/insufficient funds/gi)) {
						swal("Insufficent funds for this transaction =(");
					} else if (error.message.match(/wallet limit exceeded/gi)) {
						swal("Wallet limit exceeded");
					} else {
						swal(error.message);
					}
				});

			web3.eth
				.getGasPrice()
				.then((price) => {
					tx.gasPrice = web3.utils.numberToHex(price);
					console.log("fetched gasPrice", price);
				})
				.catch((error) => {
					//tx.gasPrice will get set to whatever the default is automatically
					console.error(
						"Unable to fetch latest gas price, falling back to default ",
						error
					);
				});

			const txHash = window.ethereum
				.request({
					method: "eth_sendTransaction",
					params: [tx],
				})
				.then(async (hash) => {
					console.log("You can now view your transaction with hash: " + hash);
					const newTotalSupply = totalSupply + numberOfTokens;
					setTotalSupply(newTotalSupply);
					setSupplyAvailable(MAX_YETI_COUNT - newTotalSupply);
				})
				.catch((err) => {
					swal(err.message.slice(0, -1) + " =(");
				});

			return txHash;
		}
	};

	const handleMintAmountChange = (e) => {
		if (e.target.value <= maxPerTxn && e.target.valueAsNumber >= 0) {
			const newMintAmouint = e.target.valueAsNumber;
			setMintAmount(newMintAmouint);
		} else if (e.target.valueAsNumber === 0 || e.target.value === "") {
			setMintAmount(e.target.valueAsNumber);
		} else {
			e.target.value = mintAmount;
		}
	};

	const incrementMintAmount = () => {
		if (mintAmount < maxPerTxn) {
			const newMintAmount = mintAmount + 1;
			setMintAmount(newMintAmount);
		}
	};

	const decrementMintAmount = () => {
		if (mintAmount > 1) {
			const newMintAmount = mintAmount - 1;
			setMintAmount(newMintAmount);
		}
	};

	const handleKeypress = (e) => {
		if (e.key === "Enter") {
			mintNFTHandler(mintAmount);
		}
	};

	const mintButton = () => {
		return (
			<>
				<div className="input-and-button">
					<button className="btn green-btn" onClick={decrementMintAmount}>
						-
					</button>
					<input
						className="mint-input"
						type="number"
						min="1"
						max={maxPerTxn}
						placeholder="1"
						value={mintAmount}
						onChange={(e) => handleMintAmountChange(e)}
						onKeyPress={(e) => handleKeypress(e)}
					></input>
					<button className="btn green-btn" onClick={incrementMintAmount}>
						+
					</button>
				</div>
				<div className="plus-minus">
					<button
						onClick={() => mintNFTHandler(mintAmount)}
						className="btn mint-btn"
					>
						{" "}
						MINT{" "}
					</button>
				</div>
			</>
		);
	};

	const connectButton = () => {
		return (
			<div className="plus-minus">
				<button onClick={web3Handler} className="btn mint-btn">
					CONNECT
				</button>
			</div>
		);
	};

	useEffect(() => {
		loadWeb3();
		loadBlockchainData();
	}, [usersAccount]);

	return (
		<>
			<Banner usersAccount={usersAccount} />

			{usersAccount ? (
				<>
					<Main
						button={mintButton()}
						supplyAvailable={supplyAvailable}
						maxPerTxn={maxPerTxn}
						maxYetis={MAX_YETI_COUNT}
						isConnected={!!usersAccount}
					/>
				</>
			) : (
				<>
					<Main button={connectButton()} isConnected={!!usersAccount} />
				</>
			)}

			<About />
			<Footer />
		</>
	);
}

export default App;
