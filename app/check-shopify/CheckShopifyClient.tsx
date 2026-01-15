"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type SessionData = {
  shop: string;
  data: any;
};

type Props = {
  onShowProducts: () => void;
  onToggleExport: () => void;
  onToggleImport: () => void;
  onShowHardDelete: () => void;
  onShowOrderWebhooks: () =>void;
  onCreateProduct: () => void;
};

export default function CheckShopifyClient({
  onShowProducts,
  onToggleExport,
  onToggleImport,
  onShowHardDelete,
  onShowOrderWebhooks,
  onCreateProduct,
}: Props) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      "https://luana-unpenetrative-fumiko.ngrok-free.dev/shopify/session-nextjs",
      {
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSession(data);
        setLoading(false);
      })
      .catch(() => {
        setError("❌ Không lấy được Shopify session hoặc chưa chạy Backend");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1 className={styles.title}>🛍 Shopify Session</h1>

      {loading && <p className={styles.loading}>Loading session...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {session && (
        <>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.label}>Shop:</span>
              <span className={styles.value}>{session.shop}</span>
            </div>

            <div className={styles.jsonBox}>
              <pre>{JSON.stringify(session.data, null, 2)}</pre>
            </div>
          </div>

          <div className={styles.controls}>
            <button className={styles.button} onClick={onShowProducts}>
              🧾 Products
            </button>
            <button className={styles.button} onClick={onCreateProduct}>
              ➕ New Product
            </button>
            <button className={styles.button} onClick={onToggleExport}>
              📦 Bulk Export
            </button>
            <button className={styles.button} onClick={onToggleImport}>
              📥 Bulk Import
            </button>
            <button className={styles.button} onClick={onShowOrderWebhooks}>
              📡 Order Webhooks
            </button>
            <button  className={styles.dangerButton} onClick={onShowHardDelete}>
              🔥 Hard Delete
            </button>
          </div>
        </>
      )}
    </>
  );
}
