'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface EncryptedTextProps {
  className?: string;
  /** Number of characters to render between the angle brackets during the glitch */
  insideLength?: number;
  /** What to show between the brackets when idle (not glitching) */
  idleText?: string;
  /** How often a glitch cycle should start (ms) */
  glitchEveryMs?: number;
  /** How long each glitch cycle lasts (ms) */
  glitchDurationMs?: number;
  /** Frame rate for scrambling updates (ms) */
  frameIntervalMs?: number;
}

const GLYPHS = "█▓▒░#@%&*+=-_/\\[]{}()<>$~^|";

function generateRandomGlyphs(length: number): string {
  let result = "";
  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * GLYPHS.length);
    result += GLYPHS[randomIndex];
  }
  return result;
}

export default function EncryptedText({
  className,
  insideLength = 12,
  idleText = "...",
  glitchEveryMs = 2800,
  glitchDurationMs = 900,
  frameIntervalMs = 45,
}: EncryptedTextProps) {
  const [innerText, setInnerText] = useState<string>(idleText);
  const glitchIntervalIdRef = useRef<number | null>(null);
  const schedulerIdRef = useRef<number | null>(null);

  // Start with a small random offset so multiple instances don't sync perfectly
  const initialDelayMs = useMemo(() => Math.floor(Math.random() * 400), []);

  useEffect(() => {
    function clearTimers() {
      if (glitchIntervalIdRef.current !== null) {
        window.clearInterval(glitchIntervalIdRef.current);
        glitchIntervalIdRef.current = null;
      }
      if (schedulerIdRef.current !== null) {
        window.clearInterval(schedulerIdRef.current);
        schedulerIdRef.current = null;
      }
    }

    function startGlitchCycle() {
      let elapsedMs = 0;
      // Rapidly scramble characters during the glitch window
      glitchIntervalIdRef.current = window.setInterval(() => {
        setInnerText(generateRandomGlyphs(insideLength));
        elapsedMs += frameIntervalMs;
        if (elapsedMs >= glitchDurationMs) {
          if (glitchIntervalIdRef.current !== null) {
            window.clearInterval(glitchIntervalIdRef.current);
            glitchIntervalIdRef.current = null;
          }
          setInnerText(idleText);
        }
      }, frameIntervalMs);
    }

    // Kick off an initial glitch, then schedule recurring ones
    const kickoffTimeoutId = window.setTimeout(() => {
      startGlitchCycle();
      schedulerIdRef.current = window.setInterval(startGlitchCycle, glitchEveryMs);
    }, initialDelayMs);

    return () => {
      window.clearTimeout(kickoffTimeoutId);
      clearTimers();
    };
  }, [frameIntervalMs, glitchDurationMs, glitchEveryMs, idleText, insideLength, initialDelayMs]);

  return (
    <span
      className={cn(
        "font-mono tracking-widest select-none inline-flex items-baseline align-baseline",
        className
      )}
      aria-label="company name redacted"
    >
      {"<"}
      <span className="opacity-90">{innerText}</span>
      {">"}
    </span>
  );
}

