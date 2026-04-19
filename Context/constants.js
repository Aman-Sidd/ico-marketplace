import {ethers} from "ethers";
import Web3Modal from "web3modal";


import ERC20Generator from "./ERC20Generator.json";
import icoMarketplace from "./icoMarketplace.json";

export const ERC20Generator_ABI = ERC20Generator.abi;
export const ERC20Generator_BYTECODE = ERC20Generator.bytecode;

export const ICO_MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_ICO_MARKETPLACE_ADDRESS
export const ICO_MARKETPLACE_ABI = icoMarketplace.abi;


//PINATA KEYS
export const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
export const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRECT_KEY;


const networks = {
    polygon_amoy:{
        chainId: `0x${Number(80002).toString(16)}`,
        chainName: "Polygon Amoy",
        nativeCurrency:{
            name:"POLYGON",
            symbol:"POL",
            decimals:18,
        },
        rpcUrls: ["https://rpc-amoy.polygon.technology/"],
        blockExplorerUrls:["https://www.amoy.polygonscan.com"]
    },
    polygon_mainnet:{
        chainId: `0x${Number(137).toString(16)}`,
        chainName: "Polygon Amoy",
        nativeCurrency:{
            name:"MATIC",
            symbol:"MATIC",
            decimals:18,
        },
        rpcUrls: ["https://rpc.ankr.com/polygon"],
        blockExplorerUrls:["https://www.polygonscan.com/"]
    },
    bsc:{
        chainId: `0x${Number(56).toString(16)}`,
        chainName:"Binance Mainnet",
        nativeCurrency:{
            name:"Binance Chain",
            symbol:"BNB",
            decimals:18
        },
        rpcUrls:["https://rpc.ankr.com/bsc"],
        blockExplorerUrls:["https://www.bscscan.com/"]
    }
}

const changeNetwork = async({networkName})=>{
    try{
        if(!window.ethereum) throw new Error("No crypto wallet found");
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: networks[networkName].chainId }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method:"wallet_addEthereumChain",
                    params:[
                        {
                            ...networks[networkName],
                        },
                    ],
                });
            } else {
                throw switchError;
            }
        }
    } catch (error){
        console.log(error);
    }
}

export const handleNetworkSwitch = async()=>{
    const networkName = "polygon_amoy";
    await changeNetwork({networkName});
}

export const shortenAddress = (address) => `${address?.slice(0,5)+"..."+address.slice(-4)}`

// GAS PRICE HELPER
export const getGasPrice = async (provider) => {
  try {
    const feeData = await provider.getFeeData();
    console.log("Network Fee Data:", {
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
      maxFeePerGas: feeData.maxFeePerGas?.toString(),
    });
    
    // Polygon Amoy requires minimum 25 Gwei priority fee. Using 35 for safety.
    const minPriorityFee = ethers.utils.parseUnits("35", "gwei");
    const minMaxFee = ethers.utils.parseUnits("60", "gwei");
    
    return {
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.gt(minPriorityFee) 
        ? feeData.maxPriorityFeePerGas 
        : minPriorityFee,
      maxFeePerGas: feeData.maxFeePerGas?.gt(minMaxFee) 
        ? feeData.maxFeePerGas 
        : minMaxFee,
    };
  } catch (error) {
    console.log("Error getting gas price, using defaults:", error);
    return {
      maxPriorityFeePerGas: ethers.utils.parseUnits("35", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("60", "gwei"),
    };
  }
};

export const getTransactionOverrides = async (provider, estimatedGas) => {
  const gasLimit = estimatedGas.mul(12).div(10);

  try {
    const network = await provider.getNetwork();
    const feeData = await provider.getFeeData();

    if (network.chainId === 80002) {
      const minPriorityFee = ethers.utils.parseUnits("35", "gwei");
      const minMaxFee = ethers.utils.parseUnits("60", "gwei");

      return {
        gasLimit,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.gt(minPriorityFee) 
          ? feeData.maxPriorityFeePerGas 
          : minPriorityFee,
        maxFeePerGas: feeData.maxFeePerGas?.gt(minMaxFee) 
          ? feeData.maxFeePerGas 
          : minMaxFee,
      };
    }

    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      return {
        gasLimit,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        maxFeePerGas: feeData.maxFeePerGas,
      };
    }

    if (feeData.gasPrice) {
      return {
        gasLimit,
        gasPrice: feeData.gasPrice,
      };
    }
  } catch (error) {
    console.log("Error preparing transaction overrides:", error);
  }

  return {gasLimit};
};

// CONTRACT

const fetchContract = (address, abi, signer) => new ethers.Contract(address, abi,signer);

export const ICO_MARKETPLACE_CONTRACT = async()=>{
    try{
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        const signer = provider.getSigner();
        const contract = fetchContract(
            ICO_MARKETPLACE_ADDRESS,
            ICO_MARKETPLACE_ABI,
            signer
        );

        return contract;
    } catch(err){
        console.log(err);
    }
}

export const TOKEN_CONTRACT = async(TOKEN_ADDRESS)=>{
    try{
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        const signer = provider.getSigner();
        const contract = fetchContract(
            TOKEN_ADDRESS,
            ERC20Generator_ABI,
            signer
        );

        return contract;
    } catch(err){
        console.log(err);
    }
}