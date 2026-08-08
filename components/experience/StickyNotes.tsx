"use client";

import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Note = {
  id: string;
  text: string;
  color: string;
  rotate: number;
  x: number;
  y: number;
  z: number;
};

type Store = {
  version: 2;
  notes: Note[];
};

const STORAGE_KEY = "motzy-sticky-notes-v2";

const NOTE_COLORS = [
  "#fff4c8",
  "#ffd9e2",
  "#d9f0e4",
  "#ffe4cc",
  "#fce8d8",
  "#f5e6ee",
];

const SEED_NOTES: Note[] = [
  {
    id: "seed-1",
    text: "Te pienso más de lo que admito.",
    color: "#ffd9e2",
    rotate: -4,
    x: 6,
    y: 28,
    z: 1,
  },
  {
    id: "seed-2",
    text: "Gracias por ser mi lugar seguro.",
    color: "#fff4c8",
    rotate: 3,
    x: 72,
    y: 22,
    z: 2,
  },
  {
    id: "seed-3",
    text: "Hoy también te elijo.",
    color: "#d9f0e4",
    rotate: -2,
    x: 12,
    y: 62,
    z: 3,
  },
];

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 2, notes: SEED_NOTES };
    const parsed = JSON.parse(raw) as Store;
    if (parsed?.version === 2 && Array.isArray(parsed.notes)) {
      return parsed;
    }
    return { version: 2, notes: SEED_NOTES };
  } catch {
    return { version: 2, notes: SEED_NOTES };
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function StickyNotes() {
  const boardRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const store = readStore();
    setNotes(store.notes);
    setTopZ(Math.max(10, ...store.notes.map((n) => n.z), 0) + 1);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 2, notes } satisfies Store),
    );
  }, [notes, ready]);

  const addNote = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setNotes((prev) => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        text,
        color: NOTE_COLORS[prev.length % NOTE_COLORS.length],
        rotate: (Math.random() - 0.5) * 8,
        x: 30 + Math.random() * 28,
        y: 35 + Math.random() * 25,
        z: nextZ,
      },
    ]);
    setDraft("");
  };

  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateText = (id: string, text: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text } : n)),
    );
  };

  const bringFront = (id: string) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, z: nextZ } : n)),
    );
  };

  const onPointerDown = (e: ReactPointerEvent, note: Note) => {
    if (editingId === note.id) return;
    const target = e.target as HTMLElement;
    if (target.closest("button, textarea")) return;

    const board = boardRef.current;
    if (!board) return;

    const rect = board.getBoundingClientRect();
    const noteLeft = (note.x / 100) * rect.width;
    const noteTop = (note.y / 100) * rect.height;

    dragRef.current = {
      id: note.id,
      offsetX: e.clientX - rect.left - noteLeft,
      offsetY: e.clientY - rect.top - noteTop,
    };
    setDraggingId(note.id);
    bringFront(note.id);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const drag = dragRef.current;
    const board = boardRef.current;
    if (!drag || !board) return;

    const rect = board.getBoundingClientRect();
    const xPx = e.clientX - rect.left - drag.offsetX;
    const yPx = e.clientY - rect.top - drag.offsetY;
    const x = clamp((xPx / rect.width) * 100, 0, 82);
    const y = clamp((yPx / rect.height) * 100, 0, 82);

    setNotes((prev) =>
      prev.map((n) => (n.id === drag.id ? { ...n, x, y } : n)),
    );
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDraggingId(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  return (
    <section className="section-soft relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
      <div className="pointer-events-none absolute inset-0 sticky-board" aria-hidden />

      <div className="relative z-[3] mx-auto max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
          Nuestros papelitos
        </p>
        <h2 className="mt-3 font-display text-4xl text-[var(--ink)] sm:text-5xl">
          Notitas
        </h2>
        <p className="muted mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base">
          Escribe, arrastra y deja cada nota donde quieras. Se guardan aquí.
        </p>

        <form
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
      </div>

      <div
        ref={boardRef}
        className="relative z-[2] mx-auto mt-10 min-h-[520px] w-full max-w-5xl sm:min-h-[580px]"
      >
        {notes.map((note) => {
          const editing = editingId === note.id;
          const dragging = draggingId === note.id;
          return (
            <article
              key={note.id}
              className={cn(
                "sticky-note",
                dragging && "is-dragging",
                editing && "is-editing",
              )}
              style={{
                left: `${note.x}%`,
                top: `${note.y}%`,
                zIndex: note.z,
                background: note.color,
                ["--note-rotate" as string]: `${note.rotate}deg`,
              }}
              onPointerDown={(e) => onPointerDown(e, note)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
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
                    if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) {
                      e.preventDefault();
                      (e.target as HTMLTextAreaElement).blur();
                    }
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="mt-1 w-full resize-none bg-transparent font-letter text-[15px] leading-snug text-[#3a2a30] outline-none"
                  rows={4}
                />
              ) : (
                <p className="pr-1 pt-1 font-letter text-[15px] leading-snug text-[#3a2a30]">
                  {note.text}
                </p>
              )}
            </article>
          );
        })}

        {!notes.length && (
          <p className="muted absolute inset-0 flex items-center justify-center text-sm">
            Aún no hay notitas. Pega la primera ♡
          </p>
        )}
      </div>

      <p className="muted relative z-[3] mt-6 text-center text-xs">
        {notes.length} notita{notes.length === 1 ? "" : "s"} · arrastra · doble click
        para editar
      </p>
    </section>
  );
}
