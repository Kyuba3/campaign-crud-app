import { Campaign } from "../../types/Campaign";
import { MapPin, Target, BadgePercent, Coins, ToggleRight, Radar } from "lucide-react";

interface Props {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: Props) => {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-6 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 tracking-tight">{campaign.name}</h2>

      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex items-center gap-2">
          <BadgePercent size={16} />
          <strong>Keywords:</strong> {campaign.keywords.join(", ")}
        </li>
        <li className="flex items-center gap-2">
          <Coins size={16} />
          <strong>Bid Amount:</strong> {campaign.bidAmount} zł
        </li>
        <li className="flex items-center gap-2">
          <Target size={16} />
          <strong>Campaign Fund:</strong> {campaign.campaignFund} zł
        </li>
        <li className="flex items-center gap-2">
          <ToggleRight size={16} />
          <strong>Status:</strong> {campaign.status ? "Enabled" : "Disabled"}
        </li>
        <li className="flex items-center gap-2">
          <MapPin size={16} />
          <strong>City:</strong> {campaign.city}
        </li>
        <li className="flex items-center gap-2">
          <Radar size={16} />
          <strong>Radius:</strong> {campaign.radius} km
        </li>
      </ul>
    </div>
  );
};
