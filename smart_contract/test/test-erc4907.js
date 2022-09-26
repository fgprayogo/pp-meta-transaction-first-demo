const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("PPNFT Unit Test", () => {
  before(async () => {
    [deployer, sam, alice] = await ethers.getSigners();
    // get chainId
    chainId = await ethers.provider.getNetwork().then((n) => n.chainId);
    // await deployments.fixture();
    const PPNFT = await ethers.getContractFactory("PlanetPersibNFT2");
    contractPPNFT = await PPNFT.deploy();
    await contractPPNFT.deployed();
  });

  it("Mint NFT to deployer", async function () {
    // PARAMS (tokenId, receiver address)
    await contractPPNFT.mint(0, deployer.address)
    await contractPPNFT.mint(1, deployer.address)
    await contractPPNFT.mint(2, deployer.address)
    await contractPPNFT.mint(3, deployer.address)
    expect(await contractPPNFT.balanceOf(deployer.address)).to.be.equal(4);
  })

  it("Deployer renting NFT to sam", async function () {
    // const tokenId = 0
    const expires = 1694848510
    // PARAMS (tokenId, receiver address)
    await contractPPNFT.connect(deployer).setUser(0, sam.address, expires)
    await contractPPNFT.connect(deployer).setUser(3, sam.address, expires)
    expect(await contractPPNFT.balanceOfRenter(sam.address)).to.be.equal(2);
  })

  it("Transfering NFT to alice when the item is rented - It should fail", async function () {
    const tokenId = 0
    const expires = 1694848510
    await expect(contractPPNFT.connect(deployer).transferFrom(deployer.address, alice.address, tokenId)).to.be.reverted;
  })

  it("Transfering NFT to alice when the item is not rented - It should success", async function () {
    const tokenId = 1
    await expect(contractPPNFT.connect(deployer).transferFrom(deployer.address, alice.address, tokenId)).to.be.emit(contractPPNFT, "Transfer");
  })

  it("Checking rented item by sam", async function () {
    const balanceOfRenter = await contractPPNFT.balanceOfRenter(sam.address)
    let tokenIds = []
    for (var i = 0; i < balanceOfRenter; i++) {
      // PARAMS : renterAddr, index
      const _tokenId = await contractPPNFT.tokenOfRentedByIndex(sam.address, i)
      tokenIds.push(_tokenId)
    }
    expect(tokenIds[0]).to.be.equal(0);
    expect(tokenIds[1]).to.be.equal(3);
  })

  it("Transferring alice NFT to sam using deployer account before the permit function - It should fail", async function () {
    const tokenId = 1
    await expect(contractPPNFT.connect(deployer).transferFrom(alice.address, sam.address, tokenId)
    ).to.be.revertedWith("ERC721: caller is not token owner nor approved")


  })

  it("Alice signing a message to give permission to deployer", async function () {
    // set deadline in 7 days
    const deadline = Math.round(Date.now() / 1000 + 7 * 24 * 60 * 60);
    const tokenId = 1

    //check alice's balance should be only 1 and token id 1
    await expect(await contractPPNFT.tokenOfOwnerByIndex(alice.address, 0)).to.be.equal(1)

    //sign message to approve deployer moving alice's balance
    const signature = await getPermitSignature(contractPPNFT, alice, deployer.address, deadline, sam, tokenId)

    //calling permit function to give permission to deployer to be able to moving alice's balance
    const permit = await contractPPNFT.connect(deployer).permit(deployer.address, tokenId, deadline, signature)
  })

  it("Transfering alice NFT to sam using deployer account after the permit function - It should success", async function () {
    const tokenId = 1
    //calling permit function to give permission to deployer to be able to moving alice's balance
    expect(await contractPPNFT.balanceOf(sam.address)).to.be.equal(0)
    await contractPPNFT.connect(deployer).transferFrom(alice.address, sam.address, tokenId)
    expect(await contractPPNFT.balanceOf(sam.address)).to.be.equal(1)
  })

})


async function getPermitSignature(token, signer, spender, deadline, to, tokenId) {
  const [nonce, name, version, chainId] = await Promise.all([
    token.nonces(tokenId),
    token.name(),
    "1",
    signer.getChainId(),
  ])

  return await signer._signTypedData(
    {
      name,
      version,
      chainId,
      verifyingContract: token.address,
    },
    {
      Permit: [
        {
          name: "spender",
          type: "address",
        },
        {
          name: "tokenId",
          type: "uint256",
        },
        {
          name: "nonce",
          type: "uint256",
        },
        {
          name: "deadline",
          type: "uint256",
        },
      ],
    },
    {
      spender,
      tokenId,
      nonce,
      deadline,
    }
  )
}