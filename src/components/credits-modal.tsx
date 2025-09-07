import React from "react";

export type CreditPlan = {
  name: string;
  tokens: number;
  usd: number;
  images: number;
  prompts: number;
};

export const CREDIT_PLANS: CreditPlan[] = [
  { name: "Starter", tokens: 49, usd: 5, images: 10, prompts: 10 },
  { name: "Plus", tokens: 99, usd: 10, images: 25, prompts: 25 },
  { name: "Pro", tokens: 199, usd: 20, images: 55, prompts: 55 },
];

interface CreditsModalProps {
  open: boolean;
  onClose: () => void;
  onRecharge: (plan: CreditPlan) => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ open, onClose, onRecharge }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Credits Exhausted</h2>
        <p className="mb-4">Choose a recharge plan to continue using BDAG features:</p>
        <div className="space-y-4">
          {CREDIT_PLANS.map((plan) => (
            <div key={plan.name} className="border rounded p-3 flex flex-col">
              <span className="font-semibold">{plan.name}</span>
              <span>{plan.tokens} BDAG Tokens</span>
              <span>${plan.usd} USD</span>
              <span>{plan.images} Images Allowed</span>
              <span>{plan.prompts} Prompts Allowed</span>
              <button
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => onRecharge(plan)}
              >
                Recharge
              </button>
            </div>
          ))}
        </div>
        <button className="mt-6 text-gray-600" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
