import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const el = document.getElementById("root");
if (!el) throw new Error("#root not found");

// 중복 마운트 가드
if (!(el as any)._bootstrapped) {
  (el as any)._bootstrapped = true;
  createRoot(el).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// HMR 수용
if (import.meta && (import.meta as any).hot) {
  (import.meta as any).hot.accept();
}
