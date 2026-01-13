"use client";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("https://luana-unpenetrative-fumiko.ngrok-free.dev/hello")
      .then(async (res) => {
        const text = await res.text();
        console.log("Raw response:", text);

        try {
          const data = JSON.parse(text); // parse JSON nếu đúng
          setMsg(data.message);
        } catch (e) {
          // nếu không phải JSON thì hiển thị raw text
          setMsg(text);
        }
      })
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <main style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎉 Welcome to Next.js 16!</h1>
      <p>Laravel backend trả về: {msg}</p>
    </main>
  );
}