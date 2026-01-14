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
  const [showCreate, setShowCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    setLoading(true);

    const res = await fetch(productsUrl, {
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
    });

    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [productsUrl]);

  const softDelete = async (id: number) => {
    if (!confirm("Soft delete product này?")) return;

    const res = await fetch(
      "https://luana-unpenetrative-fumiko.ngrok-free.dev/api/products/soft",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      }
    );

    if (!res.ok) {
      alert("Soft delete failed");
      return;
    }

    loadProducts();
  };

  if (loading) return <p>Loading…</p>;

  return (
    <section className={styles.section}>
      <h2>📦 Products</h2>

      <button
        className={styles.button}
        onClick={() => {
          setShowCreate(!showCreate);
          setEditingProduct(null);
        }}
      >
        ➕ New Product
      </button>

      {showCreate && (
        <ProductsCreate
          createUrl="https://luana-unpenetrative-fumiko.ngrok-free.dev/api/products"
          onCreated={() => {
            setShowCreate(false);
            loadProducts();
          }}
        />
      )}

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

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td>{p.variants?.[0]?.price ?? "-"}</td>
              <td>
                <button onClick={() => setEditingProduct(p)}>✏ Edit</button>
                <button onClick={() => softDelete(p.id)}>🗑 Soft</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
