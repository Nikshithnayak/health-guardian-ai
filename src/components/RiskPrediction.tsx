import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RiskItem {
  disease: string;
  risk: number;
  trend: "up" | "down" | "stable";
  timeframe: string;
  explanation?: string;
}

const defaultRisks: RiskItem[] = [
  { disease: "Type 2 Diabetes", risk: 23, trend: "down", timeframe: "5-year" },
  { disease: "Heart Disease", risk: 12, trend: "stable", timeframe: "10-year" },
  { disease: "Hypertension", risk: 34, trend: "up", timeframe: "3-year" },
  { disease: "Stroke", risk: 8, trend: "down", timeframe: "10-year" },
  { disease: "Depression", risk: 18, trend: "stable", timeframe: "1-year" },
];

const getRiskColor = (risk: number) => {
  if (risk < 20) return "bg-success";
  if (risk < 40) return "bg-warning";
  return "bg-destructive";
};

const getRiskBg = (risk: number) => {
  if (risk < 20) return "bg-success/10";
  if (risk < 40) return "bg-warning/10";
  return "bg-destructive/10";
};

const RiskPrediction = () => {
  const [risks, setRisks] = useState<RiskItem[]>(defaultRisks);
  const [loading, setLoading] = useState(false);

  const analyzeRisks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-health-analysis", {
        body: {
          type: "risk_prediction",
          data: {
            age: 32,
            weight_kg: 75,
            height_cm: 175,
            heart_rate_avg: 72,
            blood_pressure: "120/80",
            sleep_score: 76,
            stress_level: 32,
            steps_per_day: 8500,
            exercise_hours_per_week: 3,
          },
        },
      });

      if (error) throw error;

      const content = data.content;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.predictions) {
            setRisks(parsed.predictions);
          }
        }
      } catch {
        toast.error("Could not parse AI response");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to analyze risks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Disease Risk Prediction</h3>
          <p className="text-xs text-muted-foreground mt-0.5">AI-powered health forecast</p>
        </div>
        <Button variant="glass" size="sm" onClick={analyzeRisks} disabled={loading}>
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          <span className="text-xs">AI Analyze</span>
        </Button>
      </div>

      <div className="space-y-4">
        {risks.map((item, i) => (
          <motion.div
            key={item.disease}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{item.disease}</span>
              <div className="flex items-center gap-2">
                {item.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-destructive" />
                ) : item.trend === "down" ? (
                  <TrendingDown className="w-3 h-3 text-success" />
                ) : null}
                <span className="text-sm font-mono font-bold text-foreground">{item.risk}%</span>
                <span className="text-xs text-muted-foreground">({item.timeframe})</span>
              </div>
            </div>
            <div className={`w-full h-2 rounded-full ${getRiskBg(item.risk)}`}>
              <motion.div
                className={`h-full rounded-full ${getRiskColor(item.risk)}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.risk}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RiskPrediction;
