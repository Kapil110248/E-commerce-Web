import axios from "axios";

const API_URL = "http://localhost:4000/api/wishlist"; // apne backend ka URL daalna

// ✅ Get Wishlist
const getWishlist = async (token) => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Add to Wishlist
const addToWishlist = async (productId, token) => {
  const res = await axios.post(
    API_URL,
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ✅ Remove from Wishlist
const removeFromWishlist = async (productId, token) => {
  const res = await axios.delete(`${API_URL}/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
