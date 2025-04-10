import { Campaign } from "../../types/Campaign";

interface Props {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
      <h2 className="text-xl font-semibold text-blue-700 mb-2">{campaign.name}</h2>
      <ul className="text-gray-700 space-y-1 text-sm">
        <li><strong>Keywords:</strong> {campaign.keywords.join(', ')}</li>
        <li><strong>Bid Amount:</strong> {campaign.bidAmount} zł</li>
        <li><strong>Campaign Fund:</strong> {campaign.campaignFund} zł</li>
        <li><strong>Status:</strong> {campaign.status ? 'Enabled' : 'Disabled'}</li>
        <li><strong>City:</strong> {campaign.city}</li>
        <li><strong>Radius:</strong> {campaign.radius} km</li>
      </ul>
    </div>
  );
};
