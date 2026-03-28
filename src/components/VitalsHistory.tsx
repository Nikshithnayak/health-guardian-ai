import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Droplets, Wind, Thermometer, Plus, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { format } from "date-fns";

interface VitalEntry {
  id: string;
  heart_rate: number | null;
  blood_oxygen: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  temperature: number | null;
  sleep_score: number | null;
  stress_level: number | null;
  steps: number | null;
  recorded_at: string;
}

const VitalsHistory = () => {
  const { user } = useAuth();
  const [vitals, setVitals] = useState<VitalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [chartMetric, setChartMetric] = useState<"heart_rate" | "blood_oxygen" | "steps" | "sleep_score">("heart_rate");
  const [form, setForm] = useState({
    heart_rate: "",
    blood_oxygen: "",
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    temperature: "",
    sleep_score: "",
    stress_level: "",
    steps: "",
  });

  useEffect(() => {
    if (user) fetchVitals();
  }, [user]);

  const fetchVitals = async () => {
    try {
      const { data, error } = await supabase
        .from("health_vitals")
        .select("*")
        .eq("user_id", user!.id)
        .order("recorded_at", { ascending: true })
        .limit(100);

      if (error) throw error;
      setVitals(data || []);
    } catch {
      toast.error("Failed to load vitals");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVital = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const record: any = { user_id: user.id };
      if (form.heart_rate) record.heart_rate = parseInt(form.heart_rate);
      if (form.blood_oxygen) record.blood_oxygen = parseFloat(form.blood_oxygen);
      if (form.blood_pressure_systolic) record.blood_pressure_systolic = parseInt(form.blood_pressure_systolic);
      if (form.blood_pressure_diastolic) record.blood_pressure_diastolic = parseInt(form.blood_pressure_diastolic);
      if (form.temperature) record.temperature = parseFloat(form.temperature);
      if (form.sleep_score) record.sleep_score = parseInt(form.sleep_score);
      if (form.stress_level) record.stress_level = parseInt(form.stress_level);
      if (form.steps) record.steps = parseInt(form.steps);

      const { error } = await supabase.from("health_vitals").insert(record);
      if (error) throw error;

      toast.success("Vitals recorded!");
      setForm({ heart_rate: "", blood_oxygen: "", blood_pressure_systolic: "", blood_pressure_diastolic: "", temperature: "", sleep_score: "", stress_level: "", steps: "" });
      setShowForm(false);
      fetchVitals();
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const chartData = vitals.map((v) => ({
    date: format(new Date(v.recorded_at), "MMM d"),
    heart_rate: v.heart_rate,
    blood_oxygen: v.blood_oxygen,
    steps: v.steps,
    sleep_score: v.sleep_score,
  }));

  const metricConfig = {
    heart_rate: { label: "Heart Rate", color: "hsl(0, 72%, 55%)", unit: "bpm", icon: Heart },
    blood_oxygen: { label: "Blood Oxygen", color: "hsl(174, 72%, 50%)", unit: "%", icon: Droplets },
    steps: { label: "Steps", color: "hsl(152, 60%, 45%)", unit: "", icon: TrendingUp },
    sleep_score: { label: "Sleep Score", color: "hsl(38, 92%, 55%)", unit: "/100", icon: Thermometer },
  };

  const inputClass = "w-full bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Chart */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Health Trends</h3>
            <p className="text-xs text-muted-foreground">Your vitals over time</p>
          </div>
          <Button variant="glass" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-3 h-3" />
            <span className="text-xs">Record Vitals</span>
          </Button>
        </div>

        {/* Metric selector */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(Object.keys(metricConfig) as Array<keyof typeof metricConfig>).map((key) => {
            const cfg = metricConfig[key];
            const Icon = cfg.icon;
            return (
              <button
                key={key}
                onClick={() => setChartMetric(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  chartMetric === key ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3 h-3" />
                {cfg.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
            No vitals recorded yet. Click "Record Vitals" to start tracking.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricConfig[chartMetric].color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={metricConfig[chartMetric].color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 18%, 10%)",
                  border: "1px solid hsl(220, 14%, 18%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "hsl(200, 20%, 92%)",
                }}
              />
              <Area
                type="monotone"
                dataKey={chartMetric}
                stroke={metricConfig[chartMetric].color}
                fillOpacity={1}
                fill="url(#colorMetric)"
                strokeWidth={2}
                dot={{ r: 3, fill: metricConfig[chartMetric].color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Record Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Record New Vitals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Heart Rate (bpm)</label>
              <input className={inputClass} type="number" value={form.heart_rate} onChange={(e) => setForm((p) => ({ ...p, heart_rate: e.target.value }))} placeholder="72" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Blood Oxygen (%)</label>
              <input className={inputClass} type="number" value={form.blood_oxygen} onChange={(e) => setForm((p) => ({ ...p, blood_oxygen: e.target.value }))} placeholder="98" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">BP Systolic</label>
              <input className={inputClass} type="number" value={form.blood_pressure_systolic} onChange={(e) => setForm((p) => ({ ...p, blood_pressure_systolic: e.target.value }))} placeholder="120" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">BP Diastolic</label>
              <input className={inputClass} type="number" value={form.blood_pressure_diastolic} onChange={(e) => setForm((p) => ({ ...p, blood_pressure_diastolic: e.target.value }))} placeholder="80" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Temperature (°F)</label>
              <input className={inputClass} type="number" step="0.1" value={form.temperature} onChange={(e) => setForm((p) => ({ ...p, temperature: e.target.value }))} placeholder="98.6" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sleep Score (/100)</label>
              <input className={inputClass} type="number" value={form.sleep_score} onChange={(e) => setForm((p) => ({ ...p, sleep_score: e.target.value }))} placeholder="76" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Stress Level (/100)</label>
              <input className={inputClass} type="number" value={form.stress_level} onChange={(e) => setForm((p) => ({ ...p, stress_level: e.target.value }))} placeholder="32" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Steps</label>
              <input className={inputClass} type="number" value={form.steps} onChange={(e) => setForm((p) => ({ ...p, steps: e.target.value }))} placeholder="8500" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSaveVital} disabled={saving} className="flex-1">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Vitals"}
            </Button>
            <Button variant="glass" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </motion.div>
      )}

      {/* Recent entries */}
      {vitals.length > 0 && (
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Records</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {[...vitals].reverse().slice(0, 10).map((v) => (
              <div key={v.id} className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2 text-xs">
                <span className="text-muted-foreground">{format(new Date(v.recorded_at), "MMM d, yyyy h:mm a")}</span>
                <div className="flex gap-3">
                  {v.heart_rate && <span className="text-foreground"><Heart className="w-3 h-3 inline text-destructive mr-1" />{v.heart_rate}</span>}
                  {v.blood_oxygen && <span className="text-foreground"><Droplets className="w-3 h-3 inline text-primary mr-1" />{v.blood_oxygen}%</span>}
                  {v.steps && <span className="text-foreground">{v.steps.toLocaleString()} steps</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VitalsHistory;
