import { createContext, useState, useEffect } from "react";
import productService from "../services/productService";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts, loading, fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
