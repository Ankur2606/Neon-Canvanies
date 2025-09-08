
import { createThirdwebClient, getContract } from "thirdweb";
import { bdagTestnet } from "./chains";

// Create Thirdweb client
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
    throw new Error("Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID environment variable.");
}

export const client = createThirdwebClient({
  clientId,
});

// Contract addresses (update after deployment)
export const BDAG_CREDIT_CONTRACT_ADDRESS = "0x02DF0F19f96F84fAB71d9AB2A4b572a94d8500C5";
export const BDAG_JOB_PAYMENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x02DF0F19f96F84fAB71d9AB2A4b572a94d8500C5";

// Contract instances
export const bdagCreditContract = getContract({
  client,
  chain: bdagTestnet,
  address: BDAG_CREDIT_CONTRACT_ADDRESS,
});

export const bdagJobPaymentContract = getContract({
  client,
  chain: bdagTestnet,
  address: BDAG_JOB_PAYMENT_CONTRACT_ADDRESS,
});
