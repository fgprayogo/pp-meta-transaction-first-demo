import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.1",
};

// module.exports = {
//   solidity: {
//     compilers: [
//       {
//         version: "0.8.4",
//       },
//     ],
//   },
// };

export default config;

// module.exports = {
//   defaultNetwork: "hardhat",
//   networks: {
//     hardhat: {
//       chainId: 31337
//     },
//     // mumbai: {
//     //   url: "https://polygon-mumbai.g.alchemy.com/v2/BDSfOFYFhvzupg-X_hJa_PQeSh6Lz46F",
//     //   accounts: ['05c033a68dc98b47a39d80cd9c0c4c67a3f2e3135e53da09a6e00ea23b1b7983']
//     // },
//     // mainnet: {
//     //   url: "https://polygon-mainnet.g.alchemy.com/v2/7auTbIG_UEML1WsRd-TKzL9s3t_rDtVS",
//     //   accounts: ['94656c3238f87ef53fe9391424a094bb32563b58c49f696583c65ae47162c3dc']
//     // },
//   },
//   // etherscan: {
//   //   // Your API key for Etherscan
//   // // Obtain one at https://etherscan.io/
//   //   apiKey: 'Y6SB1KMDRGHSKJAY2Y6PV1NMEXG5W4M6J2'
//   // },
//   solidity: {
//     version: "0.8.8",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   }
// };