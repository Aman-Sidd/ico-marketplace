import React, { useState, useContext, createContext, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import toast from "react-hot-toast";

// INTERNAL IMPORT
import {
    ERC20Generator_BYTECODE,
    handleNetworkSwitch,
    shortenAddress,
    ICO_MARKETPLACE_ADDRESS,
    ICO_MARKETPLACE_CONTRACT,
    TOKEN_CONTRACT,
    PINATA_API_KEY,
    PINATA_SECRET_KEY,
    ERC20Generator_ABI,
    getTransactionOverrides
} from "./constants";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    // STATE VARIABLE
    const [address, setAddress] = useState();
    const [accountBalance, setAccountBalance] = useState(null);
    const [loader, setLoader] = useState(false);
    const [recall, setRecall] = useState(0);
    const [currency, setCurrency] = useState("MATIC");

    // COMPONENT
    const [openBuyToken, setOpenBuyToken] = useState(false);
    const [openWithdrawToken, setOpenWithdrawToken] = useState(false);
    const [openTransferToken, setOpenTransferToken] = useState(false);
    const [openTokenCreator, setOpenTokenCreator] = useState(false);
    const [openCreateICO, setOpenCreateICO] = useState(false);

    const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
    const notifyError = (msg) => toast.error(msg, { duration: 2000 });

    const getReadableError = (err) => {
        return (
            err?.reason ||
            err?.data?.message ||
            err?.error?.message ||
            err?.message ||
            "Something went wrong"
        );
    };

    // FUNCTIONS
    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum) return notifyError("No Account Found!");
            await handleNetworkSwitch();
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            if (accounts.length) {
                setAddress(accounts[0]);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const getBalance = await provider.getBalance(accounts[0]);
                const bal = ethers.utils.formatEther(getBalance);
                setAccountBalance(bal);
                return accounts[0];
            } else {
                notifyError("No Account Found");
            }
        } catch (err) {
            console.log(err);
            notifyError("No account found");
        }
    }

    useEffect(() => {
        checkIfWalletConnected();
    }, [])


    const connectWallet = async () => {
        try {
            if (!window.ethereum) return notifyError("No Account Found!");
            await handleNetworkSwitch();
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            if (accounts.length) {
                setAddress(accounts[0]);
                console.log("accounts[0]:", accounts[0]);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const getBalance = await provider.getBalance(accounts[0]);
                const bal = ethers.utils.formatEther(getBalance);
                console.log("BAL:", bal);
                setAccountBalance(bal);
                return accounts[0];
            } else {
                notifyError("No Account Found");
            }
        } catch (err) {
            console.log(err);
            notifyError("No account found");
        }
    }

    // MAIN FUNCTION
    const _deployContract = async (signer, account, name, symbol, supply, imageURL) => {
        try {
            console.log("========== DEPLOY CONTRACT START ==========");
            console.log("Signer:", await signer.getAddress());
            console.log("Account:", account);
            console.log("Token Name:", name);
            console.log("Token Symbol:", symbol);
            console.log("Raw Supply:", supply);

            const factory = new ethers.ContractFactory(
                ERC20Generator_ABI,
                ERC20Generator_BYTECODE,
                signer
            );

            console.log("Contract Factory Created");

            // Parse supply safely
            const _initialSupply = ethers.utils.parseEther(supply.toString());
            console.log("Parsed Initial Supply (Wei):", _initialSupply.toString());

            console.log("Deploying contract...");
            const deployTx = await factory.getDeployTransaction(_initialSupply, name, symbol);
            const estimatedGas = await signer.estimateGas(deployTx);
            const txOverrides = await getTransactionOverrides(signer.provider, estimatedGas);

            console.log("Deploy Overrides:", {
                gasLimit: txOverrides.gasLimit?.toString(),
                gasPrice: txOverrides.gasPrice?.toString(),
                maxPriorityFeePerGas: txOverrides.maxPriorityFeePerGas?.toString(),
                maxFeePerGas: txOverrides.maxFeePerGas?.toString(),
            });

            const contract = await factory.deploy(_initialSupply, name, symbol, txOverrides);

            console.log("Deployment Transaction Sent");
            console.log("Transaction Hash:", contract.deployTransaction.hash);
            notifySuccess("Transaction submitted. Waiting for confirmation...");

            console.log("Waiting for deployment confirmation...");
            const receipt = await contract.deployTransaction.wait();

            if (!receipt || receipt.status !== 1) {
                throw new Error("Deployment transaction failed");
            }

            console.log("Contract Deployed Successfully!");
            console.log("Contract Address:", contract.address);

            if (contract.address) {
                const today = Date.now();
                let date = new Date(today);
                const _tokenCreatedDate = date.toLocaleDateString("en-US");

                const _token = {
                    account: account,
                    supply: supply.toString(),
                    name,
                    symbol,
                    tokenAddress: contract.address,
                    transactionHash: contract.deployTransaction.hash,
                    createdAt: _tokenCreatedDate,
                    logo: imageURL,
                };

                console.log("Token Object Created:", _token);

                let tokenHistory = [];
                const history = localStorage.getItem("TOKEN_HISTORY");

                if (history) {
                    tokenHistory = JSON.parse(history);
                    console.log("Existing Token History Found:", tokenHistory);
                } else {
                    console.log("No Previous Token History Found");
                }

                tokenHistory.push(_token);

                localStorage.setItem(
                    "TOKEN_HISTORY",
                    JSON.stringify(tokenHistory)
                );

                console.log("Token History Updated in LocalStorage");

                setLoader(false);
                setRecall(recall + 1);
                setOpenTokenCreator(false);

                console.log("========== DEPLOY CONTRACT END ==========");
            }
        } catch (err) {
            console.error("========== DEPLOY ERROR ==========");
            console.error("Error Message:", err.message);
            console.error("Full Error:", err);
            setLoader(false);
            notifyError(getReadableError(err));
        }
    };
    const createERC20 = async (token, account, imageURL) => {
        const { name, symbol, supply } = token;
        try {
            setLoader(true);
            notifySuccess("CREATING TOKEN...");
            if (!name || !symbol || !supply) {
                setLoader(false);
                notifyError("Data Missing");
            } else if (Number.isNaN(Number(supply)) || Number(supply) <= 0) {
                setLoader(false);
                notifyError("Supply must be a number greater than 0");
            } else {
                const web3Modal = new Web3Modal();
                const connection = await web3Modal.connect();
                const provider = new ethers.providers.Web3Provider(connection);
                const signer = provider.getSigner();

                console.log("SIGNER:", signer);

                await _deployContract(signer, account, name.trim(), symbol.trim(), supply, imageURL)
            }
        } catch (err) {
            setLoader(false);
            notifyError(getReadableError(err));
            console.log(err);
        }
    }

    const GET_ALL_ICOSALE_TOKEN = async () => {
        try {
            setLoader(true);
            const address = await checkIfWalletConnected();
            const contract = await ICO_MARKETPLACE_CONTRACT();
            console.log("CONTRACT:", contract);
            if (address) {
                const allICOSaleToken = await contract.getAllTokens();

                const _tokenArray = await Promise.all(
                    allICOSaleToken.map(async (token) => {
                        const tokenContract = await TOKEN_CONTRACT(token?.token);
                        const balance = await tokenContract.balanceOf(ICO_MARKETPLACE_ADDRESS);

                        return {
                            creator: token.creator,
                            token: token.token,
                            name: token.name,
                            symbol: token.symbol,
                            supported: token.supported,
                            price: ethers.utils.formatEther(token?.price.toString()),
                            icoSaleBal: ethers.utils.formatEther(balance.toString())
                        }
                    })
                )

                setLoader(false);
                return _tokenArray;
            }
            setLoader(false);
            return [];
        } catch (err) {
            setLoader(false);
            console.log(err);
            return [];
        }
    }

    const GET_ALL_USER_ICOSALE_TOKEN = async () => {
        try {
            setLoader(true);
            const address = await checkIfWalletConnected();
            const contract = await ICO_MARKETPLACE_CONTRACT();
            if (address) {
                const allICOSaleToken = await contract.getTokensCreatedBy(address);

                const _tokenArray = await Promise.all(
                    allICOSaleToken.map(async (token) => {
                        const tokenContract = await TOKEN_CONTRACT(token?.token);
                        const balance = await tokenContract.balanceOf(ICO_MARKETPLACE_ADDRESS);

                        return {
                            creator: token.creator,
                            token: token.token,
                            name: token.name,
                            symbol: token.symbol,
                            supported: token.supported,
                            price: ethers.utils.formatEther(token?.price.toString()),
                            icoSaleBal: ethers.utils.formatEther(balance.toString())
                        }
                    })
                )

                setLoader(false);
                return _tokenArray;
            }
            setLoader(false);
            return [];
        } catch (err) {
            setLoader(false);
            console.error("GET_ALL_USER_ICOSALE_TOKEN Error:", err);
            return [];
        }
    }

    const createICOSALE = async (icoSale) => {
        try {
            console.log("========== CREATE ICO SALE START ==========");

            const { address, price } = icoSale;

            console.log("Input Data:");
            console.log("Token Address:", address);
            console.log("Price (raw):", price);

            if (!address || !price) {
                console.log("Validation Failed: Missing Data");
                return notifyError("Data is Missing");
            }

            setLoader(true);
            notifySuccess("Creating icoSale");

            console.log("Connecting Wallet...");
            const connectedAccount = await connectWallet();
            console.log("Connected Account:", connectedAccount);

            console.log("Getting ICO Marketplace Contract...");
            const contract = await ICO_MARKETPLACE_CONTRACT();
            console.log("Contract obj:", contract);
            console.log("Marketplace Contract Loaded:", contract.address);

            console.log("Parsing Price to Wei...");
            const payAmount = ethers.utils.parseUnits(price.toString(), "ether");
            console.log("Parsed Price (Wei):", payAmount.toString());

            console.log("Setting gas parameters...");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const estimatedGas = await contract.estimateGas.createICOSale(address, payAmount);
            const txParams = await getTransactionOverrides(provider, estimatedGas);

            console.log("TX Params:", {
                gasLimit: txParams.gasLimit?.toString(),
                maxPriorityFeePerGas: txParams.maxPriorityFeePerGas?.toString(),
                maxFeePerGas: txParams.maxFeePerGas?.toString()
            });

            console.log("Sending createICOSALE transaction...");

            const transaction = await contract.createICOSale(
                address,
                payAmount,
                txParams
            );

            console.log("Transaction Sent!");
            console.log("Transaction Hash:", transaction.hash);

            console.log("Waiting for confirmation...");
            const receipt = await transaction.wait();

            console.log("Transaction Confirmed!");
            console.log("Block Number:", receipt.blockNumber);
            console.log("Gas Used:", receipt.gasUsed.toString());

            if (transaction.hash) {
                console.log("ICO Sale Created Successfully");

                setLoader(false);
                setOpenCreateICO(false);
                setRecall(recall + 1);

                console.log("========== CREATE ICO SALE END ==========");
            }

        } catch (err) {
            console.error("========== CREATE ICO SALE ERROR ==========");
            console.error("Error Message:", err.message);
            console.error("Full Error:", err);

            if (err.reason) console.error("Revert Reason:", err.reason);
            if (err.data) console.error("Error Data:", err.data);

            setLoader(false);
            setOpenCreateICO(false);
            notifyError(getReadableError(err));
        }
    };

    const buyToken = async (tokenAddress, tokenQuantity) => {
        try {
            setLoader(true);
            notifySuccess("Purchasing Token...");

            if (!tokenQuantity || !tokenAddress) return notifyError("Data Missing");

            const address = await connectWallet();
            const contract = await ICO_MARKETPLACE_CONTRACT();

            const _tokenBal = await contract.getBalance(tokenAddress);
            const _tokenDetails = await contract.getTokenDetails(tokenAddress);

            const availableTokens = ethers.utils.formatEther(_tokenBal.toString());

            if (availableTokens > 0) {
                const price = ethers.utils.formatEther(_tokenDetails.price.toString()) * Number(tokenQuantity);

                const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const estimatedGas = await contract.estimateGas.buyToken(
                    tokenAddress,
                    Number(tokenQuantity),
                    { value: payAmount.toString() }
                );

                const txParams = await getTransactionOverrides(provider, estimatedGas);
                txParams.value = payAmount.toString();

                const transaction = await contract.buyToken(tokenAddress, Number(tokenQuantity), txParams);
                await transaction.wait();
                setLoader(false);
                setRecall(recall + 1);
                setOpenBuyToken(false);
                notifySuccess("Transaction completed successfully");
            } else {
                setLoader(false);
                setOpenBuyToken(false);
                notifyError("Token balance not enough!");
            }
        } catch (err) {
            setLoader(false);
            setOpenBuyToken(false);
            notifyError(getReadableError(err));
            console.log(err);
        }
    }

    const transferTokens = async (transferTokenData) => {
        try {
            if (!transferTokenData.address ||
                !transferTokenData.amount ||
                !transferTokenData.tokenAdd)
                return notifyError("Data is Missing");

            setLoader(true);
            notifySuccess("Transaction is processing");
            const address = await connectWallet();

            const contract = await TOKEN_CONTRACT(transferTokenData.tokenAdd);
            const _availableBal = await contract.balanceOf(address);
            const availableTokens = ethers.utils.formatEther(_availableBal.toString());

            if (availableTokens > 1) {
                const payAmount = ethers.utils.parseUnits(
                    transferTokenData.amount.toString(), "ether"
                );

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const estimatedGas = await contract.estimateGas.transfer(
                    transferTokenData.address,
                    payAmount
                );

                const txParams = await getTransactionOverrides(provider, estimatedGas);

                const transaction = await contract.transfer(
                    transferTokenData.address,
                    payAmount,
                    txParams
                )
                await transaction.wait();
                setLoader(false);
                setRecall(recall + 1);
                setOpenTransferToken(false);
                notifySuccess("Transaction completed successfully");
            } else {
                setLoader(false);
                setRecall(recall + 1);
                setOpenTransferToken(false);
                notifySuccess("YOur balance is 0");
            }
        } catch (err) {
            setLoader(false);
            setRecall(recall + 1);
            setOpenTransferToken(false);
            notifyError(getReadableError(err));
            console.log(err);
        }
    }

    const withdrawToken = async (withdrawQuantity) => {
        try {
            if (!withdrawQuantity.amount || !withdrawQuantity.token)
                return notifyError("Data is missing");

            setLoader(true);
            notifySuccess("Transaction is processing");

            const address = await connectWallet();
            const contract = await ICO_MARKETPLACE_CONTRACT();

            const payAmount = ethers.utils.parseUnits(
                withdrawQuantity.amount.toString(),
                "ether"
            )

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const estimatedGas = await contract.estimateGas.withdrawToken(
                withdrawQuantity.token,
                payAmount
            );

            const txParams = await getTransactionOverrides(provider, estimatedGas);

            const transaction = await contract.withdrawToken(
                withdrawQuantity.token,
                payAmount,
                txParams
            );

            await transaction.wait();
            setLoader(false);
            setRecall(recall + 1);
            setOpenWithdrawToken(false);
            notifySuccess("Transaction completed successfully");

        } catch (err) {
            setLoader(false);
            setRecall(recall + 1);
            setOpenWithdrawToken(false);
            notifyError(getReadableError(err));
            console.log(err);
        }
    }

    return (
        <StateContext.Provider value={{
            withdrawToken,
            transferTokens,
            buyToken,
            createICOSALE,
            GET_ALL_ICOSALE_TOKEN,
            GET_ALL_USER_ICOSALE_TOKEN,
            createERC20,
            connectWallet,
            openBuyToken,
            setOpenBuyToken,
            openWithdrawToken,
            setOpenWithdrawToken,
            openTransferToken,
            setOpenTransferToken,
            openTokenCreator,
            setOpenTokenCreator,
            openCreateICO,
            setOpenCreateICO,
            address,
            setAddress,
            accountBalance,
            setAccountBalance,
            loader,
            setLoader,
            currency,
            recall,
            setRecall,
            PINATA_API_KEY,
            PINATA_SECRET_KEY,
            ICO_MARKETPLACE_ADDRESS,
            shortenAddress
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);