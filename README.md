# DeVote - Decentralized Voting App

A modern, on-chain voting application built on **Ethereum** (Sepolia testnet) with a sleek neon UI. Cast your vote, view live results, and experience blockchain transparency.

---

**Live Demo**
https://de-vote-dapp.netlify.app/

## 🎯 Features

- **MetaMask Integration** - Connect your wallet securely
- **Live Vote Counting** - See real-time voting results on the blockchain
- **Vote Verification** - Each wallet votes only once (enforced by smart contract)
- **Beautiful UI** - Dark cyber aesthetic with neon accents
- **Gas Efficient** - View functions cost no gas
- **Responsive Design** - Works on desktop and mobile

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (ES6+)
- **Blockchain:** Solidity smart contract (Voting.sol)
- **Web3 Library:** Ethers.js v6
- **Network:** Ethereum Sepolia Testnet
- **Wallet:** MetaMask

---

## 📋 Prerequisites

1. **MetaMask Wallet** - [Install here](https://metamask.io)
2. **Sepolia Test ETH** - Get from a faucet:
   - https://sepoliafaucet.com
   - https://www.infura.io/faucet/sepolia
3. **Remix IDE** - For deploying the smart contract: https://remix.ethereum.org

---

## 🚀 Quick Start

### 1. Deploy Smart Contract

1. Go to [Remix IDE](https://remix.ethereum.org)
2. Create a new file: `Voting.sol`
3. Copy the content from `Voting.sol` in this project
4. **Compile:** Solidity Compiler tab → click Compile
5. **Deploy:**
   - Environment: "Injected Provider - MetaMask"
   - Make sure MetaMask is on **Sepolia testnet**
   - Constructor input: `["Alice", "Bob", "Charlie"]` (your candidates)
   - Click **Deploy**
   - Copy the deployed contract address

### 2. Configure Frontend

1. Open `app.js` (line 5)
2. Replace the placeholder address with your deployed contract:
   ```javascript
   const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_ADDRESS";
   ```

### 3. Run the App

1. Open `index.html` in your browser
2. **Click "Connect Wallet"**
3. **Approve** the MetaMask connection
4. View candidates and **cast your vote!**

---

## 📂 Project Structure

```
Decentralized voting app/
├── index.html          # Main HTML page
├── app.js             # Frontend logic (Ethers.js, Web3)
├── style.css          # Neon UI styling
├── Voting.sol         # Smart contract (Solidity)
└── README.md          # This file
```

---

## 🔧 File Descriptions

### **Voting.sol** (Smart Contract)
- `constructor(string[] memory candidateNames)` - Initialize with candidates
- `vote(uint candidateIndex)` - Cast a vote (one per wallet)
- `getCandidates()` - View all candidates + vote counts
- `checkIfVoted(address voter)` - Check if address has voted
- Uses `hasVoted` mapping to prevent double voting

### **app.js** (Frontend Logic)
- `connectWallet()` - Connect MetaMask and verify Sepolia network
- `loadCandidates()` - Fetch candidates from blockchain
- `renderCandidates()` - Display candidate cards
- `castVote(index)` - Send vote transaction to contract
- Utility functions: `truncateAddress()`, `escapeHtml()`, `showStatus()`

### **index.html** (Page Structure)
- Header with wallet connection area
- Hero section with app description
- Status bar for transaction feedback
- Candidate grid (populated by app.js)
- Footer with contract info

### **style.css** (Design)
- CSS variables for colors and fonts
- Neon dark theme (cyan, purple, green accents)
- Responsive grid layout
- Animated components (spinner, pulse, fade)

---

## 🔐 Network Configuration

**Default Network:** Sepolia Testnet
- Chain ID: `11155111`
- RPC: https://sepolia.infura.io/v3/YOUR_KEY (or use MetaMask's default)

**To switch networks:**
1. Open MetaMask
2. Click network dropdown (top of wallet)
3. Enable "Show test networks" if needed
4. Select "Sepolia"

---

## 💡 How It Works

### Voting Flow

1. **User connects wallet** → MetaMask popup
2. **App verifies Sepolia network** → Shows error if wrong network
3. **Frontend fetches candidates** → Calls `getCandidates()` (free view function)
4. **User clicks Vote** → MetaMask prompts transaction confirmation
5. **Transaction submitted** → Blockchain processes (costs gas)
6. **Vote counts update** → Frontend fetches fresh data
7. **Results display** → Vote percentage and count shown

### Smart Contract Logic

- Each wallet address can only vote **once** (enforced by `hasVoted` mapping)
- Voting is **public** - anyone can see results
- **Cannot be reversed** - votes are permanent on-chain
- **Transparent** - all logic visible in Solidity code

---

## 🐛 Troubleshooting

### "Please switch to Sepolia testnet"
- MetaMask is not on Sepolia network
- Fix: Click network dropdown → Select Sepolia

### "Contract address not set"
- You haven't updated the contract address in app.js
- Fix: Deploy contract on Remix, copy address to app.js line 5

### "Failed to load candidates"
- Contract address is invalid or contract doesn't exist on Sepolia
- Fix: Re-deploy contract and update address

### "You have already voted"
- Your wallet already cast a vote for this contract
- Note: Each wallet votes once per contract instance

### "Insufficient Sepolia ETH for gas"
- Your wallet needs test ETH to pay transaction fees
- Fix: Get free Sepolia ETH from [sepoliafaucet.com](https://sepoliafaucet.com)

---

## 🌐 Testing Checklist

- [ ] MetaMask installed and on Sepolia
- [ ] Have Sepolia test ETH
- [ ] Contract deployed (have address)
- [ ] Contract address updated in app.js
- [ ] Page loads without errors (F12 Console)
- [ ] Connect Wallet button works
- [ ] Candidates display after connecting
- [ ] Vote button clickable
- [ ] Vote transaction succeeds
- [ ] Vote count updates on refresh

---

## 📝 Example Candidates

When deploying contract, try these candidates:

```
["Bitcoin", "Ethereum", "Solana", "Cardano"]
```

Or customize for your use case:

```
["Option A", "Option B", "Option C", "Option D", "Option E"]
```

---

## 🔗 Useful Links

- **Remix IDE:** https://remix.ethereum.org
- **Sepolia Faucet:** https://sepoliafaucet.com
- **Etherscan (Sepolia):** https://sepolia.etherscan.io
- **Ethers.js Docs:** https://docs.ethers.org/v6/
- **MetaMask Support:** https://support.metamask.io

---

## ⚖️ License

MIT - Free to use and modify

---

## 🎓 Learning Resources

This project teaches:
- Smart contract development (Solidity)
- Web3 integration (Ethers.js)
- MetaMask wallet connection
- Blockchain data reading/writing
- React to real-time events
- Gas optimization (view functions)

---

**Made with ❤️ for blockchain voting.**
