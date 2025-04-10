import { useState, useEffect } from "react";
import { mockCampaigns } from "../data/mockCampaigns";
import { CampaignProvider } from "./CampaignContext";
import { EmeraldProvider } from "./EmeraldContext";

export const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const campaignsInStorage = localStorage.getItem("campaigns");

    if (!campaignsInStorage) {
      localStorage.setItem("campaigns", JSON.stringify(mockCampaigns));
      const totalFund = mockCampaigns.reduce((sum, c) => sum + c.campaignFund, 0);
      localStorage.setItem("emeraldBudget", (1000 - totalFund).toString());
    }

    setInitialized(true);
  }, []);

  if (!initialized) return null;

  return (
    <CampaignProvider>
      <EmeraldProvider>{children}</EmeraldProvider>
    </CampaignProvider>
  );
};
