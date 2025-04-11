import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEmerald } from "../context/EmeraldContext";
import { useCampaigns } from "../context/CampaignContext";
import "../styles/CampaignForm.css";
import { TownSelect } from "../components/TownSelect";

const SUGGESTED_KEYWORDS = ["sale", "fashion", "tech",];

export const CampaignForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { campaigns, addCampaign, updateCampaign } = useCampaigns();
  const { budget, deduct, restore } = useEmerald();

  const suggestionsRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [notFound, setNotFound] = useState(false);
  const [originalFund, setOriginalFund] = useState(0);

  const [form, setForm] = useState({
    name: "",
    keywords: "",
    bidAmount: 1,
    campaignFund: 0,
    status: "on",
    city: "",
    radius: 1,
    productId: "",
  });

  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  useEffect(() => {
    if (isEditing) {
      const campaign = campaigns.find((c) => c.id === id);
      if (!campaign) {
        setNotFound(true);
        return;
      }

      setForm({
        name: campaign.name,
        keywords: campaign.keywords.join(", "),
        bidAmount: campaign.bidAmount,
        campaignFund: campaign.campaignFund,
        status: campaign.status ? "on" : "off",
        city: campaign.city,
        radius: campaign.radius,
        productId: campaign.productId,
      });

      setOriginalFund(campaign.campaignFund);
    }
  }, [isEditing, id, campaigns]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "keywords") {
      const filtered = SUGGESTED_KEYWORDS.filter(
        (kw) =>
          kw.toLowerCase().startsWith(value.toLowerCase()) &&
          !form.keywords.toLowerCase().split(",").map((k) => k.trim()).includes(kw.toLowerCase())
      );
      setKeywordSuggestions(filtered);
      setHighlightedIndex(-1);
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === "bidAmount" || name === "campaignFund" || name === "radius" ? Number(value) : value,
    }));
  };

  const handleSuggestionClick = (kw: string) => {
    setForm((prev) => ({
      ...prev,
      keywords: prev.keywords ? `${prev.keywords}, ${kw}` : kw,
    }));
    setKeywordSuggestions([]);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!keywordSuggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % keywordSuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + keywordSuggestions.length) % keywordSuggestions.length);
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(keywordSuggestions[highlightedIndex]);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const el = suggestionsRef.current.children[highlightedIndex] as HTMLElement;
      el.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const keywords = form.keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const newCampaign = {
      id: id || crypto.randomUUID(),
      name: form.name,
      keywords,
      bidAmount: form.bidAmount,
      campaignFund: form.campaignFund,
      status: form.status === "on",
      city: form.city,
      radius: form.radius,
      productId: form.productId,
    };

    if (isEditing) {
      const diff = form.campaignFund - originalFund;
      if (diff > 0 && diff > budget) {
        alert("Not enough Emerald Funds.");
        return;
      }

      if (diff > 0) deduct(diff);
      if (diff < 0) restore(-diff);

      updateCampaign(newCampaign);
    } else {
      if (form.campaignFund > budget) {
        alert("Not enough Emerald Funds.");
        return;
      }
      deduct(form.campaignFund);
      addCampaign(newCampaign);
    }

    navigate("/");
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Campaign not found</h2>
        <button
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
        {isEditing ? "Edit Campaign" : "Create New Campaign"}
      </h1>

      <form onSubmit={handleSubmit} className="campaign-form">
        <div className="form-group">
          <label>Campaign Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter campaign name"
            required
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
        <label>Keywords *</label>
        <input
          type="text"
          name="keywords"
          placeholder="Type and separate with commas"
          required
          ref={inputRef}
          value={form.keywords}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <div className="flex flex-wrap gap-2 mt-2">
          {SUGGESTED_KEYWORDS.map((kw) => {
            const isSelected = form.keywords
              .toLowerCase()
              .split(",")
              .map((k) => k.trim())
              .includes(kw.toLowerCase());

            return (
              <button
                key={kw}
                type="button"
                className={`suggested-keyword ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  const keywordsArray = form.keywords
                    .split(",")
                    .map((k) => k.trim())
                    .filter((k) => k.length > 0);

                  if (isSelected) {
                    setForm((prev) => ({
                      ...prev,
                      keywords: keywordsArray
                        .filter((k) => k.toLowerCase() !== kw.toLowerCase())
                        .join(", "),
                    }));
                  } else {
                    setForm((prev) => ({
                      ...prev,
                      keywords: keywordsArray.length
                        ? `${prev.keywords}, ${kw}`
                        : kw,
                    }));
                  }
                }}
              >
                {kw}
              </button>
            );
          })}
        </div>
      </div>


        <div className="form-group">
          <label>Bid Amount (min 1 zł) *</label>
          <input
            type="number"
            name="bidAmount"
            min={1}
            required
            value={form.bidAmount}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Campaign Fund *</label>
          <input
            type="number"
            name="campaignFund"
            min={1}
            required
            value={form.campaignFund}
            onChange={handleChange}
          />
          <p className="hint pb-2">Available budget: <strong>{budget} zł</strong></p>
        </div>

        <div className="form-group">
          <label>Status *</label>
          <select
            name="status"
            required
            value={form.status}
            onChange={handleChange}
          >
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </div>

        <TownSelect
          value={form.city}
          onChange={(val) => setForm((prev) => ({ ...prev, city: val }))}
        />

        <div className="form-group">
          <label>Radius (in km) *</label>
          <input
            type="number"
            name="radius"
            min={1}
            required
            value={form.radius}
            onChange={handleChange}
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn bg-emerald-600 hover:bg-emerald-700">
            {isEditing ? "Save Changes" : "Create Campaign"}
          </button>
          <button type="button" className="cancel-btn bg-red-600" onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};
