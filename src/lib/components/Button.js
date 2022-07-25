import React, { useState } from "react";
import Select from "react-select";
import { ethers } from "ethers";
import { getTokenByChain } from "./tokenConfig";
import PhoneLink from "./PhoneLink.json";
import toast, { Toaster } from "react-hot-toast";

const Button = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  async function payNow(token) {
    await window.ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum); //create provider
    const signer = provider.getSigner(); // get signer
    const tokenContract = new ethers.Contract(
      token.address,
      PhoneLink.abi,
      signer
    );
    const etherAmount = ethers.utils.parseUnits(
      props.value.toString(),
      "ether"
    );

    if ("null" !== token.address) {
      //for non-native coin
      console.log("sds");
      const tx = await tokenContract
        .transfer(props.ownerAddress, etherAmount)
        .catch((e) => {
          console.log(e.data.message);
        }); //transfers tokens from msg.sender to destination wallet
      toast("Payment in progress... Please Wait", { icon: "👏" });
      await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
        toast.success("Payment Completed.");
      });
    } else {
      //for native coin
      console.log("test", token.address);
      const tx = await signer.sendTransaction({
        to: props.ownerAddress, //destination wallet address
        value: etherAmount, // amount of native token to be sent
      });
      toast("Payment in progress... Please Wait", { icon: "👏" });
      await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
        toast.success("Payment Completed.");
      });
    }
  }

  const handleChange = async (e) => {
    setSelectedOption(e);
    const selectedValue = e.address;
    let token;
    if (selectedValue) {
      token = e;
    }
    setSelectedToken(token);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Select
        placeholder="Select Your Token"
        value={selectedOption}
        options={getTokenByChain(Number(props.chainId))}
        onChange={handleChange}
        getOptionLabel={(e) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img width={30} height={30} alt="" src={e.token_icon} />
            <span style={{ marginLeft: 15 }}>{e.symbol}</span>
          </div>
        )}
      />
      <button className={`btn btn-primary CTA`} onClick={payNow(selectedToken)}>
        <h4>{props.label}</h4>
      </button>
    </>
  );
};
export default Button;
