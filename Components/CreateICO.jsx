import React,{useState, useEffect} from "react";

import Input from "./Input";
import Button from "./Button";

const CreateICO = ({
    shortenAddress,
    setOpenCreateICO,
    connectWallet,
    address,
    createICOSALE,
}) => {

  const [icoSale, setIcoSale] = useState({
    address:"",
    price:"",
  })

  return (
  <div className="modal">
    <div className="modal-content">
      <span onClick={()=>{
        setOpenCreateICO(false)
      }}
        className="close">
          &times;
      </span>
      <h2>Create ICO</h2>
      <div className="input-Container" style={{marginTop:"1rem"}}>
        <Input placeholder={"Address"} handleChange={(e)=>setIcoSale({...icoSale, address:e.target.value})} />

        <Input placeholder={"Price"} handleChange={(e)=>setIcoSale({...icoSale, price:e.target.value})} />
      </div>

       <div className="button-box" style={{marginTop:"1rem"}}>
        {
          address ? (
            <Button name="Create ICO" handleClick={()=>createICOSALE(icoSale)}/>
          ) : (
            <Button name="Connect Wallet" handleChange={()=>connectWallet()} />
          )
        }
        </div>
    </div>
  </div>);
};

export default CreateICO;
