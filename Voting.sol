// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// =====================================================
//  Voting.sol — Decentralized Voting Smart Contract
//  Deploy this on Sepolia testnet via Remix IDE
//  https://remix.ethereum.org
// =====================================================

contract Voting {

    // -----------------------------------------------
    // DATA STRUCTURES
    // -----------------------------------------------

    // A Candidate has a name and a running vote count
    struct Candidate {
        string name;
        uint voteCount;
    }

    // Dynamic array that holds every candidate
    Candidate[] public candidates;

    // Maps each wallet address to whether they've voted.
    // Default value is false (hasn't voted yet).
    mapping(address => bool) public hasVoted;

    // The owner of the contract (whoever deployed it)
    address public owner;

    // -----------------------------------------------
    // EVENTS
    // Events are logs written to the blockchain that
    // the frontend can listen to in real-time.
    // -----------------------------------------------

    event VoteCast(address indexed voter, uint indexed candidateIndex);

    // -----------------------------------------------
    // CONSTRUCTOR
    // Runs ONCE when the contract is first deployed.
    // Pass in an array of candidate name strings.
    // Example: ["Alice", "Bob", "Charlie"]
    // -----------------------------------------------

    constructor(string[] memory candidateNames) {
        // Store whoever deployed the contract as owner
        owner = msg.sender;

        // Loop through the provided names and create Candidate structs
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                name: candidateNames[i],
                voteCount: 0          // Everyone starts at zero votes
            }));
        }
    }

    // -----------------------------------------------
    // VOTE FUNCTION
    // Called by a user to cast their vote.
    // msg.sender = the wallet address of the caller
    // -----------------------------------------------

    function vote(uint candidateIndex) public {

        // GUARD: Reject the transaction if this wallet has already voted.
        // require() reverts the whole transaction if the condition is false.
        require(!hasVoted[msg.sender], "You have already voted.");

        // GUARD: Reject if the index is out of bounds (invalid candidate)
        require(candidateIndex < candidates.length, "Invalid candidate index.");

        // Mark this wallet address as having voted (prevents double voting)
        hasVoted[msg.sender] = true;

        // Increment the vote count for the chosen candidate
        candidates[candidateIndex].voteCount += 1;

        // Emit an event so the frontend can react to this vote
        emit VoteCast(msg.sender, candidateIndex);
    }

    // -----------------------------------------------
    // VIEW FUNCTIONS
    // "view" means these functions only READ data —
    // they don't change state and cost no gas.
    // -----------------------------------------------

    // Returns the entire candidates array
    // Frontend calls this to display all candidates + vote counts
    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    // Returns the total number of candidates
    function getCandidateCount() public view returns (uint) {
        return candidates.length;
    }

    // Convenience: check if a specific address has voted
    function checkIfVoted(address voter) public view returns (bool) {
        return hasVoted[voter];
    }
}
