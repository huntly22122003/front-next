"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Props = {
  product: {
    id: number;
    title: string;
    price?: string;
  };
  updateUrl: string;
  onUpdated?: () => void;
  onCancel?: () => void;
};

export default function ProductsUpdate({
  product,
  updateUrl,
  onUpdated,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
        body: JSON.stringify({
          id: product.id,       // 👈 BE cần
          title,
          price,
        }),
      });

      if (!res.ok) throw new Error();

      setSuccess("✅ Update thành công");
      onUpdated?.();
    } catch {
      setError("❌ Update thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>✏ Edit Product #{product.id}</h2>
      </div>

      <div className={styles.controls}>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product title"
        />

        <input
          className={styles.input}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>

        <button
          className={styles.button}
          style={{ background: "#6d7175" }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
    </section>
  );
}
