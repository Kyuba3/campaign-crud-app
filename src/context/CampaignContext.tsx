import { createContext, useContext, useEffect, useState } from "react";
import { Campaign } from "../types/Campaign";
import { mockCampaigns } from "../data/mockCampaigns";

interface CampaignContextType {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  updateCampaign: (updated: Campaign) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider = ({ children }: { children: React.ReactNode }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const stored = localStorage.getItem("campaigns");
      if (stored) return JSON.parse(stored);
      localStorage.setItem("campaigns", JSON.stringify(mockCampaigns));
      return mockCampaigns;
    } catch (error) {
      console.error("Failed to load campaigns from localStorage:", error);
      return mockCampaigns;
    }
  });

  useEffect(() => {
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
  }, [campaigns]);

  const addCampaign = (campaign: Campaign) => {
    setCampaigns((prev) => [...prev, campaign]);
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCampaign = (updated: Campaign) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  return (
    <CampaignContext.Provider value={{ campaigns, addCampaign, deleteCampaign, updateCampaign }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = (): CampaignContextType => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaigns must be used within a CampaignProvider");
  }
  return context;
};
