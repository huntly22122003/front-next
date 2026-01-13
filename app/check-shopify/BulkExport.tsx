"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export type Product = {
  id: number;
  title: string;
  vendor?: string;
  variants?: {
    price: string;
  }[];
};

type BulkExportProps = {
  exportUrl: string;
  searchUrl: string;
};

export default function BulkExport({
  exportUrl,
  searchUrl,
}: BulkExportProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const url =
        keyword.trim() === ""
          ? exportUrl
          : `${searchUrl}?q=${encodeURIComponent(keyword)}&limit=${limit}`;

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (Array.isArray(data)) setProducts(data);
      else if (Array.isArray(data.data)) setProducts(data.data);
      else setProducts([]);
    } catch (err) {
      console.error(err);
      setError("❌ Không load được products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📦 Bulk Export Products</h2>
      </div>

      {/* SEARCH */}
      <div className={styles.controls}>
        <input
          className={styles.input}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search title or vendor"
        />
        <input
          className={styles.input}
          type="number"
          value={limit}
          min={1}
          max={250}
          onChange={(e) => setLimit(Number(e.target.value))}
        />
        <button className={styles.button} onClick={fetchProducts}>
          Search
        </button>
      </div>

      {/* STATUS */}
      {loading && <p className={styles.loading}>Loading products...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {/* TABLE */}
      {!loading && products.length > 0 && (
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
                  <td>{p.variants?.[0]?.price ?? "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className={styles.empty}>No products found.</p>
      )}
    </section>
  );
}
