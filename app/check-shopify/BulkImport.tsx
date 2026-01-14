"use client";

import { useState } from "react";
import styles from "./page.module.css";

type BulkImportProps = {
  importUrl: string;
};

export default function BulkImport({ importUrl }: BulkImportProps) {
  const [productsJson, setProductsJson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImport = async () => {
    let products: any[];

    // ✅ Parse ONCE
    try {
      products = JSON.parse(productsJson);
      if (!Array.isArray(products)) {
        throw new Error("Products must be an array");
      }
    } catch {
      setError("❌ Invalid JSON format (must be an array)");
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(importUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json", // ⭐ QUAN TRỌNG
        },
        body: JSON.stringify({ products: productsJson, }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        throw new Error(`HTTP ${res.status}`);
      }

      setSuccess("✅ Import successful");
      setProductsJson("");
    } catch (err) {
      console.error(err);
      setError("❌ Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>📥 Bulk Import Products</h2>

      <textarea
        className={styles.textarea}
        rows={8}
        value={productsJson}
        onChange={(e) => setProductsJson(e.target.value)}
        placeholder='[{"title":"Product 1","vendor":"Vendor A"}]'
      />

      <button
        className={styles.button}
        onClick={handleImport}
        disabled={loading}
        style={{ marginTop: 8 }}
      >
        {loading ? "Importing..." : "Import Products"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </section>
  );
}
