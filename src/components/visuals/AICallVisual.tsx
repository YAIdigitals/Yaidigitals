'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight, PhoneCall, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

const FLOW_STEPS = [
  { label: 'Call answered', detail: 'Picks up instantly, any hour' },
  { label: 'Understands', detail: 'Captures intent & context' },
  { label: 'Responds', detail: 'Natural voice conversation' },
  { label: 'Takes action', detail: 'Books, logs, qualifies' },
  { label: 'Human handoff', detail: 'Escalates with full summary' },
] as const;

/**
 * AI calling-agent visual: an abstract live-call surface (waveform +
 * conversation indicators) above the five-stage call flow.
 * Waveform is a lightweight canvas loop that pauses off-screen.
 */
export function AICallVisual() {
  return (
    <div className="space-y-6">
      <CallWindow />
      <CallFlow />
    </div>
  );
}

function CallWindow() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className="relative mx-auto w-full max-w-sm rounded-2xl border border-border bg-bgCard shadow-elevate overflow-hidden"
      role="img"
      aria-label="Diagram of an AI voice agent on a live call: waveform, conversation exchange, and handoff to a human teammate"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/12 text-primary">
            {!reduceMotion && (
              <span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary/25 animate-pulse-ring" />
            )}
            <PhoneCall size={15} strokeWidth={2} />
          </span>
          <div>
            <p className="text-xs font-medium text-textMain leading-tight">AI voice agent</p>
            <p className="text-[11px] text-textMuted leading-tight mt-0.5">Live · answering customer</p>
          </div>
        </div>
        <span aria-hidden="true" className="rounded-full border border-primary/30 bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary">
          LIVE
        </span>
      </div>

      {/* Waveform */}
      <VoiceWaveform reduceMotion={reduceMotion} />

      {/* Conversation indicators */}
      <div className="space-y-2.5 px-4 pb-4">
        <Bubble side="caller" reduceMotion={reduceMotion} delay={0.4}>
          Caller asks about availability this week
        </Bubble>
        <Bubble side="agent" reduceMotion={reduceMotion} delay={1.1}>
          Agent checks the calendar and offers open slots
        </Bubble>
        <div
          className={cn(
            'mt-3 flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/8 px-3 py-2 text-[11px] text-textMuted',
            !reduceMotion && 'animate-fade-up'
          )}
          style={reduceMotion ? undefined : { animationDelay: '1.8s', animationFillMode: 'both' }}
        >
          <UserRound size={12} strokeWidth={2} className="shrink-0 text-primary" />
          Complex case detected → escalated to your team with a call summary
        </div>
      </div>
    </div>
  );
}

function Bubble({
  side,
  children,
  reduceMotion,
  delay,
}: {
  side: 'caller' | 'agent';
  children: React.ReactNode;
  reduceMotion: boolean;
  delay: number;
}) {
  const isAgent = side === 'agent';
  return (
    <div
      className={cn('flex', isAgent ? 'justify-end' : 'justify-start')}
      style={
        reduceMotion
          ? undefined
          : { opacity: 0, animation: `fade-up 0.45s ease-out ${delay}s forwards` }
      }
    >
      <p
        className={cn(
          'max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed',
          isAgent
            ? 'rounded-br-sm bg-primary/12 border border-primary/25 text-textMain'
            : 'rounded-bl-sm bg-bgDark border border-border text-textMuted'
        )}
      >
        {children}
      </p>
    </div>
  );
}

/** Canvas voice waveform — ~60 lines of math, no libraries, pauses when hidden. */
function VoiceWaveform({ reduceMotion }: { reduceMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const BARS = 56;
    let raf = 0;
    let running = !reduceMotion;

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time: number) {
      if (!canvas) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx!.clearRect(0, 0, w, h);

      const gap = 3;
      const barW = Math.max(2, (w - gap * (BARS - 1)) / BARS);
      const mid = h / 2;

      for (let i = 0; i < BARS; i++) {
        const p = i / (BARS - 1);
        // Layered sines produce an organic speech-like envelope
        const amp =
          0.28 +
          0.24 * Math.sin(time * 2.1 + i * 0.55) +
          0.18 * Math.sin(time * 3.7 + i * 1.3) +
          0.14 * Math.sin(time * 5.3 + i * 2.1);
        // Fade toward edges so the waveform feels centered on the speaker
        const edge = 0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
        const barH = Math.max(3, Math.abs(amp) * h * 0.92 * edge);

        const x = i * (barW + gap);
        const grad = ctx!.createLinearGradient(0, mid - barH / 2, 0, mid + barH / 2);
        grad.addColorStop(0, 'rgba(34,197,94,0.95)');
        grad.addColorStop(1, 'rgba(34,197,94,0.35)');
        ctx!.fillStyle = grad;
        const r = Math.min(barW / 2, 2);
        roundRect(ctx!, x, mid - barH / 2, barW, barH, r);
        ctx!.fill();
      }
    }

    function loop(now: number) {
      if (!running) return;
      draw((now / 1000) % 1000);
      raf = requestAnimationFrame(loop);
    }

    resize();

    if (reduceMotion) {
      draw(1.25); // single static frame
    } else {
      const observer = new IntersectionObserver(([entry]) => {
        const wasRunning = running;
        running = entry.isIntersecting && !document.hidden;
        if (running && !wasRunning) raf = requestAnimationFrame(loop);
        if (!running) cancelAnimationFrame(raf);
      });
      observer.observe(canvas);
      raf = requestAnimationFrame(loop);
      return () => {
        observer.disconnect();
        cancelAnimationFrame(raf);
        running = false;
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      running = false;
    };
  }, [reduceMotion]);

  return (
    <div aria-hidden="true" className="border-b border-border px-4 py-5">
      <canvas ref={canvasRef} className="h-16 w-full" />
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function CallFlow() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(reduceMotion ? -1 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % FLOW_STEPS.length);
    }, 2200);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <ol
      className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-0"
      aria-label="How an AI calling agent handles a call"
    >
      {FLOW_STEPS.map((step, i) => {
        const isActive = active === i;
        return (
          <li
            key={step.label}
            aria-current={isActive ? 'step' : undefined}
            className={cn(
              'relative rounded-lg border px-3.5 py-3 transition-colors duration-500 sm:border-l-0 sm:first:border-l sm:first:rounded-l-lg sm:last:rounded-r-lg',
              isActive
                ? 'border-primary/40 bg-primary/8'
                : 'border-border bg-bgCard'
            )}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors duration-500',
                  isActive ? 'bg-primary text-bgDark' : 'bg-white/8 text-textMuted'
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-500',
                  isActive ? 'text-textMain' : 'text-textMuted'
                )}
              >
                {step.label}
              </span>
              <ArrowRight
                aria-hidden="true"
                size={12}
                strokeWidth={2}
                className="ml-auto hidden shrink-0 text-white/20 sm:block"
              />
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-textMuted">{step.detail}</p>
          </li>
        );
      })}
    </ol>
  );
}
