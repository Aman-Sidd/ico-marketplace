import React, {useState, useEffect} from "react";
import Button from './Button'
import TokenHistory from "./TokenHistory";


const Header = ({
  accountBalance, 
   setAddress,
    address,
    connectWallet,
    ICO_MARKETPLACE_ADDRESS,
    shortenAddress,
    setOpenAllICO,
    openAllICO,
    setOpenTokenCreator,
    openTokenCreator,
    setOpenTokenHistory,
    openTokenHistory,
    setOpenICOMarketplace,
    openICOMarketplace,
}) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  console.log("TOKEN HISTORY:", openTokenHistory)
  useEffect(()=>{
    if(typeof window.ethereum !== "undefined"){
      setIsMetaMaskInstalled(true);
      window.ethereum.on("accountsChanged", handleAccountChanged);
    }

    return ()=>{
      if(typeof window.ethereum!=="undefined"){
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountChanged
        )
      }
    }
  }, [address])

  const handleAccountChanged = (accounts)=>{
    setAddress(accounts[0]);
  }
  return (
    <header className="header">
      <nav>
        <div className="logo">
          <a href="/">
            ICO<span>.MARKET</span>
          </a>
        </div>


        <ul className="menu">
          <li><a href="/">Home</a></li>
          <li><a onClick={()=>setOpenICOMarketplace(!openICOMarketplace)}>Marketplace</a></li>
          <li><a onClick={()=>setOpenAllICO(!openAllICO)}>My ICOs</a></li>
          <li><a onClick={()=>setOpenTokenHistory(!openTokenHistory)}>History</a></li>
          <li><a onClick={()=>setOpenTokenCreator(!openTokenCreator)}>Create Token</a></li>
        </ul>

        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          {address ? (
            <div style={{display:'flex', gap: '8px', alignItems:'center'}}>
              <div style={{padding:'8px 16px', borderRadius:'20px', background:'var(--glass-bg)', border:'1px solid var(--glass-border)', color: 'var(--text-primary)', fontWeight:600, fontSize:'0.9rem'}}>
                {shortenAddress(address)}
              </div>
              <div style={{padding:'8px 16px', borderRadius:'20px', background:'rgba(0, 229, 255, 0.1)', color:'var(--accent-cyan)', fontWeight:600, fontSize:'0.9rem'}}>
                {Number(accountBalance).toFixed(4)} POL
              </div>
            </div>
          ) : (
            <Button name="Connect Wallet" handleClick={connectWallet} classStyle="wallet-btn" />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
