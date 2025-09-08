# BdagJobPayment Smart Contract Deployment Guide

This guide explains how to deploy the `BdagJobPayment` smart contract to the BlockDAG testnet for handling job payments in the Neon-Canvanies marketplace.

## Overview

The `BdagJobPayment` contract manages:
- Job posting with BDAG budget deposits
- Designer registration
- Client hiring designers
- Job completion and payment release

## Prerequisites

1. Node.js (v22 or later recommended)
2. Hardhat installed
3. A wallet with BDAG tokens on BlockDAG testnet
4. Private key for deployment

## Setup

1. Ensure your `.env` file contains your private key:
   ```
   PRIVATE_KEY=your_private_key_without_0x_prefix
   ```

2. The contract is already compiled. If you make changes, recompile:
   ```bash
   npx hardhat compile
   ```

## Deployment Methods

### Method 1: Thirdweb CLI (Recommended)

1. Ensure your `.env` file contains your Thirdweb secret key:
   ```
   THIRDWEB_SECRET_KEY=your_secret_key
   ```

2. Run the deployment command:
   ```bash
   npx thirdweb deploy -k YOUR_SECRET_KEY
   ```

3. Select `BdagJobPayment` from the contract list

4. Choose BlockDAG testnet as the network

5. Deploy the contract

6. Note the deployed contract address

### Method 2: Hardhat (Alternative)

1. Ensure your `.env` file contains your wallet private key:
   ```
   PRIVATE_KEY=your_wallet_private_key
   ```

2. Deploy using Hardhat:
   ```bash
   npx hardhat run contracts/scripts/deploy-job-payment.mjs --network blockdagTestnet
   ```

## Contract Address

After deployment, note the contract address for integration with your frontend.

## Integration

Update your frontend to interact with the deployed contract for:
- Posting jobs
- Registering designers
- Hiring designers
- Completing jobs
- Releasing payments

## Contract Functions

- `registerDesigner(uint256 _hourlyRate, string _name)` - Register as a designer
- `postJob(string _description, uint256 _budget)` - Post a job (payable)
- `hireDesigner(uint256 _jobId, address _designer)` - Hire a designer
- `completeJob(uint256 _jobId)` - Mark job as completed
- `releasePayment(uint256 _jobId)` - Release payment to designer
- `getJob(uint256 _jobId)` - Get job details
- `getDesigner(address _designer)` - Get designer info

## Security Notes

- Always test on testnet first
- Use escrow pattern prevents premature payments
- Only job clients can release payments
- Only assigned designers can complete jobs
