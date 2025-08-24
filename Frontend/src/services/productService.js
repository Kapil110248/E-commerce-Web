import axios from "axios";

// ✅ Axios instance
const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // agar cookies/session use karni ho
});

// --------------------- Products API ---------------------

// ✅ Get all products
export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data.products || res.data || [];
};

// ✅ Get single product by id
export const getProduct = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// ✅ Create new product
export const createProduct = async (data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("category", data.category);
  formData.append("price", data.price);
  formData.append("stock", data.stock);
  if (data.image) formData.append("image", data.image);

  const res = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ✅ Update existing product
export const updateProduct = async (id, data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("category", data.category);
  formData.append("price", data.price);
  formData.append("stock", data.stock);
  if (data.image) formData.append("image", data.image);

  const res = await api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ✅ Delete product
export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

// --------------------- Default export ---------------------
const productService = {
  getAll: getProducts,
  get: getProduct,
  create: createProduct,
  update: updateProduct,
  remove: deleteProduct,
};

export default productService;
