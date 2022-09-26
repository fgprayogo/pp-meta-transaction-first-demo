import { ethers } from "hardhat";

async function main() {

  const [userOne, userTwo, userThree, userFour] = await ethers.getSigners()


  // const Token = await ethers.getContractFactory("SampleToken")
  // const token = await Token.deploy()
  // await token.deployed()

  // const tokenName = await token.name()
  // const chainId = await userOne.getChainId()

  // const Receiver = await ethers.getContractFactory("Receiver")
  // const receiver = await Receiver.deploy(token.address, tokenName, chainId)
  // await receiver.deployed()

  // await token.mint(userOne.getAddress(), `${100 * 10 ** 18}`)
  // await token.mint(userTwo.getAddress(), `${100 * 10 ** 18}`)
  // await token.mint(userThree.getAddress(), `${100 * 10 ** 18}`)

  // console.log("SampleToken deployed to:", token.address);
  // console.log("Receiver deployed to:", receiver.address);
  // console.log("Token Name :", tokenName)
  // console.log("ChainID :", chainId)


  const Token = await ethers.getContractFactory("PersibIDR")
  const token = await Token.deploy()
  await token.deployed()

  const NFT = await ethers.getContractFactory("PlanetPersibNFT")
  const nft = await NFT.deploy()
  await nft.deployed()

    const toWei = async (eth : number) => {
      return ethers.utils.parseEther(`${eth}`)
  }
  // await token.mint(userOne.getAddress(), `${1000 * 10 ** 18}`)
  await token.mint(userOne.getAddress(), await toWei(1000000))

  console.log("PIDR ADDRESS :", token.address)
  console.log("PPNFT ADDRESS :", nft.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
