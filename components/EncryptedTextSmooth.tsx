'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface EncryptedTextProps {
  className?: string;
  /** Number of characters to render between the angle brackets */
  insideLength?: number;
  /** Minimum ms before a character changes to a new glyph */
  minCharIntervalMs?: number;
  /** Maximum ms before a character changes to a new glyph */
  maxCharIntervalMs?: number;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/#%*=_-░▒▓█";

export default function EncryptedTextSmooth({
  className,
  insideLength = 12,
  minCharIntervalMs = 800,
  maxCharIntervalMs = 2000,
}: EncryptedTextProps) {
  // Continuous, slow, smooth scrambling per-character
  const [innerText, setInnerText] = useState<string>("");
  const charsRef: React.MutableRefObject<string[]> = useRef<string[]>([]);
  const nextUpdateAtMsRef: React.MutableRefObject<number[]> = useRef<number[]>([]);
  const rafIdRef = useRef<number | null>(null);
  const lastRenderAtMsRef = useRef<number>(0);

  const initialDelayMs = useMemo(() => Math.floor(Math.random() * 400), []);

  const randomGlyph = useCallback(() => {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }, []);

  const randomDelay = useCallback(() => {
    return Math.floor(minCharIntervalMs + Math.random() * (maxCharIntervalMs - minCharIntervalMs));
  }, [minCharIntervalMs, maxCharIntervalMs]);

  // Reinitialize buffers when length changes
  useEffect(() => {
    const now = performance.now();
    charsRef.current = Array.from({ length: insideLength }, () => randomGlyph());
    nextUpdateAtMsRef.current = Array.from({ length: insideLength }, () => now + randomDelay());
    setInnerText(charsRef.current.join(""));
  }, [insideLength, randomDelay, randomGlyph]);

  useEffect(() => {
    function loop(now: number) {
      let mutated = false;
      for (let i = 0; i < insideLength; i += 1) {
        if (now >= (nextUpdateAtMsRef.current[i] || 0)) {
          charsRef.current[i] = randomGlyph();
          nextUpdateAtMsRef.current[i] = now + randomDelay();
          mutated = true;
        }
      }

      // Throttle renders to ~12 fps for smoothness without flicker
      if (mutated && now - lastRenderAtMsRef.current > 80) {
        setInnerText(charsRef.current.join(""));
        lastRenderAtMsRef.current = now;
      }

      rafIdRef.current = requestAnimationFrame(loop);
    }

    const kickoff = window.setTimeout(() => {
      rafIdRef.current = requestAnimationFrame(loop);
    }, initialDelayMs);

    return () => {
      window.clearTimeout(kickoff);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    };
  }, [insideLength, initialDelayMs, randomDelay, randomGlyph]);

  return (
    <span
      className={cn(
        "font-mono tracking-widest select-none inline-flex items-baseline align-baseline",
        className
      )}
      aria-label="company name redacted"
    >
      {"<"}
      <span className={cn("relative px-[0.125rem] [filter:contrast(1.02)_saturate(1.04)]")} aria-hidden={false}>
        <span className="opacity-90">{innerText}</span>
        <span className="absolute inset-0 pointer-events-none opacity-[0.08] translate-x-[0.5px] mix-blend-screen" aria-hidden>{innerText}</span>
        <span className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay scanline" />
        <span className="pointer-events-none absolute inset-0 opacity-15 mix-blend-screen glow" />
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