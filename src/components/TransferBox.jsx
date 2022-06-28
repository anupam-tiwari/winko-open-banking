import React from "react";
import { RiSettings3Fill } from "react-icons/ri";
import { AiOutlineDown } from "react-icons/ai";
import ethLogo from "../assets/eth.png";
import { useState } from "react";
import winkoTokenAbi from "../contract/arb_winkoToken.json";
import { ethers } from "ethers";
import { db } from "../firebase";
import { collection, getDocs, where, query } from "firebase/firestore";
import requests from "../Request";
import axios from "axios";
import { useEffect } from "react";

const TransferBox = () => {
  const contractAddress = "0x329BEEeD3277d359857b710244719055bA5b0455";

  const [transferHash, setTransferHash] = useState(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [recieverAddress, setRecieverAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [recieverEmail, SetEmail] = useState("");
  const [resultMessage, setMessage] = useState(''); 


  useEffect(() => {
    FindWalletAddress(recieverEmail)
  },[recieverEmail])

  const FindWalletAddress = async (email) => {
    if(email.length > 0){
      try{
        await axios.get(requests.getUser + email).then((response) => {
          setRecieverAddress(response.data.wallet);
          setMessage(`Address Found: ${response.data.wallet}`)
        });
  
      }catch{
        console.log("no address found")
        setMessage("No Address found")
      }
    }
    //transferHandler();
  };

  const transferHandler = async () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner();
    let tempContract =  new ethers.Contract(
      contractAddress,
      winkoTokenAbi,
      tempSigner
    )

    setProvider(tempProvider);
    setSigner(tempSigner);
    setContract(tempContract);

    console.log(contract)

    try{
      await contract.transfer(recieverAddress, transferAmount);

    }catch{

    }
    
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>Transfer</div>
          <div>
            <RiSettings3Fill />
          </div>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            placeholder="0.0"
            pattern="^[0-9]*[.,]?[0-9]*$"
            //onChange={e => handleChange(e, 'amount')}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
        </div>
        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            placeholder="Email"
            onChange={(e) => SetEmail(e.target.value)}
          />
        </div>
        <div>{resultMessage}</div>
        {/* onClick={e => handleSubmit(e)} */}
        <div
          onClick={transferHandler}
          className={style.confirmButton}
        >
          Confirm
          <h1>{}</h1>
        </div>
      </div>

      {/* <Modal isOpen={!!router.query.loading} style={customStyles}>
        <TransactionLoader />
      </Modal> */}
    </div>
  );
};

const style = {
  wrapper: `w-screen flex items-center justify-center mt-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

export default TransferBox;
