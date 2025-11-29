export interface Product {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  image: string;
  category: 'meat' | 'chicken' | 'fish' | 'other';
  stock: number;
  userId?: string; // Owner of the product (merchant ID)
  createdAt: string;
  updatedAt: string;
}
