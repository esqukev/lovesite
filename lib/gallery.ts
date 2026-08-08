import { GATE_KEY_STORAGE, GATE_PASSWORDS } from "@/lib/data";

export { GATE_KEY_STORAGE };
export const GALLERY_PREFIX = "gallery/";

export type GalleryPhoto = {
  src: string;
  alt: string;
  uploadedAt?: string;
  remote?: boolean;
};

export function isValidGateKey(password: string | null | undefined) {
  if (!password) return false;
  return Boolean(GATE_PASSWORDS[password.trim().toLowerCase()]);
}

export function getStoredGateKey() {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(GATE_KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
}
