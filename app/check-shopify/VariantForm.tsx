"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Variant = {
  id: number;
  title?: string;
  price?: string;
  sku?: string;
  option1?: string;
};

type Props = {
  productId: number;
  variant: Variant;
  onDone: () => void;
};

const BASE = "https://luana-unpenetrative-fumiko.ngrok-free.dev/api";

export default function VariantForm({ productId, variant, onDone }: Props) {
  const [form, setForm] = useState({
    title: variant.title ?? "",
    option1: variant.option1 ?? "",
    sku: variant.sku ?? "",
    price: variant.price ?? "",
  });

  const submit = async () => {
    await fetch(
      `${BASE}/products/${productId}/variants/${variant.id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
        body: JSON.stringify(form),
      }
    );

    onDone();
  };

  return (
    <section className={styles.form}>
      <h3>Edit Variant #{variant.id}</h3>

      <label>
        Title
        <input
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />
      </label>

      <label>
        Option
        <input
          value={form.option1}
          onChange={(e) =>
            setForm({ ...form, option1: e.target.value })
          }
        />
      </label>

      <label>
        SKU
        <input
          value={form.sku}
          onChange={(e) =>
            setForm({ ...form, sku: e.target.value })
          }
        />
      </label>

      <label>
        Price
        <input
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />
      </label>

      <div className={styles.actions}>
        <button
          className={styles.primaryButton}
          onClick={submit}
        >
          Update
        </button>

        <button
          className={styles.cancelButton}
          onClick={onDone}
        >
          Cancel
        </button>
      </div>
    </section>
  );
}
