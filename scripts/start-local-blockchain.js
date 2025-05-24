const path = require("path")
const fs = require("fs")
const { exec } = require("child_process")

// Start Hardhat node
console.log("Starting Hardhat node...")
const hardhatNode = exec("npx hardhat node", {
  cwd: path.resolve(__dirname, ".."),
  stdio: "inherit"
})

// Wait for Hardhat node to start
setTimeout(() => {
  console.log("Deploying contract...")
  const deployProcess = exec("npx hardhat run --network localhost scripts/deploy.js", {
    cwd: path.resolve(__dirname, "..")
  })

  let deployOutput = ""
  deployProcess.stdout?.on("data", (data) => {
    deployOutput += data.toString()
    console.log(data.toString())
  })

  deployProcess.stderr?.on("data", (data) => {
    console.error(data.toString())
  })

  deployProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`Deploy script exited with code ${code}`)
      process.exit(code)
    }

    // Extract contract address from deploy output
    const addressMatch = deployOutput.match(/DreamFrameNFT deployed to: (0x[a-fA-F0-9]{40})/)
    if (addressMatch && addressMatch[1]) {
      const contractAddress = addressMatch[1]

      // Save contract address to a file
      const configPath = path.join(__dirname, "..", "lib", "contract-config.json")
      
      // Ensure the directory exists
      const dirPath = path.dirname(configPath)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      
      fs.writeFileSync(configPath, JSON.stringify({ address: contractAddress }, null, 2))

      console.log(`Contract address saved to ${configPath}`)
      console.log("Local blockchain and contract setup complete!")
    } else {
      console.error("Could not extract contract address from deploy output")
      process.exit(1)
    }
  })
}, 5000)

// Handle process termination
process.on("SIGINT", () => {
  console.log("Shutting down...")
  if (hardhatNode && hardhatNode.kill) {
    hardhatNode.kill()
  }
  process.exit()
})
