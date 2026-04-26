// Centralized API URL for frontend. Prefer explicit VITE_API_URL in production.
const API_URL = import.meta.env.VITE_API_URL || "/api";

if (!import.meta.env.VITE_API_URL) {
	// runtime fallback; keep app running but log helpful hint
	console.warn("⚠️ VITE_API_URL not set. Using relative '/api' fallback. Set VITE_API_URL for production deployments.");
}

export default API_URL;
