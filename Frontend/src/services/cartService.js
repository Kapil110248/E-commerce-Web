import axios from "axios";

const API_URL = "http://localhost:4000/api/cart"; // apna backend URL

const getCart = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const addToCart = async (productId, quantity = 1, token) => {
  const res = await axios.post(
    API_URL,
    { productId, quantity },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

const updateCart = async (productId, quantity, token) => {
  const res = await axios.put(
    `${API_URL}/${productId}`,
    { quantity },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

const removeFromCart = async (productId, token) => {
  const res = await axios.delete(`${API_URL}/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export default {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
};
