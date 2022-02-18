const YetiPunks = artifacts.require("./YetiPunks")

module.exports = async function (deployer) {

    // const IPFS_IMAGE_METADATA_URI = `ipfs://${process.env.IPFS_IMAGE_METADATA_CID}/`
    // const IPFS_HIDDEN_IMAGE_METADATA_URI = `ipfs://${process.env.IPFS_HIDDEN_IMAGE_METADATA_CID}/hidden.json`
    // const NFT_MINT_DATE = new Date(process.env.NFT_MINT_DATE).getTime().toString().slice(0, 10)

    await deployer.deploy(
        YetiPunks, 
        20,
        6420,
        10,
        21,
        "https://safelips.online/assets/meta/contract.json"
    )
};