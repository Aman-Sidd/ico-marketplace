import React from "react";

const Marketplace = (
  array,
          shortenAddress,
          setBuyIco,
          setOpenBuyToken,
          currency,
) => {
  const notifySuccess = (msg) => toast.success(msg, {duration:2000});
  const notifyError = (msg) => toast.error(msg, {duration:2000});

    const copyAddress = (text)=>{
      navigator.clipboard.writeText(text);
      notifySuccess("Copied Successfully");
    }

  return (
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
            <td>Buy</td>
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
                <td onClick={()=>(setBuyIco(token),setOpenBuyToken(true))}>
                  <Button name={"Buy"} />
                </td>
              </tr>
            ))
          }
        </tbody>
        </table>
      </div>
  )
};

export default Marketplace;
