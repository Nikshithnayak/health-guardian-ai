import { TrendingUp, TrendingDown } from "lucide-react";

interface RiskItem {
  disease: string;
  risk: number;
  trend: "up" | "down" | "stable";
  timeframe: string;
}

const risks: RiskItem[] = [
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
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Disease Risk Prediction</h3>
          <p className="text-xs text-muted-foreground mt-0.5">AI-powered health forecast</p>
        </div>
        <span className="text-xs text-primary font-mono">Updated 2h ago</span>
      </div>

      <div className="space-y-4">
        {risks.map((item) => (
          <div key={item.disease} className="space-y-2">
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
              <div
                className={`h-full rounded-full ${getRiskColor(item.risk)} transition-all duration-1000`}
                style={{ width: `${item.risk}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskPrediction;
