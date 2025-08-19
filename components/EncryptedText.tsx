import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface EncryptedTextProps {
  className?: string;
  /** Number of characters to render between the angle brackets */
  insideLength?: number;
  /** Base string to display when idle (will be tiled to fill insideLength) */
  idleText?: string;
  /** How often a glitch cycle should start (ms) */
  glitchEveryMs?: number;
  /** How long each glitch cycle lasts (ms) */
  glitchDurationMs?: number;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/#%*=_-░▒▓█";

export default function EncryptedText({
  className,
  insideLength = 12,
  idleText = "...",
  glitchEveryMs = 3000,
  glitchDurationMs = 900,
}: EncryptedTextProps) {
  // Base string tiled to target length for stability
  const baseString = useMemo(() => {
    if (!idleText) return " ".repeat(insideLength);
    let s = "";
    while (s.length < insideLength) s += idleText;
    return s.slice(0, insideLength);
  }, [idleText, insideLength]);

  const [innerText, setInnerText] = useState<string>(baseString);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);

  const rafIdRef = useRef<number | null>(null);
  const schedulerIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  function easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function pickRandomIndices(poolSize: number, count: number): number[] {
    const chosen = new Set<number>();
    while (chosen.size < count) {
      chosen.add(Math.floor(Math.random() * poolSize));
    }
    return Array.from(chosen);
  }

  const buildFrame = useCallback((progress01: number) => {
    const eased = easeInOutQuad(progress01);
    const scrambleCount = Math.max(1, Math.round(eased * insideLength));
    const indices = pickRandomIndices(insideLength, scrambleCount);
    const chars = baseString.split("");
    for (const idx of indices) chars[idx] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    return chars.join("");
  }, [baseString, insideLength]);

  const initialDelayMs = useMemo(() => Math.floor(Math.random() * 500), []);

  useEffect(() => {
    setInnerText(baseString);
  }, [baseString]);

  useEffect(() => {
    function cancelRaf() {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    }

    function frame(now: number) {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const t = Math.max(0, Math.min(1, elapsed / glitchDurationMs));
      setInnerText(buildFrame(t));
      if (elapsed < glitchDurationMs) {
        rafIdRef.current = requestAnimationFrame(frame);
      } else {
        setInnerText(baseString);
        setIsGlitching(false);
        startTimeRef.current = null;
      }
    }

    function startGlitchCycle() {
      setIsGlitching(true);
      startTimeRef.current = null;
      cancelRaf();
      rafIdRef.current = requestAnimationFrame(frame);
    }

    const kickoff = window.setTimeout(() => {
      startGlitchCycle();
      schedulerIdRef.current = window.setInterval(startGlitchCycle, glitchEveryMs);
    }, initialDelayMs);

    return () => {
      window.clearTimeout(kickoff);
      if (schedulerIdRef.current !== null) window.clearInterval(schedulerIdRef.current);
      schedulerIdRef.current = null;
      cancelRaf();
    };
  }, [baseString, glitchDurationMs, glitchEveryMs, initialDelayMs, insideLength, buildFrame]);

  return (
    <span
      className={cn(
        "font-mono tracking-widest select-none inline-flex items-baseline align-baseline",
        className
      )}
      aria-label="company name redacted"
    >
      {"<"}
      <span
        className={cn("relative px-[0.125rem]", isGlitching && "[filter:contrast(1.02)_saturate(1.05)]")}
        aria-hidden={false}
      >
        <span className={cn("transition-opacity duration-200", isGlitching ? "opacity-100" : "opacity-90")}>{innerText}</span>
        <span className="absolute inset-0 pointer-events-none opacity-[0.1] translate-x-[0.5px] mix-blend-screen" aria-hidden>{innerText}</span>
        <span className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay scanline" />
        <span className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen glow" />
      </span>
      {">"}

      <style jsx>{`
        .scanline {
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.08) 0px,
            rgba(255,255,255,0.08) 1px,
            transparent 1px,
            transparent 3px
          );
          animation: scan 6s linear infinite;
          will-change: transform;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .glow {
          background: radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.18), transparent 60%);
          filter: blur(0.25px);
        }
      `}</style>
    </span>
  );
}