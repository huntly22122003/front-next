"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import ProductsCreate from "./ProductsCreate";
import ProductsUpdate from "./ProductsUpdate";
import VariantPanel from "./VariantPanel";
import VariantCreate from "./VariantCreate";

type Variant = {
  price?: string;
};

type Product = {
  id: number;
  title: string;
  vendor?: string;
  variants?: Variant[];
  preorder_enabled: boolean;
};

type Props = {
  productsUrl: string;
};

const API_BASE = "https://luana-unpenetrative-fumiko.ngrok-free.dev";

export default function ProductsPanel({ productsUrl }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [openVariants, setOpenVariants] = useState<number | null>(null);
  const [createVariantFor, setCreateVariantFor] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // =============================
  // SOFT DELETE (GIỮ NGUYÊN)
  // =============================
  const softDelete = async (id: number) => {
    if (!confirm("Soft delete product này?")) return;

    const res = await fetch(`${API_BASE}/api/products/soft`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      alert("Soft delete failed");
      return;
    }

    loadProducts();
  };

  // =============================
  // GET PREORDER STATUS
  // =============================
  const fetchPreorderStatus = async (productId: number): Promise<boolean> => {
    try {
      const res = await fetch(
        `${API_BASE}/api/preorder/status?product_id=${productId}`,
        {
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          credentials: "include",
        }
      );

      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data.enabled);
    } catch {
      return false;
    }
  };

  // =============================
  // LOAD PRODUCTS + PREORDER
  // =============================
  const loadProducts = async () => {
    setLoading(true);

    const res = await fetch(productsUrl, {
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
    });

    const data = await res.json();
    const baseProducts = data.products ?? [];

    const enriched = await Promise.all(
      baseProducts.map(async (p: any) => ({
        ...p,
        preorder_enabled: await fetchPreorderStatus(p.id),
      }))
    );

    setProducts(enriched);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [productsUrl]);

  // =============================
  // TOGGLE PREORDER
  // =============================
  const togglePreorder = async (product: Product) => {
    const enabled = !product.preorder_enabled;
    setTogglingId(product.id);

    // optimistic UI
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, preorder_enabled: enabled } : p
      )
    );

    const res = await fetch(`${API_BASE}/api/preorder/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
      body: JSON.stringify({
        product_id: product.id,
        enabled,
      }),
    });

    setTogglingId(null);

    if (!res.ok) {
      alert("Toggle preorder failed");
      loadProducts(); // rollback
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <section className={styles.section}>
      <h2>📦 Products</h2>

      {editingProduct && (
        <ProductsUpdate
          product={{
            id: editingProduct.id,
            title: editingProduct.title,
            price: editingProduct.variants?.[0]?.price,
          }}
          updateUrl={`${API_BASE}/api/products/update`}
          onUpdated={() => {
            setEditingProduct(null);
            loadProducts();
          }}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {openVariants && (
        <VariantPanel
          productId={openVariants}
          onClose={() => setOpenVariants(null)}
        />
      )}

      {createVariantFor && (
        <VariantCreate
          productId={createVariantFor}
          onDone={() => setCreateVariantFor(null)}
          onCancel={() => setCreateVariantFor(null)}
        />
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Preorder</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td>{p.variants?.[0]?.price ?? "-"}</td>

              <td>
                <button
                  className={
                    p.preorder_enabled
                      ? styles.preorderOn
                      : styles.preorderOff
                  }
                  disabled={togglingId === p.id}
                  onClick={() => togglePreorder(p)}
                >
                  {togglingId === p.id
                    ? "..."
                    : p.preorder_enabled
                    ? "ON"
                    : "OFF"}
                </button>
              </td>

              <td>
                <button
                  className={styles.actionButton}
                  onClick={() => setEditingProduct(p)}
                >
                  ✏ Edit
                </button>

                <button
                  className={styles.actionButton}
                  onClick={() => setOpenVariants(p.id)}
                >
                  📦 Variants
                </button>

                <button
                  className={styles.softDeleteButton}
                  onClick={() => softDelete(p.id)}
                >
                  🗑 Soft Delete
                </button>

                <button
                  className={styles.primaryButton}
                  onClick={() => setCreateVariantFor(p.id)}
                >
                  ➕ Variant
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
