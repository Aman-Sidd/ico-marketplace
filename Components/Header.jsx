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
            <span style={{color: '#ffee55', fontWeight: 800}}>ICO.</span>
            <span style={{marginLeft:8, color: '#fff', fontWeight:700}}>MARKET</span>
          </a>
        </div>

        <input type="checkbox" name="" id="menu-toggle" />
        <label htmlFor='menu-toggle' className="menu-icon">&#9776;</label>

        <ul className="menu">
          <li><a href="/">Home</a></li>
          <li><a onClick={()=>setOpenICOMarketplace(!openICOMarketplace)}>Marketplace</a></li>
          <li><a onClick={()=>setOpenAllICO(!openAllICO)}>My ICOs</a></li>
          <li><a onClick={()=>setOpenTokenHistory(!openTokenHistory)}>History</a></li>
          <li><a onClick={()=>setOpenTokenCreator(!openTokenCreator)}>Create Token</a></li>
        </ul>

        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          {address ? (
            <div style={{display:'flex', gap:12, alignItems:'center'}}>
              <div style={{padding:'6px 12px', borderRadius:20, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.06)', fontWeight:700}}>
                {shortenAddress(address)}
              </div>
              <div style={{padding:'6px 12px', borderRadius:20, background:'rgba(102,126,234,0.12)', color:'#fff', fontWeight:700}}>
                {Number(accountBalance).toFixed(4)} MATIC
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
