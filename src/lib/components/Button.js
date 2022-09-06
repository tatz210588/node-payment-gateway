import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ethers } from "ethers";
import { getTokenByChain } from "./tokenConfig";
import Gateway from "../artifacts/contracts/Gateway.sol/Gateway.json";
import toast, { Toaster } from "react-hot-toast";
import { getConfigByChain } from "./config";
import BigNumber from "bignumber.js";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "react-modal";
import { getLiveRate } from "./utils";



const PayWithCrypto = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState(null);
  const [currNet, setCurNet] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [rateinUSD, setRateinUSD] = useState(0)
  const [symbol, setSymbol] = useState('')

  useEffect(() => {
    !isLoaded && onLoad();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    setSelectedTokenAddress(!selectedToken ? null : selectedToken["address"]);
    selectedToken && checkAllowance(selectedToken);
  }, [selectedToken]);

  async function onLoad() {
    await window.ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum); //create provider
    const network = await provider.getNetwork();
    console.info({ network });
    setCurNet(network?.chainId);
  }

  async function approve(token) {
    await window.ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum); //create provider
    const network = provider.getNetwork();
    const signer = provider.getSigner(); // get signer

    const tokenContract = new ethers.Contract(
      token.address,
      Gateway.abi,
      signer
    );
    const etherAmount = ethers.utils.parseUnits((Number(props.value) / Number(rateinUSD)).toString(), "ether");

    const txApproval = await tokenContract.approve(
      getConfigByChain((await network).chainId)[0].gatewayAddress,
      etherAmount
    );
    setLoading(true);
    toast("Approval in process... Please Wait", { icon: "👏" });
    //tx.hash is available only when writing transaction not reading
    const receiptOfApproval = await provider
      .waitForTransaction(txApproval.hash, 1, 150000)
      .then(() => {
        toast.success(`Thank You for approving this transaction.`);
        setAllowed(true);
        setLoading(false);
      });
  }
  async function payNow(token) {
    await window.ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum); //create provider
    const network = provider.getNetwork();
    const signer = provider.getSigner(); // get signer
    const tokenContract = new ethers.Contract(
      token.address,
      Gateway.abi,
      signer
    );
    const contrct = new ethers.Contract(
      getConfigByChain((await network).chainId)[0].gatewayAddress,
      Gateway.abi,
      signer
    );
    const etherAmount = ethers.utils.parseUnits((Number(props.value) / Number(rateinUSD)).toString(), "ether");
    console.log("tokenaddre", token.address);
    if ("null" !== token.address) {
      //for non-native coin
      try {
        const tx = await contrct.tranferNonNative(
          token.symbol,
          props.ownerAddress,
          token.address,
          etherAmount
        );
        toast("Payment in progress... Please Wait", { icon: "👏" });
        setLoading(true);
        const receipt = await provider
          .waitForTransaction(tx.hash, 1, 150000)
          .then(() => {
            toast.success("Payment Completed");
            setAllowed(false);
            setLoading(false);
          });
      } catch (e) {
        toast.error(e.data.message)
      }
    } else {
      //for native coin
      try {
        const tx = await contrct.tranferNative(token.symbol, props.ownerAddress, {
          value: etherAmount,
        });
        setLoading(true);
        toast("Payment in progress... Please Wait", { icon: "👏" });

        const receipt = await provider
          .waitForTransaction(tx.hash, 1, 150000)
          .then(() => {
            toast.success("Payment Completed");
            setLoading(false);
          });
      } catch (e) {
        toast.error(e.data.message)
      }
    }
  }

  const handleChange = async (e) => {
    setSelectedOption(e);
    setSymbol(e.symbol)
    setRateinUSD(await getLiveRate(e.symbol))
    const selectedValue = e.address;
    let token;
    if (selectedValue) {
      token = e;
    }

    setSelectedToken(token);
  };

  async function checkAllowance(token) {
    await window.ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum); //create provider
    const network = await provider.getNetwork();
    const signer = provider.getSigner();
    const myAddress = await signer.getAddress();
    console.log("tkn", token);
    const tokenContract = new ethers.Contract(
      token.address,
      Gateway.abi,
      signer
    );
    //use await function for handling promise

    const tx = await tokenContract.allowance(
      myAddress,
      getConfigByChain(network.chainId)[0].gatewayAddress
    );
    formatBigNumber(tx) != "0" ? setAllowed(true) : setAllowed(false);
  }
  function formatBigNumber(bn) {
    const divideBy = new BigNumber("10").pow(new BigNumber(18));
    const converted = new BigNumber(bn.toString());
    const divided = converted.div(divideBy);
    return divided.toFixed(0, BigNumber.ROUND_DOWN);
  }

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
      <button onClick={() => setModal(true)} style={{
        marginLeft: 15,
        padding: "10px",
        color: "white",
        fontWeight: "bold",
        borderRadius: "10px",
        width: 100,
        cursor: "pointer",
        backgroundColor: "#df3deb",
      }}
        className={`btn btn-primary CTA`}> {props.label}

      </button>
      <Modal isOpen={modal} style={{
        content: {
          backgroundColor: '#ad80e8',
          width: '30%',
          height: '70%',
          margin: 'auto',
          borderRadius: '24px',
          padding: '0px',
          justifyContent: 'end',
        }
      }}>


        <div style={{ position: 'relative', alignItems: "center", fontSize: "70%", width: "100%", }}>
          <div style={{ position: 'relative', height: '200px' }}>
            <img style={{ height: '100%', width: '100%' }} src="https://i.ibb.co/0CmLGRJ/4.jpg" />
            <div onClick={() => setModal(false)} style={{ top: 0, right: 0, position: 'absolute', cursor: 'pointer', display: "flex", justifyContent: 'end', color: 'red', marginBottom: '40px', marginTop: '10px', marginRight: '10px' }} >
              ❌
            </div>
            <div onClick={() => setModal(false)} style={{
              top: 110,
              left: 5,
              position: 'absolute',
              color: 'blue',
              fontWeight: 'bold',
              fontSize: 25

            }} >
              Price of the Product: $&nbsp;{props.value}
            </div>
            <div onClick={() => setModal(false)} style={{
              top: 150,
              left: 5,
              position: 'absolute',
              color: 'blue',
              fontWeight: 'bold',
              fontSize: 15
            }} >
              You will pay: {symbol}&nbsp;{rateinUSD === 0 ? 0 : Number(props.value) / Number(rateinUSD)}
            </div>

          </div>


          <div style={{ position: 'absolute', height: 30, width: "95%", margin: '10px' }}>
            <Select
              placeholder="Select Your Token"
              value={selectedOption}
              options={getTokenByChain(currNet)}
              onChange={handleChange}
              getOptionLabel={(e) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img width={30} height={30} src={e.token_icon} />
                  <span style={{ marginLeft: 5 }}>{e.name}</span>
                </div>
              )}
            />
          </div>
          {selectedToken &&
            (selectedTokenAddress === "null" || allowed === true ? (
              <button
                style={{
                  position: 'absolute',
                  padding: "30px",
                  color: "white",
                  fontWeight: "bold",
                  width: '100%',
                  cursor: "pointer",
                  backgroundColor: "#df3de3",
                  bottom: -310
                }}
                onClick={() => payNow(selectedToken)}
              >
                {loading === true ? (
                  <ClipLoader loading={loading} size={10} />
                ) : (
                  'Pay'
                )}
              </button>
            ) : (
              <button
                style={{
                  position: 'absolute',
                  padding: "30px",
                  color: "white",
                  fontWeight: "bold",
                  width: '100%',
                  cursor: "pointer",
                  backgroundColor: "#df3de3",
                  bottom: -310
                }}
                className={`btn btn-primary CTA`}
                onClick={() => approve(selectedToken)}
              >
                {loading === true ? (
                  <ClipLoader loading={loading} size={10} />
                ) : (
                  <a>Approve</a>
                )}
              </button>
            ))}
        </div>
      </Modal>
    </>
  );
};
export default PayWithCrypto;
