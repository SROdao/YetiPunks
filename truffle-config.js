require('babel-register');
require('babel-polyfill');
require("dotenv").config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",
			port: 7545,
			network_id: "*" // Match any network id
		},

		rinkeby: {
			provider: function () {
				return new HDWalletProvider(
					[process.env.DEPLOYER_PRIVATE_KEY],
					`wss://rinkeby.infura.io/ws/v3/${process.env.INFURA_API_KEY}` // URL to Ethereum Node
				)
			},
			network_id: 4
		},

		mainnet: {
			provider: function () {
				return new HDWalletProvider(
					[process.env.DEPLOYER_PRIVATE_KEY],
					`https://mainnet.infura.io/v3/2fc5f1e553e44d68b292a16f73044e37` // URL to Ethereum Node
				)
			},
			network_id: 1,
			gas: 6721975, //can try to lower this
			// gas: 3300000, //can try to lower this
			gasPrice: 25000000000, // play around with this
			confirmations: 2,
			skipDryRun: true,
		},

		matic: {
			provider: function () {
				return new HDWalletProvider(
					[process.env.DEPLOYER_PRIVATE_KEY],
					`https://polygon-rpc.com`
				)
			},
			network_id: 137
		}
	},
	plugins: ["solidity-coverage"],

	contracts_directory: './src/contracts/',
	contracts_build_directory: './src/abis/',

	compilers: {
		solc: {
			version: '0.8.9',
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	}
}
