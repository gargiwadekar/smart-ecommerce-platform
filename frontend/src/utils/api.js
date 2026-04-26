// Centralized API URL for frontend

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smart-ecommerce-platform-production.up.railway.app/api";

if (!import.meta.env.VITE_API_URL) {
  console.warn(
    "⚠️ VITE_API_URL not found. Using Railway production API."
  );
}

export default API_URL;