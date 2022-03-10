const YetiPunks = artifacts.require("./YetiPunks")

module.exports = async function (deployer) {
    await deployer.deploy(
        YetiPunks,
        10,
        1420,
        25,
        "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/",
        "ipfs://QmXicXiNigVapf79RkJDXwjdSGFVX8zcvokTtXfQp669RK/hiddenYETIPUNK.json"
    )
};