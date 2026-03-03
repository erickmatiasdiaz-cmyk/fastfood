/**
 * Tipo base de producto
 * Se usará tanto en menú como en carrito
 */
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string; // Ruta pública de imagen
  featured?: boolean;
};

/**
 * Lista principal de productos
 * Esta estructura luego será reemplazable por base de datos
 */
export const products: Product[] = [
  {
    id: 1,
    name: "Completo Italiano",
    description: "Tomate, palta y mayonesa",
    price: 2490,
    category: "Completos",
    image: "/products/completo_italiano.png",
    featured: true,
  },
  {
    id: 2,
    name: "Churrasco Italiano",
    description: "Carne, tomate, palta y mayo",
    price: 6490,
    category: "Churrascos",
    image: "/products/churrasco_italiano.png",
    featured: true,
  },
  {
    id: 3,
    name: "Combo Clásico",
    description: "Completo + papas + bebida",
    price: 4990,
    category: "Combos",
    image: "/products/combo_clasico.png",
    featured: true,
  },
  {
    id: 4,
    name: "Empanada de Pino",
    description: "Carne, huevo, aceituna",
    price: 2000,
    category: "Empanadas",
    image: "/products/empanadas_pino.png",
  },
];
