"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import VariantForm from "./VariantForm";

type Variant = {
  id: number;
  title?: string;
  price?: string;
  sku?: string;
  option1?: string;
};

type Mode = "list" | "edit";

type Props = {
  productId: number;
  onClose: () => void;
};

const BASE = "https://luana-unpenetrative-fumiko.ngrok-free.dev/api";

export default function VariantPanel({ productId, onClose }: Props) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<Variant | null>(null);

  /* ================= LOAD ================= */

  const load = async () => {
    setLoading(true);

    const res = await fetch(
      `${BASE}/products/${productId}/variants`,
      {
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      }
    );

    const data = await res.json();
    setVariants(data.variants ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [productId]);

  /* ================= DELETE ================= */

  const deleteVariant = async (variantId: number) => {
    if (!confirm("Delete variant này?")) return;

    await fetch(
      `${BASE}/products/${productId}/variants/${variantId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      }
    );

    load();
  };

  /* ================= EDIT MODE ================= */

  if (mode === "edit" && editing) {
    return (
      <VariantForm
        productId={productId}
        variant={editing}
        onDone={() => {
          setEditing(null);
          setMode("list");
          load();
        }}
      />
    );
  }

  /* ================= LIST MODE ================= */

  if (loading) return <p>Loading variants…</p>;

  return (
    <section className={styles.section}>
      <div className={styles.panelHeader}>
    <h3 className={styles.panelTitle}>
        Variants From Product #{productId}
    </h3>

    <button
        className={styles.closeButton}
        onClick={onClose}
    >
        ✖
    </button>
    </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Option</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {variants.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.title ?? "-"}</td>
              <td>{v.option1 ?? "-"}</td>
              <td>{v.sku ?? "-"}</td>
              <td>{v.price ?? "-"}</td>
              <td className={styles.actions}>
                <button
                  onClick={() => {
                    setEditing(v);
                    setMode("edit");
                  }}
                >
                  ✏️ Edit
                </button>

                <button
                  className={styles.dangerButton}
                  onClick={() => deleteVariant(v.id)}
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}

          {variants.length === 0 && (
            <tr>
              <td colSpan={6} className={styles.empty}>
                No variants
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
