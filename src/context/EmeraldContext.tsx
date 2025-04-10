import { createContext, useContext, useEffect, useState } from "react";

interface EmeraldContextType {
  budget: number;
  deduct: (amount: number) => boolean;
  restore: (amount: number) => void;
  setBudget: (newAmount: number) => void;
}

const EmeraldContext = createContext<EmeraldContextType | undefined>(undefined);

export const EmeraldProvider = ({ children }: { children: React.ReactNode }) => {
  const [budget, setBudgetState] = useState<number>(() => {
    const stored = localStorage.getItem("emeraldBudget");
    if (stored) return parseFloat(stored);
  
    const storedCampaigns = localStorage.getItem("campaigns");
    if (storedCampaigns) {
      try {
        const parsed = JSON.parse(storedCampaigns);
        const spent = parsed.reduce(
          (acc: number, c: { campaignFund: number }) => acc + c.campaignFund,
          0
        );
        return 1000 - spent;
      } catch {
        return 1000;
      }
    }
  
    return 1000;
  });

  useEffect(() => {
    localStorage.setItem("emeraldBudget", budget.toString());
  }, [budget]);

  const setBudget = (newAmount: number) => {
    setBudgetState(newAmount);
  };

  const deduct = (amount: number): boolean => {
    if (amount > budget) return false;
    setBudgetState((prev) => prev - amount);
    return true;
  };

  const restore = (amount: number) => {
    setBudgetState((prev) => prev + amount);
  };

  return (
    <EmeraldContext.Provider value={{ budget, deduct, restore, setBudget }}>
      {children}
    </EmeraldContext.Provider>
  );
};

export const useEmerald = (): EmeraldContextType => {
  const context = useContext(EmeraldContext);
  if (!context) {
    throw new Error("useEmerald must be used within an EmeraldProvider");
  }
  return context;
};
