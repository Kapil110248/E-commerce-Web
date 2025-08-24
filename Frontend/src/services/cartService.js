import api from "./axios";

const cartService = {
  addToCart: async (productId, quantity) => {
    const res = await api.post("/cart/add", { productId, quantity });
    return res.data; // expect { success, cart }
  },

  getCart: async () => {
    const res = await api.get("/cart");
    return res.data; // expect { success, cart }
  },

  removeFromCart: async (productId) => {
    const res = await api.delete(`/cart/remove/${productId}`);
    return res.data; // expect { success, cart }
  },

  clearCart: async () => {
    const res = await api.delete("/cart/clear");
    return res.data; // expect { success, cart }
  },
};

export default cartService;
