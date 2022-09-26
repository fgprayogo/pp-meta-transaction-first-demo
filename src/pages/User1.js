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

const user1WalletAddr = process.env.REACT_APP_USER1_ADDRESS


const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL)
const deployerAcc = new ethers.Wallet(deployerPrivateKey, provider);
const pidrContract = new ethers.Contract(pidrAddress, pidrABI, deployerAcc)
const planetPersibNFTContract = new ethers.Contract(planetPersibNFTAddress, planetPersibNFTABI, deployerAcc)

function User1() {
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
        const _pidrBalance = await pidrContract.connect(deployerAcc).balanceOf(user1WalletAddr);
        setpidrBalance(await toEther(_pidrBalance));
    }
    const tttt = async () => {

    }
    const transferPidr = async () => {
        await pidrContract.connect(deployerAcc).transfer(recipientPidr, await toWei(amountPidr))
    }

    const mintPPNFT = async () => {
        const minting = await planetPersibNFTContract.connect(deployerAcc).safeMint(mintTo, mintTokenId, mintURL)
        await minting.wait()
        console.log(await planetPersibNFTContract.connect(deployerAcc).owner())
    }

    const loadNFTCollections = async () => {
        const _nftBalance = await planetPersibNFTContract.connect(deployerAcc).balanceOf(user1WalletAddr)
        let _tokenId = []
        for (let i = 0; i < _nftBalance; i++) {
            const _nftBalanceId = await planetPersibNFTContract.connect(deployerAcc).tokenOfOwnerByIndex(user1WalletAddr, i)
            // _tokenId.push(Number(_nftBalanceId))
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

    }
    return (
        <Box display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            minHeight="100vh">
            <>
                <Button href='/' variant='outlined'>Back</Button>
                <h1>USER 1 PAGE</h1>
                <h3>Wallet Address : {user1WalletAddr}</h3>
                <h3>SALDO PIDR : {pidrBalance} </h3>

                {/* <br />
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
                </Button> */}
            </>

            {/* <>
                <br />
                <Divider orientation="horizontal" flexItem />
                <h2>MINT PLANET PERSIB NFT </h2>
                <h3>recipient Address</h3>
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
            </> */}

            <>
                <br />
                <Divider orientation="horizontal" flexItem />
                <h2>USER 1 NFT COLLECTIONS</h2>

                <Box display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="row"
                    minHeight="30vh">
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

            {/* <>
                <br />
                <Divider orientation="horizontal" flexItem />
                <h2>TRANSFER PLANET PERSIB NFT</h2>
                <h3>recipient Address</h3>
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
            </> */}
        </Box >
    );
}

export default User1;
