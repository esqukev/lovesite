"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Note = {
  id: string;
  text: string;
  color: string;
  rotate: number;
  side: "left" | "right";
  top: number;
  custom?: boolean;
};

const STORAGE_KEY = "motzy-sticky-notes-v1";

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
    side: "left",
    top: 12,
  },
  {
    id: "seed-2",
    text: "Gracias por ser mi lugar seguro.",
    color: "#fff4c8",
    rotate: 3,
    side: "right",
    top: 22,
  },
  {
    id: "seed-3",
    text: "Hoy también te elijo.",
    color: "#d9f0e4",
    rotate: -2,
    side: "left",
    top: 48,
  },
];

function readNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_NOTES;
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) && parsed.length ? parsed : SEED_NOTES;
  } catch {
    return SEED_NOTES;
  }
}

function randomNoteLayout(index: number): Pick<Note, "color" | "rotate" | "side" | "top"> {
  return {
    color: NOTE_COLORS[index % NOTE_COLORS.length],
    rotate: (Math.random() - 0.5) * 10,
    side: index % 2 === 0 ? "left" : "right",
    top: 10 + ((index * 17) % 70),
  };
}

export function StickyNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setNotes(readNotes());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes, ready]);

  const boardNotes = useMemo(
    () => notes.filter((n) => n.side === "left" || n.side === "right"),
    [notes],
  );

  const addNote = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const layout = randomNoteLayout(notes.length);
    setNotes((prev) => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        text,
        custom: true,
        ...layout,
      },
    ]);
    setDraft("");
  };

  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <section className="section-soft relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
      <div className="pointer-events-none absolute inset-0 sticky-board" aria-hidden />

      {/* Edge notes */}
      <div className="pointer-events-none absolute inset-0 z-[2] hidden md:block">
        {boardNotes.map((note) => (
          <article
            key={`edge-${note.id}`}
            className={cn(
              "sticky-note pointer-events-auto absolute w-[150px] lg:w-[168px]",
              note.side === "left" ? "left-3 lg:left-6" : "right-3 lg:right-6",
            )}
            style={{
              top: `${note.top}%`,
              background: note.color,
              ["--note-rotate" as string]: `${note.rotate}deg`,
            }}
          >
            <span className="sticky-tape" aria-hidden />
            <p className="font-letter text-[15px] leading-snug text-[#3a2a30]">
              {note.text}
            </p>
            <button
              type="button"
              data-cursor="hover"
              aria-label="Quitar nota"
              onClick={() => removeNote(note.id)}
              className="absolute right-1.5 top-1.5 rounded-full p-1 text-[#3a2a30]/35 transition hover:bg-black/5 hover:text-[#3a2a30]/70"
            >
              <Trash2 size={12} />
            </button>
          </article>
        ))}
      </div>

      <div className="relative z-[3] mx-auto max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
          Nuestros papelitos
        </p>
        <h2 className="mt-3 font-display text-4xl text-[var(--ink)] sm:text-5xl">
          Notitas
        </h2>
        <p className="muted mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base">
          Deja una nota pegada a las orillas. Se queda aquí, para cuando vuelvas.
        </p>

        <form
          onSubmit={addNote}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            maxLength={120}
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

        {/* Mobile / center stack of notes */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:hidden">
          {notes.map((note) => (
            <article
              key={`stack-${note.id}`}
              className="sticky-note relative mx-auto w-full max-w-[220px] text-left"
              style={{
                background: note.color,
                ["--note-rotate" as string]: `${note.rotate * 0.4}deg`,
              }}
            >
              <span className="sticky-tape" aria-hidden />
              <p className="font-letter text-base leading-snug text-[#3a2a30]">
                {note.text}
              </p>
              <button
                type="button"
                data-cursor="hover"
                aria-label="Quitar nota"
                onClick={() => removeNote(note.id)}
                className="absolute right-2 top-2 rounded-full p-1 text-[#3a2a30]/35 transition hover:bg-black/5 hover:text-[#3a2a30]/70"
              >
                <Trash2 size={12} />
              </button>
            </article>
          ))}
        </div>

        <p className="muted mt-8 text-xs">
          {notes.length} notita{notes.length === 1 ? "" : "s"} pegada
          {notes.length === 1 ? "" : "s"}
        </p>
      </div>
    </section>
  );
}
