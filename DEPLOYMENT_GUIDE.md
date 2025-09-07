# Design Marketplace Deployment Guide

This guide will help you deploy the DesignMarketplace smart contract to the BlockDAG testnet and integrate it with your Neon Canvanies application.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **BlockDAG Testnet Account** with some BDAG tokens for gas fees
4. **Private Key** of your wallet

## Environment Setup

### 1. Install Dependencies

First, install the required dependencies for Hardhat:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-ethers ethers dotenv
```

### 2. Environment Variables

Create or update your `.env` file with the following variables:

```env
# BlockDAG Testnet Configuration
BLOCKDAG_RPC_URL=https://rpc.testnet.blockdag.network
PRIVATE_KEY=your_private_key_without_0x_prefix
BLOCKDAG_API_KEY=your_blockdag_api_key_for_contract_verification

# Contract Addresses (after deployment)
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_CREDITS_CONTRACT_ADDRESS=your_existing_credits_contract_address

# Thirdweb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
```

## Contract Deployment

### 1. Compile the Contract

```bash
npx hardhat compile
```

### 2. Deploy to BlockDAG Testnet

```bash
npx hardhat run scripts/deploy-marketplace.ts --network blockdag-testnet
```

This will:
- Deploy the DesignMarketplace contract to BlockDAG testnet
- Output the contract address
- Add the contract address to your environment variables

### 3. Verify Contract (Optional)

If you have a BlockDAG API key, you can verify the contract:

```bash
npx hardhat verify --network blockdag-testnet DEPLOYED_CONTRACT_ADDRESS
```

## Integration with Neon Canvanies

### 1. Update Environment Variables

After deployment, make sure your `.env` file includes:

```env
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

### 2. Update Contract Addresses in Code

The marketplace hook (`src/hooks/use-marketplace-contract.ts`) will automatically use the environment variables.

### 3. Test the Integration

1. Start your Next.js application:
```bash
npm run dev
```

2. Navigate to `/marketplace` in your application

3. Connect your wallet

4. Test the following features:
   - Register as a designer
   - Post a job (if you're a client)
   - Submit proposals (if you're a designer)
   - Accept proposals (if you're a client)
   - Complete jobs

## Contract Features

The DesignMarketplace contract includes:

- **Designer Registration**: Designers can register with their profile information
- **Job Posting**: Clients can post design jobs with budgets and deadlines
- **Proposal System**: Designers can submit proposals for jobs
- **Escrow System**: Funds are held in escrow until job completion
- **Rating System**: Clients can rate designers after job completion
- **Dispute Resolution**: Both parties can raise disputes if needed

## Troubleshooting

### Common Issues

1. **Contract Deployment Fails**
   - Check your private key is correct
   - Ensure you have enough BDAG tokens for gas fees
   - Verify the RPC URL is correct

2. **Contract Verification Fails**
   - Make sure you have the correct API key
   - Check that the contract was deployed successfully

3. **Frontend Integration Issues**
   - Verify all environment variables are set correctly
   - Check that the contract address matches the deployed contract
   - Ensure your wallet is connected to BlockDAG testnet

### Gas Estimation

The contract deployment and interactions may require:
- **Deployment**: ~2-3 million gas
- **Job Posting**: ~200,000 gas
- **Proposal Submission**: ~150,000 gas
- **Job Completion**: ~100,000 gas

## Security Considerations

1. **Private Key Security**: Never commit your private key to version control
2. **Environment Variables**: Keep sensitive information in environment variables
3. **Contract Testing**: Test all contract functions on testnet before mainnet deployment
4. **Access Control**: The contract includes proper access controls for all functions

## Support

If you encounter any issues:
1. Check the BlockDAG testnet documentation
2. Verify your wallet has sufficient funds
3. Ensure all environment variables are correctly set
4. Test with small transactions first

## Next Steps

After successful deployment and testing:
1. Deploy to BlockDAG mainnet (when available)
2. Implement additional features like job categories, advanced search, etc.
3. Add more sophisticated dispute resolution mechanisms
4. Implement subscription models for premium features
