import React, { useState } from "react";
import Select from "react-select";
import { ethers } from "ethers";
import { getTokenByChain } from "./tokenConfig";
import PhoneLink from "./PhoneLink.json";
import toast, { Toaster } from "react-hot-toast";

const PayWithCrypto = (props) => {
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
        .then(() => {
          toast("Payment in progress... Please Wait", { icon: "👏" });
          provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
            toast.success("Payment Completed.");
          });
        })
        .catch((e) => {
          toast.error(e.reason);
        }); //transfers tokens from msg.sender to destination wallet
    } else {
      //for native coin
      console.log("test", token.address);
      const tx = await signer
        .sendTransaction({
          to: props.ownerAddress, //destination wallet address
          value: etherAmount, // amount of native token to be sent
        })
        .then(() => {
          toast("Payment in progress... Please Wait", { icon: "👏" });
          provider.waitForTransaction(tx.hash, 1, 150000).then(() => {
            toast.success("Payment Completed.");
          });
        })
        .catch((e) => {
          toast.error(e.message);
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "50%",
          width: "100%",
        }}
      >
        <Toaster position="top-center" reverseOrder={false} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "70%",
          width: "100%",
        }}
      >
        <div style={{ height: 30, width: "100%" }}>
          <Select
            placeholder="Select Your Token"
            value={selectedOption}
            options={getTokenByChain(Number(props.chainId))}
            onChange={handleChange}
            getOptionLabel={(e) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "70%",
                }}
              >
                <img width={30} height={30} alt="" src={e.token_icon} />
                <span style={{ marginLeft: 15 }}>{e.symbol}</span>
              </div>
            )}
          />
        </div>

        <button
          style={{
            marginLeft: 15,
            padding: "10px",
            color: "white",
            fontWeight: "bold",
            borderRadius: "10px",
            width: 100,
            cursor: "pointer",
            backgroundColor: "#df3deb",
          }}
          className={`btn btn-primary CTA`}
          onClick={() => payNow(selectedToken)}
        >
          {props.label}
        </button>
      </div>
    </>
  );
};
export default PayWithCrypto;
