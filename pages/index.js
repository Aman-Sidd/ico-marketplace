import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {useStateContext} from "../Context/index";
import Header from "../Components/Header";
import Loader from "../Components/Loader";
import Input from "../Components/Input";
import Button from "../Components/Button";
import Table from "../Components/Table";
import PreSaleList from "../Components/PreSaleList";
import UploadLogo from "../Components/UploadLogo";
import Footer from "../Components/Footer";
import ICOMarket from "../Components/ICOMarket";
import TokenCreator from "../Components/TokenCreator";
import TokenHistory from "../Components/TokenHistory";
import Marketplace from "../Components/Marketplace";
import CreateICO from "../Components/CreateICO";
import Card from "../Components/Card";
import WidthdrawToken from "../Components/WidthdrawToken";
import BuyToken from "../Components/BuyToken";
import TokenTransfer from "../Components/TokenTransfer";


const index = () => {
  const {     withdrawToken,
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
              shortenAddress} = useStateContext();

      const notifySuccess = (msg) => toast.success(msg, {duration:2000});
      const notifyError = (msg) => toast.error(msg, {duration:2000});

    const [allICOs, setAllICOs] = useState([]);
    const [allUserICOs, setAllUserICOs] = useState([]);

    const [openAllICO, setOpenAllICO] = useState(false);
    const [openTokenHistory, setOpenTokenHistory] = useState(false);
    const [openICOMarketplace, setOpenICOMarketplace] = useState(false);

    const [buyIco, setBuyIco] = useState();
    const copyAddress = () =>{
      navigator.clipboard.writeText(ICO_MARKETPLACE_ADDRESS);
      notifySuccess("Copied Successfully");
    }

    useEffect(()=>{
      if(address){
        const fetchTokens = async () => {
          const allTokens = await GET_ALL_ICOSALE_TOKEN();
          console.log("ALL ICOSALE Token from index.js", allTokens);
          setAllICOs(allTokens);
          
          const userTokens = await GET_ALL_USER_ICOSALE_TOKEN();
          console.log("ALL USER ICOSALE Token from index.js", userTokens);
          setAllUserICOs(userTokens);
        };
        fetchTokens();
      }
    },[address, recall])

  return <div>
    <Header 
    accountBalance={accountBalance}
    setAddress={setAddress}
    address={address}
    connectWallet={connectWallet}
    ICO_MARKETPLACE_ADDRESS={ICO_MARKETPLACE_ADDRESS}
    shortenAddress={shortenAddress}
    setOpenAllICO={setOpenAllICO}
    openAllICO={openAllICO}
    setOpenTokenCreator={setOpenTokenCreator}
    openTokenCreator={openTokenCreator}
    setOpenTokenHistory={setOpenTokenHistory}
    openTokenHistory={openTokenHistory}
    setOpenICOMarketplace={setOpenICOMarketplace}
    openICOMarketplace={openICOMarketplace}
    />
    <div className="create">
      <div className="hero-section">
        <h1>🚀 Crypto ICO Marketplace</h1>
        <p>
          Create, launch, and manage your Initial Coin Offerings (ICOs) with ease. 
          A decentralized platform for token creators and investors to connect seamlessly on the blockchain.
        </p>
        <div style={{marginTop:24, display:'flex', gap:12, justifyContent:'center'}}>
          <Button name="Create ICO" handleClick={() => setOpenCreateICO(true)} classStyle="hero-cta" />
          <Button name="Explore Marketplace" handleClick={() => setOpenICOMarketplace(true)} classStyle="hero-cta outline" />
        </div>
      </div>
      
      <h2 style={{fontSize:"2rem", textAlign:"center", marginTop: "60px", marginBottom: "40px", color: "#fff"}}>
        Explore Features
      </h2>
      {
        allICOs?.length!=0 && (
          <Marketplace 
          array={allICOs}
          shortenAddress={shortenAddress}
          setBuyIco={setBuyIco}
          setOpenBuyToken={setOpenBuyToken}
          currency={currency}
          />
        )
      }
      <Card
      setOpenAllICO={setOpenAllICO}
      setOpenTokenCreator={setOpenTokenCreator}
      setOpenTransferToken={setOpenTransferToken}
      setOpenTokenHistory={setOpenTokenHistory}
      setOpenICOMarketplace={setOpenICOMarketplace}
      copyAddress={copyAddress}
      setOpenCreateICO={setOpenCreateICO}
      setOpenWithdrawToken={setOpenWithdrawToken}
      />
    </div>
    {openAllICO && <ICOMarket title="Your Created ICOs" array={allUserICOs}
    shortenAddress={shortenAddress}
    handleClick={setOpenAllICO}
    currency={currency}/>}
    {openTokenCreator && 
    <TokenCreator 
      createERC20={createERC20}
      shortenAddress={shortenAddress}
      setOpenTokenCreator={setOpenTokenCreator}
      setLoader={setLoader}
      address={address}
      connectWallet={connectWallet}
      PINATA_API_KEY={PINATA_API_KEY}
      PINATA_SECRET_KEY={PINATA_SECRET_KEY}
    />}
    {openTokenHistory && 
    <TokenHistory
    shortenAddress={shortenAddress}
    setOpenTokenHistory={setOpenTokenHistory}
    />}
    {openCreateICO && <CreateICO 
    shortenAddress={shortenAddress}
    setOpenCreateICO={setOpenCreateICO}
    connectWallet={connectWallet}
    address={address}
    createICOSALE={createICOSALE} 
    />}
    {openICOMarketplace && 
    <ICOMarket title="ICO Marketplace" array={allICOs}
    shortenAddress={shortenAddress}
    handleClick={setOpenICOMarketplace}
    currency={currency}/>
    }
    {openBuyToken && 
    <BuyToken
    address={address}
    buyToken={buyToken}
    connectWallet={connectWallet}
    setOpenBuyToken={setOpenBuyToken}
    buyIco={buyIco}
    currency={currency}
    />
    }
    {openTransferToken && 
    <TokenTransfer
     address={address}
    transferTokens={transferTokens}
    connectWallet={connectWallet}
    setOpenTransferToken={setOpenTransferToken}
    />
    }
    {openWithdrawToken && 
    <WidthdrawToken
      address={address}
      withdrawToken={withdrawToken}
      connectWallet={connectWallet}
      setOpenWithdrawToken={setOpenWithdrawToken}
    />
    }
    <Footer />
    {loader && <Loader />}

  </div>;
};

export default index;
