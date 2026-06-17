export function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-accent text-white shadow-card">
        <span className="text-[15px] font-black tracking-tight">FS</span>
      </div>
      <div>
        <div className="text-[16px] font-black tracking-[-0.03em]">
          FitSignal Prototype
        </div>
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
          Private beta
        </div>
      </div>
    </div>
  );
}
