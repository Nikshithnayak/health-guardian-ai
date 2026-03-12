import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Prediction {
  scenario: string;
  prediction: string;
  severity: string;
  timeframe?: string;
}

const defaultPredictions: Prediction[] = [
  { scenario: "If current sleep pattern continues", prediction: "Fatigue risk ↑ 35% in 6 months", severity: "warning" },
  { scenario: "With current exercise level", prediction: "Cardiovascular health ↑ 12%", severity: "success" },
  { scenario: "Based on diet analysis", prediction: "Diabetes risk: 23% over 5 years", severity: "warning" },
  { scenario: "Stress level projection", prediction: "Burnout risk: Low", severity: "success" },
];

const severityStyles: Record<string, string> = {
  success: "border-success/30 bg-success/5",
  warning: "border-warning/30 bg-warning/5",
  danger: "border-destructive/30 bg-destructive/5",
};

const HealthTwin = () => {
  const [predictions, setPredictions] = useState<Prediction[]>(defaultPredictions);
  const [loading, setLoading] = useState(false);

  const simulate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-health-analysis", {
        body: {
          type: "health_twin",
          data: {
            age: 32,
            sleep_hours: 6.5,
            exercise_frequency: "3x/week",
            diet: "moderate",
            stress_level: "moderate",
            heart_rate_avg: 72,
            bmi: 24.5,
          },
        },
      });

      if (error) throw error;

      const content = data.content;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.simulations) {
            setPredictions(parsed.simulations.map((s: any) => ({
              scenario: s.scenario,
              prediction: s.prediction,
              severity: s.severity || "warning",
              timeframe: s.timeframe,
            })));
          }
        }
      } catch {
        toast.error("Could not parse AI response");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to simulate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Health Twin</h3>
            <p className="text-xs text-muted-foreground">Predictive health simulation</p>
          </div>
        </div>
        <Button variant="glass" size="sm" onClick={simulate} disabled={loading}>
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          <span className="text-xs">Simulate</span>
        </Button>
      </div>

      <div className="space-y-3">
        {predictions.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            whileHover={{ x: 4 }}
            className={`rounded-lg border p-3 ${severityStyles[p.severity] || severityStyles.warning}`}
          >
            <p className="text-xs text-muted-foreground mb-1">
              {p.scenario} {p.timeframe && `(${p.timeframe})`}
            </p>
            <p className="text-sm font-medium text-foreground">{p.prediction}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HealthTwin;
