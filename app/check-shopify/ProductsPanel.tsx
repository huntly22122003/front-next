"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import ProductsCreate from "./ProductsCreate";
import ProductsUpdate from "./ProductsUpdate";

type Variant = {
  price?: string;
};

type Product = {
  id: number;
  title: string;
  vendor?: string;
  variants?: Variant[];
};

type Props = {
  productsUrl: string;
};

export default function ProductsPanel({ productsUrl }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = () => {
    setLoading(true);
    setError(null);

    fetch(productsUrl, {
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setProducts(data.products ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("❌ Không load được products");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, [productsUrl]);

  if (loading) return <p className={styles.loading}>Loading products…</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <section className={styles.section}>
      {/* HEADER */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📦 Products</h2>

        <button
          className={styles.button}
          onClick={() => {
            setShowCreate((v) => !v);
            setEditingProduct(null);
          }}
        >
          {showCreate ? "✖ Close" : "➕ New Product"}
        </button>
      </div>

      {/* CREATE */}
      {showCreate && (
        <ProductsCreate
          createUrl="https://luana-unpenetrative-fumiko.ngrok-free.dev/api/products"
          onCreated={() => {
            setShowCreate(false);
            loadProducts();
          }}
        />
      )}

      {/* UPDATE */}
      {editingProduct && (
        <ProductsUpdate
          product={{
            id: editingProduct.id,
            title: editingProduct.title,
            price: editingProduct.variants?.[0]?.price,
          }}
          updateUrl="https://luana-unpenetrative-fumiko.ngrok-free.dev/api/products/update"
          onUpdated={() => {
            setEditingProduct(null);
            loadProducts();
          }}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Vendor</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td>{p.vendor ?? "-"}</td>
                <td>{p.variants?.[0]?.price ?? "-"}</td>
                <td>
                  <button
                    className={styles.button}
                    onClick={() => {
                      setEditingProduct(p);
                      setShowCreate(false);
                    }}
                  >
                    ✏ Edit
                  </button>
                </td>
              </tr>
            ))}

            {!products.length && (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No products
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
