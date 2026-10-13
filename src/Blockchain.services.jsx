
import Web3 from "web3";
import { setGlobalState, getGlobalState } from "./store";
import abi from "./abis/DominionDAO.json";

const getEthereum = () => {
  if (!window.ethereum) {
    throw new Error("Vui long cai dat MetaMask!");
  }
  return window.ethereum;
};

const connectWallet = async () => {
  try {
    const ethereum = getEthereum();

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    setGlobalState(
      "connectedAccount",
      accounts[0].toLowerCase()
    );

    return accounts[0];
  } catch (error) {
    console.error("Loi ket noi MetaMask:", error);
    alert(error.message || "Khong the ket noi MetaMask");
  }
};

const isWalletConnected = async () => {
  try {
    const ethereum = getEthereum();

    const accounts = await ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length > 0) {
      setGlobalState(
        "connectedAccount",
        accounts[0].toLowerCase()
      );
    }
  } catch (error) {
    console.error("Loi kiem tra vi:", error);
  }
};

const getEthereumContract = () => {
  const ethereum = getEthereum();
  const contractAddress =
    process.env.REACT_APP_CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("Chua cau hinh dia chi contract trong .env");
  }

  const web3 = new Web3(ethereum);

  return new web3.eth.Contract(
    abi.abi,
    contractAddress
  );
};



const getProposals = async () => {
  const contract = getEthereumContract();

  console.log(
    "Contract address:",
    contract.options.address
  );

  console.log(
    "Available methods:",
    Object.keys(contract.methods)
  );

  const proposals = await contract.methods
    .getProposals()
    .call();

  console.log("Proposals:", proposals);

  return proposals;
};


export {
  connectWallet,
  isWalletConnected,
  getEthereumContract,
  getProposals,
};

