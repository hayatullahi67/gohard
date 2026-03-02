
export type Category = 'Caps' | 'Tops' | 'Shorts' | 'Jackets' | 'Unisex' | 'All';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image?: string;
  image_url?: string;
  tag?: string;
  description?: string;
  stock_quantity?: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface DashboardStats {
  totalRevenue: number;
  orders: number;
  customers: number;
  activeProducts: number;
}
