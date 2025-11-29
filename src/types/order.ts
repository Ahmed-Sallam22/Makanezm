export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  discountAmount: number;
  finalTotal: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentType: 'credit' | 'cash';
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
