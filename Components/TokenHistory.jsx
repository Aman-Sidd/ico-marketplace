import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const TokenHistory = ({ shortenAddress,
  setOpenTokenHistory, }) => {

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const copyAddress = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess("Copied Successfully");
  }

  const [history, setHistory] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("TOKEN_HISTORY");
    if (storedData) {
      setHistory(JSON.parse(storedData))
    }
  }, [])

  return (
    <div className="modal">
      <div className="modal-content large">
        <span onClick={() => setOpenTokenHistory(false)
        } className="close">
          &times;
        </span>
        <h2>Token History</h2>
        <div className="market-list">
          {
            history?.length > 0 ? history?.map((token, index) => (
              <div key={index + 1} className="market-item">
                <div className="market-header">
                  <img src={token?.logo || "theblockchaincoders.jpg"} alt="logo" onClick={() => navigator.clipboard.writeText(token?.logo)} style={{ cursor: "pointer" }} />
                  <div className="market-title">
                    <h4>{token?.name}</h4>
                    <span>{token?.symbol}</span>
                  </div>
                </div>

                <div className="market-stats">
                  <div className="stat-box">
                    <p>Total Supply</p>
                    <h5>{token?.supply}</h5>
                  </div>
                </div>

                <div className="market-actions">
                  <p onClick={() => copyAddress(token?.tokenAddress)}>Token: {shortenAddress(token?.tokenAddress)} 📋</p>
                  <p onClick={() => copyAddress(token?.transactionHash)}>Tx Hash: {shortenAddress(token?.transactionHash)} 📋</p>
                </div>
              </div>
            )) : <p>No Token History found.</p>
          }
        </div>
      </div>
    </div>);
};

export default TokenHistory;
