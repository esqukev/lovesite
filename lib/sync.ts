import { GATE_KEY_STORAGE, GATE_PASSWORDS } from "@/lib/data";

export { GATE_KEY_STORAGE };

export const NOTES_BLOB_PATH = "shared/sticky-notes.json";
export const WISHLIST_BLOB_PATH = "shared/wishlist.json";

export type SyncNote = {
  id: string;
  text: string;
  color: string;
  rotate: number;
  x: number;
  y: number;
  z: number;
};

export type NotesPayload = {
  version: 4;
  updatedAt: string;
  notes: SyncNote[];
};

export type WishlistPayload = {
  version: 2;
  updatedAt: string;
  checked: Record<string, boolean>;
  custom: { id: string; label: string; custom?: boolean }[];
};

export const SEED_NOTES: SyncNote[] = [
  {
    id: "seed-1",
    text: "Te pienso más de lo que admito.",
    color: "#ffd9e2",
    rotate: -4,
    x: 4,
    y: 22,
    z: 1,
  },
  {
    id: "seed-2",
    text: "Gracias por ser mi lugar seguro.",
    color: "#fff4c8",
    rotate: 3,
    x: 78,
    y: 30,
    z: 2,
  },
  {
    id: "seed-3",
    text: "Hoy también te elijo.",
    color: "#d9f0e4",
    rotate: -2,
    x: 8,
    y: 68,
    z: 3,
  },
];

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

export function defaultNotesPayload(): NotesPayload {
  return {
    version: 4,
    updatedAt: new Date(0).toISOString(),
    notes: SEED_NOTES,
  };
}

export function defaultWishlistPayload(): WishlistPayload {
  return {
    version: 2,
    updatedAt: new Date(0).toISOString(),
    checked: {},
    custom: [],
  };
}
