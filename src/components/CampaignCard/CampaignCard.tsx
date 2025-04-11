import { useNavigate } from "react-router-dom";
import { Campaign } from "../../types/Campaign";
import { useCampaigns } from "../../context/CampaignContext";
import { useEmerald } from "../../context/EmeraldContext";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "../ConfirmModal";
interface Props {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: Props) => {
  
  const navigate = useNavigate();
  const { deleteCampaign } = useCampaigns();
  const { restore } = useEmerald();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-6 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 tracking-tight">{campaign.name}</h2>
      <ul className="space-y-2 text-sm text-gray-700 mb-4">
        <li><strong>Keywords:</strong> {campaign.keywords.join(", ")}</li>
        <li><strong>Bid Amount:</strong> {campaign.bidAmount} zł</li>
        <li><strong>Campaign Fund:</strong> {campaign.campaignFund} zł</li>
        <li><strong>Status:</strong> {campaign.status ? "Enabled" : "Disabled"}</li>
        <li><strong>City:</strong> {campaign.city}</li>
        <li><strong>Radius:</strong> {campaign.radius} km</li>
      </ul>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate(`/edit/${campaign.id}`)}
          className="flex items-center gap-1 text-sm px-6 py-1 rounded-2xl bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
        >
          <Pencil size={16} />
          Edit
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 text-sm px-4 py-1 rounded-2xl bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          restore(campaign.campaignFund);
          deleteCampaign(campaign.id)
        }}
        title="Delete Campaign"
        description="Are you sure you want to delete this campaign? This action cannot be undone."
      />
    </div>
  );
};
