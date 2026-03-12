import { Sparkles } from "lucide-react";

const predictions = [
  { label: "If current sleep pattern continues", result: "Fatigue risk ↑ 35% in 6 months", severity: "warning" },
  { label: "With current exercise level", result: "Cardiovascular health ↑ 12%", severity: "success" },
  { label: "Based on diet analysis", result: "Diabetes risk: 23% over 5 years", severity: "warning" },
  { label: "Stress level projection", result: "Burnout risk: Low", severity: "success" },
];

const severityStyles: Record<string, string> = {
  success: "border-success/30 bg-success/5",
  warning: "border-warning/30 bg-warning/5",
  danger: "border-destructive/30 bg-destructive/5",
};

const HealthTwin = () => {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center animate-float">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Health Twin</h3>
          <p className="text-xs text-muted-foreground">Predictive health simulation</p>
        </div>
      </div>

      <div className="space-y-3">
        {predictions.map((p, i) => (
          <div key={i} className={`rounded-lg border p-3 ${severityStyles[p.severity]}`}>
            <p className="text-xs text-muted-foreground mb-1">{p.label}</p>
            <p className="text-sm font-medium text-foreground">{p.result}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthTwin;
