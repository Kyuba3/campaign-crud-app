export interface Campaign {
  id: string;
  name: string;
  keywords: string[];
  bidAmount: number;
  campaignFund: number;
  status: boolean;
  city: string;
  radius: number;
  productId: string;
}