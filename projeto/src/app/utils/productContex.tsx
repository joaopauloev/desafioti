"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { Product } from "@/app/interfaces/product";

interface ProductContextType {
  products: Product[];
  allProducts: Product[];
  setProducts: (products: Product[]) => void;
  setAllProducts: (products: Product[]) => void;
  fetchProducts: (number: number, limit: number) => void;
  fetchAllProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const fetchProducts = useCallback(
    async (page: number, limit: number = 21) => {
      const offset = (page - 1) * limit;
      try {
        const response = await axios.get(
          `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${limit}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    },
    []
  );

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get('https://api.escuelajs.co/api/v1/products');
      setAllProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchAllProducts()
    fetchProducts(1);
  }, [fetchProducts]);

  return (
    <ProductContext.Provider value={{ allProducts, products, setAllProducts, setProducts, fetchProducts, fetchAllProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
