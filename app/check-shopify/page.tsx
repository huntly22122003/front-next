"use client";

import { useState } from "react";
import CheckShopifyClient from "./CheckShopifyClient";
import BulkExport from "./BulkExport";
import BulkImport from "./BulkImport";
import ProductsPanel from "./ProductsPanel";
import styles from "./page.module.css";

type View = "products" | "import" | "export" | null;

export default function Page() {
  const [view, setView] = useState<View>(null); // Not running any view

  return (
    <main className={styles.container}>
      <CheckShopifyClient
        onShowProducts={() => setView(v => (v === "products" ? null : "products"))} //if (view=== products) setView(null) else setView(products);
        onToggleImport={() => setView(v => (v === "import" ? null : "import"))} // Turn of import
        onToggleExport={() => setView(v => (v === "export" ? null : "export"))}
      />

      {view === "products" && (
        <section className={styles.section}>
          <ProductsPanel
            productsUrl="https://luana-unpenetrative-fumiko.ngrok-free.dev/api/products"
          />
        </section>
      )}

      {view === "export" && (
        <section className={styles.section}>
          <BulkExport
            exportUrl="https://luana-unpenetrative-fumiko.ngrok-free.dev/bulk/products/export"
            searchUrl="https://luana-unpenetrative-fumiko.ngrok-free.dev/bulk/products/search"
          />
        </section>
      )}

      {view === "import" && (
        <section className={styles.section}>
          <BulkImport
            importUrl="https://luana-unpenetrative-fumiko.ngrok-free.dev/api/bulk/products/import"
          />
        </section>
      )}
    </main>
  );
}
