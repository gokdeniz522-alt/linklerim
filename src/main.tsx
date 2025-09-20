import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import '@uploadcare/react-uploader/core.css';

createRoot(document.getElementById("root")!).render(
    <ThemeProvider 
        attribute="class"
        defaultTheme="light" 
        storageKey="vite-ui-theme"
        enableSystem
        disableTransitionOnChange
    >
        <App />
    </ThemeProvider>
);