import { ethers } from 'ethers'
import axios from 'axios'
import pidr from 'pidr'
import planet_persib_nft from 'planet-persib-nft'

import { useState, useEffect } from 'react'
import {
    Button,
    TextField,
    Box,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import boredApe from '../assets/bored-ape.png'

const planetPersibNFTABI = planet_persib_nft.abi
const pidrABI = pidr.abi

const planetPersibNFTAddress = process.env.REACT_APP_PLANET_PERSIB_NFT_ADDRESS
const pidrAddress = process.env.REACT_APP_PIDR_ADDRESS


const relayerUrl = process.env.REACT_APP_RELAYER_URL


const deployerWalletAddr = process.env.REACT_APP_DEPLOYER_ADDRESS
// const deployerWalletAddr = process.env.REACT_APP_USER1_ADDRESS
const deployerPrivateKey = process.env.REACT_APP_DEPLOYER_PRIVATE_KEY

const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL)
const deployerAcc = new ethers.Wallet(deployerPrivateKey, provider);
const pidrContract = new ethers.Contract(pidrAddress, pidrABI, deployerAcc)
const planetPersibNFTContract = new ethers.Contract(planetPersibNFTAddress, planetPersibNFTABI, deployerAcc)

function Admin() {
    const [destinationAddress, setDestinationAddress] = useState(0);
    const [amount, setAmount] = useState(0);
    const [ethBalance, setEthBalance] = useState(0);
    const [pidrBalance, setpidrBalance] = useState(0);

    // TRANSFER PIDR STATE
    const [recipientPidr, setrecipientPidr] = useState(0);
    const [amountPidr, setAmountPidr] = useState(0);

    // MINT PP NFT
    const [mintTo, setMintTo] = useState(0);
    const [mintTokenId, setMintTokenId] = useState(0);
    const [mintURL, setMintURL] = useState(0);

    //NFT COLLECTIONS
    const [collectionIds, setCollectionIds] = useState([]);

    // TRANSFER NFT
    const [transferNFTTO, setTransferNFTTO] = useState(0);
    const [transferNFTTokenID, setTransferNFTTokenID] = useState(0);

    useEffect(() => {
        loadPidrBalance()
        loadNFTCollections()
    }, []);

    const toEther = async (wei) => {
        return ethers.utils.formatEther(wei)
    }
    const toWei = async (eth) => {
        return ethers.utils.parseEther(`${eth}`)
    }
    const loadPidrBalance = async () => {
        const _pidrBalance = await pidrContract.connect(deployerAcc).balanceOf(deployerWalletAddr);
        setpidrBalance(await toEther(_pidrBalance));
    }
    const tttt = async () => {

    }
    const transferPidr = async () => {
        await pidrContract.connect(deployerAcc).transfer(recipientPidr, await toWei(amountPidr))
        window.location.reload();
    }
    const getURL = async () => {

    }
    const mintPPNFT = async () => {
        const urlIpfs = `https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${mintTokenId}`
        const minting = await planetPersibNFTContract.connect(deployerAcc).safeMint(mintTo, mintTokenId, urlIpfs)
        await minting.wait()
        window.location.reload();
    }

    const loadNFTCollections = async () => {
        const _nftBalance = await planetPersibNFTContract.connect(deployerAcc).balanceOf(deployerWalletAddr)
        let _tokenId = []
        for (let i = 0; i < _nftBalance; i++) {
            const _nftBalanceId = await planetPersibNFTContract.connect(deployerAcc).tokenOfOwnerByIndex(deployerWalletAddr, i)
            // console.log("meta", meta.data.image)
            try {
                const meta = await axios.get(`https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${_nftBalanceId}`)
                const imageUrl = await meta.data.image.split("//")
                // _tokenId.push(Number(_nftBalanceId))
                _tokenId.push({"id": Number(_nftBalanceId), "imageUrl": `https://ipfs.io/ipfs/${imageUrl[1]}`})
            } catch (error) {
                _tokenId.push({"id": Number(_nftBalanceId), "imageUrl": `https://ipfs.io/ipfs/QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ`})
            }
        }
        setCollectionIds(_tokenId)
    }

    const transferNFT = async () => {
        await planetPersibNFTContract.connect(deployerAcc).transferFrom(deployerWalletAddr, transferNFTTO, transferNFTTokenID)
        window.location.reload();

    }
    return (
        <Box display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            minHeight="100vh">
            <>
                <Button href='/' variant="outlined">Back</Button>
                <h1>ADMIN PAGE</h1>
                <h3>Wallet Address : {deployerWalletAddr}</h3>
                <h3>SALDO PIDR : {pidrBalance} </h3>

                <br />
                <Divider orientation="horizontal" flexItem />
                <h2>TRANSFER PIDR </h2>
                <h3>Destination Address</h3>
                <TextField
                    id="outlined-size-medium"
                    size="small"
                    value={recipientPidr !== 0 ? recipientPidr : ''} onChange={(e) => setrecipientPidr(e.target.value)}
                />
                <h3>Amount</h3>
                <TextField
                    id="outlined-size-small"
                    size="small"
                    value={amountPidr !== 0 ? amountPidr : ''} onChange={(e) => setAmountPidr(e.target.value)}
                />
                <br />
                <Button variant="contained" onClick={transferPidr}>
                    Submit
                </Button>
            </>

            <>
                <br />
                <Divider orientation="horizontal" flexItem />
                <h2>MINT PLANET PERSIB NFT </h2>
                <h3>Recipient Address</h3>
                <TextField
                    id="outlined-size-medium"
                    size="small"
                    value={mintTo !== 0 ? mintTo : ''} onChange={(e) => setMintTo(e.target.value)}
                />
                <h3>Token ID</h3>
                <TextField
                    id="outlined-size-medium"
                    size="small"
                    value={mintTokenId !== 0 ? mintTokenId : ''} onChange={(e) => setMintTokenId(e.target.value)}
                />
                <h3>Meta-Data URL</h3>
                <TextField
                    id="outlined-size-medium"
                    size="small"
                    value={mintURL !== 0 ? mintURL : ''} onChange={(e) => setMintURL(e.target.value)}
                />
                <br />
                <Button variant="contained" onClick={mintPPNFT}>
                    Submit
                </Button>
            </>

            <>
                <br />
                <Divider orientation="horizontal" flexItem />
                <h2>DEPLOYER NFT COLLECTIONS</h2>

                <Box display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="row"
                    minHeight="30vh">
                    {/* <img src='https://ipfs.io/ipfs/QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ' /> */}
                    {collectionIds.length == 0 ? <h3>No Collections</h3> :
                        collectionIds.map((obj) =>
                            <Card>
                                <CardContent>
                                    <img src={obj.imageUrl} width={250} height={250} />
                                    <br />
                                    <h3>NFT ID : {obj.id}</h3>
                                </CardContent>
                            </Card>
                        )
                    }
                </Box>
            </>

            <>
                <br />
                <Divider orientation="horizontal" flexItem />
                <h2>TRANSFER PLANET PERSIB NFT</h2>
                <h3>Recipient Address</h3>
                <TextField
                    id="outlined-size-medium"
                    size="small"
                    value={transferNFTTO !== 0 ? transferNFTTO : ''} onChange={(e) => setTransferNFTTO(e.target.value)}
                />
                <h3>NFT ID</h3>
                <TextField
                    id="outlined-size-medium"
                    size="small"
                    value={transferNFTTokenID !== 0 ? transferNFTTokenID : ''} onChange={(e) => setTransferNFTTokenID(e.target.value)}
                />
                <br />

                <Button variant="contained" onClick={transferNFT}>
                    Submit
                </Button>
            </>
        </Box >
    );
}

