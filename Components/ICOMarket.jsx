import React from "react";
import toast from "react-hot-toast";
import { ICO_MARKETPLACE_ADDRESS } from "../Context/constants";

const ICOMarket = ({ title,
  array,
  shortenAddress,
  handleClick,
  currency,
}) => {

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const copyAddress = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess("Copied Successfully");
  }

  return (
    <div className="modal">
      <div className="modal-content large">
        <span onClick={() => handleClick(false)
        } className="close">
          &times;
        </span>
        <h2>{title || "ICO Marketplace"}</h2>
        <div className="market-list">
          {
            array?.length > 0 ? array?.map((token, index) => (
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
                    <p>Price</p>
                    <h5>{token?.price} {currency}</h5>
                  </div>
                  <div className="stat-box">
                    <p>Supply Available</p>
                    <h5>{token?.icoSaleBal}</h5>
                  </div>
                </div>

                <div className="market-actions">
                  <p onClick={() => copyAddress(token?.token)}>Token: {shortenAddress(token?.token)} 📋</p>
                  <p onClick={() => copyAddress(token?.creator)}>Creator: {shortenAddress(token?.creator)} 📋</p>
                </div>
              </div>
            )) : <p>No ICOs found.</p>
          }
        </div>
      </div>
    </div>);
};

export default ICOMarket;
