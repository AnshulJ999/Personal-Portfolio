import { ProjectMetric } from "@/config/projects";

interface MetricsRowProps {
  metrics: ProjectMetric[];
}

export default function MetricsRow({ metrics }: MetricsRowProps) {
  if (!metrics.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center rounded-lg border border-border bg-accent/40 px-4 py-3 min-w-[80px] text-center"
        >
          <span className="text-2xl font-bold text-[hsl(var(--ring))] leading-none">
            {m.value}
          </span>
          <span className="mt-1 text-xs text-muted-foreground leading-tight">
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}
