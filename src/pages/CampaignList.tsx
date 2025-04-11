import { CampaignCard } from "../components/CampaignCard";
import { Link } from "react-router-dom";
import { useCampaigns } from "../context/CampaignContext";
import { useEmerald } from "../context/EmeraldContext";
import { Plus, Wallet } from "lucide-react";
import "../styles/CampaignList.css";

export const CampaignList = () => {
  const { campaigns } = useCampaigns();
  const { budget } = useEmerald();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 md:p-8">
      <header className="glass-header flex flex-col md:flex-row justify-between items-center mb-10 p-6 rounded-2xl shadow-md">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight text-center md:text-left">
          Your Campaigns
        </h1>
        <div className="mt-4 md:mt-0 flex items-center gap-2 text-green-800 font-semibold text-lg">
          <Wallet size={22} />
          Remaining Budget:
          <span className="font-bold">{budget} zł</span>
        </div>
      </header>

      <div className="flex justify-center mb-10">
      <Link
        to="/new"
        className="inline-flex items-center gap-3 px-6 py-4 text-lg font-semibold text-white rounded-2xl shadow-lg bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-all"
      >
        <Plus size={22} />
        Create New Campaign
      </Link>
    </div>


      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No campaigns created yet.
          </p>
        )}
      </div>
    </div>
  );
};