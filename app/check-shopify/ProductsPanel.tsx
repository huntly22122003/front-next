"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

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

  useEffect(() => {
    setProducts([]);
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
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
  }, [productsUrl]); // 👈 đổi URL thì fetch lại

  if (loading) return <p className={styles.loading}>Loading products…</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>📦 Products</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Vendor</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td>{p.vendor ?? "-"}</td>
                <td>
                  {p.variants?.length ? p.variants[0].price : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
