"use client";

import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SEED_NOTES,
  getStoredGateKey,
  type SyncNote,
} from "@/lib/sync";
import { useExperience } from "./ExperienceProvider";
import { SectionReveal } from "./SectionReveal";

type Note = SyncNote;

type NotesContextValue = {
  notes: Note[];
  ready: boolean;
  draft: string;
  setDraft: (v: string) => void;
  addNote: (e: FormEvent) => void;
  removeNote: (id: string) => void;
  updateText: (id: string, text: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  draggingId: string | null;
  bringFront: (id: string) => void;
  onPointerDown: (e: ReactPointerEvent, note: Note) => void;
};

const STORAGE_KEY = "motzy-sticky-notes-v4";

const NOTE_COLORS = [
  "#fff4c8",
  "#ffd9e2",
  "#d9f0e4",
  "#ffe4cc",
  "#fce8d8",
  "#f5e6ee",
];

const NotesContext = createContext<NotesContextValue | null>(null);

function readLocalNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_NOTES;
    const parsed = JSON.parse(raw) as { version?: number; notes?: Note[] };
    if (parsed?.version === 4 && Array.isArray(parsed.notes)) {
      return parsed.notes;
    }
    return SEED_NOTES;
  } catch {
    return SEED_NOTES;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function useNotesContext() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("Sticky notes context missing");
  return ctx;
}

export function StickyNotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [topZ, setTopZ] = useState(10);
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const skipNextSave = useRef(true);
  const syncedAt = useRef("");
  const dirty = useRef(false);
  const saveTimer = useRef<number | null>(null);

  const persistCloud = useCallback(async (nextNotes: Note[]) => {
    const password = getStoredGateKey();
    if (!password) return;
    try {
      const res = await fetch("/api/sync/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, notes: nextNotes }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { updatedAt?: string };
      if (data.updatedAt) syncedAt.current = data.updatedAt;
      dirty.current = false;
    } catch {
      /* offline / blob missing — local still works */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const local = readLocalNotes();
      try {
        const res = await fetch("/api/sync/notes", { cache: "no-store" });
        const data = (await res.json()) as {
          configured?: boolean;
          notes?: Note[];
          updatedAt?: string;
        };

        if (cancelled) return;

        const remote = Array.isArray(data.notes) ? data.notes : null;
        const remoteFresh =
          Boolean(data.updatedAt) &&
          data.updatedAt !== new Date(0).toISOString() &&
          remote !== null;

        if (remoteFresh && remote) {
          setNotes(remote);
          setTopZ(Math.max(10, ...remote.map((n) => n.z), 0) + 1);
          syncedAt.current = data.updatedAt ?? "";
        } else {
          setNotes(local);
          setTopZ(Math.max(10, ...local.map((n) => n.z), 0) + 1);
          if (data.configured && getStoredGateKey()) {
            void persistCloud(local);
          }
        }
      } catch {
        if (cancelled) return;
        setNotes(local);
        setTopZ(Math.max(10, ...local.map((n) => n.z), 0) + 1);
      } finally {
        if (!cancelled) {
          skipNextSave.current = true;
          setReady(true);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [persistCloud]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 4, notes }),
    );

    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    dirty.current = true;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      void persistCloud(notes);
    }, 600);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [notes, ready, persistCloud]);

  useEffect(() => {
    if (!ready) return;

    const poll = window.setInterval(async () => {
      if (dirty.current || dragRef.current || document.hidden) return;
      try {
        const res = await fetch("/api/sync/notes", { cache: "no-store" });
        const data = (await res.json()) as {
          notes?: Note[];
          updatedAt?: string;
        };
        if (
          data.updatedAt &&
          data.updatedAt !== syncedAt.current &&
          Array.isArray(data.notes)
        ) {
          skipNextSave.current = true;
          syncedAt.current = data.updatedAt;
          setNotes(data.notes);
          setTopZ(Math.max(10, ...data.notes.map((n) => n.z), 0) + 1);
        }
      } catch {
        /* ignore poll errors */
      }
    }, 12_000);

    return () => window.clearInterval(poll);
  }, [ready]);

  const bringFront = useCallback((id: string) => {
    setTopZ((z) => {
      const nextZ = z + 1;
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, z: nextZ } : n)),
      );
      return nextZ;
    });
  }, []);

  const addNote = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const text = draft.trim();
      if (!text) return;

      // Spawn near viewport center so it's visible immediately
      const x = clamp(((window.innerWidth / 2 - 84) / window.innerWidth) * 100, 2, 88);
      const y = clamp(((window.innerHeight / 2 - 60) / window.innerHeight) * 100, 2, 88);

      setTopZ((z) => {
        const nextZ = z + 1;
        setNotes((prev) => [
          ...prev,
          {
            id: `note-${Date.now()}`,
            text,
            color: NOTE_COLORS[prev.length % NOTE_COLORS.length],
            rotate: (Math.random() - 0.5) * 8,
            x,
            y,
            z: nextZ,
          },
        ]);
        return nextZ;
      });
      setDraft("");
    },
    [draft],
  );

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setEditingId((cur) => (cur === id ? null : cur));
  }, []);

  const updateText = useCallback((id: string, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  }, []);

  const moveNote = useCallback((id: string, clientX: number, clientY: number) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== id) return;

    const x = clamp(
      ((clientX - drag.offsetX) / Math.max(window.innerWidth, 1)) * 100,
      0,
      88,
    );
    const y = clamp(
      ((clientY - drag.offsetY) / Math.max(window.innerHeight, 1)) * 100,
      0,
      88,
    );

    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }, []);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent, note: Note) => {
      if (editingId === note.id) return;
      const target = e.target as HTMLElement;
      if (target.closest("button, textarea")) return;

      const noteLeft = (note.x / 100) * window.innerWidth;
      const noteTop = (note.y / 100) * window.innerHeight;

      dragRef.current = {
        id: note.id,
        offsetX: e.clientX - noteLeft,
        offsetY: e.clientY - noteTop,
      };
      setDraggingId(note.id);
      bringFront(note.id);
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [bringFront, editingId],
  );

  useEffect(() => {
    if (!draggingId) return;

    const onMove = (e: PointerEvent) => {
      moveNote(draggingId, e.clientX, e.clientY);
    };
    const onUp = () => {
      dragRef.current = null;
      setDraggingId(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [draggingId, moveNote]);

  const value = useMemo<NotesContextValue>(
    () => ({
      notes,
      ready,
      draft,
      setDraft,
      addNote,
      removeNote,
      updateText,
      editingId,
      setEditingId,
      draggingId,
      bringFront,
      onPointerDown,
    }),
    [
      notes,
      ready,
      draft,
      addNote,
      removeNote,
      updateText,
      editingId,
      draggingId,
      bringFront,
      onPointerDown,
    ],
  );

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

/** Composer section — notes float fixed over the viewport */
export function StickyNotes() {
  const { notes, draft, setDraft, addNote } = useNotesContext();

  return (
    <section className="section-soft relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
      <div className="pointer-events-none absolute inset-0 sticky-board" aria-hidden />

      <SectionReveal className="relative z-[3] mx-auto max-w-xl text-center">
        <p
          data-reveal
          className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]"
        >
          Nuestros papelitos
        </p>
        <h2
          data-reveal
          className="mt-3 font-display text-4xl text-[var(--ink)] sm:text-5xl"
        >
          Notitas
        </h2>
        <p
          data-reveal
          className="muted mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base"
        >
          Pega una nota y ponla donde quieras en la pantalla. Se sincroniza
          entre el celular y la compu.
        </p>

        <form
          data-reveal
          onSubmit={addNote}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            maxLength={140}
            placeholder="Escribe algo bonito…"
            className="min-h-[52px] flex-1 resize-none rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-[var(--ink)] shadow-sm outline-none ring-[var(--accent)]/30 placeholder:text-[var(--muted)] focus:ring-2"
          />
          <button
            type="submit"
            data-cursor="hover"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--ink)] px-5 py-3 text-sm text-[var(--cream)] transition hover:bg-[var(--accent)]"
          >
            <Plus size={16} />
            Pegar
          </button>
        </form>

        <p data-reveal className="muted mt-6 text-xs">
          {notes.length} notita{notes.length === 1 ? "" : "s"} · fijas en
          pantalla · doble click para editar
        </p>
      </SectionReveal>
    </section>
  );
}

