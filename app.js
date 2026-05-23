// DeVote - Decentralized Voting App
import { ethers } from "https://esm.sh/ethers@6.13.1";

// =============================================
// CONFIG
// =============================================

const CONTRACT_ADDRESS = "0x8831Dc33aDc80a9923d302FdCe70e63eBFD1b0C7";

const ABI = [
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "candidateNames",
        "type": "string[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "candidateIndex",
        "type": "uint256"
      }
    ],
    "name": "VoteCast",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "voter",
        "type": "address"
      }
    ],
    "name": "checkIfVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCandidateCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCandidates",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          }
        ],
        "internalType": "struct Voting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "candidateIndex",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// =============================================
// GLOBAL STATE
// =============================================

let provider = null;
let signer = null;
let contract = null;
let contractWithSigner = null;
let userAddress = null;

// =============================================
// DOM ELEMENTS
// =============================================

const connectBtn = document.getElementById("connectBtn");
const walletInfo = document.getElementById("walletInfo");
const walletAddress = document.getElementById("walletAddress");
const statusBar = document.getElementById("statusBar");
const statusIcon = document.getElementById("statusIcon");
const statusMsg = document.getElementById("statusMsg");
const connectPrompt = document.getElementById("connectPrompt");
const loadingState = document.getElementById("loadingState");
const candidatesGrid = document.getElementById("candidatesGrid");
const footerAddress = document.getElementById("footerAddress");

// =============================================
// INIT
// =============================================

(function init() {

  if (!window.ethereum) {
    alert("🦊 MetaMask not detected!\n\nPlease install MetaMask.");
    connectBtn.textContent = "MetaMask Required";
    connectBtn.disabled = true;
  }

  footerAddress.textContent = CONTRACT_ADDRESS;

})();

// =============================================
// CONNECT WALLET
// =============================================

window.connectWallet = async function () {

  try {

    provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();

    userAddress = await signer.getAddress();

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    // Sepolia chain ID
    if (chainId !== "0xaa36a7") {

      showStatus(
        "error",
        "⚠️",
        "Please switch MetaMask to Sepolia Testnet."
      );

      return;
    }

    contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      provider
    );

    contractWithSigner = contract.connect(signer);

    connectBtn.classList.add("hidden");

    walletInfo.classList.remove("hidden");

    walletAddress.textContent = truncateAddress(userAddress);

    await loadCandidates();

  } catch (err) {

    console.error(err);

    showStatus(
      "error",
      "❌",
      err.message
    );
  }
};

connectBtn.addEventListener("click", window.connectWallet);

// =============================================
// LOAD CANDIDATES
// =============================================

async function loadCandidates() {

  connectPrompt.classList.add("hidden");

  candidatesGrid.classList.add("hidden");

  loadingState.classList.remove("hidden");

  try {

    const candidates = await contract.getCandidates();

    console.log(candidates);

    const alreadyVoted =
      await contract.checkIfVoted(userAddress);

    const totalVotes = candidates.reduce(
      (sum, c) => sum + Number(c.voteCount),
      0
    );

    loadingState.classList.add("hidden");

    candidatesGrid.classList.remove("hidden");

    renderCandidates(
      candidates,
      totalVotes,
      alreadyVoted
    );

    hideStatus();

  } catch (err) {

    console.error(err);

    loadingState.classList.add("hidden");

    showStatus(
      "error",
      "❌",
      "Failed to load candidates."
    );
  }
}

// =============================================
// RENDER CANDIDATES
// =============================================

function renderCandidates(
  candidates,
  totalVotes,
  alreadyVoted
) {

  candidatesGrid.innerHTML = "";

  if (candidates.length === 0) {

    candidatesGrid.innerHTML =
      `<p>No candidates found.</p>`;

    return;
  }

  candidates.forEach((candidate, index) => {

    const count = Number(candidate.voteCount);

    const pct =
      totalVotes > 0
        ? Math.round((count / totalVotes) * 100)
        : 0;

    const card = document.createElement("div");

    card.className = "candidate-card";

    card.innerHTML = `
      <div class="candidate-name">
        ${escapeHtml(candidate.name)}
      </div>

      <div class="vote-count-row">
        <span>${count} votes</span>
      </div>

      <button
        class="btn-vote"
        onclick="castVote(${index})"
        ${alreadyVoted ? "disabled" : ""}
      >
        ${alreadyVoted ? "Voted" : "Vote"}
      </button>
    `;

    candidatesGrid.appendChild(card);

  });
}

// =============================================
// CAST VOTE
// =============================================

window.castVote = async function (candidateIndex) {

  try {

    const tx =
      await contractWithSigner.vote(candidateIndex);

    showStatus(
      "pending",
      "⛏️",
      "Transaction pending..."
    );

    await tx.wait();

    showStatus(
      "success",
      "✅",
      "Vote cast successfully!"
    );

    await loadCandidates();

  } catch (err) {

    console.error(err);

    showStatus(
      "error",
      "❌",
      err.reason || err.message
    );
  }
};

// =============================================
// HELPERS
// =============================================

function showStatus(type, icon, message) {

  statusBar.classList.remove(
    "pending",
    "success",
    "error",
    "hidden"
  );

  statusBar.classList.add(type);

  statusIcon.textContent = icon;

  statusMsg.textContent = message;
}

function hideStatus() {
  statusBar.classList.add("hidden");
}

function truncateAddress(address) {

  return (
    address.slice(0, 6) +
    "..." +
    address.slice(-4)
  );
}

function escapeHtml(str) {

  const div = document.createElement("div");

  div.appendChild(
    document.createTextNode(str)
  );

  return div.innerHTML;
}

// =============================================
// HANDLE ACCOUNT / NETWORK CHANGE
// =============================================

if (window.ethereum) {

  window.ethereum.on(
    "accountsChanged",
    () => window.location.reload()
  );

  window.ethereum.on(
    "chainChanged",
    () => window.location.reload()
  );
}