export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured?: boolean;
  badge?: string;
  prepTime: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Completo Italiano",
    description: "Vienesa, tomate fresco, palta molida y mayo de la casa.",
    price: 2490,
    category: "Completos",
    image: "/products/completo_italiano.png",
    featured: true,
    badge: "Favorito",
    prepTime: "10-12 min",
  },
  {
    id: 2,
    name: "Churrasco Italiano",
    description: "Vacuno jugoso, tomate, palta y mayo en pan tostado.",
    price: 6490,
    category: "Churrascos",
    image: "/products/churrasco_italiano.png",
    featured: true,
    badge: "Mas pedido",
    prepTime: "12-15 min",
  },
  {
    id: 3,
    name: "Combo Clasico",
    description: "Completo italiano, papas crujientes y bebida helada.",
    price: 4990,
    category: "Combos",
    image: "/products/combo_clasico.png",
    featured: true,
    badge: "Mejor valor",
    prepTime: "12-15 min",
  },
  {
    id: 4,
    name: "Empanada de Pino",
    description: "Pino tradicional con carne, huevo y aceituna.",
    price: 2000,
    category: "Empanadas",
    image: "/products/empanadas_pino.png",
    badge: "Horneada",
    prepTime: "8-10 min",
  },
];
