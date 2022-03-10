const YetiPunks = artifacts.require("./YetiPunks")

module.exports = async function (deployer) {
    await deployer.deploy(
        YetiPunks,
        20,
        6420,
        25,
        "ipfs://QmQi1VVrPMBwUSrY6Eq37v7p9aPfjLuQV63vJX7UkPDkV6/",
        "ipfs://QmZeWUvAQfFW8VJ6Ayn3YU1nQCxKYpQrQ6GnY59n8fhZCa/hiddenYETIPUNK.json"
    )
};