"use client";

import { useState } from "react";
import CheckShopifyClient from "./CheckShopifyClient";
import BulkExport from "./BulkExport";
import BulkImport from "./BulkImport";
import styles from "./page.module.css";

export default function Page() {
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);

  return (
    <main className={styles.container}>
      <CheckShopifyClient
        onToggleExport={() => setShowExport(v => !v)}
        onToggleImport={() => setShowImport(v => !v)}
      />

      {showExport && (
        <section className={styles.section}>
          <BulkExport
            exportUrl="https://luana-unpenetrative-fumiko.ngrok-free.dev/bulk/products/export"
            searchUrl="https://luana-unpenetrative-fumiko.ngrok-free.dev/bulk/products/search"
          />
        </section>
      )}

      {showImport && (
        <section className={styles.section}>
          <BulkImport
            importUrl="https://luana-unpenetrative-fumiko.ngrok-free.dev/api/bulk/products/import"
          />
        </section>
      )}
    </main>
  );
}
