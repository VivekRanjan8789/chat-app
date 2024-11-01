import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/Auth";
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AuthProvider>
    <SocketProvider>
      <BrowserRouter>
        <App />
        <Toaster closeButton />
      </BrowserRouter>
    </SocketProvider>
  </AuthProvider>
  // </StrictMode>
);
