import Image from 'next/image';
import { Bot, LayoutDashboard, PhoneCall, ShoppingCart, Smartphone, Workflow } from 'lucide-react';

const CAPABILITIES = [
  { label: 'Websites', icon: LayoutDashboard, className: 'left-2 top-6' },
  { label: 'Mobile apps', icon: Smartphone, className: '-left-2 bottom-16' },
  { label: 'E-commerce', icon: ShoppingCart, className: 'right-0 top-8' },
  { label: 'AI calling', icon: PhoneCall, className: 'right-3 bottom-5' },
] as const;

export function HeroVisual() {
  return (
    <div aria-label="YAIdigitals technology systems for web, mobile, commerce and AI" role="img" className="relative mx-auto w-full max-w-xl py-8">
      <div aria-hidden="true" className="absolute inset-6 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-black shadow-[0_28px_90px_rgba(0,255,73,.12)]">
        <Image src="/brand/yaidigitals-technology.webp" width={1600} height={900} priority sizes="(max-width: 1024px) 92vw, 48vw" alt="" className="h-auto w-full" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black via-black/85 to-transparent px-5 pb-4 pt-14">
          <div className="flex items-center gap-2 text-xs font-medium text-white/90"><Bot size={16} className="text-primary" aria-hidden="true" />Product engineering</div>
          <div className="flex items-center gap-2 text-xs text-white/65"><Workflow size={15} className="text-primary" aria-hidden="true" />Connected systems</div>
        </div>
      </div>
      {CAPABILITIES.map(({ label, icon: Icon, className }) => (
        <div key={label} aria-hidden="true" className={`absolute ${className} flex items-center gap-2 rounded-xl border border-white/10 bg-bgCard/95 px-3 py-2 text-xs font-medium text-textMain shadow-card backdrop-blur-md`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-primary"><Icon size={15} /></span>
          {label}
        </div>
      ))}
    </div>
  );
}
