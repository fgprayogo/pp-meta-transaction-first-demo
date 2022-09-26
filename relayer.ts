// import express, { Express, Request, response, Response } from 'express';
// let dotenv = require('dotenv').config()
// import { ethers } from 'ethers'
// import { TypedDataUtils } from 'ethers-eip712'
// import receiver from './smart_contract/artifacts/contracts/Receiver.sol/Receiver.json'
// import sampleToken from './smart_contract/artifacts/contracts/SampleToken.sol/SampleToken.json'
// import PIDR from './smart_contract/artifacts/contracts/PIDR.sol/PersibIDR.json'
// const receiverAbi = receiver.abi
// const sampleTokenAbi = sampleToken.abi
// const pidrAbi = PIDR.abi
// const receiverAddress: any = process.env.REACT_APP_RECEIVER_ADDRESS
// const sampleTokenAddress: any = process.env.REACT_APP_SAMPLE_TOKEN_ADDRESS
// const pidrAddress: any = process.env.REACT_APP_PIDR_ADDRESS
// const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
// const owner = new ethers.Wallet(`${process.env.DEPLOYER_PRIVATE_KEY}`, provider)
// const sampleTokenContract = new ethers.Contract(sampleTokenAddress, sampleTokenAbi, owner)
// const receiverContract = new ethers.Contract(receiverAddress, receiverAbi, owner)
// const pidrContract = new ethers.Contract(pidrAddress, pidrAbi, owner)


// const app: Express = express();

// var cors = require('cors')
// app.use(cors())
// app.use(express.json());


// let batchData: any = []

// let deployer = {
//     address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
//     privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
// }

// let user_one = {
//     address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
//     privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
// }

// let user_two = {
//     address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
//     privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
// }
// const Deployer = new ethers.Wallet(deployer.privateKey, provider); //! GAINTI WALLET MAINNET

// app.get('/', async (req: Request, res: Response) => {
//     res.json({ batchData })
// })

// app.post('/submit-trx', async (req: Request, res: Response) => {
//     let error = false;
//     if (req.body.length !== 9) {
//         return res.status(400).json({ message: "Invalid Arguments Length" })
//     }
//     for (let i = 0; i < 9; i++) {
//         if (req.body[i] === '') {
//             error = true
//         }
//     }
//     if (error == false) {
//         const val = {
//             owner: req.body[0],
//             spender: req.body[1],
//             value: req.body[3],
//             nonce: req.body[4],
//             deadline: req.body[5],
//         };
//         if (await receiverContract.verify(val, req.body[6], req.body[7], req.body[8])) {
//             await batchData.push(req.body)
//             return res.status(200).json({ message: "Ok" })
//         }
//         return res.status(400).json({ message: "Invalid Signature" })
//     } else {
//         return res.status(400).json({ message: "Invalid Arguments" })
//     }
// })

// async function sendMetaTrx() {
//     setTimeout(sendMetaTrx, 60000);
//     if (batchData.length > 0) {
//         console.log("Sending batch transfer ...")
//         await receiverContract.batchTransfer(batchData)
//         batchData = []
//     }
// }

// sendMetaTrx();

// app.post('/deposit', async (req: Request, res: Response) => {
//     await pidrContract.connect(Deployer).transfer(user_one.address, req.body.depositAmount)
//     // console.log(req.body.depositAmount)
// })

// app.get('/pidr-balance-user-one', async (req: Request, res: Response) => {
//     console.log(user_one.address)
//     const balance = await pidrContract.balanceOf(user_one.address);
//     // console.log(balance)
//     return res.json({ balance })
// })












// app.listen(4321, () => {
//     console.log('Running on port 4321')
// })
