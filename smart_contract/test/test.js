const { expect } = require("chai")
const { ethers } = require("hardhat")


async function getPermitSignature(token, signer, spender, value, deadline, receiver, to) {
    const [nonce, name, version, chainId] = await Promise.all([
        token.nonces(signer.address),
        token.name(),
        "1",
        signer.getChainId(),
    ])
    const { v, r, s } = await ethers.utils.splitSignature(
        await signer._signTypedData(
            {
                name,
                version,
                chainId,
                verifyingContract: token.address,
            },
            {
                Permit: [
                    {
                        name: "owner",
                        type: "address",
                    },
                    {
                        name: "spender",
                        type: "address",
                    },
                    {
                        name: "value",
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
                owner: signer.address,
                spender,
                value,
                nonce,
                deadline,
            }
        )

    )
    const val = {
        owner: signer.address,
        spender: receiver.address,
        value: value,
        nonce: nonce,
        deadline: deadline,
    };
    expect(await receiver.verify(val, v, r, s)).to.equal(true)
    return [signer.address, receiver.address, to.address, value, nonce, deadline, v, r, s]

}


describe("META-TRANSACTION", function () {
    it("META-TRANSACTION", async function () {
        const accounts = await ethers.getSigners(3)
        const signer = accounts[0]
        const user2 = accounts[1]
        const user3 = accounts[2]

        const Token = await ethers.getContractFactory("SampleToken")
        const token = await Token.deploy()
        await token.deployed()

        const tokenName = await token.name()
        const chainId = await signer.getChainId()

        const Receiver = await ethers.getContractFactory("Receiver")
        const receiver = await Receiver.deploy(token.address, tokenName, chainId)
        await receiver.deployed()

        await token.mint(signer.address, 10)
        await token.mint(user3.address, 10)
        let value = 1

        const deadline = 1690975092
        let batchData = []

        const data = await getPermitSignature(
            token,
            signer,
            receiver.address,
            value,
            deadline,
            receiver,
            user2
        )
        batchData.push(data)

        const data2 = await getPermitSignature(
            token,
            user3,
            receiver.address,
            value,
            deadline,
            receiver,
            user2
        )
        batchData.push(data2)

        await receiver.batchTransfer(batchData)
        console.log("Balance User 1:", await token.balanceOf(signer.address))
        console.log("balance User 2:", await token.balanceOf(user2.address))
        console.log("balance User 3:", await token.balanceOf(user3.address))



    })
})