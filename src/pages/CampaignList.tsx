import { useState } from "react";
import { Campaign } from "../types/Campaign";
import { mockCampaigns } from "../data/mockCampaigns";
import { CampaignCard } from "../components/CampaignCard/CampaignCard";

export const CampaignList = () => {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Campaign List</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};
