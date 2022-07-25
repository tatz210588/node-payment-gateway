import React, { useState, useEffect } from "react";
import Select from "react-select";
import { ethers } from "ethers";
import { getTokenByChain, TokenInfo } from "./tokenConfig";
import PhoneLink from "./PhoneLink.json";

const Button = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);

  async function payNow(token) {
    await window.ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum); //create provider
    const signer = provider.getSigner(); // get signer
    const network = await provider.getNetwork();
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
      const tx = await tokenContract.transfer(props.ownerAddress, etherAmount); //transfers tokens from msg.sender to destination wallet
      toast("Payment in progress... Please Wait", { icon: "👏" });
      const receipt = await provider
        .waitForTransaction(tx.hash, 1, 150000)
        .then(() => {
          toast.success("Payment Completed.");
        });
    } else {
      //for native coin
      const tx = await signer.sendTransaction({
        to: props.ownerAddress, //destination wallet address
        value: etherAmount, // amount of native token to be sent
      });
      toast("Payment in progress... Please Wait", { icon: "👏" });
      const receipt = await provider
        .waitForTransaction(tx.hash, 1, 150000)
        .then(() => {
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
    await payNow(token);
  };

  return (
    <Select
      placeholder="Select Your Token"
      value={selectedOption}
      options={getTokenByChain(props.chainId)}
      onChange={handleChange}
      getOptionLabel={(e) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img width={30} height={30} alt="" src={e.token_icon} />
          <span style={{ marginLeft: 15 }}>{e.symbol}</span>
        </div>
      )}
    />
    // <button
    //   className={`btn btn-${props.kind} CTA`}
    //   data-id={props.id}
    //   type={props.type}
    //   name={props.name}
    //   value={props.value}
    //   disabled={props.disabled}
    //   onClick={props.handleClick}
    // >
    //   <h4>{props.label}</h4>
    // </button>
  );
};
export default Button;