/** Viewport-fixed notes — immune to Pedacitos pin / page scroll */
export function StickyNotesLayer() {
  const { lightboxOpen } = useExperience();
  const {
    notes,
    editingId,
    setEditingId,
    draggingId,
    bringFront,
    removeNote,
    updateText,
    onPointerDown,
  } = useNotesContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || lightboxOpen) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[42] overflow-hidden">
      {notes.map((note) => {
        const editing = editingId === note.id;
        const dragging = draggingId === note.id;
        return (
          <article
            key={note.id}
            className={cn(
              "sticky-note pointer-events-auto",
              dragging && "is-dragging",
              editing && "is-editing",
            )}
            style={{
              position: "fixed",
              left: `${note.x}vw`,
              top: `${note.y}vh`,
              zIndex: 42 + note.z,
              background: note.color,
              ["--note-rotate" as string]: `${note.rotate}deg`,
            }}
            onPointerDown={(e) => onPointerDown(e, note)}
            onDoubleClick={() => setEditingId(note.id)}
          >
            <span className="sticky-tape" aria-hidden />

            <div className="absolute right-1 top-1 flex gap-0.5">
              <button
                type="button"
                data-cursor="hover"
                aria-label="Editar nota"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(note.id);
                  bringFront(note.id);
                }}
                className="rounded-full p-1 text-[#3a2a30]/35 transition hover:bg-black/5 hover:text-[#3a2a30]/70"
              >
                <Pencil size={12} />
              </button>
              <button
                type="button"
                data-cursor="hover"
                aria-label="Quitar nota"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNote(note.id);
                }}
                className="rounded-full p-1 text-[#3a2a30]/35 transition hover:bg-black/5 hover:text-[#3a2a30]/70"
              >
                <Trash2 size={12} />
              </button>
            </div>

            {editing ? (
              <textarea
                autoFocus
                value={note.text}
                maxLength={140}
                onChange={(e) => updateText(note.id, e.target.value)}
                onBlur={() => {
                  if (!note.text.trim()) removeNote(note.id);
                  else setEditingId(null);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Escape" ||
                    (e.key === "Enter" && !e.shiftKey)
                  ) {
                    e.preventDefault();
                    (e.target as HTMLTextAreaElement).blur();
                  }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="mt-1 w-full resize-none bg-transparent font-letter text-[17px] leading-snug text-[#3a2a30] outline-none sm:text-[18px]"
                rows={4}
              />
            ) : (
              <p className="pr-1 pt-1 font-letter text-[17px] leading-snug text-[#3a2a30] sm:text-[18px]">
                {note.text}
              </p>
            )}
          </article>
        );
      })}
    </div>,
    document.body,
  );
}
