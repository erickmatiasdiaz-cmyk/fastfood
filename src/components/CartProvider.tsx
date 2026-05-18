"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Product } from "@/data/products";

type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  isOpen: boolean;
  toast: string | null;
  addToCart: (product: Product) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  toggleCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "comecome-cart";
const CartContext = createContext<CartContextType | undefined>(undefined);

function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = useCallback((message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToast(message);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 2000);
  }, []);

  const addToCart = useCallback(
    (product: Product) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);

        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...prev, { ...product, quantity: 1 }];
      });

      showToast(`${product.name} agregado`);
    },
    [showToast]
  );

  const increaseQuantity = useCallback((id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const itemCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      isOpen,
      toast,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      toggleCart,
      closeCart,
      getTotal: () => total,
      getItemCount: () => itemCount,
      clearCart,
    }),
    [
      cart,
      isOpen,
      toast,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      toggleCart,
      closeCart,
      total,
      itemCount,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
