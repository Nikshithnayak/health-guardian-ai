const data = [
  { day: "Mon", hr: 72, steps: 8500 },
  { day: "Tue", hr: 75, steps: 6200 },
  { day: "Wed", hr: 68, steps: 10400 },
  { day: "Thu", hr: 71, steps: 7800 },
  { day: "Fri", hr: 78, steps: 5600 },
  { day: "Sat", hr: 65, steps: 12000 },
  { day: "Sun", hr: 70, steps: 9200 },
];

const maxSteps = Math.max(...data.map((d) => d.steps));

const ActivityChart = () => {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Weekly Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Steps & Heart Rate</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" /> Steps
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-destructive" /> HR
          </span>
        </div>
      </div>

      <div className="flex items-end gap-3 h-40">
        {data.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-xs font-mono text-primary">{d.hr}</span>
            <div className="w-full bg-secondary/50 rounded-t-md relative overflow-hidden" style={{ height: `${(d.steps / maxSteps) * 100}%` }}>
              <div className="absolute inset-0 bg-primary/30 rounded-t-md" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
            </div>
            <span className="text-xs text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
        <span>Avg: <span className="text-foreground font-mono">8,529</span> steps/day</span>
        <span>Avg HR: <span className="text-foreground font-mono">71</span> bpm</span>
      </div>
    </div>
  );
};

export default ActivityChart;
