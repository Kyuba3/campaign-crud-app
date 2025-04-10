import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmerald } from "../context/EmeraldContext";
import { useCampaigns } from "../context/CampaignContext";
import { PRODUCTS } from "../data/mockProducts";
import "../styles/CampaignForm.css";
import { TownSelect } from "../components/TownSelect";

const SUGGESTED_KEYWORDS = ["sale", "new", "fashion", "tech", "deal", "summer", "winter"];
const CITIES = ["Warsaw", "Krakow", "Gdansk", "Wroclaw"];

export const CampaignForm = () => {
  const navigate = useNavigate();
  const { budget, deduct } = useEmerald();
  const { addCampaign } = useCampaigns();
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "keywords") {
      const filtered = SUGGESTED_KEYWORDS.filter((kw) =>
        kw.toLowerCase().startsWith(value.toLowerCase()) &&
        !form.keywords.toLowerCase().split(",").map(k => k.trim()).includes(kw.toLowerCase())
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

    if (form.campaignFund > budget) {
      alert("Not enough Emerald Funds.");
      return;
    }

    const keywords = form.keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const newCampaign = {
      id: crypto.randomUUID(),
      name: form.name,
      keywords,
      bidAmount: form.bidAmount,
      campaignFund: form.campaignFund,
      status: form.status === "on",
      city: form.city,
      radius: form.radius,
      productId: form.productId,
    };

    deduct(form.campaignFund);
    addCampaign(newCampaign);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Create New Campaign</h1>

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

        <div className="form-group relative">
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
          {form.keywords && keywordSuggestions.length > 0 && (
            <ul className="keyword-suggestions" ref={suggestionsRef}>
              {keywordSuggestions.map((kw, index) => (
                <li
                  key={kw}
                  className={
                    index === highlightedIndex
                      ? "highlighted"
                      : ""
                  }
                  onClick={() => handleSuggestionClick(kw)}
                >
                  {kw}
                </li>
              ))}
            </ul>
          )}
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

        <div className="form-group">
          <label>Product *</label>
          <select
            name="productId"
            required
            value={form.productId}
            onChange={handleChange}
          >
            <option value="">Select Product</option>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn bg-emerald-600 hover:bg-emerald-700">
            Create Campaign
          </button>
          <button type="button" className="cancel-btn bg-red-600" onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};