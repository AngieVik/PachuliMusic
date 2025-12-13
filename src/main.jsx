import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Buffer } from "buffer";
window.Buffer = Buffer;
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {" "}
      {/* <--- 2. Importante: Envolver la App aquí */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
