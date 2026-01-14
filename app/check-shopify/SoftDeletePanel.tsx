"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Product = {
  id: number;
  title: string;
};

export default function SoftDeletedPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    const res = await fetch(
      "https://luana-unpenetrative-fumiko.ngrok-free.dev/api/products/soft",
      {
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      }
    );

    const data = await res.json();
    setProducts(data.softDelete ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className={styles.loading}>Loading…</p>;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>🗑 Soft Deleted Products</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
            </tr>
          ))}

          {!products.length && (
            <tr>
              <td colSpan={2} className={styles.empty}>
                No soft deleted products
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
