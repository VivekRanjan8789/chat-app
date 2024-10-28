import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/Auth";

createRoot(document.getElementById("root")).render(
  <StrictMode>
   <AuthProvider>
    <BrowserRouter>
        <App />
        <Toaster closeButton />
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
