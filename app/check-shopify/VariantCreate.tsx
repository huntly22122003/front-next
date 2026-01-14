"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Props = {
  productId: number;
  onDone: () => void;
  onCancel: () => void;
};

const BASE = "https://luana-unpenetrative-fumiko.ngrok-free.dev/api";

export default function VariantCreate({ productId, onDone, onCancel }: Props) {
  const [form, setForm] = useState({
    title: "",
    option1: "",
    sku: "",
    price: "",
  });

  const submit = async () => {
    await fetch(`${BASE}/products/${productId}/variants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
      body: JSON.stringify(form),
    });

    onDone();
  };

  return (
    <section className={styles.form}>
      <h3>Create Variant for Product #{productId}</h3>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Option"
        value={form.option1}
        onChange={(e) => setForm({ ...form, option1: e.target.value })}
      />

      <input
        placeholder="SKU"
        value={form.sku}
        onChange={(e) => setForm({ ...form, sku: e.target.value })}
      />

      <input
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <div className={styles.actions}>
        <button className={styles.primaryButton} onClick={submit}>
          Create
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </section>
  );
}
