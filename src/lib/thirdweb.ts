
import { createThirdwebClient } from "thirdweb";

// Create Thirdweb client
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
    throw new Error("Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID environment variable.");
}

export const client = createThirdwebClient({
  clientId,
});
