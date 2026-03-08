import React from "react";
import { ICO_MARKETPLACE_ADDRESS } from "../Context/constants";

const ICOMarket = (
  {array,
    shortenAddress,
    handleClick,
    curreny,
}) => {

  const notifySuccess = (msg) => toast.success(msg, {duration:2000});
  const notifyError = (msg) => toast.error(msg, {duration:2000});

  const copyAddress = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess("Copied Successfully");
  }

  return (
  <div className="modal">
    <div className="modal-content">
      <span onClick={()=>handleClick(false)
      } className="close">
        &times;
      </span>
      <h2>All ICOs You Created</h2>
      <div className="table-container">
        <table className="custom-table">
        <thead>
          <tr>
            <td>Name</td>
            <td>Symbol</td>
            <td>Supply</td>
            <td>Token</td>
            <td>Creator</td>
            <td>Price</td>
          </tr>
        </thead>
        <tbody>
          {
            array.length>0 && array?.map((token, index)=>(
              <tr key={index+1}>
                <td onClick={()=>navigator.clipboard.writeText(token?.logo)}>
                  <img src={token?.logo || "theblockchaincoders.jpg"} alt=""
                  style={{
                    width:"30px",
                    height:"auto",
                    borderRadius:"10px"
                  }}
                  />
                </td>
                <td>{token?.name}</td>
                <td>{token?.symbol}</td>
                <td>{token?.icoSaleBal}</td>
                <td onClick={()=>copyAddress(token?.token)}>{shortenAddress(token?.token)}📋</td>
                <td onClick={()=>copyAddress(token?.creator)}>{shortenAddress(token?.creator)}📋</td>
                <td>{token?.price} {currency}</td>
              </tr>
            ))
          }
        </tbody>
        </table>
      </div>
    </div>
  </div>);
};

export default ICOMarket;
