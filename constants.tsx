
import { Product, NavItem } from './types';

import image5 from './assets/image5.jpeg';
import image6 from './assets/image6.jpeg';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Republic Essential Hoodie',
    category: 'Tops',
    price: 85.00,
    image: image5,
    tag: 'NEW',
    description: 'Heavyweight fabric designed for ultimate comfort and durability.',
    stock_quantity: 12
  },
  {
    id: '2',
    name: 'Hard-Fit Tee',
    category: 'Tops',
    price: 45.00,
    image: image6,
    tag: 'LIMITED',
    description: 'Classic graphic tee featuring our signature minimalist logo.',
    stock_quantity: 8
  },
  {
    id: '3',
    name: 'Confidence Joggers',
    category: 'Unisex',
    price: 75.00,
    image: image5,
    tag: 'BEST SELLER',
    description: 'Performance cut joggers that move with you, on the street or in the gym.',
    stock_quantity: 25
  },
  {
    id: '4',
    name: 'GHR Signature Cap',
    category: 'Caps',
    price: 35.00,
    image: image6,
    description: 'Structured fit with premium embroidery.',
    stock_quantity: 5
  },
  {
    id: '5',
    name: 'Elite Heavyweight Hoodie',
    category: 'Tops',
    price: 95.00,
    image: image5,
    tag: 'NEW',
    stock_quantity: 0
  },
  {
    id: '6',
    name: 'Republic Mesh Shorts',
    category: 'Shorts',
    price: 49.00,
    image: image6,
    stock_quantity: 15
  },
  {
    id: '7',
    name: 'Hard Hitter Jacket',
    category: 'Jackets',
    price: 145.00,
    image: image5,
    tag: 'PREMIUM',
    stock_quantity: 3
  },
  {
    id: '8',
    name: 'Motivation Tie',
    category: 'Tops',
    price: 40.00,
    image: image6,
    stock_quantity: 20
  }
];

export const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'SHOP', href: '/shop' },
  { label: 'ABOUT', href: '/about' },
  // { label: 'DASHBOARD', href: '/dashboard' },
];

export const CATEGORIES: { label: string; value: string }[] = [
  { label: 'ALL PRODUCTS', value: 'All' },
  { label: 'CAPS', value: 'Caps' },
  { label: 'TOPS', value: 'Tops' },
  { label: 'SHORTS', value: 'Shorts' },
  { label: 'JACKETS', value: 'Jackets' },
  { label: 'UNISEX', value: 'Unisex' },
];
