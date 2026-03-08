import React, {useState, useEffect} from "react";

import Input from "./Input";
import Button from "./Button";

const WidthdrawToken = ({
      address,
      withdrawToken,
      connectWallet,
      setOpenWithdrawToken,
}) => {
  const [withdrawQuantity, setWithdrawQuantity] = useState({
    token:"",
    amount:"",
  })
  return (
    <div className="modal">
        <div className="modal-content">
            <span onClick={()=>setOpenWithdrawToken(false)} className="close">
                &times;
            </span>
            <h2>Withdraw Token</h2>
            <div className="input-Container"
            style={{marginTop:"1rem"}}>

                <Input 
                placeholder={"Token Address"}
                handleChange={(e)=>setWithdrawQuantity({
                  ...withdrawQuantity,
                  token:e.target.value
                })}
                />

                <Input 
                placeholder={tokenQuantity ? `${tokenQuantity*Number(buyIco?.price)} ${currency}` : "Output"}
                 handleChange={(e)=>setWithdrawQuantity({
                  ...withdrawQuantity,
                  token:e.target.value
                })}
                />
            </div>

            <div className="button-box" style={{marginTop:"1rem"}}>
        {
          address ? (
            <Button name="Token Transfer"
            handleClick={()=>withdrawToken(withdrawQuantity)}
            />
          ) : (
            <Button name="Connect Wallet" handleChange={()=>createICOSALE(icoSale)} />
          )
        }
        </div>
        </div>
    </div>
  )
};

export default WidthdrawToken;
