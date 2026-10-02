import type { ReactNode } from 'react';
import { ArrowRight, PhoneCall, UserRound } from 'lucide-react';

const FLOW_STEPS = [
  { label: 'Call answered', detail: 'Picks up instantly, any hour' },
  { label: 'Understands', detail: 'Captures intent & context' },
  { label: 'Responds', detail: 'Natural voice conversation' },
  { label: 'Takes action', detail: 'Books, logs, qualifies' },
  { label: 'Human handoff', detail: 'Escalates with full summary' },
] as const;

const WAVEFORM = [
  20, 34, 48, 30, 58, 42, 68, 38, 52, 76, 46, 64, 36, 72, 56, 82, 44, 66,
  34, 60, 78, 48, 70, 40, 62, 32, 52, 68, 38, 58, 28, 46,
] as const;

/** A server-rendered call visual: rich enough to explain the product with no runtime JS. */
export function AICallVisual() {
  return (
    <div className="space-y-6">
      <div
        className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-bgCard shadow-elevate"
        role="img"
        aria-label="Diagram of an AI voice agent answering a customer, taking action, and handing a complex case to a human teammate"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/12 text-primary">
              <PhoneCall size={15} strokeWidth={2} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium leading-tight text-textMain">AI voice agent</p>
              <p className="mt-0.5 text-[11px] leading-tight text-textMuted">Live · answering customer</p>
            </div>
          </div>
          <span aria-hidden="true" className="rounded-full border border-primary/30 bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary">
            LIVE
          </span>
        </div>

        <div aria-hidden="true" className="flex h-24 items-center gap-1 border-b border-border px-4 py-5">
          {WAVEFORM.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="min-w-0 flex-1 rounded-full bg-gradient-to-b from-primary to-primary/35"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        <div className="space-y-2.5 px-4 pb-4 pt-4">
          <Bubble>Caller asks about availability this week</Bubble>
          <Bubble agent>Agent checks the calendar and offers open slots</Bubble>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/8 px-3 py-2 text-[11px] text-textMuted">
            <UserRound size={12} strokeWidth={2} className="shrink-0 text-primary" aria-hidden="true" />
            Complex case detected → escalated to your team with a call summary
          </div>
        </div>
      </div>

      <ol
        className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-0"
        aria-label="How an AI calling agent handles a call"
      >
        {FLOW_STEPS.map((step, index) => (
          <li
            key={step.label}
            className="relative rounded-lg border border-border bg-bgCard px-3.5 py-3 sm:border-l-0 sm:first:rounded-l-lg sm:first:border-l sm:last:rounded-r-lg"
          >
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/8 text-[10px] font-semibold text-textMuted">
                {index + 1}
              </span>
              <span className="text-xs font-medium text-textMuted">{step.label}</span>
              <ArrowRight aria-hidden="true" size={12} strokeWidth={2} className="ml-auto hidden shrink-0 text-white/20 sm:block" />
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-textMuted">{step.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Bubble({ agent = false, children }: { agent?: boolean; children: ReactNode }) {
  return (
    <div className={`flex ${agent ? 'justify-end' : 'justify-start'}`}>
      <p
        className={`max-w-[85%] rounded-xl border px-3 py-2 text-[11px] leading-relaxed ${
          agent
            ? 'rounded-br-sm border-primary/25 bg-primary/12 text-textMain'
            : 'rounded-bl-sm border-border bg-bgDark text-textMuted'
        }`}
      >
        {children}
      </p>
    </div>
  );
}
