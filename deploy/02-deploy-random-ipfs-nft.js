const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let vrfCoorinatorV2Address, subscriptionId, tokenUris

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    if (developmentChains.includes(network.name)) {
        const vrfCoorinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoorinatorV2Address = vrfCoorinatorV2Mock.address
        const tx = await vrfCoorinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
    } else {
        vrfCoorinatorV2Address = networkConfig[chainId].vrfCoorinator
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("----------------------------------------------------")
    const args = [
        vrfCoorinatorV2Address,
        subscriptionId,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].callbackGasLimit,
        // TokenUris
        networkConfig[chainId].mintFee,
    ]
}

async function handleTokenUris() {
    tokenUris = []

    return tokenUris
}
