
import { useEffect, useState } from "react";
import {
  connectWallet,
  isWalletConnected,
  getEthereumContract,
  getProposals,
} from "./Blockchain.services";
import { useGlobalState } from "./store";

function App() {
  const [account] = useGlobalState("connectedAccount");
  const [loading, setLoading] = useState(false);
  const [contractStatus, setContractStatus] = useState("");

  useEffect(() => {
    isWalletConnected();
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connectWallet();
    } finally {
      setLoading(false);
    }
  };

  
  const checkContract = async () => {
    try {
      setContractStatus("Dang kiem tra...");

      if (!window.ethereum) {
        setContractStatus("Vui long cai dat MetaMask.");
        return;
      }

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      if (chainId !== "0xaa36a7") {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
          });
        } catch (switchError) {
          console.error("Loi chuyen mang:", switchError);

          if (switchError.code === 4902) {
            setContractStatus(
              "MetaMask chua them mang Sepolia. Hay them Sepolia trong MetaMask."
            );
          } else {
            setContractStatus(
              "Khong chuyen duoc sang Sepolia. Hay chuyen mang thu cong trong MetaMask."
            );
          }
          return;
        }
      }

      const contract = getEthereumContract();

      setContractStatus(
        "Tao ket noi contract thanh cong!\nDia chi: " +
          contract.options.address
      );
    } catch (error) {
      console.error(error);
      setContractStatus(
        "Loi: " + (error.message || "Khong ket noi duoc contract")
      );
    }
  };
  
  const testGetProposals = async () => {
    try {
      const proposals = await getProposals();

      console.log("Danh sach de xuat:", proposals);
      alert("Doc du lieu thanh cong! Mo F12 > Console de xem ket qua.");
    } catch (error) {
      console.error("Loi doc danh sach de xuat:", error);
      alert("Doc du lieu that bai. Hay xem Console (F12).");
    }
  };



  return (
    <div style={{
      maxWidth: "700px",
      margin: "80px auto",
      padding: "24px",
      fontFamily: "Arial, sans-serif",
      textAlign: "center"
    }}>
      <h1>DominionDAO</h1>

      {account ? (
        <p>
          Vi da ket noi: {account.slice(0, 6)}...
          {account.slice(-4)}
        </p>
      ) : (
        <button onClick={handleConnect} disabled={loading}>
          {loading ? "Dang ket noi..." : "Ket noi MetaMask"}
        </button>
      )}

      <div style={{ marginTop: "24px" }}>
        <button onClick={checkContract}>
          Kiem tra Smart Contract
        </button>
        <button
      onClick={testGetProposals}
      style={{ marginLeft: "10px" }}
    >
      Kiem tra danh sach de xuat
    </button>
  </div>
      

      <p style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
        {contractStatus}
      </p>
    </div>
  );
}

export default App;
