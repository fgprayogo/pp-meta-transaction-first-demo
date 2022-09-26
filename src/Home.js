import { ethers } from 'ethers'
import axios from 'axios'
// import receiver from 'receiver'
// import sampleToken from 'sample-token'
// import persibIDR from 'pidr'

import { useState, useEffect } from 'react'
import {
  Button,
  TextField,
  Box
} from '@mui/material';

// const receiverAbi = receiver.abi
// const sampleTokenAbi = sampleToken.abi
// const pidrAbi = persibIDR.abi

const receiverAddress = process.env.REACT_APP_RECEIVER_ADDRESS
const sampleTokenAddress = process.env.REACT_APP_SAMPLE_TOKEN_ADDRESS
const pidrAddress = process.env.REACT_APP_PIDR_ADDRESS
const relayerUrl = process.env.REACT_APP_RELAYER_URL


function Home() {
  const [destinationAddress, setDestinationAddress] = useState(0);
  const [amount, setAmount] = useState(0);
  const [ethBalance, setEthBalance] = useState();
  const [sampleTokenBalance, setSampleTokenBalance] = useState();
  const [pidrBalance, setPidrBalance] = useState();
  const [userAddress, setUserAddress] = useState();
  const [depositAmount, setDepositAmount] = useState(0);
  // depositAmount

  useEffect(() => {
    // if (typeof window.ethereum !== 'undefined') {
    //   window.ethereum.enable().then(function (accounts) {
    //     window.ethereum.on('accountsChanged', function (accounts) {
    //       connect()
    //     })
    //   })
    // }
    getUserBalance();
  }, [])

  const getUserBalance = async () => {
    const res = await axios.get(`${relayerUrl}/pidr-balance-user-one`)
    setPidrBalance(await ethers.utils.formatEther(res.data.balance))
    // console.log(res.data.balance)
    // console.log(res.data.balance)
    // console.log(res.data.balance)
    // await ethers.utils.formatEther(await setPidrBalance(res.data.balance))
  }

  const connect = async () => {
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // const signer = await provider.getSigner()
    // const sa = await signer.getAddress()

    // const sampleTokenContract = new ethers.Contract(sampleTokenAddress, sampleTokenAbi, signer)
    // const receiverContract = new ethers.Contract(receiverAddress, receiverAbi, signer)
    // const pidrContract = new ethers.Contract(receiverAddress, receiverAbi, signer)
    // setEthBalance(await ethers.utils.formatEther(await provider.getBalance(sa)))
    // setSampleTokenBalance(await ethers.utils.formatEther(await sampleTokenContract.balanceOf(sa)))

  }

  async function getPermitSignature(token, signer, value, deadline, receiver, to) {
    const [nonce, name, version, chainId, verifyingContract, owner, spender] = await Promise.all([
      token.nonces(signer.getAddress()),
      token.name(),
      "1",
      signer.getChainId(),
      token.address,
      signer.getAddress(),
      receiver.address
    ])
    const { v, r, s } = await ethers.utils.splitSignature(
      await signer._signTypedData(
        {
          name,
          version,
          chainId,
          verifyingContract
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
          owner,
          spender,
          value,
          nonce: parseInt(nonce),
          deadline,
        }
      )
    )
    return [owner, spender, to, value, parseInt(nonce), deadline, v, r, s]
  }
  const submitTrx = async () => {
    const [signer, sampleTokenContract, receiverContract] = await connect()
    let value = `${amount * 10 ** 18}`
    const deadline = 1690975092
    if (destinationAddress.length < 26 || amount < 1) {
      window.alert("Invalid data")
    } else {
      const data = await getPermitSignature(
        sampleTokenContract,
        signer,
        value,
        deadline,
        receiverContract,
        destinationAddress
      )
      try {
        await axios.post(`${relayerUrl}/submit-trx`, data)
        window.alert("Your signature is valid. Transaction successfully submited")
      } catch (error) {
        window.alert(`Error : ${error.response.data.message}`)
      }
    }
  }

  const deposit = async () => {
    const data = {
      depositAmount: `${depositAmount * 10 ** 18}`
    }
    await axios.post(`${relayerUrl}/deposit`, data)
  }
  return (
    <Box display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      minHeight="100vh">
      {/* {
        userAddress ?
          <Button variant="contained" onClick={connect}>
            Connect
          </Button> :

          <>
            <h3>USER ADDRESS : {userAddress}</h3>
            <h3>ETH BALANCE : {parseFloat(ethBalance).toFixed(5)} ETH</h3>
            <h3>SAMPLE TOKEN BALANCE BALANCE : {parseInt(sampleTokenBalance)} STOKEN</h3>
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

      {/* <h3>Saldo PIDR : {pidrBalance}</h3>
      <h3>Amount</h3>
      <TextField
        id="outlined-size-small"
        size="small"
        value={depositAmount !== 0 ? depositAmount : ''} onChange={(e) => setDepositAmount(e.target.value)}
      />
      <br />
      <Button variant="contained" onClick={deposit}>
        Submit
      </Button>
      <h3>NFT Collection : </h3> */}

      <Button href='/admin' variant="contained">Admin</Button>
      <br/>
      <Button href='/user1' variant="outlined">User 1</Button>
      <br/>
      <Button href='/user2' variant="outlined">User 2</Button>
    </Box >


  );
}

export default Home;