export default Admin;



{/* {
        userAddress ?
          <Button variant="contained" onClick={connect}>
            Connect
          </Button> :

          <>
            <h1>ADMIN PAGE</h1>
            <h3>USER ADDRESS : {userAddress}</h3>
            <h3>ETH BALANCE : {parseFloat(ethBalance).toFixed(5)} ETH</h3>
            <h3>SAMPLE TOKEN BALANCE BALANCE : {parseInt(pidrBalance)} STOKEN</h3>
            <h3>Destination Address</h3>
            <TextField
              id="outlined-size-medium"
              size="small"
              value={destinationAddress !== 0 ? destinationAddress : ''} onChange={(e) => setDestinationAddress(e.target.value)}
            />
            <h3>Amount</h3>
            <TextField
              id="outlined-size-small"
              size="small"
              value={amount !== 0 ? amount : ''} onChange={(e) => setAmount(e.target.value)}
            />
            <br />
            <Button variant="contained" onClick={submitTrx}>
              Submit
            </Button>
          </>
      } */}


  // useEffect(() => {
  //   if (typeof window.ethereum !== 'undefined') {
  //     window.ethereum.enable().then(function (accounts) {
  //       window.ethereum.on('accountsChanged', function (accounts) {
  //         connect()
  //       })
  //     })
  //   }
  // }, [userAddress])

//   const connect = async () => {
//     const provider = new ethers.providers.Web3Provider(window.ethereum)
//     const signer = await provider.getSigner()
//     const sa = await signer.getAddress()

//     const sampleTokenContract = new ethers.Contract(sampleTokenAddress, pidrABI, signer)
//     const receiverContract = new ethers.Contract(receiverAddress, planetPersibNFTABI, signer)
//     setEthBalance(await ethers.utils.formatEther(await provider.getBalance(sa)))
//     setpidrBalance(await ethers.utils.formatEther(await sampleTokenContract.balanceOf(sa)))
//     setUserAddress(sa)
//     return [signer, sampleTokenContract, receiverContract]
//   }

//   const submitTrx = async () => {
//     const [signer, sampleTokenContract, receiverContract] = await connect()
//     let value = `${amount * 10 ** 18}`
//     const deadline = 1690975092
//     if (destinationAddress.length < 26 || amount < 1) {
//       window.alert("Invalid data")
//     } else {
//       const data = await getPermitSignature(
//         sampleTokenContract,
//         signer,
//         value,
//         deadline,
//         receiverContract,
//         destinationAddress
//       )
//       try {
//         await axios.post(`${relayerUrl}/submit-trx`, data)
//         window.alert("Your signature is valid. Transaction successfully submited")
//       } catch (error) {
//         window.alert(`Error : ${error.response.data.message}`)
//       }
//     }
//   }