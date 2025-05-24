const hre = require("hardhat")

async function main() {
  const DreamFrameNFT = await hre.ethers.getContractFactory("DreamFrameNFT")
  const dreamFrameNFT = await DreamFrameNFT.deploy()

  await dreamFrameNFT.waitForDeployment()

  const address = await dreamFrameNFT.getAddress()
  console.log("DreamFrameNFT deployed to:", address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
