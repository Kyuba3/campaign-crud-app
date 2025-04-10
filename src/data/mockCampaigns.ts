import { Campaign } from "../types/Campaign";

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Spring Promo',
    keywords: ['shoes', 'spring', 'fashion'],
    bidAmount: 5,
    campaignFund: 100,
    status: true,
    city: 'Warsaw',
    radius: 10,
  },
  {
    id: '2',
    name: 'Summer Sale',
    keywords: ['clothes', 'summer', 'discount'],
    bidAmount: 7,
    campaignFund: 150,
    status: false,
    city: 'Krakow',
    radius: 15,
  },
];
