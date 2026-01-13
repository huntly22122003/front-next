"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import BulkExport from "./BulkExport";

type SessionData = {
  shop: string;
  data: any;
};

export default function CheckShopifyClient() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      .catch((err) => {
        console.error(err);
        setError("❌ Không lấy được Shopify session");
        setLoading(false);
      });
  }, []);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>🛍 Shopify Session</h1>

      {loading && <p className={styles.loading}>Loading session...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {session && (
        <>
          {/* SESSION INFO */}
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.label}>Shop:</span>
              <span className={styles.value}>{session.shop}</span>
            </div>

            <div className={styles.jsonBox}>
              <pre>{JSON.stringify(session.data, null, 2)}</pre>
            </div>
          </div>

          {/* SPA EXPORT */}
          <BulkExport
            exportUrl="https://luana-unpenetrative-fumiko.ngrok-free.dev/bulk/products/export"
            searchUrl="https://luana-unpenetrative-fumiko.ngrok-free.dev/bulk/products/search"
          />
        </>
      )}
    </main>
  );
}
