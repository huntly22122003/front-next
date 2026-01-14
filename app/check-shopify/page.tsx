"use client";

import { useState } from "react";
import CheckShopifyClient from "./CheckShopifyClient";
import BulkExport from "./BulkExport";
import BulkImport from "./BulkImport";
import ProductsPanel from "./ProductsPanel";
import HardDeletePanel from "./HardDeletePanel";
import styles from "./page.module.css";

type View = "products" | "import" | "export" | "hardDelete" | null;

export default function Page() {
  const [view, setView] = useState<View>(null);

  return (
    <main className={styles.container}>
      <CheckShopifyClient
        onShowProducts={() =>
          setView((v) => (v === "products" ? null : "products"))
        }
        onToggleImport={() =>
          setView((v) => (v === "import" ? null : "import"))
        }
        onToggleExport={() =>
          setView((v) => (v === "export" ? null : "export"))
        }
        onShowHardDelete={() =>
          setView((v) => (v === "hardDelete" ? null : "hardDelete"))
        }
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

      {view === "hardDelete" && (
        <section className={styles.section}>
          <HardDeletePanel />
        </section>
      )}
    </main>
  );
}
