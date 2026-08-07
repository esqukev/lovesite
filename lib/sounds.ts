let enabled = false;
let ctx: AudioContext | null = null;

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

export function isSoundEnabled() {
  return enabled;
}

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AudioCtx();
  }
  return ctx;
}

export function playTone(
  frequency = 520,
  duration = 0.08,
  type: OscillatorType = "sine",
  gain = 0.03,
) {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;

  void audio.resume();
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  g.gain.value = gain;
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
  osc.connect(g);
  g.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + duration);
}

export const softClick = () => playTone(640, 0.06, "sine", 0.025);
export const softSuccess = () => {
  playTone(520, 0.08, "triangle", 0.03);
  setTimeout(() => playTone(720, 0.1, "triangle", 0.025), 70);
};
export const softWhoosh = () => playTone(220, 0.18, "sine", 0.02);
