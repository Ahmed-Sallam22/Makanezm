import type { PaymentType, InstallmentTier } from './product';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number; // Base cash price
  image?: string;
  merchantId?: string;
}

// Installment payment details
export interface InstallmentDetails {
  tier: InstallmentTier;
  totalAmount: number; // Price with installment fee
  monthlyPayment: number;
  monthsPaid: number;
  nextPaymentDate: string;
  remainingPayments: number;
  profit: number; // Merchant's profit from installment
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  discountAmount: number;
  finalTotal: number; // Cash total or installment total
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentType: PaymentType; // 'cash' | 'installment'
  
  // Installment-specific fields
  installmentDetails?: InstallmentDetails;
  
  // Merchant info
  merchantId?: string;
  
  createdAt: string;
  updatedAt: string;
  deliveryLink?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  customerNotes?: string;
  merchantNotes?: string;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalProfit: number;
  totalProducts: number;
  monthlyGrowth: number;
}

export interface PartnershipRequest {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  partnershipType: 'distribution' | 'reseller' | 'collaboration' | 'other';
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface SeasonalProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  discountPrice?: number;
  launchDate: string;
  endDate: string;
  available: boolean;
}

export interface DeferredSaleRequest {
  id: string;
  productId: number;
  productName: string;
  requestedPrice: number;
  originalPrice: number;
  profit: number;
  profitPercentage: number;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  merchantNotes?: string;
}
