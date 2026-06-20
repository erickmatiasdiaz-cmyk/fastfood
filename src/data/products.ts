// Product shape used across the app. The source of truth lives in Supabase
// (public.products); this type mirrors a mapped row.
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured: boolean;
  badge: string;
  prepTime: string;
  isHidden: boolean;
  sortOrder: number;
};
