"use client";

import { useEffect, useState } from "react";
import {Page, Card, DataTable, SkeletonBodyText, SkeletonDisplayText,} from "@shopify/polaris";

type Order = {
  shopify_order_id: number;
  email?: string;
  total_price: string;
  currency: string;
  financial_status: string;
  received_at: string;
};

export default function OrderWebhooks() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://luana-unpenetrative-fumiko.ngrok-free.dev/api/order-webhooks", {
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("ORDERS FROM API:", data);
        setOrders(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const rows = orders.map((order) => [`#${order.shopify_order_id}`, order.email ?? "-",`${order.total_price} ${order.currency}`, order.financial_status, order.received_at,]);

  return (
    <Page title="Order Webhooks">
      <Card>
        {loading ? (
          <>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={6} />
          </>
        ) : (
          <DataTable
            columnContentTypes={["text", "text", "text", "text", "text"]}
            headings={[
              "Order ID",
              "Email",
              "Total",
              "Financial",
              "Received At",
            ]}
            rows={rows}
          />
        )}
      </Card>
    </Page>
  );
}
