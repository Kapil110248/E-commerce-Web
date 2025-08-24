import React, { useEffect, useState } from "react";
import productService from "../../services/productService";
import seedProducts from "./seedProducts";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    stock: "",
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState(null);

  // ✅ Load products from DB
  const load = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setErr("");
    } catch (e) {
      setErr("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto Seed Products (only first time if DB empty)
  const autoSeedProducts = async () => {
    try {
      setLoading(true);
      const existing = await productService.getAll();
      if (existing.length === 0) {
        for (const p of seedProducts) {
          await productService.create(p);
        }
        await load();
        console.log("✅ Auto seeded products!");
      }
    } catch {
      setErr("Failed to auto-seed products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await load();
      await autoSeedProducts(); // auto insert ho jayenge agar empty DB hai
    })();
  }, []);

  // ✅ Reset form
  const resetForm = () => {
    setForm({ id: null, name: "", category: "", price: "", stock: "", image: null });
    setPreview(null);
    setIsEditing(false);
  };

  // ✅ Handle text input
  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ✅ Handle file input
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file)); // preview ke liye
  };

  // ✅ Add / Update product
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await productService.update(form.id, form);
      } else {
        await productService.create(form);
      }
      await load();
      resetForm();
    } catch (e2) {
      setErr("Save failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit product
  const onEdit = (p) => {
    setForm({
      id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      image: null, // editing me naya file select karna hoga
    });
    setPreview(typeof p.image === "string" ? p.image : null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Delete product
  const onDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      setLoading(true);
      await productService.remove(id);
      await load();
    } catch {
      setErr("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-3">
      <h4 className="mb-3">Manage Products</h4>
      {err && <div className="alert alert-danger">{err}</div>}

      {/* 🚫 Remove Seed Button - ab zarurat nahi */}
      {/* <button className="btn btn-success mb-3" onClick={addSeedProducts} disabled={loading}>
        Add 20 Seed Products
      </button> */}

      {/* Form */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <form onSubmit={onSubmit} className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Name</label>
              <input name="name" value={form.name} onChange={onChange} className="form-control" required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Category</label>
              <input name="category" value={form.category} onChange={onChange} className="form-control" required />
            </div>
            <div className="col-md-2">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={onChange}
                className="form-control"
                min="0"
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={onChange}
                className="form-control"
                min="0"
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Image</label>
              <input type="file" onChange={onFileChange} className="form-control" accept="image/*" />
            </div>

            {preview && (
              <div className="col-12">
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6 }}
                />
              </div>
            )}

            <div className="col-12 d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update" : "Add"}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-outline-secondary" onClick={resetForm} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          {loading && !isEditing ? (
            <div className="p-3">Loading...</div>
          ) : (
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={p._id}>
                    <td>{idx + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <img
                        src={
                          p.image && typeof p.image === "string"
                            ? p.image
                            : "https://via.placeholder.com/50?text=No+Image"
                        }
                        alt={p.name}
                        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                      />
                    </td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-sm btn-warning" onClick={() => onEdit(p)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete(p._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!products.length && (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
