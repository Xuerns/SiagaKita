export { cn } from "cn";

export function getUserInitials(name?: string | null, fallback = "WG"): string {
  if (!name) return fallback;
  const words = name.trim().split(/\s+/);
  if (words.length === 0 || !words[0]) return fallback;
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function getUserRoleLabel(
  user?: { role?: string; is_anonymous?: boolean } | null,
  isGuest?: boolean
): string {
  if (isGuest || user?.is_anonymous) return "Mode Tamu";
  return "Warga Siaga";
}
