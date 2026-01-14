"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Props = {
  createUrl: string;
  onCreated?: () => void;
};

export default function CreateProductForm({ createUrl, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [isNotifyActive, setIsNotifyActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title || !price) {
      setError("❌ Title và price là bắt buộc");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(createUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          price,
          is_notify_active: isNotifyActive,
        }),
      });

      if (!res.ok) throw new Error();

      setSuccess("✅ Tạo product thành công");
      setTitle("");
      setPrice("");
      setIsNotifyActive(false);
      onCreated?.();
    } catch {
      setError("❌ Tạo product thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>➕ Create Product</h2>
      </div>

      <div className={styles.controls}>
        <input
          className={styles.input}
          placeholder="Product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className={styles.input}
          type="number"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <label className={styles.row}>
        <input
          type="checkbox"
          checked={isNotifyActive}
          onChange={(e) => setIsNotifyActive(e.target.checked)}
        />
        <span style={{ marginLeft: 8 }}>Notify active</span>
      </label>

      <button
        className={styles.button}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Product"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
    </section>
  );
}
