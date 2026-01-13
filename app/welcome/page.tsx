"use client";

import { useEffect, useState } from "react";

export default function WelcomePage() {
  const [msg, setMsg] = useState("loading...");

  useEffect(() => {
    fetch("https://luana-unpenetrative-fumiko.ngrok-free.dev/hello", {
      method: "GET",
      headers: {
        // 🔥 BẮT BUỘC cho ngrok free
        "ngrok-skip-browser-warning": "true",
        "Accept": "application/json",
      },
      credentials: "include",
    })
      .then(async (res) => {
        const text = await res.text();
        console.log("Raw response:", text);

        try {
          const json = JSON.parse(text);
          setMsg(json.message);
        } catch {
          setMsg("❌ Không phải JSON (ngrok đang chặn)");
        }
      })
      .catch((err) => {
        console.error("API error:", err);
        setMsg("❌ Fetch failed");
      });
  }, []);

  return (
    <main style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎉 Welcome to Next.js</h1>
      <p>Laravel backend trả về:</p>
      <b>{msg}</b>
    </main>
  );
}
