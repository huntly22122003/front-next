"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Product = {
  id: number;
  title: string;
};

export default function HardDeletePanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const BASE_URL = "https://luana-unpenetrative-fumiko.ngrok-free.dev";

  const load = async () => {
    setLoading(true);

    const res = await fetch(`${BASE_URL}/api/products/softdeleted`, {
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
    });

    const data = await res.json();
    setProducts(data.softDelete ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const hardDelete = async (id: number) => {
    const ok = confirm(
      `Hard delete product ID ${id}?\nHành động này KHÔNG thể hoàn tác.`
    );
    if (!ok) return;

    setDeletingId(id);

    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
    });

    setDeletingId(null);

    if (!res.ok) {
      alert("Hard delete failed");
      return;
    }

    // reload list
    load();
  };

  if (loading) return <p className={styles.loading}>Loading soft deleted…</p>;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>🔥 Hard Delete (Soft Deleted)</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td>
                <button
                  className={styles.danger}
                  disabled={deletingId === p.id}
                  onClick={() => hardDelete(p.id)}
                >
                  {deletingId === p.id ? "Deleting…" : "❌ Hard Delete"}
                </button>
              </td>
            </tr>
          ))}

          {!products.length && (
            <tr>
              <td colSpan={3} className={styles.empty}>
                No soft deleted products
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
