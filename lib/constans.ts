import { PackageId } from "@/types/payments";

export interface PricingPackage {
  id: PackageId;
  title: string;
  price: string;
  oldPrice: string;
  credits: number;
  description: string;
  isPopular?: boolean;
}

export const PRICING_PACKAGES: Record<PackageId, PricingPackage> = {
  pack_10: {
    id: "pack_10",
    title: "Starter",
    price: "2.99",
    oldPrice: "4.99",
    credits: 10,
    description: "Perfect for single tasks and exploring AI capabilities.",
    isPopular: false,
  },
  pack_25: {
    id: "pack_25",
    title: "Pro",
    price: "5.99",
    oldPrice: "9.99",
    credits: 25,
    description: "The best choice for active job hunting or hiring.",
    isPopular: true,
  },
  pack_50: {
    id: "pack_50",
    title: "Ultimate",
    price: "9.99",
    oldPrice: "19.99",
    credits: 50,
    description: "Maximum power for HR professionals and agencies.",
    isPopular: false,
  },
};

export const PRICING_PLANS = Object.values(PRICING_PACKAGES);
